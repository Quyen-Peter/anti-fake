import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket, socket } from "../services/socket";
import { getToken } from "../ultil/auth";


type ChatAck =
  | { ok: true; thread?: unknown; clientMessageId?: string | null }
  | { ok: false; error: string };

export type ChatRealtimeEvent = {
  threadId?: string;
  roomId?: string;
  thread?: unknown;
  message?: unknown;
};

type PresenceUpdateEvent = {
  threadId?: string;
  userId?: string;
  online?: boolean;
  onlineUserIds?: string[];
};

type TypingEvent = {
  threadId?: string;
  userId?: string;
  isTyping?: boolean;
};

type UseChatRealtimeOptions = {
  threadId: string;
  onThreadUpdate?: (thread: unknown) => void;
  onMessage?: (event: ChatRealtimeEvent) => void;
  onReconnect?: () => void;
};

const PRESENCE_HEARTBEAT_INTERVAL_MS = 15_000;

export function useChatRealtime({
  threadId,
  onThreadUpdate,
  onMessage,
  onReconnect,
}: UseChatRealtimeOptions) {
  const session = getToken();
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const threadIdRef = useRef(threadId);
  const updateRef = useRef(onThreadUpdate);
  const messageRef = useRef(onMessage);
  const reconnectRef = useRef(onReconnect);

  useEffect(() => {
    threadIdRef.current = threadId;
    setOnlineUserIds([]);
    setTypingUserIds([]);
  }, [threadId]);

  useEffect(() => {
    updateRef.current = onThreadUpdate;
  }, [onThreadUpdate]);

  useEffect(() => {
    messageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    reconnectRef.current = onReconnect;
  }, [onReconnect]);

  useEffect(() => {
    if (!session) {
      socket.disconnect();
      setConnected(false);
      return;
    }

    let heartbeatIntervalId: number | null = null;

    function emitHeartbeat() {
      socket.emit("presence:heartbeat");
    }

    function handleConnect() {
      setConnected(true);
      setLastError(null);
      emitHeartbeat();
      heartbeatIntervalId = window.setInterval(emitHeartbeat, PRESENCE_HEARTBEAT_INTERVAL_MS);
      reconnectRef.current?.();
      if (threadIdRef.current) {
        socket.emit("chat:join", { threadId: threadIdRef.current });
      }
    }

    function handleDisconnect() {
      setConnected(false);
      if (heartbeatIntervalId !== null) {
        window.clearInterval(heartbeatIntervalId);
        heartbeatIntervalId = null;
      }
    }

    function handleConnectError(error: Error) {
      setConnected(false);
      setLastError(error.message);
    }

    function handleChatError(payload: { error?: string }) {
      setLastError(payload.error || "Chat realtime error");
    }

    function handleMessageCreated(event: ChatRealtimeEvent) {
      const eventThreadId = event.threadId || event.roomId;
      if (eventThreadId === threadIdRef.current) {
        if (event.thread) {
          updateRef.current?.(event.thread);
        }
        messageRef.current?.(event);
      }
    }

    function handlePresenceUpdate(event: PresenceUpdateEvent) {
      if (event.threadId !== threadIdRef.current) {
        return;
      }

      if (event.onlineUserIds) {
        setOnlineUserIds(event.onlineUserIds);
        return;
      }

      if (event.userId) {
        setOnlineUserIds((current) => {
          const next = new Set(current);
          if (event.online === false) {
            next.delete(String(event.userId));
          } else {
            next.add(String(event.userId));
          }
          return Array.from(next);
        });
      }
    }

    function handleTyping(event: TypingEvent) {
      if (event.threadId !== threadIdRef.current || !event.userId) {
        return;
      }

      setTypingUserIds((current) => {
        const next = new Set(current);
        if (event.isTyping) {
          next.add(String(event.userId));
        } else {
          next.delete(String(event.userId));
        }
        return Array.from(next);
      });
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("chat:error", handleChatError);
    socket.on("chat:message.created", handleMessageCreated);
    socket.on("presence:update", handlePresenceUpdate);
    socket.on("chat:typing", handleTyping);

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      if (heartbeatIntervalId !== null) {
        window.clearInterval(heartbeatIntervalId);
      }
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("chat:error", handleChatError);
      socket.off("chat:message.created", handleMessageCreated);
      socket.off("presence:update", handlePresenceUpdate);
      socket.off("chat:typing", handleTyping);
    };
  }, [session]);

  useEffect(() => {
    if (!threadId || !socket.connected) {
      return;
    }

    socket.emit("chat:join", { threadId }, (ack?: ChatAck) => {
      if (ack && !ack.ok) {
        setLastError(ack.error);
      }
    });
  }, [threadId]);

  const sendMessage = useCallback(
    (body: string, clientMessageId: string) =>
      new Promise<{ thread: unknown; clientMessageId: string } | null>((resolve, reject) => {
        if (!threadId || !socket.connected) {
          resolve(null);
          return;
        }

        socket.timeout(8000).emit(
          "chat:send",
          {
            threadId,
            body,
            clientMessageId,
          },
          (error: Error | null, ack?: ChatAck) => {
            if (error) {
              reject(error);
              return;
            }
            if (!ack?.ok) {
              reject(new Error(ack?.error || "Chat send failed"));
              return;
            }
            resolve({ thread: ack.thread, clientMessageId });
          },
        );
      }),
    [threadId],
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!threadId || !socket.connected) {
        return;
      }

      socket.emit("chat:typing", { threadId, isTyping });
    },
    [threadId],
  );

  return {
    connected,
    lastError,
    onlineUserIds,
    typingUserIds,
    sendMessage,
    sendTyping,
  };
}
