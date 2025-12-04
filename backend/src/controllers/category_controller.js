import Category from "../models/category_models.js";
import Product from "../models/product_models.js";

// Lấy tất cả danh mục (kèm sản phẩm)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: { model: Product, as: "products" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo danh mục
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh mục theo id (kèm sản phẩm)
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: { model: Product, as: "products" },
    });
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    await category.update({ name });
    res.json({ message: "Cập nhật danh mục thành công", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    await category.destroy();
    res.json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
