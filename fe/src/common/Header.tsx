// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSilce";
import { fetchProfile } from "../redux/slices/profileSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { useState, useEffect } from "react";
import "./Header.css";
import logon from "../imgList/logon.png";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";

const BASE_URL = "http://localhost:3001";

interface ProductType {
  id: string;
  name: string;
  image_url: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { profile } = useSelector((state: RootState) => state.profile);

  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Tổng số lượng sản phẩm
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Load profile
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, isAuthenticated, user]);

  // Load all products once
  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data: ProductType[]) => setAllProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter products by name
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchQuery, allProducts]);

  const handleSelectProduct = (id: string) => {
    navigate(`/products/${id}`);
    setSearchQuery("");
    setFilteredProducts([]);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const goToProfile = () => {
    if (user?.id) navigate(`/profile/${user.id}`);
  };

  return (
    <header className="hdt-header">
      <div className="hdt-top">
        <Link to="/" className="hdt-logo">
          <img src={logon} alt="Logo" />
        </Link>

        {/* Search */}
        <div className="hdt-search">
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {showDropdown && filteredProducts.length > 0 && (
            <ul className="search-suggestions">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  className="suggestion-item"
                  onClick={() => handleSelectProduct(p.id)}
                >
                  <img
                    src={`${BASE_URL}${p.image_url}`}
                    alt={p.name}
                    className="suggestion-img"
                  />
                  <span className="suggestion-name">{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link to="/cart" className="hdt-cart cart-wrapper">
          <FaShoppingCart />

          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* User */}
        <div className="hdt-user">
          {isAuthenticated && user && profile ? (
            <div className="logged">
              <img
                src={`${BASE_URL}${profile.avatar_url || "/default-avatar.png"}`}
                alt={user.name || "User"}
                className="header-avatar"
                onClick={goToProfile}
              />
              <div className="user-info">
                <span className="user-name" onClick={goToProfile}>
                  {user.name || "User"}
                </span>
                <span className="user-email">{user.email || ""}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          ) : (
            <div className="auth">
              <Link to="/login" className="login-btn">
                <FaUser /> Log In
              </Link>
              <Link to="/register" className="register-btn">
                <FaUser /> Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="hdt-nav">
        <ul>
          <li>
            <Link to="/">Tất cả</Link>
          </li>
          <li>
            <Link to="/product">Sản phẩm</Link>
          </li>
          <li>
            <Link to="/blogs">Xu hướng làm đẹp</Link>
          </li>
          <li>
            <Link to="/brands">Thương hiệu</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
