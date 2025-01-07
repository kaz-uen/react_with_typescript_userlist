import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userListData from "@/constants/userList/userListData";
import type { User, UserState } from "@/types/userList/index";

const initialState: UserState = {
  userListData: [],
  status: "idle",
  error: null,
};

// ユーザーデータ取得
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    try {
      return userListData;
    } catch (error) {
      // 開発環境でのみログを出力
      if (import.meta.env.DEV) {
        console.error('Error details:', error);
      }
      throw new Error("ユーザーデータの取得に失敗しました");
    }
  }
);

// 新規ユーザー登録
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData: Omit<User, "id">, { getState }) => {
    try {
      const state = getState() as { user: UserState };
      const currentUsers = state.user.userListData;
      const newId = currentUsers.length > 0
        ? Math.max(...currentUsers.map(user => user.id)) + 1
        : 1;
      const newUser: User = {
        ...userData,
        id: newId
      };
      return newUser;
    } catch (error) {
      // 開発環境でのみログを出力
      if (import.meta.env.DEV) {
        console.error('Error details:', error);
      }
      throw new Error("ユーザーの追加に失敗しました");
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      // リクエストが開始されたときの処理
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      // リクエストが成功したときの処理
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userListData = action.payload;
        state.error = null;
      })
      // リクエストが失敗したときの処理
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
        state.error = "ユーザーデータの取得に失敗しました";
      })
      // addUser
      .addCase(addUser.fulfilled, (state, action) => {
        state.userListData.push(action.payload);
      });
  }
});

export default UserSlice.reducer;
