import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSilce";
import type { RootState, AppDispatch } from "../../redux/store";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../../common/Header";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, error, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // -------------------- REDIRECT BY ROLE --------------------
  const redirectByRole = (role: string | null) => {
    if (!role) return;

    if (role === "admin" || role === "super_admin") {
      navigate("/manage_admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  // -------------------- AUTO REDIRECT --------------------
  useEffect(() => {
    // Nếu user đã login trong Redux
    if (user?.token && user.role) {
      redirectByRole(user.role);
      return;
    }

    // Nếu chưa có user trong Redux -> kiểm tra localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      redirectByRole(role);
    }
  }, [user]);

  // -------------------- HANDLE LOGIN --------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      // login thành công
      localStorage.setItem("role", result.payload.role);
      redirectByRole(result.payload.role);
    } else if (
      loginUser.rejected.match(result) &&
      result.payload === "Tài khoản chưa xác thực email!"
    ) {
      alert(
        "Tài khoản chưa xác thực email. Vui lòng kiểm tra email và xác thực."
      );
    }
  };

  return (
    <>
      <Header />
      <div className="login-background-login">
        <div className="login-card-login">
          <h1 className="brand-title-login">D$&Care</h1>

          {error && <div className="alert-error-login">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form-login">
            <div className="form-group-login">
              <label>Email</label>
              <div className="input-icon-login">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Nhập email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-login">
              <label>Mật khẩu</label>
              <div className="input-icon-login">
                <FaLock />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-pass-login"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <span
                className="forgot-password-login"
                onClick={() => navigate("/forgot")}
              >
                Quên mật khẩu?
              </span>
            </div>

            <button
              type="submit"
              className="btn-login-login"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>

            <div className="register-text-login">
              Chưa có tài khoản?{" "}
              <span onClick={() => navigate("/register")}>Đăng ký ngay</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
