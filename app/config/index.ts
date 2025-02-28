// Mark these environment variables as required.
declare module "bun" {
  interface Env {
    WORDPRESS_URL: string;
    WORDPRESS_USER: string;
    WORDPRESS_PASSWORD: string;
    MENU_ID_EN: string;
    MENU_ID_FR: string;
    SITE_NAME_EN: string;
    SITE_NAME_FR: string;
    PORT: string;
    PATH_SEGMENTS_ALLOWED: string;
  }
}

export const config = {
  port: parseInt(process.env.PORT || "5000"),
  wordpress: {
    url: process.env.WORDPRESS_URL,
    user: process.env.WORDPRESS_USER,
    password: process.env.WORDPRESS_PASSWORD,
    get authToken() {
      return Buffer.from(`${this.user}:${this.password}`).toString("base64");
    },
    menuIds: {
      en: process.env.MENU_ID_EN,
      fr: process.env.MENU_ID_FR,
    },
  },
  site: {
    names: {
      en: process.env.SITE_NAME_EN,
      fr: process.env.SITE_NAME_FR,
    },
  },
  routing: {
    pathSegmentsAllowed: parseInt(process.env.PATH_SEGMENTS_ALLOWED || "3"),
    pathPattern: "/:path1/:path2/:path3?",
  },
};

// Build the dynamic path pattern based on the number of allowed segments.
// This determines how many levels of nesting a page in WordPress can have
// and still resolve in this site.
config.routing.pathPattern = Array(config.routing.pathSegmentsAllowed)
  .fill("/:path")
  .map((p, i) => p + (i + 1) + "?")
  .join("");
