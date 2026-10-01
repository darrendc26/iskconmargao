"use client";

import { Shell } from "@/components/Shell";
import Link from "next/link";

export default function Page() {
  return (
    <Shell>
      <div className="max-w-xl bg-white/80 p-8 rounded-2xl border border-gold/30 shadow-sm mt-6">
        <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-2xl text-forest mb-4">
          🌄
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest">Galleries in Articles</h1>
        <p className="mt-3 text-sm text-ink/80 leading-relaxed">
          Galleries are now created directly inside articles using the <strong>Gallery Block</strong>.
        </p>
        <p className="mt-2 text-xs text-ink/60 leading-relaxed">
          While creating or editing an article, click <strong>"+ Add Block" → "Gallery"</strong> to upload and arrange photos directly inside the article.
        </p>

        <div className="mt-6 pt-4 border-t border-gold/20">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full bg-forest text-cream px-6 py-2.5 text-xs font-semibold hover:bg-forest/90 transition shadow"
          >
            <span>✍️ Go to Articles</span>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
