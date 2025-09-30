import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import Accounts from "./Accounts";

const FeedPage = ({ token, userId }) => {
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch feed
  const fetchFeed = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_API}/users/feed?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.posts.length === 0) setHasMore(false);
      else {
      setPosts((prev) => {
        const combined = [...prev, ...res.data.posts];
        const deduped = Array.from(
          new Map(combined.map((p) => [p.postId, p])).values()
        );
        return deduped;
      });
    }
  } catch (err) {
    console.error("Failed to load feed:", err);
  } finally {
    setLoading(false);
  }
};

  // Initial load
  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  // Auto search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/users/search?username=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Failed to search users:", err);
      }
    }, 300); // wait 300ms after user stops typing

    return () => clearTimeout(delayDebounce); // cleanup on next keystroke
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-12">
      {/* 🔎 Search Bar */}
      <div className="sticky top-0 bg-white shadow-md z-10 border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex items-center px-4 py-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 border-0 focus:ring-2 focus:ring-red-500 outline-none transition-all duration-200 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="max-w-3xl mx-auto bg-white border-t border-gray-200 shadow-lg rounded-b-lg overflow-hidden">
            {searchResults.map((u,idx) => (
              <div
                key={`${u._id}-${idx}`}
                onClick={() => (window.location.href = `/${u.username}`)}
                className="flex items-center px-6 py-4 cursor-pointer hover:bg-red-50 transition-colors duration-150"
              >
                <img
                  src={u.profilePicture || "/personlogo.png"}
                  alt={u.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">{u.username}</p>
                  <p className="text-xs text-gray-500">{u.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Accounts BACKEND_API={BACKEND_API} />

      {/* 📰 Feed */}
      <div className="max-w-3xl mx-auto mt-8 space-y-8 px-4">
        {posts.map((post,idx) => (
          <div key={`${post.postId}-${idx}`} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-200 hover:shadow-xl">
            {/* Post Header */}
            <div
              className="flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
              onClick={() => (window.location.href = `/${post.username}`)}
            >
              <img
                src={post.profilePicture || "/personlogo.png"}
                alt={post.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900">{post.username}</p>
                <p className="text-xs text-gray-500">{post.name}</p>
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <img src={post.image} alt="post" className="w-full aspect-square object-cover" />
            )}

            {/* Post Footer */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-800 leading-relaxed">{post.caption}</p>
            </div>
          </div>
        ))}

        {hasMore && !loading && (
          <div className="flex justify-center pt-6">
            <button onClick={() => setPage((prev) => prev + 1)} className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm">
              Load More
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent rounded-full border-t-red-500 animate-spin"></div>
            </div>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-10">
            <div className="inline-block bg-gradient-to-r from-red-100 to-pink-100 px-6 py-4 rounded-2xl">
              <p className="text-sm text-gray-600 font-medium">You&apos;ve reached the end of the feed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
