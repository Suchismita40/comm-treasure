type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

class AppLogger {
  private static instance: AppLogger;
  private isDevelopment = process.env.NODE_ENV !== "production";

  private constructor() {}

  public static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger();
    }
    return AppLogger.instance;
  }

  private formatLog(level: LogLevel, message: string, context?: Record<string, any>): LogPayload {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  public debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.debug("[DEBUG]", message, context || "");
    }
  }

  public info(message: string, context?: Record<string, any>) {
    const payload = this.formatLog("INFO", message, context);
    console.info(`[INFO] ${payload.timestamp} - ${message}`, context || "");
  }

  public warn(message: string, context?: Record<string, any>) {
    const payload = this.formatLog("WARN", message, context);
    console.warn(`[WARN] ${payload.timestamp} - ${message}`, context || "");
  }

  public error(message: string, error?: any, context?: Record<string, any>) {
    const payload = this.formatLog("ERROR", message, { ...context, error: error?.message || error });
    console.error(`[ERROR] ${payload.timestamp} - ${message}`, error, context || "");
  }
}

export const logger = AppLogger.getInstance();
