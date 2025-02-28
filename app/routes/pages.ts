import WordPressService from "../services/wordpress";
import config from "../config";
import templateHelpers from "../utils/template-helpers";
import handlebars from "handlebars";
import { readFileSync } from "fs";
import { join } from "path";

const wordPressService = new WordPressService(config.wordpress);

// Register handlebars helpers
Object.keys(templateHelpers).forEach((key) => {
  handlebars.registerHelper(key, templateHelpers[key]);
});

// Load partials
const headerPartial = readFileSync(join(process.cwd(), "views", "partials", "header.hbs"), "utf-8");
const footerPartial = readFileSync(join(process.cwd(), "views", "partials", "footer.hbs"), "utf-8");
handlebars.registerPartial("header", headerPartial);
handlebars.registerPartial("footer", footerPartial);

const layoutTemplate = readFileSync(join(process.cwd(), "views", "layouts", "main.hbs"), "utf-8");

export const fetch = async (req: Request) => {
  const url = new URL(req.url);

  // Handle favicon.ico
  if (url.pathname === "/favicon.ico") {
    const faviconPath = join(process.cwd(), "public", "favicon.ico");
    const favicon = readFileSync(faviconPath);
    return new Response(favicon, { status: 200, headers: { "Content-Type": "image/x-icon" } });
  }

  const lang = url.searchParams.get("lang") || "en";
  const pathSegments: string[] = url.pathname.split("/").filter(Boolean);
  const lastSegment: string = pathSegments[pathSegments.length - 1] || "home";

  try {
    const [page, menuItems] = await Promise.all([
      wordPressService.getPage(lastSegment, lang),
      wordPressService.getMenu(lang),
    ]);

    if (page && menuItems) {
      const template = handlebars.compile(layoutTemplate);
      const html = template({
        page,
        menuItems,
        isHome: lastSegment === "home",
        langSwap: lang === "en" ? "fr" : "en",
        langSwapSlug: lang === "en" ? page?.slug_fr : page?.slug_en,
        siteName: config.site.names[lang],
      });

      return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    } else {
      console.log(`Page not found for: ${lastSegment}`);
      return new Response("Page not found", { status: 404 });
    }
  } catch (error) {
    console.error("Route handler error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
