import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar.jsx";

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData || {
    orderId: "ORD-" + Math.floor(Math.random() * 1000000),
    orderDate: new Date().toLocaleString(),
    items: [],
    total: 0,
  };

  // ⭐️ State สำหรับ progress และการโหลดเสร็จ
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("✅ Auto-download started");
    }, 2000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloaded(true); // ✅ เมื่อครบ 100% ให้เปลี่ยนข้อความ
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-background min-h-screen w-full py-12 px-6 flex flex-col items-center">
      {/* Success Banner */}
      <div className="w-full flex justify-between items-center max-w-5xl mb-8">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/shop")}
        >
          ← Back to shop
        </Button>
        <h1 className="text-3xl font-bold text-primary">Payment Successful!</h1>
        <h2 className="text-xl font-semibold text-primary">Your Order</h2>
      </div>

      <div className="flex gap-12 max-w-6xl w-full">
        {/* Left Side */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Thank you for your purchase
          </h2>

          {/* Download illustration + Progress bar */}
          <Card className="w-full h-[300px] mb-8 flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center h-full gap-6">
              <AnimatedCircularProgressBar
                value={progress}
                gaugePrimaryColor="rgb(79 70 229)"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
              />
            </CardContent>
          </Card>

          {/* Download status */}
          <div className="space-y-2 text-center">
            {isDownloaded ? (
              <>
                <h3 className="text-xl font-semibold text-primary">
                  ✅ Downloaded completely
                </h3>
                <h4 className="text-lg font-semibold text-secondary">
                  Please check your library
                </h4>
              </>
            ) : (
              <h3 className="text-xl font-semibold text-muted-foreground">
                Your file is downloading...
              </h3>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <div className="flex justify-between text-gray-500 mb-4">
            <span>Order No: {orderData.orderId}</span>
            <span>Order Date: {orderData.orderDate}</span>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between font-semibold mb-2">
                <span>Your Item:</span>
                <span>Price (THB.)</span>
              </div>
              <Separator className="mb-4" />

              {/* Order Items */}
              <div className="space-y-6">
                {orderData.items.map((item, index) => (
                  <div key={item.id || index}>
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[150px] h-[100px] object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-muted-foreground">
                          {item.quantity} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <div>{item.price}</div>
                      </div>
                    </div>
                    {index < orderData.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Total */}
              <div className="flex justify-between font-bold text-primary">
                <span>Total</span>
                <span>{orderData.total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
