// src/redux/slices/profileSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../services/api";

export interface Profile {
  id: string;
  user_id: string;
  avatar_url?: string | null;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
}

interface ProfileState {
  profile?: Profile;
  loading: boolean;
  error?: string;
}

const initialState: ProfileState = {
  profile: undefined,
  loading: false,
  error: undefined,
};

// ========================
// Fetch profile by user_id
// ========================
export const fetchProfile = createAsyncThunk<Profile, string>(
  "profile/fetchProfile",
  async (user_id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/profiles/${user_id}`);
      return res.data as Profile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message());
      console.log(err, "lỗi con cặc");
    }
  }
);

// ========================
// Create profile
// ========================
export const createProfile = createAsyncThunk<Profile, FormData>(
  "profile/createProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/api/profiles", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as Profile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Update profile
// ========================
export const updateProfile = createAsyncThunk<
  Profile,
  { user_id: string; data: FormData }
>("profile/updateProfile", async ({ user_id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(`/api/profiles/${user_id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data as Profile;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ========================
// Slice
// ========================
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = undefined;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createProfile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        createProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
