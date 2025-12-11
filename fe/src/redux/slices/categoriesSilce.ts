import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ===================== TYPES ===================== //

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  stock?: number;
  rating?: number;
  isSale?: boolean;
  isNew?: boolean;
  skin_type?: "da_dau" | "da_kho" | "hon_hop" | "nhay_cam" | "tat_ca";
  created_by?: string | null;
  created_at?: Date;
  categories?: Category[];
  is_hidden?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
}

export interface CategoryState {
  categories: Category[];
  categoryDetail?: Category;
  loading: boolean;
  error?: string;
  success?: string;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
};

// ===================== ASYNC ACTIONS ===================== //

// Lấy danh sách categories
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/categories");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Lấy category theo ID
export const fetchCategoryById = createAsyncThunk<Category, string>(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/categories/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Tạo category
export const createCategory = createAsyncThunk<
  Category,
  { name: string; description?: string }
>("categories/createCategory", async (body, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/categories", body);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Cập nhật category
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; name: string; description?: string }
>("categories/updateCategory", async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/api/categories/${id}`, body);
    return res.data.category;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Xóa category
export const deleteCategory = createAsyncThunk<string, string>(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/categories/${id}`);
      return id; // trả về id để xóa trong state
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===================== SLICE ===================== //

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = undefined;
      state.success = undefined;
    },
  },

  extraReducers: (builder) => {
    builder
      // ============================================
      // FETCH ALL
      // ============================================
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.success = undefined;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============================================
      // FETCH BY ID
      // ============================================
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.categoryDetail = undefined;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryDetail = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============================================
      // CREATE CATEGORY
      // ============================================
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // thêm vào list ngay
        state.success = "Tạo danh mục thành công";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============================================
      // UPDATE CATEGORY
      // ============================================
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Cập nhật danh mục thành công";

        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }

        if (state.categoryDetail?.id === action.payload.id) {
          state.categoryDetail = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============================================
      // DELETE CATEGORY
      // ============================================
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Xóa danh mục thành công";
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = categorySlice.actions;
export default categorySlice.reducer;
