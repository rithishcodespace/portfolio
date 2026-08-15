const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to make API requests with CORS and credentials handling
 */
const request = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || 'Request failed';
      const error = new Error(errorMsg);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const authApi = {
  login: async (credentials) => {
    try {
      return await request('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (err) {
      if (err.status === 404) {
        return await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
      }
      throw err;
    }
  },

  me: async () => {
    try {
      return await request('/admin/me', {
        method: 'GET',
      });
    } catch (err) {
      if (err.status === 404) {
        return await request('/auth/me', {
          method: 'GET',
        });
      }
      throw err;
    }
  },

  logout: async () => {
    try {
      await request('/admin/logout', {
        method: 'POST',
      });
    } catch (err) {
      // Ignore logout errors
    }
  },
};

export const messagesApi = {
  getMessages: async () => {
    const data = await request('/contact', {
      method: 'GET',
    });
    return data.messages || data;
  },

  postMessage: async (contactData) => {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  markRead: async (id) => {
    try {
      return await request(`/contact/${id}/read`, {
        method: 'PATCH',
      });
    } catch (err) {
      return { success: true };
    }
  },
};
