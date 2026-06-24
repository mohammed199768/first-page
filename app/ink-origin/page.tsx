import { InkOriginCinematic } from "@/components/InkOriginCinematic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ink Origin — Inkspire",
  description: "A cinematic journey from ink and invention to modern creation.",
};

export default function InkOriginPage() {
  return (
    <main className="w-full bg-[#05060B]">
      <InkOriginCinematic />
    </main>
  );
}
