"use client";
import { SimpleList } from "@/components/SimpleList";
export default function Page() {
  return (
    <SimpleList
      title="Donation purposes"
      path="/api/v1/admin/donation-purposes"
      fields={[
        { name: "title", label: "Name" },
        { name: "description", label: "Short description", textarea: true },
        { name: "long_description", label: "Full description", textarea: true },
      ]}
    />
  );
}
