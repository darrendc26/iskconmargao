"use client";

import { useState } from "react";
import { ArticleBlock, GalleryMediaItem } from "@iskcon/types";
import { MediaPickerModal, SelectedMedia } from "./MediaPickerModal";

interface BlockEditorProps {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [galleryPickerIndex, setGalleryPickerIndex] = useState<number | null>(null);

  function updateBlock(index: number, updated: ArticleBlock) {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  }

  function addBlock(type: ArticleBlock["type"]) {
    let newBlock: ArticleBlock;

    switch (type) {
      case "heading":
        newBlock = { type: "heading", level: 2, text: "" };
        break;
      case "paragraph":
        newBlock = { type: "paragraph", text: "" };
        break;
      case "image":
        newBlock = { type: "image", mediaId: "", alt: "", caption: "" };
        break;
      case "split":
        newBlock = { type: "split", imagePosition: "left", mediaId: "", text: "", alt: "", caption: "" };
        break;
      case "quote":
        newBlock = { type: "quote", text: "", attribution: "" };
        break;
      case "youtube":
        newBlock = { type: "youtube", videoId: "", caption: "" };
        break;
      case "gallery":
        newBlock = { type: "gallery", mediaIds: [], media: [] };
        break;
    }

    onChange([...blocks, newBlock]);
  }

