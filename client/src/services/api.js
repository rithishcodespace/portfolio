// vercel calls portfolio.rithish.site:443 -> render's api-gateway will route to api.rithish.site:renders-port
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`; 

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
  getMessages: async (filter = 'all') => {
    const query = filter && filter !== 'all' ? `?filter=${filter}` : '';
    const data = await request(`/contact${query}`, {
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

  markSeen: async (id, seen = true) => {
    try {
      return await request(`/contact/mark_as_seen/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ seen }),
      });
    } catch (err) {
      return { success: true };
    }
  },

  markRead: async (id) => {
    return await messagesApi.markSeen(id, true);
  },
};

export const trackingApi = {
  trackPageView: async (page = '/') => {
    try {
      return await request('/track', {
        method: 'POST',
        body: JSON.stringify({ page }),
      });
    } catch (err) {
      console.error('Error tracking page view:', err);
    }
  },

  getStats: async () => {
    return await request('/track/stats', {
      method: 'GET',
    });
  },
};

export const resumeApi = {
  requestResume: async (formData) => {
    return await request('/resume/request', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  getResumeRequests: async (filter = 'all') => {
    const query = filter && filter !== 'all' ? `?filter=${filter}` : '';
    const data = await request(`/resume/requests${query}`, {
      method: 'GET',
    });
    return data.requests || data;
  },

  markSeen: async (id, seen = true) => {
    try {
      return await request(`/resume/requests/${id}/seen`, {
        method: 'PATCH',
        body: JSON.stringify({ seen }),
      });
    } catch (err) {
      return { success: true };
    }
  },
};


