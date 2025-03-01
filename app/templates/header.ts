export const header=`<gcds-header <% if (langSwapSlug) { %>lang-href="/<%= langSwapSlug %>?lang=<%= langSwap %>"<% } %> skip-to-href="#main-content">
    
    <% if (menuItems) { %>
    <gcds-top-nav slot="menu" label="Main menu" alignment="right">
        <gcds-nav-link href="/" slot="home"><%= it.siteName %></gcds-nav-link>
        <% menuItems.forEach(function(menuItem) { %>
            <% if (menuItem.children && menuItem.children.length > 0) { %>
                <gcds-nav-group open-trigger="<%= menuItem.title.rendered %>" menu-label="<%= menuItem.title.rendered %>">
                    <% menuItem.children.forEach(function(child) { %>
                        <gcds-nav-link href="<%= child.url %>"><%= child.title.rendered %></gcds-nav-link>
                    <% }); %>
                </gcds-nav-group>
            <% } else { %>
                <gcds-nav-link href="<%= menuItem.url %>" <% if (menuItem.title.rendered === page.title.rendered) { %>current<% } %>><%= menuItem.title.rendered %></gcds-nav-link>
            <% } %>
        <% }); %>
    </gcds-top-nav>
    <% } %>

    <gcds-breadcrumbs slot="breadcrumb">
    <% if (!isHome) { %>
        <gcds-breadcrumbs-item href="/"><%= siteName %></gcds-breadcrumbs-item>
    <% } %>
    </gcds-breadcrumbs>

</gcds-header>
`;