import { useState } from "react";
import Nav from "./components/ui/Nav";
import Home from "./views/Home";
// Import หน้าอื่นๆ ที่สร้างเสร็จแล้ว
// import Products from "./views/Products";
// import Product from "./views/Product";
// import Favorite from "./views/Favorite";
// import Cart from "./views/Cart";
// import SignIn from "./views/SignIn";

const views = {
  home: Home,
  // products: Products,
  // product: Product,
  // favorite: Favorite,
  // cart: Cart,
  // signIn: SignIn,
};

// Component DevNavPanel ที่สร้างใหม่ (รับ props)
function DevNavPanel({ navigateToView }) {
  const devButtons = [
    { view: "home", color: "bg-blue-500", hover: "hover:bg-blue-600" },
    { view: "product", color: "bg-green-500", hover: "hover:bg-green-600" },
    { view: "favorite", color: "bg-pink-500", hover: "hover:bg-pink-600" },
    { view: "cart", color: "bg-yellow-500", hover: "hover:bg-yellow-600" },
    { view: "checkout", color: "bg-red-500", hover: "hover:bg-red-600" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-3 z-50">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-4">
        <span className="text-white font-bold text-sm hidden md:inline">
          Dev Nav:
        </span>
        {devButtons.map((btn) => (
          <button
            key={btn.view}
            // ใช้ onClick เรียกฟังก์ชันที่ได้รับจาก props โดยตรง
            onClick={() => navigateToView(btn.view)}
            className={`${btn.color} ${btn.hover} text-white px-3 py-1 rounded-md text-sm`}
          >
            {/* ทำให้ตัวอักษรแรกเป็นตัวใหญ่ */}
            {btn.view.charAt(0).toUpperCase() + btn.view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState("home");

  const navigateToView = (viewName) => {
    // เช็คว่า view ที่กดมีจริงใน object views หรือไม่
    if (views[viewName]) {
      setCurrentView(viewName);
      document.title = `BabyChub - ${
        viewName.charAt(0).toUpperCase() + viewName.slice(1)
      }`;
    } else {
      // แจ้งเตือนถ้ายังไม่ได้สร้าง Component หน้านั้นๆ
      alert(`View '${viewName}' is not available yet!`);
      console.error(`View '${viewName}' not found in 'views' object.`);
    }
  };

  const CurrentViewComponent = views[currentView];

  return (
    <>
      {/* ส่ง navigateToView ให้ทั้ง Nav และ DevNavPanel */}
      <Nav navigateToView={navigateToView} />

      <main className="container mx-auto p-4">
        {CurrentViewComponent ? (
          <CurrentViewComponent />
        ) : (
          <div>View not found</div>
        )}
      </main>

      {/* เพิ่ม DevNavPanel เข้ามาตรงนี้ และส่ง prop ให้เหมือนกัน */}
      {/* TIP: เราสามารถเลือกให้แสดง Dev Panel เฉพาะตอน dev ได้ */}
      {import.meta.env.DEV && <DevNavPanel navigateToView={navigateToView} />}
    </>
  );
}
