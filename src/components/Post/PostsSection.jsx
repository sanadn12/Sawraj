import { useState } from "react";
import { FiImage, FiX, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const PostsSection = ({ posts, isOwnProfile, token }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postList, setPostList] = useState(posts); 

  const handleDelete = async (postId) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/users/deletepost/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update local state after deletion
      setPostList((prev) => prev.filter((post) => post._id !== postId));
      setSelectedPost(null);
      console.log(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {postList && postList.length > 0 ? (
          postList.map((post, idx) => (
            <div
              key={post._id || idx}
              className="relative group cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition"
              onClick={() => setSelectedPost(post)}
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-500 text-lg">
                  <span>No Image</span>
                </div>
              )}

              {post.caption && (
                <div className="p-3">
                  <p className="text-gray-800 text-sm truncate">{post.caption}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-gray-500">
              {isOwnProfile ? "You haven't shared any posts." : "This user hasn't shared any posts."}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedPost(null)}
            >
              <FiX size={24} />
            </button>

            {/* Image */}
            {selectedPost.image && (
              <img src={selectedPost.image} alt="Selected Post" className="w-full rounded-t-xl" />
            )}

            {/* Caption & Created Time */}
            <div className="p-4">
              {selectedPost.caption && <p className="text-gray-800 text-sm">{selectedPost.caption}</p>}
              {selectedPost.createdAt && (
                <p className="text-gray-500 text-xs mt-2">
                  Posted on: {new Date(selectedPost.createdAt).toLocaleString()}
                </p>
              )}

              {/* Delete Button (only for own posts) */}
              {isOwnProfile && (
                <button
                  className="mt-4 flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(selectedPost._id)}
                >
                  <FiTrash2 /> Delete Post
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsSection;
