

import { api } from "../api";
import { EnrollResponse } from "../models/models";
export const enrollApi = api.injectEndpoints({
  endpoints: (build) => ({
    postEnroll: build.mutation<EnrollResponse, { payload: FormData }>({
      query: ({ payload }) => ({
        url: "enroll",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});
