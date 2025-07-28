// API service for backend communication
export class ApiService {
  private static instance: ApiService;
  private baseUrl = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || '/api')
    : 'http://localhost:3001/api';

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('smart-code-reviewer-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Project Management
  async createProject(name: string, description?: string) {
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return this.handleResponse(response);
  }

  async getProjects() {
    const response = await fetch(`${this.baseUrl}/projects`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProject(id: number) {
    const response = await fetch(`${this.baseUrl}/projects/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProject(id: number, name: string, description?: string) {
    const response = await fetch(`${this.baseUrl}/projects/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return this.handleResponse(response);
  }

  async deleteProject(id: number) {
    const response = await fetch(`${this.baseUrl}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Analysis Management
  async saveAnalysis(projectId: number, filename: string, language: string, analysisData: any, score: number) {
    const response = await fetch(`${this.baseUrl}/analyses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        projectId,
        filename,
        language,
        analysisData,
        score,
      }),
    });
    return this.handleResponse(response);
  }

  async getAnalyses(projectId?: number, language?: string, limit = 20, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (projectId) params.append('projectId', projectId.toString());
    if (language) params.append('language', language);

    const response = await fetch(`${this.baseUrl}/analyses?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAnalysis(id: number) {
    const response = await fetch(`${this.baseUrl}/analyses/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteAnalysis(id: number) {
    const response = await fetch(`${this.baseUrl}/analyses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`);
    return this.handleResponse(response);
  }
}