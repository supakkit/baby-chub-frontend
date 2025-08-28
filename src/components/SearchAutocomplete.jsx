import { useState } from "react";
import Fuse from "fuse.js";

// รอเชื่อม API backend
const products = [
  { id: 1, name: "coding" },
  { id: 2, name: "age 6-9" },
  { id: 3, name: "math" },
  { id: 4, name: "learning code" },
  { id: 5, name: "logical thinking" },
];

export function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // ตั้งค่า Fuse
  const fuse = new Fuse(products, {
    keys: ["name", "description", "tags", "subject", "type"],
    threshold: 0.3,
    includeScore: true,
  });

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    if (q.trim() === "") {
      setResults([]);
      return;
    }

    const fuseResults = fuse.search(q).sort((a, b) => a.score - b.score);
    setResults(fuseResults.map((r) => r.item));
  };

  return (
    <div className="relative flex flex-col w-full md:w-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search"
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-64"
      />
      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full md:w-64 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10">
          {results.map((p) => (
            <li
              key={p.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
