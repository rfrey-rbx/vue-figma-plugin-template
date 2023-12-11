// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "Example Figma Plugin",
  // Get an ID from creating a new plugin via Figma
  id: "000000000000000",
  api: "1.0.0",
  main: "plugin.mjs",
  ui: "index.html",
  capabilities: [],
  enableProposedApi: false,
  editorType: ["figma", "figjam"],
  networkAccess: {
    allowedDomains: [
      "none"
    ]
  }
};
