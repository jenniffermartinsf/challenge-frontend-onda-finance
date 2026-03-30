import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { handleMockRequest, toMockApiErrorPayload } from "@/lib/mock-api";

type ApiErrorPayload = {
  message?: string;
};

const mockAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  try {
    const response = await handleMockRequest(config);

    return {
      data: response.data,
      status: response.status,
      statusText: "OK",
      headers: new AxiosHeaders({
        "Content-Type": "application/json",
      }),
      config,
      request: undefined,
    };
  } catch (error) {
    const errorPayload = toMockApiErrorPayload(error);

    const response: AxiosResponse<ApiErrorPayload> = {
      data: errorPayload,
      status:
        error instanceof Error && "status" in error
          ? Number(error.status)
          : 500,
      statusText: "Error",
      headers: new AxiosHeaders({
        "Content-Type": "application/json",
      }),
      config,
      request: undefined,
    };

    throw new AxiosError(
      errorPayload.message,
      String(response.status),
      config,
      undefined,
      response,
    );
  }
};

export const api = axios.create({
  adapter: mockAdapter,
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a solicitação.",
) {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
