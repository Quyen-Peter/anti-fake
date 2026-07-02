import { useEffect, useState } from "react";
import CommunityPost from "../../components/community/communityPost";
import CreatePostBox from "../../components/community/createPostBox";
import type { SocialPost } from "../../type/community";
import { getSocialPosts } from "../../services/community.api";
import LoadingOverlay from "../../components/loadingOverlay";

export default function DiscussionFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getSocialPosts(1, 20);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div><LoadingOverlay/></div>;

  return (
    <>
      <CreatePostBox onCreated={fetchPosts} />

      {posts.map((post) => (
        <CommunityPost key={post.id} post={post} />
      ))}
    </>
  );
}
