import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../services/api";

// =========================
// INTERFACES
// =========================
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  verification_code?: string; // optional, chỉ dùng khi register
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  emailToVerify: string | null; // lưu tạm email khi register chưa verify
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface VerifyPayload {
  email: string;
  code: string;
}

// =========================
// HELPER: load user từ localStorage
// =========================
const loadUserFromStorage = (): User | null => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  if (token && id && email) {
    return { id, name: name || "", email, role: role || "", token };
  }
  return null;
};

// =========================
// REGISTER
// =========================
export const registerUser = createAsyncThunk<
  { email: string; verification_code: string },
  RegisterPayload,
  { rejectValue: string }
>(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("api/auth/register", {
        name,
        email,
        password,
      });
      return {
        email: res.data.email,
        verification_code: res.data.verification_code,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  }
);

// =========================
// VERIFY USER
// =========================
export const verifyUser = createAsyncThunk<
  User,
  VerifyPayload,
  { rejectValue: string }
>("auth/verifyUser", async ({ email, code }, { rejectWithValue }) => {
  try {
    const res = await api.post("api/auth/verify", { email, code });
    const { token, id, name, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name || "");
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);

    return { token, email, name, role, id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Xác thực thất bại");
  }
});

// =========================
// LOGIN
// =========================
export const loginUser = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post("api/auth/login", { email, password });

    if (res.status === 403) {
      return rejectWithValue(
        res.data.message || "Tài khoản chưa xác thực email!"
      );
    }

    const { token, id, name, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name || "");
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);

    return { token, email, name, role, id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Đăng nhập thất bại");
  }
});

// =========================
// LOGOUT
// =========================
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
  return {};
});

// =========================
// INITIAL STATE
// =========================
const initialUser = loadUserFromStorage();
const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
  emailToVerify: null,
};

// =========================
// SLICE
// =========================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.emailToVerify = action.payload.email;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Đăng ký thất bại";
    });

    // VERIFY
    builder.addCase(verifyUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      verifyUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.emailToVerify = null;
      }
    );
    builder.addCase(verifyUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Xác thực thất bại";
    });

    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Đăng nhập thất bại";
    });

    // LOGOUT
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.emailToVerify = null;
    });
  },
});

export default authSlice.reducer;
