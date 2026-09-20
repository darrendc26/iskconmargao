"use client";

import React from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  // Split content into blocks by double line breaks or single line breaks
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = (keyPrefix: string) => {
    if (paragraphBuffer.length === 0) return;
    const text = paragraphBuffer.join("\n").trim();
    paragraphBuffer = [];
    if (!text) return;

    elements.push(
      <p key={`${keyPrefix}-p`} className="text-ink/90 leading-relaxed mb-5 text-base md:text-lg">
        {text}
      </p>
    );
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check for Markdown / HTML Image: ![alt](url) or <img src="url" ... />
    const mdImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)/);
    const htmlImgMatch = trimmed.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/i);

    if (mdImgMatch) {
      flushParagraph(`img-${idx}`);
      const src = mdImgMatch[2];
      elements.push(
        <figure key={`img-${idx}`} className="my-8 overflow-hidden rounded-2xl border border-gold/25 shadow-md bg-white/60">
          <img src={src} alt="" className="w-full max-h-[550px] object-cover" />
        </figure>
      );
      return;
    }

    if (htmlImgMatch) {
      flushParagraph(`img-html-${idx}`);
      const src = htmlImgMatch[1];
      elements.push(
        <figure key={`img-html-${idx}`} className="my-8 overflow-hidden rounded-2xl border border-gold/25 shadow-md bg-white/60">
          <img src={src} alt="Article image" className="w-full max-h-[550px] object-cover" />
        </figure>
      );
      return;
    }

    // Check Headings: #, ##, ###
    if (trimmed.startsWith("### ")) {
      flushParagraph(`h3-${idx}`);
      elements.push(
        <h3 key={`h3-${idx}`} className="font-serif text-xl font-bold text-forest mt-6 mb-3">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(`h2-${idx}`);
      elements.push(
        <h2 key={`h2-${idx}`} className="font-serif text-2xl md:text-3xl text-forest mt-8 mb-4 border-b border-gold/20 pb-2">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph(`h1-${idx}`);
      elements.push(
        <h1 key={`h1-${idx}`} className="font-serif text-3xl md:text-4xl text-forest mt-8 mb-4">
          {trimmed.replace(/^#\s+/, "")}
        </h1>
      );
      return;
    }

    // Check Blockquotes: > quote
    if (trimmed.startsWith("> ")) {
      flushParagraph(`quote-${idx}`);
      elements.push(
        <blockquote key={`quote-${idx}`} className="border-l-4 border-gold pl-5 py-3 my-6 text-forest font-serif italic text-lg md:text-xl bg-gold/10 rounded-r-xl">
          {trimmed.replace(/^>\s+/, "")}
        </blockquote>
      );
      return;
    }

    // Empty line triggers paragraph flush
    if (trimmed === "") {
      flushParagraph(`flush-${idx}`);
      return;
    }

    // Regular line buffer
    paragraphBuffer.push(trimmed);
  });

  flushParagraph("end");

  return <div className="prose-article">{elements}</div>;
}
