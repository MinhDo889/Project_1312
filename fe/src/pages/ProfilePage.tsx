import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchProfile, updateProfile } from "../redux/slices/profileSlice";
import { fetchOrdersByUser } from "../redux/slices/orderSlice";
import Header from "../common/Header";
import { toast } from "react-toastify";
import "./css/ProfilePage.css";

const BASE_URL = "http://localhost:3001";
const GEO_API_KEY = "223a868730c248428b0b3ff06e07e0b1";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.profile);
  const { orders } = useSelector((state: RootState) => state.order);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: "",
    address: "",
    province: "",
    country: "Việt Nam",
  });

  const [errors, setErrors] = useState({
    phone_number: "",
    address: "",
    province: "",
    country: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const provinceName = provinces.find((p) => p.code == code)?.name || "";
    setFormData((prev) => ({ ...prev, province: provinceName }));
  };

  const handleAddressInput = async (value: string) => {
    setFormData((prev) => ({ ...prev, address: value }));
    if (value.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          value
        )}&filter=countrycode:vn&format=json&apiKey=${GEO_API_KEY}`
      );
      const data = await res.json();
      setAddressSuggestions(data.results || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
    }
  };

  const selectSuggestion = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      address: item.address_line1 || "",
      province: item.city || item.state || prev.province,
      country: "Việt Nam",
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
      dispatch(fetchOrdersByUser(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        province: profile.city || "",
        country: "Việt Nam",
      });
      setAvatarPreview(
        profile.avatar_url
          ? `${BASE_URL}${profile.avatar_url}`
          : "/default-avatar.png"
      );
    }
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: any = {
      phone_number: "",
      address: "",
      province: "",
      country: "",
    };

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Vui lòng nhập số điện thoại";
      valid = false;
    } else if (!/^(0|\+84)[0-9]{8,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      valid = false;
    }

    if (!formData.province.trim()) {
      newErrors.province = "Vui lòng chọn thành phố";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!validateForm()) return;

    const data = new FormData();
    data.append("phone_number", formData.phone_number);
    data.append("address", formData.address);
    data.append("city", formData.province);
    data.append("country", "Việt Nam");

    if (avatarFile) data.append("avatar", avatarFile);

    try {
      await dispatch(updateProfile({ user_id: user.id, data })).unwrap();
      toast.success("Cập nhật profile thành công!");
      setShowForm(false);
    } catch {
      toast.error("Cập nhật profile thất bại!");
    }
  };

  if (!user) return <p>Vui lòng đăng nhập để xem profile</p>;

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-layout">
          {/* HIỂN THỊ THÔNG TIN */}
          <div className="profile-display">
            <img src={avatarPreview || "/default-avatar.png"} alt="avatar" />
            <p>
              <strong>Số điện thoại:</strong> {formData.phone_number}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {formData.address}
            </p>
            <p>
              <strong>Thành phố:</strong> {formData.province}
            </p>
            <p>
              <strong>Quốc gia:</strong> {formData.country}
            </p>

            <button
              type="button"
              className="profile-btn"
              onClick={() => setShowForm(!showForm)}
            >
              Cập nhật thông tin
            </button>
          </div>

          {/* FORM xuất hiện bên dưới */}
          <form
            className={`profile-form ${showForm ? "active" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="profile-avatar">
              <img src={avatarPreview || "/default-avatar.png"} alt="avatar" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="profile-field">
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={errors.phone_number ? "input-error" : ""}
              />
              {errors.phone_number && (
                <p className="error-text">{errors.phone_number}</p>
              )}
            </div>

            <div className="profile-field" style={{ position: "relative" }}>
              <label>Địa chỉ (Số nhà, đường, phường):</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => handleAddressInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
                className={errors.address ? "input-error" : ""}
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                  {addressSuggestions.map((item, index) => (
                    <li key={index} onClick={() => selectSuggestion(item)}>
                      <strong>{item.address_line1}</strong>
                      <br />
                      <span className="sub-address">{item.address_line2}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="profile-field">
              <label>Thành phố:</label>
              <select
                onChange={handleProvinceChange}
                className={errors.province ? "input-error" : ""}
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces.map((p) => (
                  <option
                    key={p.code}
                    value={p.code}
                    selected={p.name === formData.province}
                  >
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="error-text">{errors.province}</p>
              )}
            </div>

            <button type="submit" className="profile-btn-1">
              Lưu thay đổi
            </button>
          </form>
        </div>

        {/* Lịch sử đơn hàng */}
        <div className="orders-section">
          <h2>Lịch sử đơn hàng</h2>
          <ul className="order-list">
            {orders?.map((order) => (
              <li key={order.id} className="order-item">
                <p>Order ID: {order.id}</p>
                <p>Status: {order.status}</p>
                <p>Total: {Number(order.total).toFixed(3)} VNĐ</p>
                <p>
                  Ngày Tạo:{" "}
                  {new Date(order.created_at).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>

                <div className="order-items">
                  {order.OrderItems.map((item) => (
                    <div key={item.id} className="order-item-detail">
                      <img
                        src={
                          item.Product?.image_url
                            ? `${BASE_URL}${item.Product.image_url}`
                            : "/default-product.png"
                        }
                        alt={item.Product?.name || ""}
                      />
                      <div>
                        <p>{item.Product?.name}</p>
                        <p>SL: {item.quantity}</p>
                        <p>Giá: {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
