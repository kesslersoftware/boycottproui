/**
 * Test suite for API core functionality
 * Tests authentication, error handling, response parsing, and HTTP methods
 */

// Mock AWS Amplify auth
jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn(),
}));

import { apiGet, apiPost, apiPut, apiDelete } from '../../api/api';

// Get the mocked function for type safety
import { fetchAuthSession } from 'aws-amplify/auth';
const mockFetchAuthSession = fetchAuthSession as jest.MockedFunction<typeof fetchAuthSession>;

// Global fetch mock
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Core Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock session with valid token
    mockFetchAuthSession.mockResolvedValue({
      tokens: {
        idToken: {
          toString: () => 'mock-id-token-12345'
        }
      }
    } as any);
  });

  describe('Authentication Handling', () => {
    it('should include Authorization header when requireAuth is true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ success: true })
      });

      await apiGet('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/test-endpoint',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-id-token-12345'
          })
        })
      );
    });

    it('should not include Authorization header when requireAuth is false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ success: true })
      });

      await apiGet('/test-endpoint', false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/test-endpoint',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String)
          })
        })
      );
    });

    it('should throw 401 error when no token is available and auth is required', async () => {
      mockFetchAuthSession.mockResolvedValueOnce({
        tokens: undefined
      } as any);

      await expect(apiGet('/test-endpoint')).rejects.toEqual({
        status: 401,
        message: 'Not authenticated'
      });
    });

    it('should retry once on 401 error with fresh token', async () => {
      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ error: 'Unauthorized' })
      });

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ success: true })
      });

      const result = await apiGet('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ success: true })
      });
    });

    it('should handle GET requests correctly', async () => {
      await apiGet('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/users',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should handle POST requests with JSON data', async () => {
      const testData = { name: 'Test User', email: 'test@example.com' };

      await apiPost('/users', testData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(testData)
        })
      );
    });

    it('should handle PUT requests with JSON data', async () => {
      const updateData = { name: 'Updated User' };

      await apiPut('/users/123', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/users/123',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(updateData)
        })
      );
    });

    it('should handle DELETE requests correctly', async () => {
      await apiDelete('/users/123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/users/123',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('Response Handling', () => {
    it('should parse JSON responses correctly', async () => {
      const mockData = { users: [{ id: 1, name: 'Test' }] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue(mockData)
      });

      const result = await apiGet('/users');
      expect(result).toEqual(mockData);
    });

    it('should handle text responses when content-type is not JSON', async () => {
      const textResponse = 'Plain text response';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('text/plain')
        },
        text: jest.fn().mockResolvedValue(textResponse)
      });

      const result = await apiGet('/status');
      expect(result).toBe(textResponse);
    });

    it('should handle malformed JSON gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      });

      const result = await apiGet('/malformed');
      expect(result).toEqual({});
    });
  });

  describe('Error Handling', () => {
    it('should throw JSON error response when available', async () => {
      const errorResponse = { error: 'Validation failed', code: 'INVALID_DATA' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue(errorResponse)
      });

      await expect(apiGet('/invalid')).rejects.toEqual(errorResponse);
    });

    it('should throw wrapped text error when JSON not available', async () => {
      const textError = 'Internal Server Error';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('text/plain')
        },
        text: jest.fn().mockResolvedValue(textError)
      });

      await expect(apiGet('/server-error')).rejects.toEqual({
        status: 500,
        message: textError
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiGet('/network-fail')).rejects.toThrow('Network error');
    });

    it('should handle 404 errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ error: 'Resource not found' })
      });

      await expect(apiGet('/not-found')).rejects.toEqual({
        error: 'Resource not found'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty response bodies', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: {
          get: jest.fn().mockReturnValue('')
        },
        text: jest.fn().mockResolvedValue('')
      });

      const result = await apiGet('/empty');
      expect(result).toBe('');
    });

    it('should handle missing content-type header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue(null)
        },
        text: jest.fn().mockResolvedValue('No content type')
      });

      const result = await apiGet('/no-content-type');
      expect(result).toBe('No content type');
    });

    it('should handle POST with empty data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ created: true })
      });

      await apiPost('/create-empty');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/create-empty',
        expect.objectContaining({
          body: JSON.stringify({})
        })
      );
    });
  });

  describe('URL Construction', () => {
    it('should construct URLs correctly with API_URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: jest.fn().mockReturnValue('application/json') },
        json: jest.fn().mockResolvedValue({})
      });

      await apiGet('/companies/123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/dev/companies/123',
        expect.any(Object)
      );
    });

    it('should handle paths without leading slash', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: jest.fn().mockReturnValue('application/json') },
        json: jest.fn().mockResolvedValue({})
      });

      await apiGet('users');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://vkk2r6kji5.execute-api.us-east-1.amazonaws.com/devusers',
        expect.any(Object)
      );
    });
  });
});