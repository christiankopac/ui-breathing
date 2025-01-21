/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    serverModuleFormat: "esm",
    tailwind: true,
    serverDependenciesToBundle: [
      /^marked.*/,
      /^p5.*/,  // Asegurarnos de que p5.js se empaquete correctamente
    ],
    future: {
      v2_dev: true,
      v2_errorBoundary: true,
      v2_headers: true,
      v2_meta: true,
      v2_normalizeFormMethod: true,
      v2_routeConvention: true,
    },
  };