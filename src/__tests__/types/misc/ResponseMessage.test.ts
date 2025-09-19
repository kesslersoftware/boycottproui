/**
 * Test suite for ResponseMessage interface
 *
 * Tests data structure validation, type safety, and business logic constraints
 * for the ResponseMessage interface used in API responses.
 */

import { ResponseMessage } from '../../../types/misc/ResponseMessage';

describe('ResponseMessage Interface', () => {
  describe('Required Fields', () => {
    it('should accept valid response message with all fields', () => {
      const successResponse: ResponseMessage = {
        status: 200,
        message: 'Operation completed successfully',
        devMsg: 'User profile updated in database'
      };

      expect(successResponse.status).toBe(200);
      expect(successResponse.message).toBe('Operation completed successfully');
      expect(successResponse.devMsg).toBe('User profile updated in database');
    });

    it('should require all three fields', () => {
      const response: ResponseMessage = {
        status: 404,
        message: 'Resource not found',
        devMsg: 'User ID does not exist in users table'
      };

      expect(response.status).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.devMsg).toBeDefined();
    });
  });

  describe('Data Types', () => {
    it('should enforce correct data types', () => {
      const response: ResponseMessage = {
        status: 500,
        message: 'Internal server error',
        devMsg: 'Database connection timeout'
      };

      expect(typeof response.status).toBe('number');
      expect(typeof response.message).toBe('string');
      expect(typeof response.devMsg).toBe('string');
    });

    it('should handle integer status codes', () => {
      const statusCodes = [200, 201, 400, 401, 403, 404, 500, 502, 503];

      statusCodes.forEach((code, index) => {
        const response: ResponseMessage = {
          status: code,
          message: `Status ${code} message`,
          devMsg: `Developer message for ${code}`
        };

        expect(response.status).toBe(code);
        expect(Number.isInteger(response.status)).toBe(true);
      });
    });
  });

  describe('HTTP Status Code Scenarios', () => {
    it('should handle 2xx success responses', () => {
      const successResponses: ResponseMessage[] = [
        {
          status: 200,
          message: 'Request successful',
          devMsg: 'GET /users/123 completed successfully'
        },
        {
          status: 201,
          message: 'Resource created',
          devMsg: 'New user created with ID: user_456'
        },
        {
          status: 202,
          message: 'Request accepted',
          devMsg: 'Background job queued for processing'
        },
        {
          status: 204,
          message: 'No content',
          devMsg: 'DELETE /users/789 completed, no content returned'
        }
      ];

      successResponses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(300);
        expect(typeof response.message).toBe('string');
        expect(typeof response.devMsg).toBe('string');
      });
    });

    it('should handle 4xx client error responses', () => {
      const clientErrorResponses: ResponseMessage[] = [
        {
          status: 400,
          message: 'Bad request',
          devMsg: 'Invalid JSON in request body'
        },
        {
          status: 401,
          message: 'Unauthorized',
          devMsg: 'JWT token expired or invalid'
        },
        {
          status: 403,
          message: 'Forbidden',
          devMsg: 'User lacks permission for this resource'
        },
        {
          status: 404,
          message: 'Not found',
          devMsg: 'User with ID user_123 not found'
        },
        {
          status: 409,
          message: 'Conflict',
          devMsg: 'Email address already exists'
        },
        {
          status: 422,
          message: 'Unprocessable entity',
          devMsg: 'Validation failed: email format invalid'
        }
      ];

      clientErrorResponses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(500);
        expect(response.message.length).toBeGreaterThan(0);
        expect(response.devMsg.length).toBeGreaterThan(0);
      });
    });

    it('should handle 5xx server error responses', () => {
      const serverErrorResponses: ResponseMessage[] = [
        {
          status: 500,
          message: 'Internal server error',
          devMsg: 'Database connection failed'
        },
        {
          status: 502,
          message: 'Bad gateway',
          devMsg: 'Upstream service returned invalid response'
        },
        {
          status: 503,
          message: 'Service unavailable',
          devMsg: 'Database maintenance in progress'
        },
        {
          status: 504,
          message: 'Gateway timeout',
          devMsg: 'Upstream service timeout after 30s'
        }
      ];

      serverErrorResponses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(500);
        expect(response.status).toBeLessThan(600);
        expect(response.message).toBeDefined();
        expect(response.devMsg).toBeDefined();
      });
    });
  });

  describe('Message Content Scenarios', () => {
    it('should handle user-friendly messages', () => {
      const userFriendlyResponses: ResponseMessage[] = [
        {
          status: 200,
          message: 'Welcome back!',
          devMsg: 'User login successful, session created'
        },
        {
          status: 400,
          message: 'Please check your email address',
          devMsg: 'Email validation failed: missing @ symbol'
        },
        {
          status: 500,
          message: 'Something went wrong. Please try again.',
          devMsg: 'SQL exception: connection pool exhausted'
        }
      ];

      userFriendlyResponses.forEach(response => {
        expect(response.message.length).toBeGreaterThan(0);
        expect(response.message).not.toContain('SQL');
        expect(response.message).not.toContain('Exception');
        expect(response.message).not.toContain('NullPointer');
      });
    });

    it('should handle technical developer messages', () => {
      const technicalResponses: ResponseMessage[] = [
        {
          status: 500,
          message: 'Server error',
          devMsg: 'SQLException: Connection to database failed - Connection refused (Connection refused)'
        },
        {
          status: 400,
          message: 'Invalid request',
          devMsg: 'ValidationException: Field "email" failed regex pattern /^[^@]+@[^@]+\\.[^@]+$/'
        },
        {
          status: 404,
          message: 'User not found',
          devMsg: 'No row found in users table for user_id = "user_12345"'
        }
      ];

      technicalResponses.forEach(response => {
        expect(response.devMsg.length).toBeGreaterThan(response.message.length);
        // Developer messages should be more detailed than user messages
        expect(response.devMsg).toBeDefined();
        expect(response.devMsg.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases and Special Characters', () => {
    it('should handle empty and minimal messages', () => {
      const minimalResponse: ResponseMessage = {
        status: 200,
        message: '',
        devMsg: ''
      };

      expect(minimalResponse.message).toBe('');
      expect(minimalResponse.devMsg).toBe('');
      expect(typeof minimalResponse.message).toBe('string');
      expect(typeof minimalResponse.devMsg).toBe('string');
    });

    it('should handle special characters in messages', () => {
      const specialCharResponse: ResponseMessage = {
        status: 400,
        message: 'Invalid characters: @#$%^&*()',
        devMsg: 'Validation failed for field "username": contains illegal chars @#$%^&*()'
      };

      expect(specialCharResponse.message).toContain('@#$%^&*()');
      expect(specialCharResponse.devMsg).toContain('@#$%^&*()');
    });

    it('should handle unicode characters', () => {
      const unicodeResponse: ResponseMessage = {
        status: 200,
        message: 'Bienvenido! 欢迎! добро пожаловать!',
        devMsg: 'User login successful for unicode username: ユーザー123'
      };

      expect(unicodeResponse.message).toContain('欢迎');
      expect(unicodeResponse.devMsg).toContain('ユーザー');
    });

    it('should handle very long messages', () => {
      const longMessage = 'This is a very long user message that contains many words and could potentially be quite lengthy in real-world scenarios where detailed explanations are needed for complex error conditions or success states.';
      const longDevMsg = 'This is an extremely detailed developer message that includes comprehensive technical information about what exactly happened during the request processing, including stack traces, database queries, timing information, and other debugging details that could span multiple lines and contain substantial amounts of technical data for troubleshooting purposes.';

      const longResponse: ResponseMessage = {
        status: 422,
        message: longMessage,
        devMsg: longDevMsg
      };

      expect(longResponse.message.length).toBeGreaterThan(100);
      expect(longResponse.devMsg.length).toBeGreaterThan(200);
    });

    it('should handle newlines and formatting', () => {
      const formattedResponse: ResponseMessage = {
        status: 400,
        message: 'Multiple errors found:\n1. Email invalid\n2. Password too short',
        devMsg: 'Validation errors:\n- email: failed regex validation\n- password: length < 8 characters\nRequest ID: req_12345'
      };

      expect(formattedResponse.message).toContain('\n');
      expect(formattedResponse.devMsg).toContain('\n');
      expect(formattedResponse.message.split('\n')).toHaveLength(3);
    });
  });

  describe('Response Collections and Operations', () => {
    it('should work in arrays for response logs', () => {
      const responseLogs: ResponseMessage[] = [
        { status: 200, message: 'Success', devMsg: 'Operation 1 completed' },
        { status: 400, message: 'Bad request', devMsg: 'Validation failed' },
        { status: 500, message: 'Server error', devMsg: 'Database error' },
        { status: 200, message: 'Success', devMsg: 'Operation 2 completed' }
      ];

      expect(responseLogs).toHaveLength(4);

      // Filter errors
      const errors = responseLogs.filter(r => r.status >= 400);
      expect(errors).toHaveLength(2);

      // Filter successes
      const successes = responseLogs.filter(r => r.status >= 200 && r.status < 300);
      expect(successes).toHaveLength(2);
    });

    it('should support response analysis operations', () => {
      const responses: ResponseMessage[] = [
        { status: 200, message: 'OK', devMsg: 'Success 1' },
        { status: 201, message: 'Created', devMsg: 'Success 2' },
        { status: 400, message: 'Bad Request', devMsg: 'Client Error 1' },
        { status: 404, message: 'Not Found', devMsg: 'Client Error 2' },
        { status: 500, message: 'Server Error', devMsg: 'Server Error 1' }
      ];

      // Group by status category
      const byCategory = responses.reduce((groups, response) => {
        let category: string;
        if (response.status >= 200 && response.status < 300) category = 'success';
        else if (response.status >= 400 && response.status < 500) category = 'clientError';
        else if (response.status >= 500) category = 'serverError';
        else category = 'other';

        if (!groups[category]) groups[category] = [];
        groups[category].push(response);
        return groups;
      }, {} as Record<string, ResponseMessage[]>);

      expect(byCategory.success).toHaveLength(2);
      expect(byCategory.clientError).toHaveLength(2);
      expect(byCategory.serverError).toHaveLength(1);
    });

    it('should support response transformation', () => {
      const responses: ResponseMessage[] = [
        { status: 200, message: 'Login successful', devMsg: 'User authenticated' },
        { status: 400, message: 'Invalid email', devMsg: 'Email format validation failed' }
      ];

      // Transform to simplified format
      const simplified = responses.map(r => ({
        success: r.status < 400,
        userMessage: r.message,
        statusCode: r.status
      }));

      expect(simplified[0].success).toBe(true);
      expect(simplified[1].success).toBe(false);
      expect(simplified[0].userMessage).toBe('Login successful');

      // Extract just status codes
      const statusCodes = responses.map(r => r.status);
      expect(statusCodes).toEqual([200, 400]);
    });

    it('should support response statistics', () => {
      const responses: ResponseMessage[] = [
        { status: 200, message: 'OK', devMsg: 'Success' },
        { status: 200, message: 'OK', devMsg: 'Success' },
        { status: 400, message: 'Bad Request', devMsg: 'Error' },
        { status: 500, message: 'Server Error', devMsg: 'Error' },
        { status: 200, message: 'OK', devMsg: 'Success' }
      ];

      // Calculate success rate
      const successCount = responses.filter(r => r.status >= 200 && r.status < 300).length;
      const successRate = (successCount / responses.length) * 100;

      expect(successRate).toBe(60);

      // Find most common status
      const statusCounts = responses.reduce((counts, r) => {
        counts[r.status] = (counts[r.status] || 0) + 1;
        return counts;
      }, {} as Record<number, number>);

      expect(statusCounts[200]).toBe(3);
      expect(statusCounts[400]).toBe(1);
      expect(statusCounts[500]).toBe(1);
    });
  });
});