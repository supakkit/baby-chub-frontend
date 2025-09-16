// src/services/adminUserServices.js
import api from "./api";

function normalizeVerified(v) {
  if (v === "1" || v === 1 || v === true) return true;
  if (v === "0" || v === 0 || v === false) return false;
  return undefined;
}

// ---- helpers: fallback caller ----
async function getWithFallback(paths, options) {
  let lastErr;
  for (const p of paths) {
    try {
      return await api.get(p, options);
    } catch (e) {
      lastErr = e;
      if (e?.response?.status !== 404) throw e;
    }
  }
  throw lastErr;
}
async function postWithFallback(paths, body, options) {
  let lastErr;
  for (const p of paths) {
    try {
      return await api.post(p, body, options);
    } catch (e) {
      lastErr = e;
      if (e?.response?.status !== 404) throw e;
    }
  }
  throw lastErr;
}
async function patchWithFallback(paths, body, options) {
  let lastErr;
  for (const p of paths) {
    try {
      return await api.patch(p, body, options);
    } catch (e) {
      lastErr = e;
      if (e?.response?.status !== 404) throw e;
    }
  }
  throw lastErr;
}
async function deleteWithFallback(paths, options) {
  let lastErr;
  for (const p of paths) {
    try {
      return await api.delete(p, options);
    } catch (e) {
      lastErr = e;
      if (e?.response?.status !== 404) throw e;
    }
  }
  throw lastErr;
}

// ---- services ----
export async function listAdminUsers({
  query,
  role,
  verified,
  page = 1,
  limit = 20,
} = {}) {
  const params = { page, limit };
  const q = (query || "").trim();
  if (q) params.query = q;
  if (role) params.role = role;

  const v = normalizeVerified(verified);
  if (typeof v === "boolean") params.verified = v;

  // ลำดับ fallback: /admin/users → /admin/user-list → /users/all
  const { data } = await getWithFallback(
    ["/admin/users", "/admin/user-list", "/users/all"],
    { params }
  );

  return {
    items: data?.items ?? [],
    total: Number(data?.total ?? 0),
    page: Number(data?.page ?? page),
    pageSize: Number(data?.pageSize ?? limit),
  };
}

export async function getAdminUserById(id) {
  const { data } = await getWithFallback([
    `/admin/users/${id}`,
    `/users/${id}`,
  ]);
  return data;
}

export async function updateUserRole(id, role) {
  const { data } = await patchWithFallback(
    [`/admin/users/${id}`, `/users/${id}/role`],
    { role }
  );
  return data;
}

export async function resendUserVerification(id) {
  const { data } = await postWithFallback(
    [
      `/admin/users/${id}/resend-verification`,
      `/admin/users/${id}/resend-verify`,
      `/users/${id}/resend-verification`,
    ],
    {}
  );
  return data;
}

export async function deleteUserById(id) {
  const { data } = await deleteWithFallback([
    `/admin/users/${id}`,
    `/users/${id}`,
  ]);
  return data;
}
