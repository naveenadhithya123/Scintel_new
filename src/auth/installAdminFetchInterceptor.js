import { clearAdminSession, getAdminToken } from "./adminAuth";

const ADMIN_PREFIX = "/api/admin";
const LEGACY_ADMIN_PATHS = new Set([
  "/add-batch",
  "/add-member",
  "/edit-batch",
  "/edit-member",
]);

const getRequestUrl = (input) => {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof Request) {
    return input.url;
  }

  return "";
};

const isAdminApiRequest = (url) => url.includes(ADMIN_PREFIX);

const isProtectedAdminScreen = (pathname) =>
  pathname.startsWith("/admin") || LEGACY_ADMIN_PATHS.has(pathname);

export const installAdminFetchInterceptor = () => {
  if (typeof window === "undefined" || window.__scintelAdminFetchInstalled) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = getRequestUrl(input);
    const nextInit = { ...init };

    if (isAdminApiRequest(url) && !url.endsWith("/admin/login")) {
      const token = getAdminToken();
      const headers = new Headers(
        nextInit.headers || (input instanceof Request ? input.headers : undefined)
      );

      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      nextInit.headers = headers;
    }

    const response = await originalFetch(input, nextInit);

    if (isAdminApiRequest(url) && response.status === 401 && !url.endsWith("/admin/login")) {
      clearAdminSession();

      if (isProtectedAdminScreen(window.location.pathname)) {
        window.location.replace("/admin");
      }
    }

    return response;
  };

  window.__scintelAdminFetchInstalled = true;
};
