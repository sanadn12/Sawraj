"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { useRouter } from "next/navigation";

const Post = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgRef, setImgRef] = useState();
  const [showCrop, setShowCrop] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);

        const { width, height } = imgRef || { width: 100, height: 100 };
        const crop = centerCrop(
          makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
          width,
          height
        );
        setCrop(crop);
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setImgRef(e.currentTarget);

    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(crop);
  };

  const finalizeCrop = async () => {
    if (!imgRef || !completedCrop || !previewCanvasRef.current) return;

    await canvasPreview(imgRef, previewCanvasRef.current, completedCrop);

    previewCanvasRef.current.toBlob((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // update preview with cropped image
        setShowCrop(false); // hide cropping UI
      };
      reader.readAsDataURL(blob);
    }, "image/jpeg", 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !preview) {
      alert("Please add a caption or select an image.");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      let processedImage = preview;

      await axios.post(
        `${BACKEND_API}/users/createpost`,
        { caption, image: processedImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowPopup(true);

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="max-w-lg mx-auto mt-36 bg-white rounded-2xl  shadow-xl overflow-hidden border border-red-100">
      <div className="bg-red-500 py-4 text-center">
        <h2 className="text-xl font-bold text-white">Create Post</h2>
      </div>

      <div className="p-5">
        {/* Image Preview / Crop */}
        {preview && (
          <div className="mb-5 relative rounded-lg overflow-hidden">
            {showCrop ? (
              <>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    ref={setImgRef}
                    alt="Crop me"
                    src={preview}
                    onLoad={onImageLoad}
                    className="max-h-64 object-contain"
                  />
                </ReactCrop>

                <canvas
                  ref={previewCanvasRef}
                  style={{
                    display: "none",
                    width: completedCrop?.width,
                    height: completedCrop?.height,
                  }}
                />

                <div className="mt-2 flex justify-center">
                  <button
                    onClick={finalizeCrop}
                    className="bg-red-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-red-600 transition-all"
                  >
Crop                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* Upload Section */}
        {!preview && (
          <div className="text-center py-8">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <h3 className="text-xl font-bold mt-2 text-gray-800">
                Upload your photo
              </h3>
              <p className="text-gray-500 mt-1">
                Select a photo to share with your audience
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Select from computer
            </button>
          </div>
        )}

        {/* Caption */}
        <div className="mb-5">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            rows="3"
          />
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          {preview && !showCrop && (
            <button
              onClick={() => {
                setPreview("");
                setImage("");
              }}
              className="flex-1 border border-red-500 text-red-500 font-semibold py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !preview}
            onClick={handleSubmit}
            className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md flex items-center justify-center"
          >
            {loading ? "Posting..." : "Share Post"}
          </button>
        </div>
      </div>

      {/* Success popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-green-600 mb-2">
              Post Created Successfully!
            </h3>
            <p className="text-gray-600">Redirecting to previous page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
