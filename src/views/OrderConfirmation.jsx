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
          setIsDownloaded(true);
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
    <div className="bg-background mx-auto min-h-screen max-w-10/12 py-10 px-6 flex flex-col items-center">
      {/* Success Banner */}
      <div className="w-full flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          Payment Successful!
        </h1>

        {/* Grid: Thank you / Your Order */}
        <div className="grid grid-cols-2 gap-2 max-w-5xl w-full">
          <h2 className="text-2xl font-semibold text-primary text-left">
            Thank you for your purchase
          </h2>
          <h2 className="text-2xl font-semibold text-primary text-right">
            Your Order
          </h2>
        </div>
      </div>

      <div className="flex gap-12 max-w-6xl w-full">
        {/* Left Side */}
        <div className="flex-1">
          {/* Download illustration + Progress bar */}
          <Card className="w-full h-[300px] mb-8 flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center h-full gap-6">
              <AnimatedCircularProgressBar
                value={progress}
                gaugePrimaryColor="#543285"
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
