import { logger } from "./logger";

export interface TransactionMetric {
  functionName: string;
  hash: string;
  durationMs: number;
  success: boolean;
}

class MonitoringService {
  private static instance: MonitoringService;
  private metricsBuffer: TransactionMetric[] = [];

  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public recordTransaction(metric: TransactionMetric) {
    this.metricsBuffer.push(metric);
    logger.info(`Transaction Metric Recorded: ${metric.functionName}`, metric);
  }

  public trackError(error: Error, context: Record<string, any> = {}) {
    logger.error("Application Error Captured", error, context);
  }

  public getMetricsSummary() {
    const total = this.metricsBuffer.length;
    const successful = this.metricsBuffer.filter((m) => m.success).length;
    const avgDuration =
      total > 0
        ? Math.round(
            this.metricsBuffer.reduce((acc, m) => acc + m.durationMs, 0) / total
          )
        : 0;

    return {
      totalTransactions: total,
      successRate: total > 0 ? (successful / total) * 100 : 100,
      avgDurationMs: avgDuration,
    };
  }
}

export const monitoring = MonitoringService.getInstance();
