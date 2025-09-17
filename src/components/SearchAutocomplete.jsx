import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { ProductContext } from "../context/ProductContext";

export function SearchAutocomplete({ onSelect }) {
  const { products } = useContext(ProductContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ["name", "description", "tags", "subject", "type"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [products]);

  // const results = query ? fuse.search(query).map((r) => r.item) : [];

  const handleSelect = (productId) => {
    if (onSelect) {
      onSelect(productId); // Mobile
    } else {
      navigate(`/products/${productId}`); // Desktop
    }
    setQuery(""); // ล้าง input
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim() !== '') {
      params.append('q', JSON.stringify(query));
    }

    navigate(`/products?${params.toString()}`);
    setQuery('');
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={query}
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
      />  
      </form>
      

      {/* {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-50">
          {results.map((p) => (
            <li
              key={p.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(p.id)}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
