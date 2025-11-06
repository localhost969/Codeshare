import { useAuth } from './auth-context';

export function useApi() {
  const { user } = useAuth();

  const request = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add JWT token if user is authenticated
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  };

  return {
    get: (endpoint: string) =>
      request(endpoint, { method: 'GET' }),

    post: (endpoint: string, body: any) =>
      request(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    put: (endpoint: string, body: any) =>
      request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),

    delete: (endpoint: string) =>
      request(endpoint, { method: 'DELETE' }),

    request,
  };
}
