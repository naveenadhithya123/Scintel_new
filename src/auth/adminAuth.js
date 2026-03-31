const ADMIN_SESSION_KEY = "scintel_admin_session";

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
};

export const parseAdminToken = (token) => {
  if (!token) {
    return null;
  }

  const [encodedPayload] = token.split(".");
  if (!encodedPayload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(encodedPayload));
  } catch {
    return null;
  }
};

export const isAdminTokenValid = (token) => {
  const payload = parseAdminToken(token);
  return Boolean(payload?.role === "admin" && payload?.exp && payload.exp > Date.now());
};

export const getAdminSession = () => {
  const rawSession = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession);
    if (!isAdminTokenValid(session?.token)) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
};

export const getAdminToken = () => getAdminSession()?.token || null;

export const hasAdminSession = () => Boolean(getAdminSession());

export const saveAdminSession = (session) => {
  if (!session?.token || !isAdminTokenValid(session.token)) {
    throw new Error("Invalid admin session");
  }

  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      token: session.token,
      admin: session.admin || null,
    })
  );
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};