  function moveBlock(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...blocks];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  }

  function duplicateBlock(index: number) {
    const blockToCopy = JSON.parse(JSON.stringify(blocks[index]));
    const next = [...blocks];
    next.splice(index + 1, 0, blockToCopy);
    onChange(next);
  }

  function deleteBlock(index: number) {
    const next = blocks.filter((_, i) => i !== index);
    onChange(next);
  }

  function handleMediaSelected(media: SelectedMedia) {
    if (activePickerIndex !== null) {
      const b = blocks[activePickerIndex];
      if (b.type === "image" || b.type === "split") {
        updateBlock(activePickerIndex, {
          ...b,
          mediaId: media.id,
          url: media.url,
          thumb_url: media.thumb_url || media.url,
        });
      }
      setActivePickerIndex(null);
    } else if (galleryPickerIndex !== null) {
      const b = blocks[galleryPickerIndex];
      if (b.type === "gallery") {
        const mediaIds = [...b.mediaIds, media.id];
        const mediaList: GalleryMediaItem[] = [
          ...(b.media || []),
          { id: media.id, url: media.url, thumb_url: media.thumb_url || media.url },
        ];
        updateBlock(galleryPickerIndex, {
          ...b,
          mediaIds,
          media: mediaList,
        });
      }
      setGalleryPickerIndex(null);
    }
  }

  return (
    <div className="space-y-6">
      <MediaPickerModal
        isOpen={activePickerIndex !== null || galleryPickerIndex !== null}
        onClose={() => {
          setActivePickerIndex(null);
          setGalleryPickerIndex(null);
        }}
        onSelect={handleMediaSelected}
      />

      <div className="flex items-center justify-between border-b border-gold/20 pb-3">
        <h3 className="font-serif text-lg font-bold text-forest uppercase tracking-wider">
          Article Content Blocks ({blocks.length})
        </h3>
      </div>

      {blocks.length === 0 ? (
        <div className="p-8 text-center bg-cream/40 rounded-2xl border border-dashed border-gold/30">
          <p className="text-ink/60 text-sm italic mb-4">No content blocks added yet. Click "+ Add Block" below to start!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gold/30 shadow-sm overflow-hidden transition hover:border-gold/60"
            >
              {/* Block Header Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-cream/60 border-b border-gold/20 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-ink/40 font-bold">#{idx + 1}</span>
                  <span className="font-bold text-forest uppercase tracking-wider bg-gold/20 px-2 py-0.5 rounded-full text-[10px]">
                    {block.type === "split" ? "Image + Text" : block.type}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded text-ink/70 hover:text-forest hover:bg-gold/20 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, "down")}
                    disabled={idx === blocks.length - 1}
                    className="p-1 rounded text-ink/70 hover:text-forest hover:bg-gold/20 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <span className="text-gold/40 mx-1">|</span>
                  <button
                    type="button"
                    onClick={() => duplicateBlock(idx)}
                    className="px-2 py-0.5 rounded text-forest font-medium hover:bg-gold/20"
                    title="Duplicate Block"
                  >
                    📋 Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBlock(idx)}
                    className="px-2 py-0.5 rounded text-red-700 font-medium hover:bg-red-100"
                    title="Delete Block"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Block Body Inputs */}
              <div className="p-4 space-y-3">
                {/* 1. HEADING BLOCK */}
                {block.type === "heading" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <label className="text-xs font-semibold text-forest uppercase tracking-wider">Heading Level:</label>
                      <div className="flex gap-3">
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`heading-level-${idx}`}
                            checked={block.level === 2}
                            onChange={() => updateBlock(idx, { ...block, level: 2 })}
                            className="accent-forest"
                          />
                          <span className="font-semibold text-forest">H2 (Section Header)</span>
                        </label>
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`heading-level-${idx}`}
                            checked={block.level === 3}
                            onChange={() => updateBlock(idx, { ...block, level: 3 })}
                            className="accent-forest"
                          />
                          <span className="font-semibold text-forest">H3 (Sub-heading)</span>
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={block.text}
                      onChange={(e) => updateBlock(idx, { ...block, text: e.target.value })}
                      placeholder="Enter heading text..."
                      className="w-full border border-gold/30 rounded-xl px-4 py-2 text-base font-serif text-forest focus:border-forest"
                    />
                  </div>
                )}

                {/* 2. PARAGRAPH BLOCK */}
                {block.type === "paragraph" && (
                  <div className="space-y-2">
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(idx, { ...block, text: e.target.value })}
                      rows={5}
                      placeholder="Enter paragraph text..."
                      className="w-full border border-gold/30 rounded-xl p-3 text-sm text-ink font-sans leading-relaxed focus:border-forest"
                    />
                  </div>
                )}

                {/* 3. IMAGE BLOCK */}
                {block.type === "image" && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-dashed border-gold/40 p-3 rounded-xl bg-cream/30">
                      <div>
                        <span className="text-xs font-semibold text-forest block">Referenced Media ID:</span>
                        <code className="text-xs text-ink/70 font-mono">{block.mediaId || "No image selected"}</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActivePickerIndex(idx)}
                        className="px-4 py-1.5 rounded-full bg-forest text-cream text-xs font-medium hover:bg-forest/90"
                      >
                        {block.mediaId ? "📷 Change Image" : "📷 Select Image"}
                      </button>
                    </div>

                    {(block.url || block.thumb_url) && (
                      <div className="relative max-w-sm rounded-xl overflow-hidden border border-gold/30 shadow-sm">
                        <img src={block.url || block.thumb_url} alt="" className="w-full max-h-48 object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <label className="text-xs font-semibold text-forest uppercase tracking-wider">Display Size:</label>
                      <div className="flex gap-3">
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`img-size-${idx}`}
                            checked={!block.imageSize || block.imageSize === "medium"}
                            onChange={() => updateBlock(idx, { ...block, imageSize: "medium" })}
                            className="accent-forest"
                          />
                          <span className="font-semibold text-forest">Medium (Standard)</span>
                        </label>
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`img-size-${idx}`}
                            checked={block.imageSize === "small"}
                            onChange={() => updateBlock(idx, { ...block, imageSize: "small" })}
                            className="accent-forest"
                          />
                          <span className="font-semibold text-forest">Small (Compact)</span>
                        </label>
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`img-size-${idx}`}
                            checked={block.imageSize === "full"}
                            onChange={() => updateBlock(idx, { ...block, imageSize: "full" })}
                            className="accent-forest"
                          />
                          <span className="font-semibold text-forest">Full Width</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-forest/80 mb-1">Alt Text (Accessibility)</label>
                        <input
                          type="text"
                          value={block.alt || ""}
                          onChange={(e) => updateBlock(idx, { ...block, alt: e.target.value })}
                          placeholder="Description of image..."
                          className="w-full border border-gold/30 rounded-lg px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-forest/80 mb-1">Caption (Optional)</label>
                        <input
                          type="text"
                          value={block.caption || ""}
                          onChange={(e) => updateBlock(idx, { ...block, caption: e.target.value })}
                          placeholder="Image caption shown below photo..."
                          className="w-full border border-gold/30 rounded-lg px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SPLIT (IMAGE + TEXT) BLOCK */}
                {block.type === "split" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-cream/40 p-2.5 rounded-xl border border-gold/20">
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-forest uppercase tracking-wider">Position:</label>
                        <div className="flex gap-2">
                          <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`split-pos-${idx}`}
                              checked={block.imagePosition === "left"}
                              onChange={() => updateBlock(idx, { ...block, imagePosition: "left" })}
                              className="accent-forest"
                            />
                            <span className="font-semibold text-forest">Left</span>
                          </label>
                          <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`split-pos-${idx}`}
                              checked={block.imagePosition === "right"}
                              onChange={() => updateBlock(idx, { ...block, imagePosition: "right" })}
                              className="accent-forest"
                            />
                            <span className="font-semibold text-forest">Right</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-forest uppercase tracking-wider">Image Width:</label>
                        <div className="flex gap-2">
                          <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`split-size-${idx}`}
                              checked={block.imageSize === "small"}
                              onChange={() => updateBlock(idx, { ...block, imageSize: "small" })}
                              className="accent-forest"
                            />
                            <span className="font-medium text-forest">Small (25%)</span>
                          </label>
                          <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`split-size-${idx}`}
                              checked={!block.imageSize || block.imageSize === "medium"}
                              onChange={() => updateBlock(idx, { ...block, imageSize: "medium" })}
                              className="accent-forest"
                            />
                            <span className="font-medium text-forest">Medium (40%)</span>
                          </label>
                          <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`split-size-${idx}`}
                              checked={block.imageSize === "large"}
                              onChange={() => updateBlock(idx, { ...block, imageSize: "large" })}
                              className="accent-forest"
                            />
                            <span className="font-medium text-forest">Large (50%)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 items-start">
                      <div className="space-y-3 border border-dashed border-gold/40 p-3 rounded-xl bg-cream/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-forest">Split Image</span>
                          <button
                            type="button"
                            onClick={() => setActivePickerIndex(idx)}
                            className="px-3 py-1 rounded-full bg-forest text-cream text-xs font-medium"
                          >
                            {block.mediaId ? "Change Image" : "Select Image"}
                          </button>
                        </div>
                        {(block.url || block.thumb_url) && (
                          <img src={block.url || block.thumb_url} alt="" className="w-full h-36 object-cover rounded-lg border border-gold/30" />
                        )}
                        <input
                          type="text"
                          value={block.caption || ""}
                          onChange={(e) => updateBlock(idx, { ...block, caption: e.target.value })}
                          placeholder="Image caption (optional)"
                          className="w-full border border-gold/30 rounded-lg px-3 py-1 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1">Text Content</label>
                        <textarea
                          value={block.text}
                          onChange={(e) => updateBlock(idx, { ...block, text: e.target.value })}
                          rows={6}
                          placeholder="Enter text to wrap alongside image..."
                          className="w-full border border-gold/30 rounded-xl p-3 text-sm text-ink font-sans focus:border-forest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. QUOTE BLOCK */}
                {block.type === "quote" && (
                  <div className="space-y-3">
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(idx, { ...block, text: e.target.value })}
                      rows={3}
                      placeholder="Enter devotional quotation or verse text..."
                      className="w-full border border-gold/30 rounded-xl p-3 text-sm font-serif italic text-forest bg-gold/5 focus:border-forest"
                    />
                    <div>
                      <label className="block text-xs font-medium text-forest/80 mb-1">Attribution / Speaker (Optional)</label>
                      <input
                        type="text"
                        value={block.attribution || ""}
                        onChange={(e) => updateBlock(idx, { ...block, attribution: e.target.value })}
                        placeholder="e.g. Srila Prabhupada / Bhagavad-gita 4.9"
                        className="w-full border border-gold/30 rounded-lg px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 6. YOUTUBE BLOCK */}
                {block.type === "youtube" && (
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1">YouTube Video ID *</label>
                        <input
                          type="text"
                          value={block.videoId}
                          onChange={(e) => updateBlock(idx, { ...block, videoId: e.target.value.trim() })}
                          placeholder="e.g. dQw4w9WgXcQ (11 characters)"
                          className="w-full border border-gold/30 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1">Caption (Optional)</label>
                        <input
                          type="text"
                          value={block.caption || ""}
                          onChange={(e) => updateBlock(idx, { ...block, caption: e.target.value })}
                          placeholder="Video title / caption..."
                          className="w-full border border-gold/30 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    {block.videoId && block.videoId.length === 11 && (
                      <div className="mt-2 aspect-video max-w-sm rounded-xl overflow-hidden border border-gold/30 bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
                          title="YouTube video preview"
                          className="w-full h-full border-0"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 7. GALLERY BLOCK */}
                {block.type === "gallery" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-forest uppercase tracking-wider">
                        Gallery Images ({block.mediaIds.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setGalleryPickerIndex(idx)}
                        className="px-4 py-1.5 rounded-full bg-forest text-cream text-xs font-medium hover:bg-forest/90"
                      >
                        + Add Photo to Gallery
                      </button>
                    </div>

                    {block.mediaIds.length === 0 ? (
                      <p className="text-xs text-ink/60 italic p-3 bg-cream/30 rounded-xl text-center">No images added to gallery yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {block.mediaIds.map((mId, mIdx) => {
                          const item = block.media?.find((m) => m.id === mId);
                          return (
                            <div key={mIdx} className="relative group rounded-xl overflow-hidden border border-gold/30 bg-white">
                              {item?.url || item?.thumb_url ? (
                                <img src={item.url || item.thumb_url} alt="" className="w-full h-24 object-cover" />
                              ) : (
                                <div className="w-full h-24 bg-cream flex items-center justify-center text-[10px] font-mono text-ink/60 truncate p-1">
                                  {mId.slice(0, 8)}...
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const nextIds = block.mediaIds.filter((_, i) => i !== mIdx);
                                  const nextMedia = block.media?.filter((_, i) => i !== mIdx);
                                  updateBlock(idx, { ...block, mediaIds: nextIds, media: nextMedia });
                                }}
                                className="absolute top-1 right-1 bg-red-800 text-white rounded-full p-1 text-[10px] leading-none shadow hover:bg-red-900"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Block Dropdown Bar */}
      <div className="p-4 bg-cream/60 rounded-2xl border border-gold/30 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-forest uppercase tracking-wider mr-2">+ Add Content Block:</span>
        <button
          type="button"
          onClick={() => addBlock("heading")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          📌 Heading
        </button>
        <button
          type="button"
          onClick={() => addBlock("paragraph")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          📝 Paragraph
        </button>
        <button
          type="button"
          onClick={() => addBlock("image")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          🖼️ Image
        </button>
        <button
          type="button"
          onClick={() => addBlock("split")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          🖼️+📝 Image + Text
        </button>
        <button
          type="button"
          onClick={() => addBlock("quote")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          💬 Quote
        </button>
        <button
          type="button"
          onClick={() => addBlock("youtube")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          ▶️ YouTube
        </button>
        <button
          type="button"
          onClick={() => addBlock("gallery")}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-gold/20 border border-gold/30 text-forest text-xs font-medium transition"
        >
          🌄 Gallery
        </button>
      </div>
    </div>
  );
}
