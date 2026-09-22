"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { uploadFile } from "@/components/SimpleList";

export interface SelectedMedia {
  id: string;
  url: string;
  thumb_url?: string;
  alt?: string;
  caption?: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: SelectedMedia) => void;
  title?: string;
}

export function MediaPickerModal({ isOpen, onClose, onSelect, title = "Select Image" }: MediaPickerModalProps) {
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!isOpen) return null;

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("Uploading image to media library...");

    try {
      const data = await uploadFile(file, "articles");
      if (data.success && data.data?.id) {
        setMsg("Upload complete!");
        onSelect({
          id: data.data.id,
          url: data.data.url,
          thumb_url: data.data.thumb_url,
        });
        onClose();
      } else {
        setMsg(data.error?.message || "Upload failed. Please try again.");
      }
    } catch {
      setMsg("Error uploading image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gold/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-cream border-b border-gold/20">
          <h3 className="font-serif text-xl font-bold text-forest">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/60 hover:text-ink text-xl font-bold p-1 rounded-lg hover:bg-gold/10"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {msg && (
            <div className="p-3 text-xs rounded-xl bg-gold/15 border border-gold/30 text-forest font-medium">
              {msg}
            </div>
          )}

          <div className="border-2 border-dashed border-gold/40 rounded-2xl p-8 text-center bg-cream/30 hover:bg-cream/50 transition">
            <div className="mx-auto w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-forest text-2xl mb-3">
              📷
            </div>
            <p className="text-sm font-semibold text-forest mb-1">Upload Image File</p>
            <p className="text-xs text-ink/70 mb-4 max-w-xs mx-auto">
              Select a photo (JPEG, PNG, WebP up to 15MB). The media system will generate optimized web versions and return the media ID.
            </p>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-forest text-cream hover:bg-forest/90 px-6 py-2.5 text-xs font-semibold shadow-md transition">
              <span>{uploading ? "Uploading..." : "Browse & Upload Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="px-6 py-3 bg-cream/50 border-t border-gold/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-ink/70 hover:text-ink bg-white border border-gold/30 hover:bg-cream"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
