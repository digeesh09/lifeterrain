const preset = require("../../packages/ui/tailwind-preset");
module.exports = {
  presets: [preset],
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};
