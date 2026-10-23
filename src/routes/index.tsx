import { createFileRoute } from "@tanstack/react-router";
import { Prototype } from "@/proto/Prototype";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hold & Fit — wedding dress try-on prototype" },
      { name: "description", content: "Clickable mobile prototype: hold your size in up to three wedding dresses and try them one at a time." },
      { property: "og:title", content: "Hold & Fit — wedding dress try-on prototype" },
      { property: "og:description", content: "Hold your size in up to three wedding dresses and try them one at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Prototype,
});
