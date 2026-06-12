import { ErrorCode } from "@/lib/errors";

export type AppError = {
  code: ErrorCode;
  message: string;
  status?: number;
  meta?: unknown;
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

export const ok = <T>(data: T): Result<T> => ({
  ok: true,
  data,
});

export const err = (error: AppError): Result<never> => ({
  ok: false,
  error,
});
