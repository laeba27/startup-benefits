/**
 * API utility with automatic Bearer token injection and token refresh
 */

interface RequestInit extends globalThis.RequestInit {
  skipAuth?: boolean;
}

/**
 * Enhanced fetch that:
 * 1. Automatically adds Authorization header with accessToken
 * 2. Refreshes token if expired
 * 3. Retries request with new token
 */
export const apiCall = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const { skipAuth = false, ...fetchOptions } = options;

  // Get tokens from localStorage
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

  // Check if token needs refresh (within 5 minutes of expiry)
  if (
    accessToken &&
    tokenExpiresAt &&
    Date.now() > parseInt(tokenExpiresAt) - 5 * 60 * 1000
  ) {
    if (refreshToken) {
      const refreshSuccess = await refreshAccessToken(refreshToken);
      if (refreshSuccess) {
        accessToken = localStorage.getItem('accessToken');
      } else {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiresAt');
        window.location.href = '/auth/login';
        return new Response('Unauthorized', { status: 401 });
      }
    }
  }

  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authorization header if we have a token and skipAuth is not true
  if (!skipAuth && accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  // Make the request
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // If 401, try to refresh and retry once
  if (response.status === 401 && !skipAuth && refreshToken) {
    const refreshSuccess = await refreshAccessToken(refreshToken);
    if (refreshSuccess) {
      const newAccessToken = localStorage.getItem('accessToken');
      if (newAccessToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...fetchOptions,
          headers,
        });
      }
    }
  }

  return response;
};

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        skipAuth: true,
      } as RequestInit
    );

    const data = await response.json();

    if (data.success && data.data.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem(
        'tokenExpiresAt',
        String(Date.now() + data.data.expiresIn * 1000)
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}
