/**
 * Test suite for Misc API module
 * Tests miscellaneous utility API endpoints including boycott update submissions
 */

// Mock the core API module FIRST before imports
jest.mock('../../api/api', () => ({
  apiPost: jest.fn(),
}));

import { submitBoycottUpdate } from '../../api/misc';
import { apiPost } from '../../api/api';
import { ResponseMessage } from '../../types/misc';
import { UpdateReasonsForm } from '../../types/users';

// Type the mocked functions
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

// Mock console methods to reduce test noise
const originalConsoleError = console.error;

describe('Misc API', () => {
  const mockResponseMessage: ResponseMessage = {
    message: 'Boycott update submitted successfully'
  };

  const mockUpdateReasonsForm: UpdateReasonsForm = {
    company_id: 'company-123',
    cause_id: 'cause-456',
    reasons: ['environmental concerns', 'labor practices'],
    action_type: 'boycott',
    notes: 'Additional details about the boycott decision'
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

  describe('submitBoycottUpdate', () => {
    it('should submit boycott update successfully', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(mockUpdateReasonsForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', mockUpdateReasonsForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle complete boycott update form', async () => {
      const completeForm: UpdateReasonsForm = {
        company_id: 'company-xyz',
        cause_id: 'cause-environmental',
        reasons: ['climate change', 'pollution', 'resource depletion'],
        action_type: 'boycott',
        notes: 'Comprehensive environmental boycott for climate action',
        user_id: 'user-789',
        intensity: 'high',
        duration: '12 months'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(completeForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', completeForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle support action type', async () => {
      const supportForm: UpdateReasonsForm = {
        company_id: 'company-abc',
        cause_id: 'cause-social',
        reasons: ['ethical practices', 'community support'],
        action_type: 'support',
        notes: 'Supporting company for positive social impact'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(supportForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', supportForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle minimal required fields', async () => {
      const minimalForm: UpdateReasonsForm = {
        company_id: 'company-min',
        cause_id: 'cause-min',
        reasons: ['basic reason'],
        action_type: 'boycott'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(minimalForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', minimalForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle empty reasons array', async () => {
      const formWithEmptyReasons: UpdateReasonsForm = {
        company_id: 'company-empty',
        cause_id: 'cause-empty',
        reasons: [],
        action_type: 'boycott',
        notes: 'Form with empty reasons array'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(formWithEmptyReasons);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', formWithEmptyReasons);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle multiple detailed reasons', async () => {
      const detailedForm: UpdateReasonsForm = {
        company_id: 'company-detailed',
        cause_id: 'cause-detailed',
        reasons: [
          'Environmental impact: carbon emissions',
          'Labor practices: worker rights violations',
          'Supply chain: unethical sourcing',
          'Corporate governance: lack of transparency',
          'Community impact: negative local effects'
        ],
        action_type: 'boycott',
        notes: 'Comprehensive boycott based on multiple ethical concerns',
        intensity: 'maximum',
        duration: 'indefinite'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(detailedForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', detailedForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle special characters in form data', async () => {
      const specialCharForm: UpdateReasonsForm = {
        company_id: 'company-123@#$%',
        cause_id: 'cause-456!@#',
        reasons: ['reason with special chars: !@#$%^&*()'],
        action_type: 'boycott',
        notes: 'Notes with émojis 🚫 and spéciàl characters ñ'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(specialCharForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', specialCharForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle API errors', async () => {
      const apiError = { message: 'Company not found' };
      mockApiPost.mockRejectedValueOnce(apiError);

      await expect(submitBoycottUpdate(mockUpdateReasonsForm)).rejects.toEqual(apiError);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', mockUpdateReasonsForm);
    });

    it('should handle validation errors', async () => {
      const validationError = {
        message: 'Validation failed',
        errors: ['company_id is required', 'cause_id is required']
      };
      mockApiPost.mockRejectedValueOnce(validationError);

      await expect(submitBoycottUpdate(mockUpdateReasonsForm)).rejects.toEqual(validationError);
    });

    it('should handle server errors', async () => {
      const serverError = { status: 500, message: 'Internal server error' };
      mockApiPost.mockRejectedValueOnce(serverError);

      await expect(submitBoycottUpdate(mockUpdateReasonsForm)).rejects.toEqual(serverError);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      mockApiPost.mockRejectedValueOnce(networkError);

      await expect(submitBoycottUpdate(mockUpdateReasonsForm)).rejects.toThrow('Network timeout');
    });

    it('should handle authentication errors', async () => {
      const authError = { status: 401, message: 'Unauthorized' };
      mockApiPost.mockRejectedValueOnce(authError);

      await expect(submitBoycottUpdate(mockUpdateReasonsForm)).rejects.toEqual(authError);
    });

    it('should handle forbidden errors', async () => {
      const forbiddenError = { status: 403, message: 'Forbidden' };
      mockApiPost.mockRejectedValueOnce(forbiddenError);

      await expect(submitBoycottUpdate(mockUpdateReasonsForm)).rejects.toEqual(forbiddenError);
    });

    it('should handle empty string values', async () => {
      const emptyStringForm: UpdateReasonsForm = {
        company_id: '',
        cause_id: '',
        reasons: [''],
        action_type: 'boycott',
        notes: ''
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(emptyStringForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', emptyStringForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle undefined optional fields', async () => {
      const formWithUndefined: UpdateReasonsForm = {
        company_id: 'company-123',
        cause_id: 'cause-456',
        reasons: ['test reason'],
        action_type: 'boycott',
        notes: undefined,
        user_id: undefined,
        intensity: undefined,
        duration: undefined
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(formWithUndefined);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', formWithUndefined);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle very long text fields', async () => {
      const longTextForm: UpdateReasonsForm = {
        company_id: 'company-long',
        cause_id: 'cause-long',
        reasons: [
          'This is a very long reason that exceeds typical input lengths to test how the API handles extended text content in the reasons field'.repeat(5)
        ],
        action_type: 'boycott',
        notes: 'This is a very long notes field that contains extensive details about the boycott decision including background information, specific incidents, and future intentions'.repeat(10)
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await submitBoycottUpdate(longTextForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', longTextForm);
      expect(result).toEqual(mockResponseMessage);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle sequential boycott update submissions', async () => {
      const forms = [
        { ...mockUpdateReasonsForm, company_id: 'company-1' },
        { ...mockUpdateReasonsForm, company_id: 'company-2' },
        { ...mockUpdateReasonsForm, company_id: 'company-3' }
      ];

      for (const form of forms) {
        mockApiPost.mockResolvedValueOnce(mockResponseMessage);

        const result = await submitBoycottUpdate(form);

        expect(mockApiPost).toHaveBeenCalledWith('/users/companies/causes', form);
        expect(result).toEqual(mockResponseMessage);
      }

      expect(mockApiPost).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent boycott update submissions', async () => {
      const forms = [
        { ...mockUpdateReasonsForm, company_id: 'company-concurrent-1' },
        { ...mockUpdateReasonsForm, company_id: 'company-concurrent-2' },
        { ...mockUpdateReasonsForm, company_id: 'company-concurrent-3' }
      ];

      // Setup mocks for parallel calls
      forms.forEach(() => {
        mockApiPost.mockResolvedValueOnce(mockResponseMessage);
      });

      // Make concurrent calls
      const results = await Promise.all(
        forms.map(form => submitBoycottUpdate(form))
      );

      results.forEach(result => {
        expect(result).toEqual(mockResponseMessage);
      });

      expect(mockApiPost).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success and failure scenarios', async () => {
      const form1 = { ...mockUpdateReasonsForm, company_id: 'company-success' };
      const form2 = { ...mockUpdateReasonsForm, company_id: 'company-fail' };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);
      mockApiPost.mockRejectedValueOnce({ message: 'Company not found' });

      // First call should succeed
      const result1 = await submitBoycottUpdate(form1);
      expect(result1).toEqual(mockResponseMessage);

      // Second call should fail
      await expect(submitBoycottUpdate(form2)).rejects.toEqual({ message: 'Company not found' });
    });
  });
});