import ExploreGrid from "@/components/post/ExploreGrid";
import { getExplorePosts } from "@/lib/posting"

export default async function ExplorePage() {
  const posts = await getExplorePosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white 
            bg-gradient-to-r from-blue-600 to-purple-600 
            text-transparent bg-clip-text">
            Explore
          </h1>
        </div>
        
        {posts.length > 0 ? (
          <ExploreGrid initialPosts={posts} />
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No posts to explore right now
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Check back later or follow more creators
            </p>
          </div>
        )}
      </div>
    </div>
  );
}