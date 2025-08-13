import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/",
  build: {
    assetsDir: "assets", // Ensures assets go to /assets/
  },
});
