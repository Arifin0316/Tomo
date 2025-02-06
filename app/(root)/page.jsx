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
    <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
      <div className="col-span-1 md:col-span-2 lg:col-span-2 relative">
        {/* Tampilkan Search hanya di mobile */}
        <div className="block md:hidden mb-4">
          <Search />
        </div>
        <HomeFeed initialPosts={posts} />
      </div>
      <div className="hidden md:block md:col-span-1 lg:col-span-1">
        <Suggestions initialSuggestions={suggestions} />
      </div>
    </div>
  );
}