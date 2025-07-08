import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTokenVerify, loginUserApi } from "../utils/delivery-api";
import type {TLoginData} from "../utils/delivery-api";
import type { TAuth } from "../utils/types";
import { setCookie } from "../utils/cookie";

type userState = {
    accessToken: string | null;
    isLoading: boolean;
    isAuthChecked: boolean;
    isAuthenticated: boolean;
    loginError: string
}
export const getInitialState = (): userState => {
  // Вычисляем accessToken динамически при каждом вызове функции. Нужно для тестов
  const accessToken = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null;
  
  return {
    isLoading: false,
    accessToken,
    isAuthChecked: false,
    isAuthenticated: false,
    loginError: ''
  };
};

const initialState = getInitialState();

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
    },
    extraReducers(builder) {
        builder.addCase(loginUserThunk.pending, (state) => {
            state.isLoading = true;
            state.loginError = ''
          })
          .addCase(loginUserThunk.fulfilled, (state, action) => {
            state.accessToken = action.payload.access;
            state.isLoading = false;
            setCookie('accessToken', action.payload.access);
            localStorage.setItem('refreshToken', action.payload.refresh)
            state.isAuthenticated = true
            state.loginError = 'null'
          })
          .addCase(loginUserThunk.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false
            state.accessToken = null;
            localStorage.removeItem('accessToken');
            state.loginError = "Ошибка авторизации"
          })
          .addCase(authThunk.fulfilled, (state) => {
            state.isAuthChecked = true;
            state.isAuthenticated = true;
          })
          .addCase(authThunk.rejected, (state) => {
            state.isAuthChecked = true;
            state.isAuthenticated = false;
          }) 
    },
})


export const loginUserThunk = createAsyncThunk<TAuth, TLoginData>(
    'login',
    async (data) => {
      const response = await loginUserApi(data);
      return response;
    }
  );

export const authThunk = createAsyncThunk(
  'auth',
  async() => {
    const response = await getTokenVerify()
    return response
  }
)

export const userReducer = userSlice.reducer;