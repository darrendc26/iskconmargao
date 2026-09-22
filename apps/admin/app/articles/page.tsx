"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { uploadFile } from "@/components/SimpleList";
import { ArticleBlock } from "@iskcon/types";
import { BlockEditor } from "@/components/BlockEditor";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("krishna-katha");
  const [excerpt, setExcerpt] = useState("");
  const [blocks, setBlocks] = useState<ArticleBlock[]>([]);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const formRef = useRef<HTMLFormElement>(null);

  const load = () => api<any[]>("/api/v1/admin/articles").then((r) => setItems(r.data || []));

  useEffect(() => {
    load();
  }, []);

  // Upload Cover Image
  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setMsg("Uploading cover image...");

    try {
      const data = await uploadFile(file, "articles");
      if (data.success && data.data?.id) {
        setCoverMediaId(data.data.id);
        setCoverPreviewUrl(data.data.url);
        setMsg("Cover image uploaded successfully!");
      } else {
        setMsg(data.error?.message || "Failed to upload cover image.");
      }
    } catch {
      setMsg("Error uploading cover image.");
    } finally {
      setUploadingCover(false);
    }
  }

  function startEdit(article: any) {
    setEditingId(article.id);
    setTitle(article.title || "");
    setCategory(article.category_slug || article.category || "krishna-katha");
    setExcerpt(article.excerpt || "");

    let blocksToSet: ArticleBlock[] = [];
    if (Array.isArray(article.content)) {
      blocksToSet = article.content;
    } else if (typeof article.content === "string" && article.content.trim()) {
      blocksToSet = article.content
        .split(/\r?\n\r?\n/)
        .map((p: string) => p.trim())
        .filter(Boolean)
        .map((text: string) => ({ type: "paragraph", text }));
    }
    setBlocks(blocksToSet);

    setCoverPreviewUrl(article.cover_url || null);
    setCoverMediaId(article.cover_media_id || null);
    setActiveTab("edit");
    setMsg(`Editing article: "${article.title}"`);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setCategory("krishna-katha");
    setExcerpt("");
    setBlocks([]);
    setCoverMediaId(null);
    setCoverPreviewUrl(null);
    setMsg("");
  }

  async function handleSave(statusToSet: "pending_review" | "published") {
    if (!title.trim()) {
      setMsg("Article title is required.");
      return;
    }
    const isEdit = !!editingId;
    setMsg(isEdit ? "Saving changes..." : statusToSet === "published" ? "Publishing article..." : "Saving draft for review...");

    const url = isEdit ? `/api/v1/admin/articles/${editingId}` : "/api/v1/admin/articles";
    const method = isEdit ? "PUT" : "POST";

    const res = await api(url, {
      method,
      body: JSON.stringify({
        title,
        excerpt,
        content: blocks,
        category,
        cover_media_id: coverMediaId,
        status: statusToSet,
      }),
    });

    if (res.ok) {
      setMsg(
        isEdit
          ? statusToSet === "published"
            ? "Article updated and published live!"
            : "Article updated successfully!"
          : statusToSet === "published"
          ? "Article created and published live!"
          : "Article saved as draft!"
      );
      cancelEdit();
      load();
    } else {
      setMsg(res.error || "Could not save article. Please check all block fields.");
    }
  }

  async function togglePublish(id: string, isCurrentlyPublished: boolean) {
    const endpoint = isCurrentlyPublished ? `/api/v1/admin/articles/${id}/unpublish` : `/api/v1/admin/articles/${id}/publish`;
    const res = await api(endpoint, { method: "POST" });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    const res = await api(`/api/v1/admin/articles/${id}`, { method: "DELETE" });
    setMsg(res.ok ? "Article deleted." : res.error || "Could not delete this article.");
    if (res.ok) {
      if (editingId === id) cancelEdit();
      load();
    }
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-forest">Articles & Devotional Content</h1>
          <p className="mt-1 text-ink/70">Create, edit and publish articles using controlled responsive content blocks.</p>
        </div>
        <div className="flex gap-2 border bg-white p-1 rounded-full self-start">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === "edit" ? "bg-forest text-cream shadow-sm" : "text-ink/70 hover:text-ink"
            }`}
          >
            {editingId ? "✏️ Edit Mode" : "✍️ Create Content"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === "preview" ? "bg-forest text-cream shadow-sm" : "text-ink/70 hover:text-ink"
            }`}
          >
            👁️ Block Preview
          </button>
        </div>
      </div>

      {msg && (
        <div className="mt-4 p-3 text-sm rounded-lg bg-gold/15 border border-gold/30 text-forest font-medium">
          {msg}
        </div>
      )}

      {activeTab === "edit" ? (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave("pending_review");
          }}
          className="mt-6 max-w-4xl space-y-6 bg-white/80 p-6 md:p-8 rounded-2xl border border-gold/30 shadow-sm"
        >
          {editingId && (
            <div className="flex items-center justify-between bg-gold/10 p-3 rounded-xl border border-gold/30">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                Editing Article ID: {editingId}
              </span>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-lg"
              >
                Cancel Edit
              </button>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
                Article Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Why Do We Chant Hare Krishna?"
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white text-ink text-base focus:border-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. krishna-katha, bhagavad-gita"
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white text-ink text-sm focus:border-forest"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="border border-dashed border-gold/40 rounded-xl p-4 bg-cream/40">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-forest">Article Cover Image</h3>
                <p className="text-xs text-ink/70 mt-0.5">Banner photo displayed at the top of the article page.</p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-forest/10 hover:bg-forest/20 text-forest px-4 py-2 text-xs font-medium transition">
                <span>{uploadingCover ? "Uploading..." : "📷 Choose Cover Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>
            </div>

            {coverPreviewUrl && (
              <div className="mt-4 relative inline-block group">
                <img
                  src={coverPreviewUrl}
                  alt="Cover preview"
                  className="h-40 w-full max-w-md object-cover rounded-xl border border-gold/30 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverMediaId(null);
                    setCoverPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-800 text-white rounded-full p-1.5 text-xs shadow hover:bg-red-900"
                  title="Remove cover photo"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-forest/80 mb-1">
              Short Summary / Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Brief 1-2 sentence description shown in article lists..."
              className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white text-ink text-sm focus:border-forest"
            />
          </div>

          {/* Controlled Block Editor */}
          <div className="pt-2">
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gold/20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave("pending_review")}
                className="rounded-full border border-forest text-forest hover:bg-forest/10 px-5 py-2 font-medium text-sm transition"
              >
                {editingId ? "Save Changes as Draft" : "Save Draft"}
              </button>
              <button
                type="button"
                onClick={() => handleSave("published")}
                className="rounded-full bg-forest text-cream hover:bg-forest/90 px-6 py-2 font-medium text-sm shadow-md transition flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>{editingId ? "Update & Publish Live" : "Publish Directly"}</span>
              </button>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-medium text-ink/70 hover:text-ink underline"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </form>
      ) : (
        /* Live Block Preview Tab */
        <div className="mt-6 max-w-3xl mx-auto bg-cream p-6 md:p-10 rounded-3xl border border-gold/30 shadow-lg space-y-6">
          <div className="text-xs uppercase tracking-widest text-saffron font-bold">{category || "General"}</div>
          <h1 className="font-serif text-3xl md:text-4xl text-forest mt-2">{title || "Untitled Article"}</h1>
          {excerpt && <p className="mt-3 text-lg text-ink/70 leading-relaxed italic">{excerpt}</p>}

          {coverPreviewUrl && (
            <img
              src={coverPreviewUrl}
              alt=""
              className="w-full h-64 md:h-80 object-cover rounded-2xl my-6 border border-gold/20 shadow-md"
            />
          )}

          <div className="mt-6 border-t border-gold/20 pt-6 space-y-6">
            {blocks.length === 0 ? (
              <p className="text-ink/60 italic text-center p-4">No content blocks added. Add blocks in Edit mode to preview!</p>
            ) : (
              blocks.map((b, i) => (
                <div key={i} className="p-4 bg-white/70 rounded-xl border border-gold/20">
                  <span className="text-[10px] font-bold text-saffron uppercase block mb-1">Block #{i + 1}: {b.type}</span>
                  {b.type === "heading" && <h2 className="font-serif text-2xl text-forest font-bold">{b.text}</h2>}
                  {b.type === "paragraph" && <p className="text-ink/90">{b.text}</p>}
                  {b.type === "image" && (
                    <div>
                      {(b.url || b.thumb_url) && <img src={b.url || b.thumb_url} alt="" className="h-40 rounded object-cover mb-2" />}
                      <p className="text-xs text-ink/70">Media ID: {b.mediaId}</p>
                    </div>
                  )}
                  {b.type === "split" && (
                    <div className="flex gap-4 items-center">
                      {(b.url || b.thumb_url) && <img src={b.url || b.thumb_url} alt="" className="w-24 h-24 rounded object-cover" />}
                      <p className="text-xs text-ink/90">{b.text}</p>
                    </div>
                  )}
                  {b.type === "quote" && <blockquote className="border-l-4 border-gold pl-3 italic text-forest">"{b.text}"</blockquote>}
                  {b.type === "youtube" && <p className="text-xs font-mono">YouTube Video ID: {b.videoId}</p>}
                  {b.type === "gallery" && <p className="text-xs text-ink/70">Gallery with {b.mediaIds.length} images</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Published & Existing Articles List */}
      <div className="mt-14 max-w-4xl">
        <h2 className="font-serif text-2xl text-forest border-b border-gold/20 pb-2">Existing Articles</h2>
        <ul className="mt-4 space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className={`bg-white/70 p-4 rounded-xl border ${
                editingId === a.id ? "border-forest ring-2 ring-forest/20" : "border-gold/20"
              } flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-4">
                {a.cover_url ? (
                  <img src={a.cover_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-gold/20 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center text-forest text-xs font-serif flex-shrink-0">Article</div>
                )}
                <div>
                  <p className="font-medium text-forest text-base">{a.title}</p>
                  <p className="text-xs text-ink/60 mt-0.5 flex items-center gap-2">
                    <span
                      className={`capitalize font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        a.status === "published" ? "bg-emerald-700 text-white" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {a.status}
                    </span>
                    <span>· {a.category || "General"}</span>
                    <span>· {a.slug}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center self-end md:self-auto flex-wrap">
                <button
                  type="button"
                  className="text-xs font-medium bg-gold/20 text-forest border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold/30"
                  onClick={() => startEdit(a)}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                    a.status === "published"
                      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                      : "bg-forest text-cream hover:bg-forest/90"
                  }`}
                  onClick={() => togglePublish(a.id, a.status === "published")}
                >
                  {a.status === "published" ? "⏸️ Unpublish" : "🚀 Publish"}
                </button>

                <button
                  type="button"
                  className="text-xs text-red-800 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50"
                  onClick={() => remove(a.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
