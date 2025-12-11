const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface License {
  id: string;
  name: string;
  email: string;
  activationEmail: string;
  activationPassword: string;
  users: User[];
  maxUsers: number;
}

export interface Stats {
  totalLicenses: number;
  totalUsers: number;
  availableSlots: number;
  usagePercentage: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Licenças
  async getLicenses(): Promise<License[]> {
    return this.request<License[]>('/licenses');
  }

  async getLicense(id: string): Promise<License> {
    return this.request<License>(`/licenses/${id}`);
  }

  async createLicense(license: Omit<License, 'id'>): Promise<License> {
    return this.request<License>('/licenses', {
      method: 'POST',
      body: JSON.stringify(license),
    });
  }

  async updateLicense(id: string, license: Partial<License>): Promise<License> {
    return this.request<License>(`/licenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(license),
    });
  }

  async deleteLicense(id: string): Promise<void> {
    return this.request<void>(`/licenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Usuários
  async addUser(licenseId: string, user: Omit<User, 'id'>): Promise<License> {
    return this.request<License>(`/licenses/${licenseId}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async removeUser(licenseId: string, userId: string): Promise<License> {
    return this.request<License>(`/licenses/${licenseId}/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Estatísticas
  async getStats(): Promise<Stats> {
    return this.request<Stats>('/stats');
  }
}

export const apiService = new ApiService();




