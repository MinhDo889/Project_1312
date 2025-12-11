import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
} from "../redux/slices/categoriesSilce";
import type { AppDispatch, RootState } from "../redux/store";
import "./categoryAdmin.css";

const CategoryAdmin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Open modal for create OR edit
  const openModal = (category?: any) => {
    if (category) {
      setEditId(category.id);
      setFormName(category.name);
    } else {
      setEditId(null);
      setFormName("");
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return alert("Tên danh mục không được để trống");

    if (editId) {
      await dispatch(updateCategory({ id: editId, name: formName }));
    } else {
      await dispatch(createCategory({ name: formName }));
    }

    setModalOpen(false);
    dispatch(fetchCategories());
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    await dispatch(deleteCategory(id) as any);
    dispatch(fetchCategories());
  };

  return (
    <div className="category-admin-container">
      <h1>Quản lý danh mục</h1>

      <button className="add-btn" onClick={() => openModal()}>
        + Thêm danh mục
      </button>

      {loading && <p>Đang tải...</p>}

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Số sản phẩm</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cate) => (
            <tr key={cate.id}>
              <td>{cate.id}</td>
              <td>{cate.name}</td>
              <td>{cate.products?.length || 0}</td>
              <td>
                <button className="edit-btn" onClick={() => openModal(cate)}>
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteCategory(cate.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =================== MODAL =================== */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editId ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h2>

            <input
              type="text"
              value={formName}
              placeholder="Tên danh mục..."
              onChange={(e) => setFormName(e.target.value)}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSubmit}>
                Lưu
              </button>
              <button
                className="cancel-btn"
                onClick={() => setModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAdmin;
