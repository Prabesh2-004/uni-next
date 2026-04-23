import type { OpenNextConfig } from "@opennextjs/cloudflare";

export default {
  default: {},
  middleware: {
    external: true,
  },
} satisfies OpenNextConfig;