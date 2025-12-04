// src/pages/ProductAdminV2.tsx
import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categoriesSilce";
import Header from "../common/Header";
import type { Product } from "../redux/types/auth";
import "./ProductAdmin.css";

const ProductAdminV2: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  // Form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    rating: 0,
    image: null as File | null,
    selectedCategories: [] as string[],
  });
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch products & categories
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleCategoryToggle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter((c) => c !== id)
        : [...prev.selectedCategories, id],
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      stock: 0,
      rating: 0,
      image: null,
      selectedCategories: [],
    });
    setEditId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price.toString());
    formData.append("description", form.description);
    formData.append("stock", form.stock.toString());
    formData.append("rating", form.rating.toString());
    if (form.image) formData.append("image", form.image);
    form.selectedCategories.forEach((id) =>
      formData.append("categoryIds[]", id)
    );

    try {
      if (editId) {
        await dispatch(updateProduct({ id: editId, data: formData })).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      stock: product.stock || 0,
      rating: product.rating || 0,
      image: null,
      selectedCategories: product.categories?.map((c) => c.id) || [],
    });
    setEditId(product.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <Header />
      <div className="container product-admin">
        <h2>Quản lý Sản phẩm</h2>

        <form className="product-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Số lượng tồn kho"
            value={form.stock}
            onChange={handleChange}
            min={0}
          />
          <input
            type="number"
            name="rating"
            placeholder="Đánh giá"
            value={form.rating}
            onChange={handleChange}
            min={0}
            max={5}
            step={0.1}
          />
          <textarea
            name="description"
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="file"
            key={editId || "new"}
            onChange={handleFileChange}
          />

          <div className="category-select">
            <label>Chọn danh mục:</label>
            <div className="category-list">
              {categories.map((c) => (
                <label key={c.id}>
                  <input
                    type="checkbox"
                    value={c.id}
                    checked={form.selectedCategories.includes(c.id)}
                    onChange={() => handleCategoryToggle(c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit">{editId ? "Cập nhật" : "Thêm sản phẩm"}</button>
        </form>

        {loading && <p>Đang tải...</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="product-list">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-info">
                <strong>{p.name}</strong> - {p.price} VND
                <p>
                  Số lượng: {p.stock || 0}, Đánh giá: {p.rating || 0}
                </p>
                {p.image_url && (
                  <img
                    src={`http://localhost:3001${p.image_url}`}
                    alt={p.name}
                    width={60}
                  />
                )}
                <small>
                  Danh mục:{" "}
                  {p.categories?.map((c) => c.name).join(", ") || "Chưa có"}
                </small>
              </div>
              <div className="product-actions">
                <button className="btn-warning" onClick={() => handleEdit(p)}>
                  Sửa
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductAdminV2;
