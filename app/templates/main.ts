export const main = `
<!DOCTYPE html>
<html dir="ltr" lang="<%~ page.lang %>">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%~ page.title.rendered %> - <%~ siteName %> </title>
  <style>
    gcds-container :is(ol, ul, p, hr, h2, h3, h4, h5, h6) {
      margin-block-start: var(--gcds-spacing-300);
      margin-block-end: var(--gcds-spacing-300);
    }

    gcds-container :is(ol, ul) {
      padding-inline-start: var(--gcds-spacing-300);
    }

    gcds-container :is(ol li) {
      list-style: decimal;
    }

    gcds-container :is(ul li) {
      list-style: disc;
    }

    gcds-details p {
      margin-block-start: var(--gcds-spacing-100);
      margin-block-end: var(--gcds-spacing-100);
    }

   @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
  }

  body {
    animation: fade 0.05s normal forwards ease-in-out;
  }
  </style>
  <link rel="preload" href="https://articles.alpha.canada.ca/forms-formulaires/wp-content/themes/cds-default/style.css?ver=3.26.1" as="style" />
  <link rel="stylesheet" href="https://articles.alpha.canada.ca/forms-formulaires/wp-content/themes/cds-default/style.css?ver=3.26.1" />
  <link rel="preload" href="https://articles.alpha.canada.ca/forms-formulaires/wp-includes/css/dist/block-library/style.min.css?ver=6.7.2" as="style" />
  <link rel="stylesheet" href="https://articles.alpha.canada.ca/forms-formulaires/wp-includes/css/dist/block-library/style.min.css?ver=6.7.2" />
  <!-- GC Design System -->
  <link rel="preload" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-utility@1.5.0/dist/gcds-utility.min.css" as="style" />
  <link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-utility@1.5.0/dist/gcds-utility.min.css" />
  <link rel="preload" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.css" as="style" />
  <link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.css" />
  <script type="module" src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.esm.js" defer></script>
  <script nomodule src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.js" defer></script>
</head>
<body>
  <%~ include("@header", {menuItems, siteName, isHome, eq, langSwap, langSwapSlug, page}) %>
  <gcds-container id="main-content" main-container size="xl" centered tag="main">
    <%~ include("@body", { page, updateMarkup, dateFormat}) %>
  </gcds-container>
  <%~ include("@footer") %>
</body>
</html>`;
