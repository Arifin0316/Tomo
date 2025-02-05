
import ExploreGrid from "@/components/post/ExploreGrid";
import { getExplorePosts } from "@/lib/posting"


export default async function ExplorePage() {
  const posts = await getExplorePosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Jelajahi</h1>
      <ExploreGrid initialPosts={posts} />
    </div>
  );
}