import { config } from "./config";
import { serve } from "bun";
import { fetch } from "./routes";

const {
  port,
  wordpress: { url },
} = config;

serve({
  fetch,
  port: port,
  development: process.env.NODE_ENV !== "production",
});

console.log(`Server: http://localhost:${port}`);
console.log(`WordPress: ${url}`);
