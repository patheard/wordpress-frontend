const express = require("express");
const axios = require("axios");
const { engine } = require("express-handlebars");

require("dotenv").config();

const PORT = parseInt(process.env.PORT) || 5000;
const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD;
const WORDPRESS_AUTH = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASSWORD}`).toString("base64");
const PATH_SEGMENTS_ALLOWED = parseInt(process.env.PATH_SEGMENTS_ALLOWED) || 3;
const PATH_MATCH = Array(PATH_SEGMENTS_ALLOWED).fill('/:path').map((p, i) => p + (i + 1) + '?').join('');

const app = express();
const hbsHelpers = {
    dateFormat: (date) => new Date(date).toLocaleDateString(`en-CA`, { year: "numeric", month: "numeric", day: "numeric" }),
    eq: (a, b) => a == b,
};

app.engine("hbs", engine({
    extname: "hbs",
    helpers: hbsHelpers,
}));
app.set("view engine", "hbs");

// Main route for all content requests
app.get(PATH_MATCH, async (req, res) => {
    const { lang = "en" } = req.query;
    const pathSegments = Object.values(req.params).filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || "home";

    let pageRes = null;

    try {
        // Get the page content
        pageRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/pages?slug=${lastSegment}&lang=${lang}`);

        // Get the menu
        const menusRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/menus`, {
            headers: {
                Authorization: `Basic ${WORDPRESS_AUTH}`
            }
        });
        const menu = menusRes.data.find((menu) => menu.slug === `top-menu-${lang}`);
        if (!menu) {
            return res.status(404).send("Menu not found");
        }
        const menuItemsRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/menu-items?menus=${menu.id}`, {
            headers: {
                Authorization: `Basic ${WORDPRESS_AUTH}`
            }
        });

        const page = pageRes?.data?.length ? pageRes.data[0] : null;
        res.render("page", {
            isHome: lastSegment === "",
            langSwap: lang === "en" ? "fr" : "en",
            langSwapSlug: lang === "en" ? page?.slug_fr : page?.slug_en,
            menuItems: createMenu(menuItemsRes.data),
            page: page,
            siteName: lang === "en" ? process.env.SITE_NAME_EN : process.env.SITE_NAME_FR,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching content from WordPress");
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}\nWordPress: ${WORDPRESS_URL}\nPath match: ${PATH_MATCH}`));

const createMenu = (menuItems) => {
    const menuTree = [];
    const menuMap = {};

    // Create a lookup object for menu items
    menuItems.forEach((item) => {
        item.url = item.url.replace(WORDPRESS_URL, "");
        menuMap[item.id] = { ...item, children: [] };
    });

    // Organize the items into a nested structure
    menuItems.forEach((item) => {
        if (item.parent === 0) {
            menuTree.push(menuMap[item.id]);
        } else if (menuMap[item.parent]) {
            menuMap[item.parent].children.push(menuMap[item.id]);
        }
    });

    return menuTree;
};