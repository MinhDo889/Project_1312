import Profile from "../models/profile_models.js";
import User from "../models/user_models.js";

// ====================
// Tạo profile (có thể dùng khi user mới tạo)
// ====================
export const createProfile = async (req, res) => {
  try {
    const { user_id, phone_number, address, city, country } = req.body;
    const avatar_url = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    // Kiểm tra user tồn tại
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // Kiểm tra profile đã tồn tại chưa
    let profile = await Profile.findOne({ where: { user_id } });
    if (profile) return res.status(400).json({ message: "Profile đã tồn tại" });

    profile = await Profile.create({
      user_id,
      phone_number: phone_number || "",
      address: address || "",
      city: city || "",
      country: country || "Vietnam",
      avatar_url,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================
// Lấy profile theo user_id
// Nếu chưa có profile → tạo mới mặc định
// ====================
export const getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Kiểm tra user tồn tại
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    let profile = await Profile.findOne({
      where: { user_id },
      include: { model: User, as: "user" },
    });

    // Nếu chưa có profile → tạo mới mặc định
    if (!profile) {
      profile = await Profile.create({
        user_id,
        phone_number: "",
        address: "",
        city: "",
        country: "Vietnam",
        avatar_url: null,
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================
// Cập nhật profile
// Nếu chưa có profile → tạo mới
// ====================
export const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { phone_number, address, city, country } = req.body;
    const avatar_url = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

    // Kiểm tra user tồn tại
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    let profile = await Profile.findOne({ where: { user_id } });

    if (!profile) {
      // Nếu chưa có profile → tạo mới
      profile = await Profile.create({
        user_id,
        phone_number: phone_number || "",
        address: address || "",
        city: city || "",
        country: country || "Vietnam",
        avatar_url: avatar_url || null,
      });
    } else {
      // Nếu có profile → update
      await profile.update({
        phone_number: phone_number ?? profile.phone_number,
        address: address ?? profile.address,
        city: city ?? profile.city,
        country: country ?? profile.country,
        avatar_url: avatar_url ?? profile.avatar_url,
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
