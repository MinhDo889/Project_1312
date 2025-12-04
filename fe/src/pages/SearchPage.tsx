import React, { useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/products/search?query=${query}`);

      // Kiểm tra API trả về object hay mảng
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setResults(data);
    } catch (err: any) {
      console.error("Search Products Error:", err);
      setError("Đã có lỗi xảy ra khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tìm kiếm sản phẩm</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tên sản phẩm..."
          className="border p-2 flex-1 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tìm
        </button>
      </div>

      {loading && <p>Đang tìm kiếm...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && results.length === 0 && query && (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.isArray(results) &&
          results.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-bold">{item.name}</h2>
              <p>{item.description}</p>
              <p className="font-semibold mt-2">{item.price}₫</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
