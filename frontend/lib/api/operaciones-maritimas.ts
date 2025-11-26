const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface OperacionMaritima {
  code: string;
  containers: number;
  status: string;
  progress: number;
  ship: string;
  merchandise: string;
  correctionNote: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class OperacionesMaritimasAPI {
  private baseURL = `${API_BASE_URL}/gestion-maritima/operaciones-maritimas`;

  async getOperaciones(page: number = 1, limit: number = 10): Promise<PaginatedResponse<OperacionMaritima>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseURL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching operations: ${response.statusText}`);
    }

    return response.json();
  }
}

export const operacionesAPI = new OperacionesMaritimasAPI();
