import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Library() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your library");
      navigate("/signin");
      return;
    }

    const today = new Date();
    // สมมติ order = { id, title, type: "digital" | "subscription", purchaseDate, expireDate, progress }
    const validOrders =
      user.orders?.filter((order) => new Date(order.expireDate) >= today) || [];

    setActiveOrders(validOrders);
  }, [user, navigate]);

  if (!user) return null;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>

      {activeOrders.length === 0 ? (
        <p className="text-gray-500">You have no active orders yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {activeOrders.map((order) => {
            const progressPercent = order.progress || 0;
            const isSubscription = order.type === "subscription";

            return (
              <div
                key={order.id}
                className="border rounded-lg p-5 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold">{order.title}</h2>
                  <p className="text-sm text-gray-500">
                    Purchased: {formatDate(order.purchaseDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires: {formatDate(order.expireDate)}
                  </p>

                  {isSubscription && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#543285] h-2 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-[#543285] text-white py-2 rounded hover:bg-[#3f236e] transition"
                    onClick={() => navigate(`/library/${order.id}`)}
                  >
                    View
                  </button>
                  {order.type === "digital" && (
                    <button
                      className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
                      onClick={() => toast.success("Download started")}
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
