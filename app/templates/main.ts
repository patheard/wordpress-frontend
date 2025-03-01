export const main = `
<!DOCTYPE html>
<html dir="ltr" lang="<%~ page.lang %>">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%~ page.title.rendered %> - <%~ siteName %> </title>
  <link rel="stylesheet" href="https://articles.alpha.canada.ca/forms-formulaires/wp-content/themes/cds-default/style.css?ver=3.26.1" />
  <link rel="stylesheet" href=" https://articles.alpha.canada.ca/forms-formulaires/wp-includes/css/dist/block-library/style.min.css?ver=6.7.2" />
  <!-- GC Design System -->
  <link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-utility@1.5.0/dist/gcds-utility.min.css" />
  <link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.css" />
  <script type="module" src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.esm.js"></script>
  <script nomodule src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.31.0/dist/gcds/gcds.js" />
  </script>
</head>
<body>
  <%~ include("@header", {menuItems, siteName, isHome, eq, langSwap, langSwapSlug, page}) %>
  <gcds-container id="main-content" main-container size="xl" centered tag="main">
    <%~ include("@body", { page, updateMarkup, dateFormat}) %>
  </gcds-container>
  <%~ include("@footer") %>
</body>
</html>
`;
