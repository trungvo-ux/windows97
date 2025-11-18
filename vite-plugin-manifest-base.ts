import type { Plugin } from "vite";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Vite plugin to update manifest.json with correct base path
 */
export function manifestBasePath(): Plugin {
  return {
    name: "manifest-base-path",
    writeBundle() {
      const base = process.env.GITHUB_ACTIONS ? "/windows97" : "";
      const manifestPath = join(process.cwd(), "dist", "manifest.json");
      
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
        
        // Update start_url
        if (manifest.start_url) {
          manifest.start_url = base + manifest.start_url;
        }
        
        // Update icon paths
        if (manifest.icons && Array.isArray(manifest.icons)) {
          manifest.icons = manifest.icons.map((icon: any) => ({
            ...icon,
            src: base + icon.src,
          }));
        }
        
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      } catch (error) {
        console.warn("Failed to update manifest.json:", error);
      }
    },
  };
}

