export interface HealthResponse {
  status: string;
  message: string;
  system: string;
  environment: string;
  timestamp: string;
  database: 'connected' | 'disconnected';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
};
