import { useCallback, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutContext } from "../context/CheckoutContext";
import { updateOrder } from "../services/orderService";
import { toast } from "sonner";

export function PendingPayment() {
  const { order } = useContext(CheckoutContext);
  const navigate = useNavigate();
  const hasExecuted = useRef(false);

  const simulatePaymentConfirmation = useCallback(
    async (order) => {
      try {
        const data = await updateOrder(order._id, "paid"); // simulate payment confirmation
        toast.success(data?.libraryStatus || "Failed to add products to your library");
        // เตรียม orderData ให้ส่งต่อไปหน้า confirmation
        const orderData = {
          orderId: order._id || "ORD-" + Math.floor(Math.random() * 1000000),
          orderDate: new Date().toLocaleString(),
          items: order.items || [],
          total: order.total || 0,
        };
        // หลังจาก simulate แล้ว เด้งไป OrderConfirmation พร้อม orderData
        setTimeout(() => {
          navigate("/order-confirmation", { state: { orderData } });
        }, 3000);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Payment failed");
      }
    },
    [navigate]
  );
  useEffect(() => {
    console.log("useEffect");
    if (order && !hasExecuted.current) {
      hasExecuted.current = true;
      simulatePaymentConfirmation(order);
    }
  }, [order, simulatePaymentConfirmation]);
  return (
    <div className="grid h-screen">
      <h2 className="pt-24 font-semibold text-3xl text-center text-primary">
        Pending Payment...
      </h2>
    </div>
  );
}
