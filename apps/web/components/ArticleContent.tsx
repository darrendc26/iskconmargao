"use client";

import React from "react";
import { ArticleBlock } from "@iskcon/types";
import { ArticleRenderer } from "./ArticleRenderer";

interface ArticleContentProps {
  content: ArticleBlock[] | string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;
  return <ArticleRenderer content={content} />;
}
