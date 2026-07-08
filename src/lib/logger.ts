type Level = "error" | "warn" | "info";

export type LogContext = {
  userId?: string | null;
  shopId?: string | null;
  action?: string;
  route?: string;
  code?: string;
  reason?: string;
  [key: string]: unknown;
};

function serializeCause(cause: unknown): unknown {
  if (cause instanceof Error) {
    return { name: cause.name, message: cause.message, stack: cause.stack };
  }
  try { return String(cause); } catch { return "unserializable"; }
}

function write(level: Level, location: string, ctx?: LogContext, cause?: unknown) {
  try {
    const entry = {
      level,
      ts: new Date().toISOString(),
      env: process.env.NODE_ENV ?? "production",
      location,
      ...ctx,
      ...(cause != null ? { cause: serializeCause(cause) } : {}),
    };
    const line = JSON.stringify(entry);
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  } catch {
    // logging must never throw
  }
}

export const logger = {
  error: (location: string, ctx?: LogContext, cause?: unknown) =>
    write("error", location, ctx, cause),
  warn: (location: string, ctx?: LogContext, cause?: unknown) =>
    write("warn", location, ctx, cause),
  info: (location: string, ctx?: LogContext) =>
    write("info", location, ctx),
};
