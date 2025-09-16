import { useEffect, useMemo, useState } from "react";
import Drawer from "../../components/Drawer";
import { Loader2 } from "lucide-react";
import {
  getOrders,
  getOrderById,
  patchOrderStatus,
  deleteOrder,
} from "../../services/orderService.js";

function currency(amount) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

export default function AdminOrders() {
  const [orderStatus, setOrderStatus] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [userQuery, setUserQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  const [orderData, setOrderData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: ordersPerPage,
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const data = await getOrders({
          status: orderStatus,
          page: currentPage,
          limit: ordersPerPage,
        });
        setOrderData(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrderData({ items: [], total: 0, page: 1, pageSize: ordersPerPage });
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [orderStatus, currentPage]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((orderData.total || 0) / ordersPerPage)),
    [orderData.total, ordersPerPage]
  );

  const handleChangeStatus = async (orderId, newStatus) => {
    const success = await patchOrderStatus(orderId, newStatus);
    if (success) {
      setOrderData((prevData) => ({
        ...prevData,
        items: prevData.items.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ),
      }));
      if (orderDetail?._id === orderId) {
        setOrderDetail((prevDetail) => ({ ...prevDetail, status: newStatus }));
      }
    } else {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }
    const success = await deleteOrder(orderId);
    if (success) {
      setOrderData((prevData) => ({
        ...prevData,
        items: prevData.items.filter((order) => order._id !== orderId),
        total: (prevData.total || 1) - 1,
      }));
      if (orderDetail?._id === orderId) {
        setIsDrawerOpen(false);
      }
    } else {
      alert("Failed to delete order");
    }
  };

  const handleViewOrder = async (orderId) => {
    setIsDrawerOpen(true);
    setIsLoadingDetail(true);
    try {
      // FIX: Access the 'order' key from the response object
      const response = await getOrderById(orderId);
      setOrderDetail(response.order);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
      setOrderDetail(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const RowActions = (order) => (
    <div className="flex flex-wrap gap-2">
      <button
        className="h-9 px-3 rounded-md border hover:bg-gray-100"
        onClick={() => handleViewOrder(order._id)}
      >
        View
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-gray-100"
        onClick={() => handleChangeStatus(order._id, "paid")}
      >
        Mark paid
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-gray-100"
        onClick={() => handleChangeStatus(order._id, "cancelled")}
      >
        Cancel
      </button>
      <button
        className="h-9 px-3 rounded-md border text-red-600 hover:bg-red-50"
        onClick={() => handleDelete(order._id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="h-10 px-3 rounded-md border border-gray-300"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
        >
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="h-10 px-3 rounded-md border border-gray-300"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <input
          className="h-10 px-3 rounded-md border border-gray-300"
          placeholder="By user/email"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="py-2 px-3">Order #</th>
              <th className="py-2 px-3">User</th>
              <th className="py-2 px-3">Products</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Created</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingOrders ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : orderData.items.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No orders
                </td>
              </tr>
            ) : (
              orderData.items.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{order.number}</td>
                  <td className="py-2 px-3">
                    {order.userId?.fullName || "N/A"}
                  </td>
                  <td className="py-2 px-3">{order.products?.length}</td>
                  <td className="py-2 px-3">{currency(order.totalAmount)}</td>
                  <td className="py-2 px-3">{order.status}</td>
                  <td className="py-2 px-3">{order.paymentMethod}</td>
                  <td className="py-2 px-3">
                    {new Date(order.createdAt).toLocaleString("th-TH")}
                  </td>
                  <td className="py-2 px-3">
                    <RowActions {...order} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-500">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="h-9 px-3 rounded-md border border-gray-300 disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          >
            Previous
          </button>
          <button
            className="h-9 px-3 rounded-md border border-gray-300 disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Drawer: Order detail */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Order details"
      >
        {isLoadingDetail || !orderDetail ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-28 bg-gray-200 rounded" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Order:</span> {orderDetail.number}
            </div>
            <div>
              <span className="font-medium">User:</span>{" "}
              {orderDetail.userId?.fullName || "N/A"} (
              {orderDetail.userId?.email || "N/A"})
            </div>
            <div>
              <span className="font-medium">Status:</span> {orderDetail.status}
            </div>
            <div>
              <span className="font-medium">Payment:</span>{" "}
              {orderDetail.paymentMethod || "N/A"}
            </div>
            <div>
              <span className="font-medium">Products:</span>
              <ul className="list-disc pl-5">
                {orderDetail.products?.map((product, index) => (
                  <li key={index}>
                    {product.productTitle} — {currency(product.purchasePrice)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium">Discount:</span>{" "}
              {currency(orderDetail.discountAmount)}
            </div>
            <div>
              <span className="font-medium">Total:</span>{" "}
              {currency(orderDetail.totalAmount)}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(orderDetail.createdAt).toLocaleString("th-TH")}
            </div>

            <div className="pt-3 flex gap-2">
              <button
                className="h-9 px-3 rounded-md border border-gray-300"
                onClick={() => handleChangeStatus(orderDetail._id, "paid")}
              >
                Mark paid
              </button>
              <button
                className="h-9 px-3 rounded-md border border-gray-300"
                onClick={() => handleChangeStatus(orderDetail._id, "cancelled")}
              >
                Cancel
              </button>
              <button
                className="h-9 px-3 rounded-md border text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(orderDetail._id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
