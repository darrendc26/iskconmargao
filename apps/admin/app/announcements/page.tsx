"use client";
import { SimpleList } from "@/components/SimpleList";
export default function Page() {
  return (
    <SimpleList
      title="Announcements"
      path="/api/v1/admin/announcements"
      fields={[
        { name: "title", label: "Title" },
        { name: "message", label: "Message", textarea: true },
        { name: "cta_label", label: "Button text" },
        { name: "cta_url", label: "Button link" },
        { name: "end_at", label: "Hide after (date & time)", type: "datetime-local" },
      ]}
    />
  );
}
