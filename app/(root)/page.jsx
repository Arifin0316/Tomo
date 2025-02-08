import Search from "@/components/Search/Search";
import HomeFeed from "@/components/home/HomeFeed";
import Suggestions from "@/components/home/Suggestions";
import { fetchHomePosts, fetchSuggestions } from "@/lib/home"

export default async function HomePage() {
  const [posts, suggestions] = await Promise.all([
    fetchHomePosts(),
    fetchSuggestions()
  ]);
 
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="md:hidden">
              <Search />
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <HomeFeed initialPosts={posts} />
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <Suggestions initialSuggestions={suggestions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}