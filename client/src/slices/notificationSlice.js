import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/api/notifications');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createNotification = createAsyncThunk(
    'notifications/create',
    async (notificationData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/notifications', notificationData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        count: 0,
        loading: false,
        error: null,
        lastFetch: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.count = 0;
        },
        resetCount: (state) => {
            state.count = 0;
            state.lastFetch = Date.now();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                // Simple logic: if new notifications count is different from before, show as new
                state.count = action.payload.length;
                state.error = null;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createNotification.fulfilled, (state, action) => {
                state.notifications.unshift(action.payload);
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n._id !== action.payload);
            });
    },
});

export const { clearNotifications, resetCount } = notificationSlice.actions;
export default notificationSlice.reducer;
