

import { api } from "../api";
import { LoginRequest, LoginResponse } from "../models/models";
export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // register: build.mutation<RegisterResponse, RegisterRequest>({
    //   query: (credentials) => ({
    //     url: "register",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // getMe: build.query<User, void>({
    //   query: () => "user",
    // }),
  }),
});

export const {
  //   useRegisterMutation,
  useLoginMutation,
} = authApi;
