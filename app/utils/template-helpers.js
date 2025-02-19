const templateHelpers = {
  dateFormat: (date) =>
    new Date(date).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
  eq: (a, b) => a == b,
  updateMarkup: (content) => {
    if (!content) return "";

    // Updates the WordPress content to match with the expected markup
    // for the Design System components.
    return content
      .replace(
        /<details class="alert alert-([^"]+)" open><summary class="h3"><h3>([^<]+)<\/h3><\/summary>(.+)<\/details>/g,
        '<section class="mt-300 mb-300"><gcds-notice type="$1" notice-title-tag="h2" notice-title="$2"><gcds-text>$3</gcds-text></gcds-notice></section>',
      )
      .replace(
        /<div class="wp-block-button"><a class="wp-block-button__link[^"]+" href="([^"]+)">([^<]+)<\/a><\/div>/g,
        '<gcds-button type="link" href="$1">$2</gcds-button>',
      )
      .replace(
        /<details class="wp-block-cds-snc-accordion"><summary>([^<]+)<\/summary>\n*(.+)\n*<\/details>/g,
        '<gcds-details details-title="$1">$2</gcds-details>',
      );
  },
};

module.exports = templateHelpers;
