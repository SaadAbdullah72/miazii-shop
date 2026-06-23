import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';


export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/login', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
       
        return response.data;
    } catch (error) {
       
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
       
        return response.data;
    } catch (error) {
       
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await api.post('/api/users/logout');
    } catch (error) {
        // Ignore server errors — we always want to clear local state
        console.warn('[Logout] Server-side logout failed, clearing local state anyway:', error.message);
    }
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    // Clear all cached API responses
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('api_cache_')) {
            localStorage.removeItem(key);
        }
    }
    return null;
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (googleData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/google-login', googleData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
      
        return response.data;
    } catch (error) {
       
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.put('/api/users/profile', userData);
        const existingUserInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        // ✅ FIX: Server profile update response doesn't include token.
        // Always preserve the existing token so auth never breaks.
        const updatedUserInfo = {
            ...existingUserInfo,
            ...response.data,
            token: response.data.token || existingUserInfo.token,
        };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        return updatedUserInfo;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/users/profile');
        const existingUserInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        // ✅ FIX: Server profile GET response doesn't return token.
        // Always preserve the existing token so auth never breaks after background sync.
        const updatedUserInfo = {
            ...existingUserInfo,
            ...response.data,
            token: existingUserInfo.token,
        };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        return updatedUserInfo;
    } catch (error) {
        // ✅ FIX: Silently ignore getProfile failures — don't log out user
        // if background sync fails (e.g. offline or server error)
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.userInfo = null;
            })
            // Google Login
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Profile (Background Sync)
            .addCase(getProfile.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            });
    },
});

export default authSlice.reducer;
