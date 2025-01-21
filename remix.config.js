/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    tailwind: true,
    serverDependenciesToBundle: [
      /^marked.*/,
      /^p5.*/,  // Asegurarnos de que p5.js se empaquete correctamente
      "p5",
      "object-assign",
      /^@remix-run\/.*/,
      /^@netlify\/.*/,
      "web-streams-polyfill",
      "web-encoding",
      "mrmime",
      "data-uri-to-buffer",
      "@web3-storage/multipart-parser",
    ],
    future: {
      v3_fetcherPersist: true,
      v3_lazyRouteDiscovery: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      v3_singleFetch: true,
    },
    publicPath: "/build/",
    assetsBuildDirectory: "public/build",
    serverBuildPath: ".netlify/functions-internal/server.js",
    serverMainFields: ["browser", "module", "main"],
    serverModuleFormat: "cjs",
    serverPlatform: "node",
    serverMinify: false,
};