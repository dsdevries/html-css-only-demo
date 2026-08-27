// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  vite: {
    build: {
      // Lightning CSS merges animation-timeline into the animation shorthand,
      // which no browser accepts, so the scroll driven animations are dropped.
      cssMinify: 'esbuild'
    }
  }
});
