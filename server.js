const express = require("express");
const axios = require("axios");
const { engine } = require("express-handlebars");

const app = express();

const PORT = parseInt(process.env.PORT) || 3000;
const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD;
const WORDPRESS_AUTH = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASSWORD}`).toString("base64");
const ALLOWED_PATH_SEGMENTS = parseInt(process.env.ALLOWED_PATH_SEGMENTS) || 3;
const PATH_MATCH = Array(ALLOWED_PATH_SEGMENTS).fill('/:path').map((p, i) => p + (i + 1) + '?').join('');

const hbsHelpers = {
    dateFormat: (date, lang) => new Date(date).toLocaleDateString(`${lang}-CA`, { year: "numeric", month: "numeric", day: "numeric" }),
    eq: (a, b) => a == b,
};

// Configure Handlebars
app.engine("hbs", engine({
    extname: "hbs",
    helpers: hbsHelpers,
}));
app.set("view engine", "hbs");

// Fetch WordPress content & render the page
app.get(PATH_MATCH, async (req, res) => {
    const pathSegments = Object.values(req.params).filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || "";

    let pageRes = null;

    try {
        // Home page, determine which page to show
        if (lastSegment === "") {
            const settingsRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/settings`, {
                headers: {
                    Authorization: `Basic ${WORDPRESS_AUTH}`
                }
            });
            pageRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/pages/${settingsRes.data.page_on_front}`);
        // Normal page, retrieve by slug
        } else {
            pageRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/pages?slug=${lastSegment}`);
        }

        // Fetch the menu
        const menusRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/menus`, {
            headers: {
                Authorization: `Basic ${WORDPRESS_AUTH}`
            }
        });
        const menuItemsRes = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/menu-items?menus=9`, {
            headers: {
                Authorization: `Basic ${WORDPRESS_AUTH}`
            }
        });

        res.render("page", {
            page: pageRes.data.length ? pageRes.data[0] : pageRes.data,
            menuItems: createMenu(menuItemsRes.data),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching content from WordPress");
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

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