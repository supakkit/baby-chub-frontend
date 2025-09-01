import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProductProvider } from "./context/ProductProvider";
import { CartProvider } from "./context/CartProvider";
import { Toaster } from "sonner";
import { CheckoutProvider } from "./context/CheckoutProvider.jsx";
import { ApplyDiscountProvider } from "./context/ApplyDiscountProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <CartProvider>
        <ApplyDiscountProvider>
          <CheckoutProvider>
            <App />
            <Toaster />  
          </CheckoutProvider>
        </ApplyDiscountProvider>
      </CartProvider>
    </ProductProvider>
  </StrictMode>
);
