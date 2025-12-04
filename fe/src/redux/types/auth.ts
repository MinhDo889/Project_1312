// =========================
// USER & PROFILE
// =========================
export interface Profile {
  id: string;
  user_id: string;
  avatar_url?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  created_at?: Date;
}

export interface User {
  id: string; // CHAR(36)
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  token?: string; // token JWT sau login hoặc verify
  profile?: Profile; // quan hệ 1-1 với profile
  skin_type?: "da_dau" | "da_kho" | "hon_hop" | "nhay_cam" | "tat_ca";
  is_verified?: boolean; // trạng thái xác thực email
  verification_code: string;
}

// =========================
// AUTH STATE
// =========================
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  emailToVerify?: string | null; // lưu tạm email khi register chưa verify
}

// =========================
// CATEGORY & PRODUCT
// =========================
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: Date;
}

export interface Product {
  isSale: any;
  isNew: any;
  id: string; // CHAR(36)
  name: string;
  description?: string; // TEXT có thể null
  price: number; // DECIMAL(10,2)
  image_url?: string;
  stock?: number; // INTEGER, default 0
  rating?: number; // FLOAT, default 0
  skin_type?: "da_dau" | "da_kho" | "hon_hop" | "nhay_cam" | "tat_ca";
  created_by?: string | null; // id người tạo
  created_at?: Date;
  categories?: Category[];
}

// =========================
// CART & CART ITEM
// =========================
export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product?: Product; // <-- chú ý chữ P hoa
}

export interface Cart {
  id: string;
  user_id: string;
  CartItems: CartItem[];
}
