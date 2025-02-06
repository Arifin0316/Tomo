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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="md:hidden mb-4">
              <Search />
            </div>
            <div className="bg-white rounded-xl shadow-sm">
              <HomeFeed initialPosts={posts} />
            </div>
          </div>
          
          <div className="hidden md:block sticky top-20">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <Suggestions initialSuggestions={suggestions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }