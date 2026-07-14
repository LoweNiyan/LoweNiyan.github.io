// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nyan.work",
  trailingSlash: "never",

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'TianChengBit',
          cssVariable: '--font-pixel-7',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/TianChengBit-Regular.otf'],
                      weight: 'normal',
                      style: 'normal',
                      display: 'swap',
                  }
              ],
          },
      },
      {
          provider: fontProviders.local(),
          name: 'Good Old DOS',
          cssVariable: '--font-pixel-dos',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/Good Old DOS.ttf'],
                      weight: 'normal',
                      style: 'normal',
                      display: 'swap',
                  }
              ],
          },
      },
      {
          name: "JetBrains Mono",
          cssVariable: "--font-mono",
          provider: fontProviders.fontsource(),
          fallbacks: ["monospace"],
      },
      {
          name: "Rubik",
          cssVariable: "--font-rubik",
          provider: fontProviders.fontsource(),
      },
      {
          provider: fontProviders.local(),
          name: "OPPOSans",
          cssVariable: "--font-opposans",
          options: {
              variants: [
                  {
                    weight: 300,
                    style: "normal",
                    src: [
                      "./src/assets/fonts/OPPOSans/OPPOSans-L.woff2",
                      "./src/assets/fonts/OPPOSans/OPPOSans-L.ttf",
                    ],
                  },
                  {
                    weight: 400,
                    style: "normal",
                    src: [
                      "./src/assets/fonts/OPPOSans/OPPOSans-R.woff2",
                      "./src/assets/fonts/OPPOSans/OPPOSans-R.ttf",
                    ],
                  },
                  {
                    weight: 500,
                    style: "normal",
                    src: [
                      "./src/assets/fonts/OPPOSans/OPPOSansWeb.woff2",
                      "./src/assets/fonts/OPPOSans/OPPOSans-M.ttf",
                    ],
                  },
                  {
                    weight: 700,
                    style: "normal",
                    src: [
                      "./src/assets/fonts/OPPOSans/OPPOSans-B.woff2",
                      "./src/assets/fonts/OPPOSans/OPPOSans-B.ttf",
                    ],
                  },
                  {
                    weight: 900,
                    style: "normal",
                    src: [
                      "./src/assets/fonts/OPPOSans/OPPOSans-H.woff2",
                      "./src/assets/fonts/OPPOSans/OPPOSans-H.ttf",
                    ],
                  },
              ],
          },
      },
	],

  integrations: [sitemap()],
});