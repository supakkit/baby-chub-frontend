// src/services/libraryServices.js
import api from "./api";

/**
 * itemKey รูปแบบ "orderId:orderItemId"
 * FE ควรส่งแบบ encodeURIComponent(itemKey) เวลาประกอบ URL
 */

export async function getAccessLink(itemKey) {
  const { data } = await api.post(
    `/users/me/library/${encodeURIComponent(itemKey)}/access-link`
  );
  return data?.accessUrl || null;
}

export async function getViewLink(itemKey) {
  // alias ของ access-link (เผื่อในอนาคตจะแยก logic)
  const { data } = await api.post(
    `/users/me/library/${encodeURIComponent(itemKey)}/view-link`
  );
  return data?.accessUrl || null;
}

export async function renewItem(itemKey, plan = "month") {
  // plan ที่รองรับ: month/year/onetime (BE map เป็น monthly/yearly/oneTime)
  const { data, status } = await api.post(
    `/users/me/library/${encodeURIComponent(itemKey)}/renew`,
    { plan }
  );
  return { data, status };
}
