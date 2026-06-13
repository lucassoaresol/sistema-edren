import { type ApiResponse, request } from './request';

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  profile: {
    code: string;
    name: string;
  };
};

export async function getCurrentUser() {
  const response = await request<ApiResponse<AuthUser | null>>('/api/auth/me');
  return response.data;
}

export async function login(input: { password: string; username: string }) {
  const response = await request<ApiResponse<AuthUser>>('/api/auth/login', {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function logout() {
  await request<ApiResponse<{ ok: boolean }>>('/api/auth/logout', {
    method: 'POST',
  });
}
