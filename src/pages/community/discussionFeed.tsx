import CommunityPost from "../../components/community/communityPost";
import CreatePostBox from "../../components/community/createPostBox";


export default function DiscussionFeed() {
  return (
    <>
      <CreatePostBox />

      <CommunityPost />
      <CommunityPost />
      <CommunityPost />
    </>
  );
}