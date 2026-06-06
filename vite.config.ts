import {
  defineConfig,
  type Connect,
  type PluginOption,
  type ViteDevServer,
} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "vite-plugin-vercel";
import type { ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { manifestBasePath } from "./vite-plugin-manifest-base";

// Polyfill __dirname in ESM context (Node >=16)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type IframeCheckHandler = (req: Request) => Response | Promise<Response>;

function iframeCheckDevApi(): PluginOption {
  return {
    name: "iframe-check-dev-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (
        req: Connect.IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
      ) => {
        if (!req.url?.startsWith("/api/iframe-check")) {
          next();
          return;
        }

        try {
          const protocol =
            req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
          const host =
            req.headers.host ?? `localhost:${server.config.server.port ?? 5173}`;
          const requestUrl = new URL(
            req.url,
            `${protocol}://${host}`
          ).toString();
          const headers = new Headers();

          Object.entries(req.headers).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((item) => headers.append(key, item));
            } else if (typeof value === "string") {
              headers.set(key, value);
            } else if (typeof value === "number") {
              headers.set(key, String(value));
            }
          });

          const { default: handler } = (await server.ssrLoadModule(
            "/_api/iframe-check.ts"
          )) as { default: IframeCheckHandler };
          const response = await handler(
            new Request(requestUrl, {
              method: req.method,
              headers,
            })
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          if (!response.body) {
            res.end();
            return;
          }

          const body = Buffer.from(await response.arrayBuffer());
          res.end(body);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/windows97/" : "/",
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    cors: { origin: ["*"] },
    watch: {
      ignored: ["**/.terminals/**"],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    iframeCheckDevApi(),
    vercel(),
    manifestBasePath(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  vercel: {
    defaultSupportsResponseStreaming: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
          ],
          audio: ["tone", "wavesurfer.js", "audio-buffer-utils"],
        },
      },
    },
    sourcemap: false,
    minify: true,
  },
});
