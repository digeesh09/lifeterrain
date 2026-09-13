/**
 * Shared Tailwind design tokens — white + shades of green, in the register
 * of established environmental/wildlife orgs (WTI, BRI): lots of white
 * space, deep forest green for headers/footers, a bright leaf green for
 * CTAs and icons, and a soft sage tint for section backgrounds. Gold is
 * kept only as a rare micro-accent (small badges), never a dominant color.
 * Both apps/web and apps/admin extend this preset so brand colors never drift.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef5f0",
          100: "#d9ebe0",
          300: "#5f9d78",
          500: "#1f6b41",
          700: "#0f4a2c", // primary brand — deep forest green (header/footer bands)
          900: "#082617",
        },
        leaf: {
          100: "#e7f4e2",
          300: "#a9d9a3",
          500: "#4fa855", // secondary — natural leaf green (CTAs, icons, success)
          700: "#357a3c",
        },
        sage: {
          50: "#f4f8f4", // soft section background tint, used instead of cream
          100: "#e8f1e8",
        },
        gold: {
          100: "#fdf1cf",
          300: "#f8d878",
          500: "#e0ac2b", // rare micro-accent only — small badges, never large fills
          700: "#c98f13",
        },
        ink: {
          500: "#4a5a55",
          700: "#223028", // body/heading charcoal-green text
          900: "#101a15",
        },
        cream: "#ffffff", // page background is plain white
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(15, 74, 44, 0.18)",
      },
    },
  },
};
