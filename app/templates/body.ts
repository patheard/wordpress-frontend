export const body = `
<gcds-heading tag="h1">
  <%~ updateMarkup(page.title.rendered) %>
</gcds-heading>
<%~ updateMarkup(page.content.rendered) %>
<gcds-date-modified><%~ dateFormat(page.modified) %></gcds-date-modified>`;
