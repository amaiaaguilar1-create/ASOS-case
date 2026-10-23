// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages build: GITHUB_PAGES=true serves the app as a static SPA under /ASOS-case/.
const pages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  ...(pages ? { nitro: false as const, vite: { base: "/ASOS-case/" } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(pages ? { spa: { enabled: true, prerender: { outputPath: "/index.html" } } } : {}),
  },
});
