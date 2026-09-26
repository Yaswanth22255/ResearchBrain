import api from './api';

// Fallback user store for local testing and offline support when backend /api/auth endpoints are pending
const LOCAL_USERS_KEY = 'academic_research_users';
const DEFAULT_DEMO_USER = {
  id: 'usr_demo_academic_01',
  name: 'Dr. Jane Vance',
  email: 'researcher@university.edu',
  role: 'Principal Investigator',
  institution: 'Department of Computer Science',
  createdAt: new Date().toISOString()
};

const getLocalUsers = () => {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    if (!stored) {
      const initial = [
        {
          ...DEFAULT_DEMO_USER,
          passwordHash: 'Research123!' // Demo password
        }
      ];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Could not save local user registry', e);
  }
};

export const authService = {
  /**
   * Authenticate user with email and password
   * Target endpoint: POST /api/auth/login
   */
  async login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    } catch (error) {
      // If backend route is not mounted (404) or unavailable, use local persistent authentication
      if (error.response?.status === 404 || !error.response) {
        console.warn('Backend /api/auth/login not detected. Using client-side persistent academic auth.');
        
        const normalizedEmail = email.trim().toLowerCase();
        const users = getLocalUsers();
        const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

        if (!found) {
          throw new Error('No academic profile found with this email address.');
        }

        if (found.passwordHash && found.passwordHash !== password) {
          throw new Error('Invalid password credentials.');
        }

        const token = `jwt_mock_${found.id}_${Date.now()}`;
        const user = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role || 'Academic Researcher',
          institution: found.institution || 'Research Institute'
        };

        return { user, token };
      }

      // Backend exists and returned an error
      const message = error.response?.data?.message || 'Authentication failed. Please verify credentials.';
      throw new Error(message);
    }
  },

  /**
   * Register a new user
   * Target endpoint: POST /api/auth/register
   */
  async register(name, email, password) {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    } catch (error) {
      // If backend route is not mounted (404) or unavailable, use local persistent registration
      if (error.response?.status === 404 || !error.response) {
        console.warn('Backend /api/auth/register not detected. Using client-side persistent academic registration.');
        
        const normalizedEmail = email.trim().toLowerCase();
        const users = getLocalUsers();
        
        if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
          throw new Error('An account with this email address already exists.');
        }

        const newUser = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: password,
          role: 'Academic Researcher',
          institution: 'Academic Institution',
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveLocalUsers(users);

        const token = `jwt_mock_${newUser.id}_${Date.now()}`;
        const user = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          institution: newUser.institution
        };

        return { user, token };
      }

      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  },

  /**
   * Request password reset email
   * Target endpoint: POST /api/auth/forgot-password
   */
  async forgotPassword(email) {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (error) {
      if (error.response?.status === 404 || !error.response) {
        console.warn('Backend /api/auth/forgot-password not detected. Using client-side reset token generator.');
        const normalizedEmail = email.trim().toLowerCase();
        const users = getLocalUsers();
        const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

        if (!found) {
          throw new Error('No researcher account found with that email address.');
        }

        // Return a mock reset token for testing
        const resetToken = `token_${Date.now()}`;
        return {
          success: true,
          message: 'Password reset instructions dispatched.',
          demoResetToken: resetToken // Helpful for direct UI testing
        };
      }

      const message = error.response?.data?.message || 'Failed to dispatch reset email.';
      throw new Error(message);
    }
  },

  /**
   * Complete password reset with token
   * Target endpoint: POST /api/auth/reset-password
   */
  async resetPassword(token, password) {
    try {
      const res = await api.post('/auth/reset-password', { token, password });
      return res.data;
    } catch (error) {
      if (error.response?.status === 404 || !error.response) {
        console.warn('Backend /api/auth/reset-password not detected. Updating local user password.');
        if (!token) throw new Error('Invalid or expired password reset token.');
        
        // Update first matching user or demo user
        const users = getLocalUsers();
        if (users.length > 0) {
          users[0].passwordHash = password;
          saveLocalUsers(users);
        }

        return {
          success: true,
          message: 'Your password has been successfully updated.'
        };
      }

      const message = error.response?.data?.message || 'Password reset token invalid or expired.';
      throw new Error(message);
    }
  },

  /**
   * Verify session / fetch current user profile
   * Target endpoint: GET /api/auth/me
   */
  async getCurrentUser() {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (error) {
      if (error.response?.status === 404 || !error.response) {
        return null;
      }
      throw error;
    }
  }
};

export default authService;
