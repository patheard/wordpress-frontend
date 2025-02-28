import config from "./config";
import { serve } from "bun";
import { fetch } from "./routes/pages";

serve({
  fetch,
  port: config.port,
  development: process.env.NODE_ENV !== "production",
});

console.log(`Server: http://localhost:${config.port}`);
console.log(`WordPress: ${config.wordpress.url}`);
