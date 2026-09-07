// Approval is explicit. Neither an omitted flag nor a truthy string is consent
// to include a record in HTML, feeds, search, taxonomy or sitemaps.
export const isApprovedPublication = (data) => data.draft === false && data.published === true;
