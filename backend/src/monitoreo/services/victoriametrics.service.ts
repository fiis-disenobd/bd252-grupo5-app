import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface VictoriaMetricsRangeQueryResult {
  status: string;
  data?: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      values: [number, string][];
    }>;
  };
  error?: string;
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

@Injectable()
export class VictoriaMetricsService {
  private readonly logger = new Logger(VictoriaMetricsService.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('VICTORIA_METRICS_URL') ||
      'http://localhost:8428';
  }

  async writeLines(lines: string | string[]): Promise<void> {
    const body = Array.isArray(lines) ? lines.join('\n') : lines;

    // Usamos el endpoint de importación para formato Prometheus exposition.
    const url = new URL('/api/v1/import/prometheus', this.baseUrl);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(
        `Error al escribir en VictoriaMetrics: ${response.status} ${text}`,
      );
      throw new Error('Error al escribir métricas en VictoriaMetrics');
    }
  }

  async queryRange(
    query: string,
    start: number,
    end: number,
    step: number,
  ): Promise<VictoriaMetricsRangeQueryResult> {
    const url = new URL('/api/v1/query_range', this.baseUrl);
    url.searchParams.set('query', query);
    url.searchParams.set('start', String(start));
    url.searchParams.set('end', String(end));
    url.searchParams.set('step', String(step));

    const response = await fetch(url.toString());
    const data = (await response.json()) as VictoriaMetricsRangeQueryResult;

    if (!response.ok || data.status !== 'success') {
      this.logger.error(
        `Error en query_range VictoriaMetrics: ${response.status} ${data.error || ''}`,
      );
      throw new Error(data.error || 'Error al consultar VictoriaMetrics');
    }

    return data;
  }

  async getTemperaturaContenedor(
    contenedorId: string,
    // Por defecto consultamos el último año para cubrir lecturas históricas.
    horas: number = 24 * 365,
    // Step de 1 hora para mantener el número de puntos por debajo del límite de VictoriaMetrics.
    stepSeconds: number = 3600,
  ): Promise<TimeSeriesPoint[]> {
    const nowSec = Math.floor(Date.now() / 1000);
    // Para la demo usamos un rango amplio: hasta 1 año hacia atrás, para cubrir lecturas históricas.
    const maxHoras = 24 * 365;
    const effectiveHoras = Math.min(horas, maxHoras);
    const startSec = nowSec - effectiveHoras * 3600;

    // Para la demo usamos todas las lecturas del contenedor sin filtrar por tipo de sensor,
    // ya que la etiqueta "tipo" puede variar (temperatura_interior, temperatura_exterior, etc.).
    const query = `contenedor_sensor_valor{contenedor_id="${contenedorId}"}`;

    const result = await this.queryRange(query, startSec, nowSec, stepSeconds);

    const serie = result.data?.result?.[0];
    if (!serie) {
      return [];
    }

    return serie.values.map(([ts, val]) => ({
      timestamp: ts,
      value: Number(val),
    }));
  }
}
