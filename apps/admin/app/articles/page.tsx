"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("krishna-katha");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; alt: string }[]>([]);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "articles");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/admin/media/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.id) {
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

  // Upload Inline Image and insert markdown
  async function handleInlineUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    setMsg("Uploading picture for article...");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "articles");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/admin/media/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.url) {
        const url = data.data.url;
        const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const markdown = `\n\n![${altText}](${url})\n\n`;

        insertAtCursor(markdown);
        setUploadedImages((prev) => [{ id: data.data.id, url, alt: altText }, ...prev]);
        setMsg("Picture uploaded and inserted into article!");
      } else {
        setMsg(data.error?.message || "Failed to upload picture.");
      }
    } catch {
      setMsg("Error uploading picture.");
    } finally {
      setUploadingInline(false);
      if (e.target) e.target.value = "";
    }
  }

  function insertAtCursor(textToInsert: string) {
    if (!textareaRef.current) {
      setContent((prev) => prev + textToInsert);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  }

  function startEdit(article: any) {
    setEditingId(article.id);
    setTitle(article.title || "");
    setCategory(article.category_slug || article.category || "krishna-katha");
    setExcerpt(article.excerpt || "");
    setContent(article.content || "");
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
    setContent("");
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
        content,
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
          ? "Article created and published directly live!"
          : "Article saved as draft for review!"
      );
      cancelEdit();
      load();
    } else {
      setMsg(res.error || "Could not save article. Please check all fields.");
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
          <h1 className="font-serif text-4xl text-forest">Articles & Blogs</h1>
          <p className="mt-1 text-ink/70">Create, edit and publish posts with cover photos, inline pictures, headings and devotional content.</p>
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
            👁️ Live Preview
          </button>
        </div>
      </div>

      {msg && (
        <div className="mt-4 p-3 text-sm rounded-lg bg-gold/15 border border-gold/30 text-forest font-medium">
          {msg}
        </div>
      )}

      {activeTab === "edit" ? (
        <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSave("pending_review"); }} className="mt-6 max-w-4xl space-y-6 bg-white/80 p-6 md:p-8 rounded-2xl border border-gold/30 shadow-sm">
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
                <p className="text-xs text-ink/70 mt-0.5">Upload a banner photo displayed at the top of the blog and on card previews.</p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-forest/10 hover:bg-forest/20 text-forest px-4 py-2 text-xs font-medium transition">
                <span>{uploadingCover ? "Uploading..." : "📷 Choose Cover Photo"}</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} className="hidden" />
              </label>
            </div>

            {coverPreviewUrl && (
              <div className="mt-4 relative inline-block group">
                <img src={coverPreviewUrl} alt="Cover preview" className="h-40 w-full max-w-md object-cover rounded-xl border border-gold/30 shadow-sm" />
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
              rows={4}
              placeholder="Brief 1-2 sentence description shown in article cards..."
              className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white text-ink text-sm focus:border-forest min-h-[100px]"
            />
          </div>

          {/* Content & Inline Image Toolbar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-medium uppercase tracking-wider text-forest/80">
                Article Body & Content
              </label>
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-forest px-3 py-1 text-xs font-medium transition">
                  <span>{uploadingInline ? "Uploading..." : "🖼️ Upload & Insert Picture"}</span>
                  <input type="file" accept="image/*" onChange={handleInlineUpload} disabled={uploadingInline} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => insertAtCursor("\n\n## Section Heading\n\n")}
                  className="rounded-lg bg-cream hover:bg-gold/10 border border-gold/30 text-forest px-2.5 py-1 text-xs font-medium"
                >
                  + Heading
                </button>
                <button
                  type="button"
                  onClick={() => insertAtCursor("\n\n> Devotional quote or verse\n\n")}
                  className="rounded-lg bg-cream hover:bg-gold/10 border border-gold/30 text-forest px-2.5 py-1 text-xs font-medium"
                >
                  + Quote
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18}
              placeholder="Write your article text here. You can insert pictures anywhere using the 'Upload & Insert Picture' button above!"
              className="w-full border border-gold/30 rounded-xl p-4 bg-white text-ink text-base font-sans leading-relaxed focus:border-forest min-h-[420px]"
            />

            {/* Recently Inserted Images Quick List */}
            {uploadedImages.length > 0 && (
              <div className="mt-3 p-3 bg-cream/30 rounded-xl border border-gold/20">
                <p className="text-xs font-semibold text-forest mb-2">Uploaded Pictures for this Article:</p>
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gold/20 text-xs">
                      <img src={img.url} alt="" className="w-8 h-8 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => insertAtCursor(`\n\n![${img.alt}](${img.url})\n\n`)}
                        className="text-forest hover:underline font-medium"
                      >
                        + Insert Picture
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave("pending_review")}
                className="rounded-full border border-forest text-forest hover:bg-forest/10 px-5 py-2 font-medium text-sm transition"
              >
                {editingId ? "Save Changes as Draft" : "Save for Review"}
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
        /* Live Preview Tab */
        <div className="mt-6 max-w-3xl mx-auto bg-cream p-6 md:p-10 rounded-3xl border border-gold/30 shadow-lg">
          <div className="text-xs uppercase tracking-widest text-saffron font-bold">{category || "General"}</div>
          <h1 className="font-serif text-3xl md:text-4xl text-forest mt-2">{title || "Untitled Article"}</h1>
          {excerpt && <p className="mt-3 text-lg text-ink/70 leading-relaxed italic">{excerpt}</p>}
          
          {coverPreviewUrl && (
            <img src={coverPreviewUrl} alt="" className="w-full h-64 md:h-80 object-cover rounded-2xl my-6 border border-gold/20 shadow-md" />
          )}

          <div className="mt-6 border-t border-gold/20 pt-6 space-y-4">
            {content ? (
              content.split(/\r?\n/).map((line, idx) => {
                const trimmed = line.trim();
                const mdImg = trimmed.match(/^!\[(.*?)\]\((.*?)\)/);
                if (mdImg) {
                  return (
                    <figure key={idx} className="my-6 overflow-hidden rounded-xl border border-gold/20 shadow bg-white">
                      <img src={mdImg[2]} alt={mdImg[1]} className="w-full max-h-96 object-cover" />
                      {mdImg[1] && <figcaption className="p-2 text-center text-xs italic text-ink/70 bg-cream/50">{mdImg[1]}</figcaption>}
                    </figure>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return <h2 key={idx} className="font-serif text-2xl text-forest mt-6 border-b pb-1">{trimmed.replace(/^##\s+/, "")}</h2>;
                }
                if (trimmed.startsWith("> ")) {
                  return <blockquote key={idx} className="border-l-4 border-gold pl-4 py-2 italic text-forest bg-gold/10 rounded-r-lg">{trimmed.replace(/^>\s+/, "")}</blockquote>;
                }
                if (!trimmed) return null;
                return <p key={idx} className="text-ink/90 leading-relaxed">{trimmed}</p>;
              })
            ) : (
              <p className="text-ink-muted italic">Article body is empty. Type in the editor to see live preview!</p>
            )}
          </div>
        </div>
      )}

      {/* Published & Existing Articles List */}
      <div className="mt-14 max-w-4xl">
        <h2 className="font-serif text-2xl text-forest border-b border-gold/20 pb-2">Existing Articles</h2>
        <ul className="mt-4 space-y-3">
          {items.map((a) => (
            <li key={a.id} className={`bg-white/70 p-4 rounded-xl border ${editingId === a.id ? "border-forest ring-2 ring-forest/20" : "border-gold/20"} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="flex items-center gap-4">
                {a.cover_url ? (
                  <img src={a.cover_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-gold/20 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center text-forest text-xs font-serif flex-shrink-0">Article</div>
                )}
                <div>
                  <p className="font-medium text-forest text-base">{a.title}</p>
                  <p className="text-xs text-ink/60 mt-0.5 flex items-center gap-2">
                    <span className={`capitalize font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      a.status === "published" ? "bg-emerald-700 text-white" : "bg-amber-100 text-amber-800"
                    }`}>
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
