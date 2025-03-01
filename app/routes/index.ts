import WordPressService from "../services/wordpress";
import { config } from "../config";
import { handler } from "../config/eta";
import templateHelpers from "../utils/template-helpers";

const wordPressService = new WordPressService(config.wordpress);

export const fetch = async (req: Request) => {
  const url = new URL(req.url);

  const lang = url.searchParams.get("lang") || "en";
  const pathSegments: string[] = url.pathname.split("/").filter(Boolean);
  const lastSegment: string = pathSegments[pathSegments.length - 1] || "home";

  try {
    const [page, menuItems] = await Promise.all([
      wordPressService.getPage(lastSegment, lang),
      wordPressService.getMenu(lang),
    ]);

    if (page && menuItems) {
      const html = handler.render("@main", {
        page,
        menuItems,
        isHome: lastSegment === "home",
        siteName: config.site.names[lang],
        langSwap: lang === "en" ? "fr" : "en",
        langSwapSlug: lang === "en" ? page?.slug_fr : page?.slug_en,
        ...templateHelpers,
      });

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    } else {
      console.log(`Page not found for: ${lastSegment}`);
      return new Response("Page not found", { status: 404 });
    }
  } catch (error) {
    console.error("Route handler error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
