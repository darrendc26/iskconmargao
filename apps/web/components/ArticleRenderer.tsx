"use client";

import React from "react";
import { ArticleBlock } from "@iskcon/types";

interface ArticleRendererProps {
  content: ArticleBlock[] | string;
}

/**
 * Safely parses basic inline markdown formatting (**bold**, *italic*, [link](url)).
 * Prevents XSS and javascript: URLs.
 */
function renderRichText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Regex to split by bold, italic, or markdown links
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i} className="font-semibold text-forest">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i} className="italic text-ink">{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      let href = linkMatch[2].trim();
      // Security check: prevent javascript: and data: URLs
      if (/^(javascript|data|vbscript):/i.test(href)) {
        href = "#";
      }
      return (
        <a
          key={i}
          href={href}
          target={href.startsWith("http") ? "_blank" : "_self"}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-forest font-medium underline decoration-gold hover:text-saffron transition"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
  if (!content) return null;

  // Handle fallback if legacy plain-text string is passed
  if (typeof content === "string") {
    const blocks: ArticleBlock[] = content
      .split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((text) => ({ type: "paragraph", text }));

    return <ArticleRenderer content={blocks} />;
  }

  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  return (
    <div className="article-body max-w-3xl mx-auto space-y-6">
      {content.map((block, idx) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 3) {
              return (
                <h3 key={idx} className="font-serif text-xl md:text-2xl text-forest font-bold mt-8 mb-4">
                  {block.text}
                </h3>
              );
            }
            return (
              <h2 key={idx} className="font-serif text-2xl md:text-3xl text-forest font-bold mt-10 mb-4 border-b border-gold/20 pb-2">
                {block.text}
              </h2>
            );
          }

          case "paragraph": {
            return (
              <p key={idx} className="text-ink/90 leading-relaxed mb-6 text-base md:text-lg whitespace-pre-line">
                {renderRichText(block.text)}
              </p>
            );
          }

          case "image": {
            const imgSrc = block.url || block.thumb_url;
            if (!imgSrc) return null;

            let sizeClass = "w-full";
            if (block.imageSize === "small") sizeClass = "max-w-sm mx-auto";
            else if (block.imageSize === "medium") sizeClass = "max-w-xl mx-auto";

            return (
              <figure key={idx} className={`my-8 overflow-hidden rounded-2xl border border-gold/25 shadow-md bg-white/60 ${sizeClass}`}>
                <img
                  src={imgSrc}
                  alt={block.alt || ""}
                  loading="lazy"
                  className="w-full max-h-[600px] object-cover"
                />
                {block.caption && (
                  <figcaption className="p-3 text-xs md:text-sm text-center italic text-ink/70 bg-cream/50 border-t border-gold/15">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "split": {
            const imgSrc = block.url || block.thumb_url;
            const isRight = block.imagePosition === "right";

            let widthClass = "md:w-[40%]";
            if (block.imageSize === "small") widthClass = "md:w-[25%]";
            else if (block.imageSize === "large") widthClass = "md:w-[50%]";

            const floatClass = isRight ? `md:float-right md:ml-8 md:mb-4` : `md:float-left md:mr-8 md:mb-4`;

            return (
              <div key={idx} className="my-6 clearfix">
                {imgSrc && (
                  <figure className={`w-full ${widthClass} ${floatClass} mb-4`}>
                    <img
                      src={imgSrc}
                      alt={block.alt || ""}
                      loading="lazy"
                      className="w-full h-auto max-h-96 object-cover rounded-2xl border border-gold/20 shadow-sm"
                    />
                    {block.caption && (
                      <figcaption className="mt-2 text-xs text-center italic text-ink/70">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
                <div className="text-ink/90 leading-relaxed text-base md:text-lg whitespace-pre-line">
                  {renderRichText(block.text)}
                </div>
                <div className="clear-both" />
              </div>
            );
          }

          case "quote": {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-gold pl-6 py-4 my-8 text-forest font-serif italic text-lg md:text-xl bg-gold/10 rounded-r-2xl shadow-sm space-y-2 whitespace-pre-line"
              >
                <p>"{block.text}"</p>
                {block.attribution && (
                  <cite className="block text-xs md:text-sm not-italic font-sans font-semibold uppercase tracking-wider text-saffron">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );
          }

          case "youtube": {
            if (!block.videoId) return null;
            return (
              <figure key={idx} className="my-8">
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gold/30 shadow-lg bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
                    title={block.caption || "YouTube Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-xs md:text-sm text-center italic text-ink/70">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "gallery": {
            const mediaItems = block.media || [];
            if (mediaItems.length === 0) return null;

            return (
              <div key={idx} className="my-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaItems.map((item, mIdx) => (
                    <div
                      key={mIdx}
                      className="overflow-hidden rounded-2xl border border-gold/25 shadow-sm bg-white hover:shadow-md transition group"
                    >
                      <img
                        src={item.url || item.thumb_url}
                        alt={item.alt || ""}
                        loading="lazy"
                        className="w-full h-48 md:h-52 object-cover group-hover:scale-105 transition duration-300"
                      />
                      {item.caption && (
                        <p className="p-2 text-xs text-center italic text-ink/70 bg-cream/40 border-t border-gold/10 truncate">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
