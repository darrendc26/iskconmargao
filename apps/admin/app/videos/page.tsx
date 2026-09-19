"use client";
import { SimpleList } from "@/components/SimpleList";
export default function Page() {
  return (
    <SimpleList
      title="Videos"
      path="/api/v1/admin/videos"
      fields={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description", textarea: true },
        { name: "youtube_url", label: "YouTube link" },
      ]}
      createExtra={{ published: true }}
    />
  );
}
