import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string;
    email: string;
    password: string;
    isAuthValid: boolean;
}

const initialState: UserState = {
    username: '',
    email: '',
    password: '',
    isAuthValid: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.isAuthValid = action.payload.isAuthValid;
        },
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            Object.assign(state, action.payload);
        },
        getUser: (state) => state,
    },
});

export const { setUser, updateUser, getUser } = userSlice.actions;
export default userSlice.reducer;
