/**
 * Test suite for Causes API module
 * Tests all cause-related API endpoints including top causes, cause details, and cause-company relationships
 */

// Mock the core API module FIRST before imports
jest.mock('../../api/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
}));

import {
  getTopCauses,
  getAllCauses,
  addCause,
  getCauseCompanies,
  getCauseDetails,
} from '../../api/causes';

import { apiGet, apiPost } from '../../api/api';
import { Cause } from '../../types/causes/Cause';
import { TopCause } from '../../types/causes/TopCause';
import { CauseCompanyStats } from '../../types/causecompanystats/CauseCompanyStats';
import { ResponseMessage } from '../../types/misc';

// Type the mocked functions
const mockApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe('Causes API', () => {
  // Sample test data
  const mockCause: Cause = {
    cause_id: 'cause-123',
    cause_desc: 'Environmental Protection',
    cause_detail: 'Fighting climate change and protecting natural resources',
    supporter_count: 1500
  };

  const mockTopCause: TopCause = {
    cause_id: 'cause-456',
    cause_desc: 'Labor Rights',
    supporter_count: 2000,
    rank: 1
  };

  const mockCauseCompanyStats: CauseCompanyStats = {
    cause_id: 'cause-123',
    company_id: 'company-789',
    company_name: 'Test Corp',
    boycott_count: 250,
    cause_desc: 'Environmental Protection'
  };

  const mockResponseMessage: ResponseMessage = {
    message: 'Cause added successfully'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Top Causes', () => {
    it('should get top causes with specified limit', async () => {
      const mockTopCauses = [mockTopCause];
      mockApiGet.mockResolvedValueOnce(mockTopCauses);

      const result = await getTopCauses(10);

      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/10');
      expect(result).toEqual(mockTopCauses);
    });

    it('should get top causes with different limits', async () => {
      const mockTopCauses = [mockTopCause];
      mockApiGet.mockResolvedValueOnce(mockTopCauses);

      await getTopCauses(5);
      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/5');

      await getTopCauses(20);
      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/20');

      await getTopCauses(1);
      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/1');
    });

    it('should handle zero limit for top causes', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getTopCauses(0);

      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/0');
      expect(result).toEqual([]);
    });

    it('should handle large limit for top causes', async () => {
      const mockTopCauses = Array.from({ length: 100 }, (_, i) => ({
        ...mockTopCause,
        cause_id: `cause-${i}`,
        rank: i + 1
      }));
      mockApiGet.mockResolvedValueOnce(mockTopCauses);

      const result = await getTopCauses(100);

      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/100');
      expect(result).toEqual(mockTopCauses);
    });

    it('should handle top causes API errors', async () => {
      const errorResponse = { error: 'Failed to fetch top causes' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getTopCauses(10)).rejects.toEqual(errorResponse);
      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/10');
    });

    it('should handle empty top causes response', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getTopCauses(10);

      expect(result).toEqual([]);
    });
  });

  describe('All Causes', () => {
    it('should get all causes', async () => {
      const mockCauses = [mockCause];
      mockApiGet.mockResolvedValueOnce(mockCauses);

      const result = await getAllCauses();

      expect(mockApiGet).toHaveBeenCalledWith('/causes');
      expect(result).toEqual(mockCauses);
    });

    it('should handle multiple causes', async () => {
      const mockCauses = [
        mockCause,
        {
          ...mockCause,
          cause_id: 'cause-456',
          cause_desc: 'Labor Rights',
          supporter_count: 1200
        },
        {
          ...mockCause,
          cause_id: 'cause-789',
          cause_desc: 'Animal Welfare',
          supporter_count: 800
        }
      ];
      mockApiGet.mockResolvedValueOnce(mockCauses);

      const result = await getAllCauses();

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockCauses);
    });

    it('should handle empty causes list', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getAllCauses();

      expect(result).toEqual([]);
    });

    it('should handle getAllCauses API errors', async () => {
      const errorResponse = { error: 'Database connection failed' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getAllCauses()).rejects.toEqual(errorResponse);
    });
  });

  describe('Cause Details', () => {
    it('should get cause details by ID', async () => {
      mockApiGet.mockResolvedValueOnce(mockCause);

      const result = await getCauseDetails('cause-123');

      expect(mockApiGet).toHaveBeenCalledWith('/causes/cause-123');
      expect(result).toEqual(mockCause);
    });

    it('should handle different cause IDs', async () => {
      const causes = ['cause-123', 'cause-456', 'cause-789'];

      for (const causeId of causes) {
        mockApiGet.mockResolvedValueOnce({ ...mockCause, cause_id: causeId });

        const result = await getCauseDetails(causeId);

        expect(mockApiGet).toHaveBeenCalledWith(`/causes/${causeId}`);
        expect(result.cause_id).toBe(causeId);
      }
    });

    it('should handle cause not found', async () => {
      const errorResponse = { error: 'Cause not found', status: 404 };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getCauseDetails('nonexistent-cause')).rejects.toEqual(errorResponse);
    });

    it('should handle empty string cause ID', async () => {
      mockApiGet.mockResolvedValueOnce(mockCause);

      await getCauseDetails('');

      expect(mockApiGet).toHaveBeenCalledWith('/causes/');
    });

    it('should handle special characters in cause ID', async () => {
      const specialCauseId = 'cause-123@#$%';
      mockApiGet.mockResolvedValueOnce(mockCause);

      await getCauseDetails(specialCauseId);

      expect(mockApiGet).toHaveBeenCalledWith(`/causes/${specialCauseId}`);
    });
  });

  describe('Add Cause', () => {
    it('should add a new cause', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addCause(mockCause);

      expect(mockApiPost).toHaveBeenCalledWith('/causes', mockCause);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle cause creation with all fields', async () => {
      const completeCause: Cause = {
        cause_id: 'cause-new',
        cause_desc: 'Digital Privacy',
        cause_detail: 'Protecting user privacy and data rights in the digital age',
        supporter_count: 0
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addCause(completeCause);

      expect(mockApiPost).toHaveBeenCalledWith('/causes', completeCause);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle cause creation errors', async () => {
      const errorResponse = { error: 'Cause already exists' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(addCause(mockCause)).rejects.toEqual(errorResponse);
    });

    it('should handle validation errors', async () => {
      const invalidCause = { ...mockCause, cause_desc: '' };
      const validationError = { error: 'Cause description is required' };
      mockApiPost.mockRejectedValueOnce(validationError);

      await expect(addCause(invalidCause)).rejects.toEqual(validationError);
    });

    it('should handle duplicate cause creation', async () => {
      const duplicateError = { error: 'Cause with this ID already exists', status: 409 };
      mockApiPost.mockRejectedValueOnce(duplicateError);

      await expect(addCause(mockCause)).rejects.toEqual(duplicateError);
    });
  });

  describe('Cause Companies', () => {
    it('should get companies associated with a cause', async () => {
      const mockCauseCompanyStatsList = [mockCauseCompanyStats];
      mockApiGet.mockResolvedValueOnce(mockCauseCompanyStatsList);

      const result = await getCauseCompanies('cause-123');

      expect(mockApiGet).toHaveBeenCalledWith('/causes/cause-123/companies');
      expect(result).toEqual(mockCauseCompanyStatsList);
    });

    it('should handle multiple companies for a cause', async () => {
      const mockCompanyStats = [
        mockCauseCompanyStats,
        {
          ...mockCauseCompanyStats,
          company_id: 'company-456',
          company_name: 'Another Corp',
          boycott_count: 150
        },
        {
          ...mockCauseCompanyStats,
          company_id: 'company-789',
          company_name: 'Third Corp',
          boycott_count: 300
        }
      ];
      mockApiGet.mockResolvedValueOnce(mockCompanyStats);

      const result = await getCauseCompanies('cause-123');

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockCompanyStats);
    });

    it('should handle cause with no associated companies', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getCauseCompanies('cause-no-companies');

      expect(result).toEqual([]);
    });

    it('should handle cause companies API errors', async () => {
      const errorResponse = { error: 'Cause not found' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getCauseCompanies('nonexistent-cause')).rejects.toEqual(errorResponse);
    });

    it('should handle different cause IDs for company lookup', async () => {
      const causeIds = ['cause-123', 'cause-456', 'cause-789'];

      for (const causeId of causeIds) {
        mockApiGet.mockResolvedValueOnce([{ ...mockCauseCompanyStats, cause_id: causeId }]);

        const result = await getCauseCompanies(causeId);

        expect(mockApiGet).toHaveBeenCalledWith(`/causes/${causeId}/companies`);
        expect(result[0].cause_id).toBe(causeId);
      }
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle network timeouts', async () => {
      const networkError = new Error('Network timeout');
      mockApiGet.mockRejectedValueOnce(networkError);

      await expect(getAllCauses()).rejects.toThrow('Network timeout');
    });

    it('should handle server errors', async () => {
      const serverError = { status: 500, message: 'Internal server error' };
      mockApiGet.mockRejectedValueOnce(serverError);

      await expect(getCauseDetails('cause-123')).rejects.toEqual(serverError);
    });

    it('should handle malformed response data', async () => {
      const malformedData = { invalid_field: 'test' };
      mockApiGet.mockResolvedValueOnce(malformedData);

      const result = await getCauseDetails('cause-123');

      expect(result).toEqual(malformedData);
    });

    it('should handle negative limit for top causes', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getTopCauses(-1);

      expect(mockApiGet).toHaveBeenCalledWith('/causes/top/-1');
      expect(result).toEqual([]);
    });

    it('should handle very large numbers', async () => {
      const largeLimit = 999999;
      mockApiGet.mockResolvedValueOnce([]);

      await getTopCauses(largeLimit);

      expect(mockApiGet).toHaveBeenCalledWith(`/causes/top/${largeLimit}`);
    });

    it('should handle null and undefined parameters', async () => {
      mockApiGet.mockResolvedValueOnce(mockCause);

      // Test with undefined (TypeScript won't allow null, but runtime might)
      await getCauseDetails(undefined as any);
      expect(mockApiGet).toHaveBeenCalledWith('/causes/undefined');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete cause discovery workflow', async () => {
      // Get all causes
      mockApiGet.mockResolvedValueOnce([mockCause]);
      const allCauses = await getAllCauses();
      expect(allCauses).toEqual([mockCause]);

      // Get top causes
      mockApiGet.mockResolvedValueOnce([mockTopCause]);
      const topCauses = await getTopCauses(5);
      expect(topCauses).toEqual([mockTopCause]);

      // Get specific cause details
      mockApiGet.mockResolvedValueOnce(mockCause);
      const causeDetails = await getCauseDetails(mockCause.cause_id);
      expect(causeDetails).toEqual(mockCause);

      // Get companies for this cause
      mockApiGet.mockResolvedValueOnce([mockCauseCompanyStats]);
      const causeCompanies = await getCauseCompanies(mockCause.cause_id);
      expect(causeCompanies).toEqual([mockCauseCompanyStats]);
    });

    it('should handle cause creation and retrieval workflow', async () => {
      const newCause: Cause = {
        cause_id: 'cause-new',
        cause_desc: 'Tech Ethics',
        cause_detail: 'Promoting ethical practices in technology',
        supporter_count: 0
      };

      // Add new cause
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);
      const addResult = await addCause(newCause);
      expect(addResult).toEqual(mockResponseMessage);

      // Verify cause was added by retrieving it
      mockApiGet.mockResolvedValueOnce(newCause);
      const retrievedCause = await getCauseDetails(newCause.cause_id);
      expect(retrievedCause).toEqual(newCause);

      // Check if it appears in all causes
      mockApiGet.mockResolvedValueOnce([mockCause, newCause]);
      const allCauses = await getAllCauses();
      expect(allCauses).toContain(newCause);
    });

    it('should handle concurrent API calls', async () => {
      // Setup mocks for parallel calls
      mockApiGet.mockResolvedValueOnce([mockCause]); // getAllCauses
      mockApiGet.mockResolvedValueOnce([mockTopCause]); // getTopCauses
      mockApiGet.mockResolvedValueOnce(mockCause); // getCauseDetails

      // Make concurrent calls
      const [allCauses, topCauses, causeDetails] = await Promise.all([
        getAllCauses(),
        getTopCauses(10),
        getCauseDetails('cause-123')
      ]);

      expect(allCauses).toEqual([mockCause]);
      expect(topCauses).toEqual([mockTopCause]);
      expect(causeDetails).toEqual(mockCause);
    });
  });
});