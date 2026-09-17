"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSettings({ initialImage, initialName, email }: { initialImage?: string | null, initialName?: string | null, email: string }) {
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/user/upload-photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.imageUrl);
        router.refresh();
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/remove-photo", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setImage(null);
        router.refresh();
      } else {
        alert("Failed to remove image.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-base font-semibold text-white border-b border-slate-800 pb-3">Profile Photo & Identity</h3>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold overflow-hidden">
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>{initialName ? initialName.charAt(0).toUpperCase() : "C"}</span>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Upload a clear photo or company logo. Supported formats: PNG, JPG (Max 5MB).</p>
          <div className="flex flex-wrap gap-3">
            <label className={`cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-md ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {loading ? "Processing..." : "Upload Profile Photo"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={loading} />
            </label>
            <button 
              type="button" 
              onClick={handleRemove}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Remove Profile Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}