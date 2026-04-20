"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRef, useState, useCallback } from "react";
import { Upload, X } from "lucide-react";

export default function UserInfo({ profile, email }: any) {
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadToCloudinary = async (file: File) => {
        if (!file.type.startsWith("image/")) return alert("Only images allowed.");
        setUploading(true);

        // 1. Get signature from your API
        const sigRes = await fetch("/api/user/update-avatar");
        const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

        // 2. Upload directly to Cloudinary (bypasses Vercel size limit)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "profile-pics");
        formData.append("transformation", "c_fill,w_400,h_400");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        if (data.error) {
            console.error("Cloudinary upload error:", data.error.message);
            alert(data.error.message);
            setUploading(false);
            return;
        }

        if (data.secure_url) {
            await fetch("/api/user/update-avatar", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: profile?.id, avatarUrl: data.secure_url }),
            });
            setAvatarUrl(data.secure_url);
            setShowDropzone(false);
        }

        setUploading(false);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadToCloudinary(file);
    }, []);

    return (
        <div className="p-6 rounded-2xl shadow shadow-gray-500">
            <div className="flex flex-col items-center space-y-4">

                {/* Avatar with hover overlay */}
                <div className="relative group cursor-pointer" onClick={() => setShowDropzone(true)}>
                    <Avatar className="h-16 w-16 rounded-full overflow-hidden">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="rounded-lg">
                            {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="text-white w-5 h-5" />
                    </div>
                </div>

                {/* Drag & Drop Zone */}
                {showDropzone && (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={`relative w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-colors
                            ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setShowDropzone(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <Upload className="w-7 h-7 text-gray-400" />
                        <p className="text-sm text-gray-500 text-center">
                            Drag & drop your photo here, or{" "}
                            <span
                                className="text-blue-500 underline cursor-pointer"
                                onClick={() => inputRef.current?.click()}
                            >
                                browse
                            </span>
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 5MB</p>

                        {uploading && (
                            <p className="text-xs text-blue-500 animate-pulse">Uploading...</p>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadToCloudinary(file);
                            }}
                        />
                    </div>
                )}

                <div className="text-center">
                    <p className="font-semibold text-lg">
                        {profile?.first_name || "No Name"} {profile?.last_name}
                    </p>
                    <p className="text-gray-500">{email}</p>
                    {profile?.username && (
                        <p className="text-sm">@{profile.username}</p>
                    )}
                </div>

                {profile?.bio && (
                    <p className="text-sm text-gray-600 text-center">{profile.bio}</p>
                )}

                <div className="flex gap-4">
                    <Button variant="default" onClick={() => setShowDropzone((p) => !p)}>
                        Change Profile
                    </Button>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </div>
        </div>
    );
}