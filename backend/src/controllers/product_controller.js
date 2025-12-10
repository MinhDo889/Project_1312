// controllers/productController.js
import Product from "../models/product_models.js";
import Category from "../models/category_models.js";
import { Op } from "sequelize";
import ProductCategory from "../models/product_category_models.js";

// =====================
// 📦 CRUD Sản phẩm
// =====================

// Lấy tất cả sản phẩm (kèm danh mục), phân quyền theo role
// Lấy tất cả sản phẩm (kèm danh mục), phân quyền theo role
// Lấy tất cả sản phẩm (kèm danh mục)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: Category, as: "categories" },
      order: [["created_at", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Thêm sản phẩm
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, rating, categoryIds } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock ? Number(stock) : 0,
      rating: rating ? Number(rating) : 0,
      image_url,
    });

    if (categoryIds && categoryIds.length > 0) {
      await product.setCategories(categoryIds);
    }

    res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: Category, as: "categories" },
    });
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, rating, categoryIds } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // Nếu có file mới thì update image_url
    let image_url = product.image_url;
    if (req.file) {
      image_url = `/uploads/products/${req.file.filename}`;
    }

    await product.update({
      name,
      description,
      price,
      stock: stock ? Number(stock) : product.stock,
      rating: rating ? Number(rating) : product.rating,
      image_url,
    });

    if (categoryIds) {
      await product.setCategories(categoryIds);
    }

    res.json({ message: "Cập nhật thành công", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await product.destroy();
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Search sản phẩm
export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${keyword}%` },
      },
      order: [["created_at", "DESC"]],
      limit: 10,
      include: [
        {
          model: Category,
          through: { model: ProductCategory },
          as: "categories",
          attributes: ["id", "name", "description"],
        },
      ],
    });

    res.json({ success: true, products });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// PATCH /api/products/:id/toggle-hide
export const toggleHideProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing product id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.is_hidden = !product.is_hidden;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Toggle Hide Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};
