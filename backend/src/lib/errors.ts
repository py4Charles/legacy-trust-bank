export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: ErrorCode = "INTERNAL",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new AppError(400, message, "BAD_REQUEST", details);

export const unauthorized = (message = "Authentication required") =>
  new AppError(401, message, "UNAUTHORIZED");

export const forbidden = (message = "You do not have permission to do that") =>
  new AppError(403, message, "FORBIDDEN");

export const notFound = (message = "Resource not found") =>
  new AppError(404, message, "NOT_FOUND");

export const conflict = (message: string, details?: unknown) =>
  new AppError(409, message, "CONFLICT", details);

export const tooManyRequests = (message: string) =>
  new AppError(429, message, "TOO_MANY_REQUESTS");
