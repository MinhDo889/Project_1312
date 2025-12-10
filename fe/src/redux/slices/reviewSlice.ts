// src/redux/reviewSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// ----- Types -----
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

// ----- Initial State -----
const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

// ----- API URL -----
const API_URL = "http://localhost:3001/api/reviews";

// ----- Async Thunks -----
// Lấy tất cả review
export const fetchReviews = createAsyncThunk<
  Review[],
  void,
  { rejectValue: string }
>("reviews/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<Review[]>(API_URL);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Lấy review theo product
export const fetchReviewsByProduct = createAsyncThunk<
  Review[],
  string,
  { rejectValue: string }
>("reviews/fetchByProduct", async (productId, { rejectWithValue }) => {
  try {
    const res = await axios.get<Review[]>(`${API_URL}/product/${productId}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Tạo review mới
export const createReview = createAsyncThunk<
  Review,
  Omit<Review, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("reviews/create", async (reviewData, { rejectWithValue }) => {
  try {
    const res = await axios.post<Review>(API_URL, reviewData);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Xóa review
export const deleteReview = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("reviews/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ----- Slice -----
const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.loading = false;
          state.reviews = action.payload;
        }
      )
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch reviews";
      })
      // Fetch by product
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviewsByProduct.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.loading = false;
          state.reviews = action.payload;
        }
      )
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch reviews by product";
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createReview.fulfilled,
        (state, action: PayloadAction<Review>) => {
          state.loading = false;
          state.reviews.unshift(action.payload);
        }
      )
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create review";
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteReview.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.reviews = state.reviews.filter((r) => r.id !== action.payload);
        }
      )
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete review";
      });
  },
});

export default reviewSlice.reducer;
