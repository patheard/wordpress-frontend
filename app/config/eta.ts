import path from "path";
import { Eta } from "eta";

import { header as headerPartial } from "../templates/header";
import { body as bodyPartial } from "../templates/body";
import { footer as footerPartial } from "../templates/footer";
import { main } from "../templates/main";

declare module "eta" {
  interface EtaConfig {
    functionHelpers: {
      updateMarkup: (content: string | undefined) => string;
    };
  }
}

export const handler = new Eta({
  views: path.join(process.cwd(), "templates"),
  cache: process.env.NODE_ENV === "production",
  useWith: true,
});

handler.loadTemplate("@header", headerPartial);
handler.loadTemplate("@body", bodyPartial);
handler.loadTemplate("@footer", footerPartial);
handler.loadTemplate("@main", main);
