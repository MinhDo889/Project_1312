import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../services/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  products?: Product[];
}

export interface CategoryState {
  categories: Category[];
  categoryDetail?: Category; // chi tiết danh mục
  loading: boolean;
  error?: string;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
};

// Lấy danh sách categories
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/categories");
      return res.data as Category[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Lấy chi tiết category theo ID
export const fetchCategoryById = createAsyncThunk<Category, string>(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/categories/${id}`);
      return res.data as Category;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Fetch all categories ===
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // === Fetch category by ID ===
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.categoryDetail = undefined;
      })
      .addCase(
        fetchCategoryById.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categoryDetail = action.payload;
        }
      )
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
