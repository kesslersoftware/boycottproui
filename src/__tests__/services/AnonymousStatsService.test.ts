/**
 * Test suite for AnonymousStatsService
 * Tests anonymous statistics tracking for companies, causes, and cause-company relationships
 */

// Mock the core API module FIRST before imports
jest.mock('../../api/api', () => ({
  apiPost: jest.fn(),
  apiPut: jest.fn(),
}));

import { postAnonymousStat } from '../../services/AnonymousStatsService';
import { apiPost, apiPut } from '../../api/api';
import { ResponseMessage } from '../../types';

// Type the mocked functions
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockApiPut = apiPut as jest.MockedFunction<typeof apiPut>;

// Mock console methods to reduce test noise
const originalConsoleError = console.error;

describe('AnonymousStatsService', () => {
  const mockResponseMessage: ResponseMessage = {
    message: 'Stat updated successfully'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.error to reduce test noise
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  describe('Company Stats', () => {
    it('should increment company stats', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('company', {
        company_id: 'company-123',
        increment: true
      });

      expect(mockApiPut).toHaveBeenCalledWith('/companies/company-123/true');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should decrement company stats', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('company', {
        company_id: 'company-456',
        increment: false
      });

      expect(mockApiPut).toHaveBeenCalledWith('/companies/company-456/false');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle different company IDs', async () => {
      const companyIds = ['company-123', 'company-abc', 'company-xyz'];

      for (const companyId of companyIds) {
        mockApiPut.mockResolvedValueOnce(mockResponseMessage);

        const result = await postAnonymousStat('company', {
          company_id: companyId,
          increment: true
        });

        expect(mockApiPut).toHaveBeenCalledWith(`/companies/${companyId}/true`);
        expect(result).toEqual(mockResponseMessage);
      }
    });

    it('should handle company stat errors', async () => {
      const apiError = { message: 'Company not found' };
      mockApiPut.mockRejectedValueOnce(apiError);

      await expect(postAnonymousStat('company', {
        company_id: 'nonexistent-company',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Company not found'
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to post anonymous stat (company):',
        apiError
      );
    });

    it('should handle empty company ID', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      await postAnonymousStat('company', {
        company_id: '',
        increment: true
      });

      expect(mockApiPut).toHaveBeenCalledWith('/companies//true');
    });

    it('should handle special characters in company ID', async () => {
      const specialCompanyId = 'company-123@#$%';
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      await postAnonymousStat('company', {
        company_id: specialCompanyId,
        increment: true
      });

      expect(mockApiPut).toHaveBeenCalledWith(`/companies/${specialCompanyId}/true`);
    });
  });

  describe('Cause Stats', () => {
    it('should increment cause stats', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('cause', {
        cause_id: 'cause-123',
        increment: true
      });

      expect(mockApiPut).toHaveBeenCalledWith('/causes/cause-123/true');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should decrement cause stats', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('cause', {
        cause_id: 'cause-456',
        increment: false
      });

      expect(mockApiPut).toHaveBeenCalledWith('/causes/cause-456/false');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle different cause IDs', async () => {
      const causeIds = ['cause-123', 'cause-environmental', 'cause-labor'];

      for (const causeId of causeIds) {
        mockApiPut.mockResolvedValueOnce(mockResponseMessage);

        const result = await postAnonymousStat('cause', {
          cause_id: causeId,
          increment: true
        });

        expect(mockApiPut).toHaveBeenCalledWith(`/causes/${causeId}/true`);
        expect(result).toEqual(mockResponseMessage);
      }
    });

    it('should handle cause stat errors', async () => {
      const apiError = { message: 'Cause not found' };
      mockApiPut.mockRejectedValueOnce(apiError);

      await expect(postAnonymousStat('cause', {
        cause_id: 'nonexistent-cause',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Cause not found'
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to post anonymous stat (cause):',
        apiError
      );
    });
  });

  describe('Cause-Company Stats', () => {
    it('should post cause-company stats with increment', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('cause_company', {
        cause_id: 'cause-123',
        company_id: 'company-456',
        cause_desc: 'Environmental Issues',
        company_name: 'Test Corp',
        increment: true
      });

      expect(mockApiPost).toHaveBeenCalledWith(
        '/causes/cause-123/companies/company-456',
        {
          cause_desc: 'Environmental Issues',
          company_name: 'Test Corp',
          increment: true
        }
      );
      expect(result).toEqual(mockResponseMessage);
    });

    it('should post cause-company stats with decrement', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('cause_company', {
        cause_id: 'cause-789',
        company_id: 'company-abc',
        cause_desc: 'Labor Rights',
        company_name: 'Another Corp',
        increment: false
      });

      expect(mockApiPost).toHaveBeenCalledWith(
        '/causes/cause-789/companies/company-abc',
        {
          cause_desc: 'Labor Rights',
          company_name: 'Another Corp',
          increment: false
        }
      );
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle cause-company stats without optional fields', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await postAnonymousStat('cause_company', {
        cause_id: 'cause-123',
        company_id: 'company-456',
        increment: true
      });

      expect(mockApiPost).toHaveBeenCalledWith(
        '/causes/cause-123/companies/company-456',
        {
          cause_desc: undefined,
          company_name: undefined,
          increment: true
        }
      );
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle cause-company stat errors', async () => {
      const apiError = { message: 'Invalid cause-company relationship' };
      mockApiPost.mockRejectedValueOnce(apiError);

      await expect(postAnonymousStat('cause_company', {
        cause_id: 'cause-123',
        company_id: 'company-456',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Invalid cause-company relationship'
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to post anonymous stat (cause_company):',
        apiError
      );
    });

    it('should handle empty strings in cause-company data', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      await postAnonymousStat('cause_company', {
        cause_id: '',
        company_id: '',
        cause_desc: '',
        company_name: '',
        increment: true
      });

      expect(mockApiPost).toHaveBeenCalledWith(
        '/causes//companies/',
        {
          cause_desc: '',
          company_name: '',
          increment: true
        }
      );
    });
  });

  describe('Invalid Stat Types', () => {
    it('should throw error for unknown stat type', async () => {
      await expect(postAnonymousStat('invalid_type' as any, {
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Unknown stat type'
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to post anonymous stat (invalid_type):',
        new Error('Unknown stat type')
      );
    });

    it('should handle null stat type', async () => {
      await expect(postAnonymousStat(null as any, {
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Unknown stat type'
      });
    });

    it('should handle undefined stat type', async () => {
      await expect(postAnonymousStat(undefined as any, {
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Unknown stat type'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      mockApiPut.mockRejectedValueOnce(networkError);

      await expect(postAnonymousStat('company', {
        company_id: 'company-123',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Network timeout'
      });
    });

    it('should handle errors without message property', async () => {
      const errorWithoutMessage = { code: 'UNKNOWN_ERROR' };
      mockApiPut.mockRejectedValueOnce(errorWithoutMessage);

      await expect(postAnonymousStat('company', {
        company_id: 'company-123',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Unknown error'
      });
    });

    it('should handle server errors', async () => {
      const serverError = { status: 500, message: 'Internal server error' };
      mockApiPost.mockRejectedValueOnce(serverError);

      await expect(postAnonymousStat('cause_company', {
        cause_id: 'cause-123',
        company_id: 'company-456',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Internal server error'
      });
    });

    it('should handle API errors with custom status codes', async () => {
      const customError = { status: 404, message: 'Resource not found' };
      mockApiPut.mockRejectedValueOnce(customError);

      await expect(postAnonymousStat('cause', {
        cause_id: 'cause-404',
        increment: true
      })).rejects.toEqual({
        status: 500,
        message: 'Failed to post anonymous stat',
        devMsg: 'Resource not found'
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle sequential stat updates', async () => {
      // Increment company stat
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);
      await postAnonymousStat('company', {
        company_id: 'company-123',
        increment: true
      });

      // Increment cause stat
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);
      await postAnonymousStat('cause', {
        cause_id: 'cause-456',
        increment: true
      });

      // Add cause-company relationship
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);
      await postAnonymousStat('cause_company', {
        cause_id: 'cause-456',
        company_id: 'company-123',
        cause_desc: 'Environmental Issues',
        company_name: 'Test Corp',
        increment: true
      });

      expect(mockApiPut).toHaveBeenCalledTimes(2);
      expect(mockApiPost).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent stat updates', async () => {
      // Setup mocks for parallel calls
      mockApiPut.mockResolvedValueOnce(mockResponseMessage); // company
      mockApiPut.mockResolvedValueOnce(mockResponseMessage); // cause
      mockApiPost.mockResolvedValueOnce(mockResponseMessage); // cause_company

      // Make concurrent calls
      const [companyResult, causeResult, causeCompanyResult] = await Promise.all([
        postAnonymousStat('company', { company_id: 'company-123', increment: true }),
        postAnonymousStat('cause', { cause_id: 'cause-456', increment: true }),
        postAnonymousStat('cause_company', {
          cause_id: 'cause-456',
          company_id: 'company-123',
          increment: true
        })
      ]);

      expect(companyResult).toEqual(mockResponseMessage);
      expect(causeResult).toEqual(mockResponseMessage);
      expect(causeCompanyResult).toEqual(mockResponseMessage);
    });

    it('should handle mixed increment/decrement operations', async () => {
      // Increment company
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);
      await postAnonymousStat('company', {
        company_id: 'company-123',
        increment: true
      });

      // Decrement same company
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);
      await postAnonymousStat('company', {
        company_id: 'company-123',
        increment: false
      });

      expect(mockApiPut).toHaveBeenCalledWith('/companies/company-123/true');
      expect(mockApiPut).toHaveBeenCalledWith('/companies/company-123/false');
    });
  });

  describe('Data Validation', () => {
    it('should handle missing required fields for company stats', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      await postAnonymousStat('company', {
        increment: true
        // company_id intentionally missing
      } as any);

      expect(mockApiPut).toHaveBeenCalledWith('/companies/undefined/true');
    });

    it('should handle missing required fields for cause stats', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      await postAnonymousStat('cause', {
        increment: false
        // cause_id intentionally missing
      } as any);

      expect(mockApiPut).toHaveBeenCalledWith('/causes/undefined/false');
    });

    it('should handle boolean conversion for increment field', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      // Test with truthy values
      await postAnonymousStat('company', {
        company_id: 'company-123',
        increment: 'true' as any // string instead of boolean
      });

      expect(mockApiPut).toHaveBeenCalledWith('/companies/company-123/true');
    });
  });
});