// controllers/reviewController.js
import Review from "../models/reviews_model.js";
import User from "../models/user_models.js";
import Product from "../models/product_models.js";

// Tạo review mới
export const createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    // Có thể kiểm tra product và user tồn tại
    const user = await User.findByPk(user_id);
    const product = await Product.findByPk(product_id);

    if (!user || !product) {
      return res.status(404).json({ message: "User hoặc Product không tồn tại" });
    }

    const newReview = await Review.create({
      user_id,
      product_id,
      rating,
      comment,
    });

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo review thất bại", error: err.message });
  }
};

// Lấy tất cả review
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Product, attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lấy review thất bại", error: err.message });
  }
};

// Lấy review theo product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [{ model: User, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lấy review thất bại", error: err.message });
  }
};

// Xóa review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Review không tồn tại" });
    }

    await review.destroy();
    res.json({ message: "Xóa review thành công" });
  } catch (err) {
    res.status(500).json({ message: "Xóa review thất bại", error: err.message });
  }
};
