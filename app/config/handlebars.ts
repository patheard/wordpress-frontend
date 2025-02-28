import { readFileSync } from "fs";
import { join } from "path";
import handlebars from "handlebars";

/* Local imports */
import templateHelpers from "../utils/template-helpers";

export const loadTemplate = (path: string) =>
  readFileSync(join(process.cwd(), path), "utf-8");

// Load main template
const layoutTemplate = loadTemplate("views/layouts/main.hbs");

// Load and register partials
export const partials = [
  { name: "header", path: "header.hbs" },
  { name: "body", path: "body.hbs" },
  { name: "footer", path: "footer.hbs" },
];

partials.forEach(({ name, path }) => {
  handlebars.registerPartial(name, loadTemplate(`views/partials/${path}`));
});

// Register handlebars helpers
Object.keys(templateHelpers).forEach((key) => {
  handlebars.registerHelper(key, templateHelpers[key]);
});

export { handlebars, layoutTemplate };
