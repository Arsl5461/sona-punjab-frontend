import axiosInstance from "../../../../helper/AxiosConfig";

/**
 * Headline API — defaults match backend routes (Express):
 *   GET    /sona-punjab/get-all-headline
 *   POST   /sona-punjab/create-headline     body: { text: string }
 *   PUT    /sona-punjab/update-headline/:headlineId
 *   DELETE /sona-punjab/delete-headline/:headlineId
 * Override any path with REACT_APP_HEADLINE_* in `.env` (restart dev server).
 */

const envPath = (key, fallback) => {
  const v =
    typeof process !== "undefined" && process.env[key]
      ? String(process.env[key]).trim()
      : "";
  return v || fallback;
};

export const headlineApiPaths = {
  list: envPath("REACT_APP_HEADLINE_GET", "/sona-punjab/get-all-headlines"),
  create: envPath("REACT_APP_HEADLINE_CREATE", "/sona-punjab/create-headline"),
  updatePrefix: envPath(
    "REACT_APP_HEADLINE_UPDATE",
    "/sona-punjab/update-headline"
  ),
  deletePrefix: envPath(
    "REACT_APP_HEADLINE_DELETE",
    "/sona-punjab/delete-headline"
  ),
};

export const getAllMarquees = async () => {
  try {
    const response = await axiosInstance.get(headlineApiPaths.list);
    return response.data;
  } catch (error) {
    console.error("Error fetching headlines", error?.message);
    return { headlines: [], marquees: [], error: error?.message };
  }
};

export const createMarqueeRequest = async (payload) => {
  try {
    const response = await axiosInstance.post(
      headlineApiPaths.create,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating headline", error?.message);
    const msg =
      error?.response?.status === 404
        ? `404 — no route for POST ${headlineApiPaths.create}. Add it on the server or set REACT_APP_HEADLINE_CREATE in .env.`
        : error?.message;
    return { success: false, error: msg };
  }
};

const joinId = (prefix, id) =>
  `${String(prefix).replace(/\/$/, "")}/${encodeURIComponent(id)}`;

export const updateMarqueeRequest = async (id, payload) => {
  try {
    const url = joinId(headlineApiPaths.updatePrefix, id);
    const response = await axiosInstance.put(url, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating headline", error?.message);
    const msg =
      error?.response?.status === 404
        ? `404 — no route for PUT ${headlineApiPaths.updatePrefix}/:id`
        : error?.message;
    return { success: false, error: msg };
  }
};

export const deleteMarqueeRequest = async (id) => {
  try {
    const url = joinId(headlineApiPaths.deletePrefix, id);
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting headline", error?.message);
    const msg =
      error?.response?.status === 404
        ? `404 — no route for DELETE ${headlineApiPaths.deletePrefix}/:id`
        : error?.message;
    return { success: false, error: msg };
  }
};

/** Normalize list from various response shapes (backend may use `headlines` or `marquees`) */
export const normalizeMarqueeList = (data) => {
  if (!data) return [];
  const raw =
    data.headlines ||
    data.marquees ||
    data.marqueeList ||
    data.data ||
    (Array.isArray(data) ? data : []);
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => ({
    _id: row._id || row.id,
    text: String(
      row.text ?? row.headline ?? row.message ?? row.content ?? ""
    ).trim(),
  }));
};

/** Copy-pasted admin help text — never show on public marquee */
const isHeadlineBoilerplate = (t) =>
  /Public home and club pages show these lines/i.test(t) ||
  (/Defaults:\s*GET/i.test(t) && /create-headline/i.test(t));

/** Single string for public strip (joins all non-empty entries) */
export const buildPublicMarqueeText = (data, separator = "   •   ") => {
  const list = normalizeMarqueeList(data);
  const parts = list
    .map((m) => m.text)
    .filter(Boolean)
    .filter((t) => !isHeadlineBoilerplate(t));
  return parts.length ? parts.join(separator) : "";
};
