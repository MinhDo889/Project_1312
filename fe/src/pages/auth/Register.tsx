import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyUser } from "../../redux/slices/authSilce";
import type { RootState, AppDispatch } from "../../redux/store";
import { FaEnvelope, FaLock, FaUser, FaKey } from "react-icons/fa";
import { send } from "@emailjs/browser";
import Header from "../../common/Header";
import "./Register.css";

const SERVICE_ID = "service_wzh1oai";
const TEMPLATE_ID = "template_k2p0b2f";
const PUBLIC_KEY = "eQWJGLYw_u3FYSVuM";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerifyForm, setShowVerifyForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, emailToVerify } = useSelector(
    (state: RootState) => state.auth
  );

  // -------------------- HANDLE REGISTER --------------------
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Gửi request register lên backend
      const result = await dispatch(registerUser({ name, email, password }));

      if (registerUser.fulfilled.match(result)) {
        // Lưu email cần verify vào Redux

        // Lấy verification_code trả từ backend
        const codeFromBackend = result.payload.verification_code;

        // Gửi mail xác thực qua EmailJS
        await send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            email: result.payload.email,
            name,
            verification_code: codeFromBackend,
          },
          PUBLIC_KEY
        )
          .then(() => console.log("✅ Email gửi thành công"))
          .catch((err) => console.error("❌ Lỗi gửi email:", err));

        setShowVerifyForm(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- HANDLE VERIFY --------------------
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !emailToVerify) return;

    try {
      const result = await dispatch(
        verifyUser({ email: emailToVerify, code: verificationCode })
      );

      if (verifyUser.fulfilled.match(result)) {
        alert("Xác thực thành công! Bạn có thể đăng nhập ngay.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="register-background-register">
        <div className="register-card-register">
          <h1 className="brand-title-register">D$&Care</h1>

          {error && <div className="alert-error-register">{error}</div>}

          {!showVerifyForm ? (
            <form onSubmit={handleRegister} className="register-form-register">
              <div className="form-group-register">
                <label>Họ và Tên</label>
                <div className="input-icon-register">
                  <FaUser />
                  <input
                    type="text"
                    placeholder="Nhập họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-register">
                <label>Email</label>
                <div className="input-icon-register">
                  <FaEnvelope />
                  <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-register">
                <label>Mật khẩu</label>
                <div className="input-icon-register">
                  <FaLock />
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-register-register"
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng Ký"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="register-form-register">
              <p>
                Mã xác thực đã được gửi tới email: <b>{emailToVerify}</b>
              </p>

              <div className="form-group-register">
                <label>Mã xác thực</label>
                <div className="input-icon-register">
                  <FaKey />
                  <input
                    type="text"
                    placeholder="Nhập mã xác thực"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-register-register"
                disabled={loading}
              >
                {loading ? "Đang xác thực..." : "Xác Thực Email"}
              </button>
            </form>
          )}

          {!showVerifyForm && (
            <p className="register-switch-register">
              Đã có tài khoản?{" "}
              <span onClick={() => navigate("/login")}>Đăng nhập ngay</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
