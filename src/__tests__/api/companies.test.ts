/**
 * Test suite for Companies API module
 * Tests all company-related API endpoints and data fetching
 */

// Mock the core API module FIRST before imports
jest.mock('../../api/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiDelete: jest.fn(),
}));

import {
  getTopCompanies,
  getCompanyById,
  getCompanyByName,
  getCompanyCauses,
  getAllCompanies,
  addCompany,
  deleteCompany
} from '../../api/companies';

import { apiGet, apiPost, apiDelete } from '../../api/api';
import { Company } from '../../types/companies/Company';
import { TopCompany } from '../../types/companies/TopCompany';
import { CompanyCause } from '../../types/companies/CompanyCause';
import { CompanyData } from '../../types/companies/CompanyData';
import { ResponseMessage } from '../../types/misc/ResponseMessage';

// Type the mocked functions
const mockApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

describe('Companies API', () => {
  // Sample test data
  const mockCompany: Company = {
    company_id: 'company-123',
    company_name: 'Test Corporation',
    description: 'A test company for unit testing',
    industry: 'Technology',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    employees: 1000,
    revenue: 5000000,
    valuation: 25000000,
    profits: 1000000,
    stock_symbol: 'TEST',
    ceo: 'Jane Doe',
    boycott_count: 25
  };

  const mockTopCompany: TopCompany = {
    rank: 1,
    company_id: 'company-456',
    company_name: 'Most Boycotted Corp',
    boycott_count: 150
  };

  const mockCompanyCause: CompanyCause = {
    cause_id: 'cause-789',
    cause_desc: 'Environmental Issues',
    boycott_count: 75
  };

  const mockCompanyData: CompanyData = {
    company: 'Advanced Test Corp',
    slug: 'advanced-test-corp',
    as_of_utc: '2024-01-01T00:00:00Z',
    summary: 'Leading technology company in the test industry',
    sector: 'Information Technology',
    hq_city: 'Seattle',
    founded_year: 2010,
    employees_est: 5000,
    key_products: ['Software', 'Hardware', 'Services'],
    stock_ticker: 'ATEST',
    website: 'https://advancedtest.com',
    notable_news_window: '2024-Q1',
    controversies_or_issues: [
      {
        title: 'Environmental Concerns',
        desc: 'Issues with waste management',
        date: '2024-01-15',
        source_url: 'https://news.example.com/environmental'
      }
    ],
    sources: [
      {
        title: 'Company Profile',
        url: 'https://finance.example.com/company-profile'
      }
    ]
  };

  const mockResponseMessage: ResponseMessage = {
    status: 200,
    message: 'Operation successful',
    devMsg: 'Company operation completed successfully'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopCompanies', () => {
    it('should fetch top companies with specified limit', async () => {
      const limit = 10;
      const mockTopCompanies = [mockTopCompany];

      mockApiGet.mockResolvedValueOnce(mockTopCompanies);

      const result = await getTopCompanies(limit);

      expect(mockApiGet).toHaveBeenCalledWith(`/companies/top/${limit}`);
      expect(result).toEqual(mockTopCompanies);
    });

    it('should handle different limit values', async () => {
      const limits = [5, 20, 50, 100];

      for (const limit of limits) {
        mockApiGet.mockResolvedValueOnce([mockTopCompany]);

        await getTopCompanies(limit);

        expect(mockApiGet).toHaveBeenCalledWith(`/companies/top/${limit}`);
      }

      expect(mockApiGet).toHaveBeenCalledTimes(limits.length);
    });

    it('should handle zero limit', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getTopCompanies(0);

      expect(mockApiGet).toHaveBeenCalledWith('/companies/top/0');
      expect(result).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      const limit = 10;
      const apiError = new Error('API request failed');

      mockApiGet.mockRejectedValueOnce(apiError);

      await expect(getTopCompanies(limit)).rejects.toThrow('API request failed');
      expect(mockApiGet).toHaveBeenCalledWith(`/companies/top/${limit}`);
    });

    it('should handle empty response', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getTopCompanies(10);

      expect(result).toEqual([]);
    });
  });

  describe('getCompanyById', () => {
    it('should fetch company by ID', async () => {
      const companyId = 'company-123';

      mockApiGet.mockResolvedValueOnce(mockCompany);

      const result = await getCompanyById(companyId);

      expect(mockApiGet).toHaveBeenCalledWith(`/companies/${companyId}`);
      expect(result).toEqual(mockCompany);
    });

    it('should handle different company ID formats', async () => {
      const companyIds = ['123', 'company-456', 'COMP_789', 'uuid-format-id'];

      for (const id of companyIds) {
        mockApiGet.mockResolvedValueOnce(mockCompany);

        await getCompanyById(id);

        expect(mockApiGet).toHaveBeenCalledWith(`/companies/${id}`);
      }

      expect(mockApiGet).toHaveBeenCalledTimes(companyIds.length);
    });

    it('should handle company not found error', async () => {
      const companyId = 'nonexistent-company';
      const notFoundError = { status: 404, message: 'Company not found' };

      mockApiGet.mockRejectedValueOnce(notFoundError);

      await expect(getCompanyById(companyId)).rejects.toEqual(notFoundError);
      expect(mockApiGet).toHaveBeenCalledWith(`/companies/${companyId}`);
    });

    it('should handle empty string ID', async () => {
      mockApiGet.mockResolvedValueOnce(mockCompany);

      await getCompanyById('');

      expect(mockApiGet).toHaveBeenCalledWith('/companies/');
    });
  });

  describe('getCompanyByName', () => {
    it('should fetch company data by name/ID', async () => {
      const companyId = 'test-company';

      mockApiGet.mockResolvedValueOnce(mockCompanyData);

      const result = await getCompanyByName(companyId);

      expect(mockApiGet).toHaveBeenCalledWith(`/companies/${companyId}`);
      expect(result).toEqual(mockCompanyData);
    });

    it('should handle special characters in company name', async () => {
      const specialNames = ['company-with-dashes', 'company_with_underscores', 'company%20with%20spaces'];

      for (const name of specialNames) {
        mockApiGet.mockResolvedValueOnce(mockCompanyData);

        await getCompanyByName(name);

        expect(mockApiGet).toHaveBeenCalledWith(`/companies/${name}`);
      }
    });

    it('should return CompanyData type with full details', async () => {
      const companyId = 'detailed-company';

      mockApiGet.mockResolvedValueOnce(mockCompanyData);

      const result = await getCompanyByName(companyId);

      expect(result).toHaveProperty('company');
      expect(result).toHaveProperty('slug');
      expect(result).toHaveProperty('controversies_or_issues');
      expect(result).toHaveProperty('sources');
      expect(Array.isArray(result.key_products)).toBe(true);
    });
  });

  describe('getCompanyCauses', () => {
    it('should fetch causes associated with a company', async () => {
      const companyId = 'company-123';
      const mockCauses = [mockCompanyCause];

      mockApiGet.mockResolvedValueOnce(mockCauses);

      const result = await getCompanyCauses(companyId);

      expect(mockApiGet).toHaveBeenCalledWith(`/companies/${companyId}/causes`);
      expect(result).toEqual(mockCauses);
    });

    it('should handle company with multiple causes', async () => {
      const companyId = 'multi-cause-company';
      const multipleCauses = [
        { cause_id: 'cause-1', cause_desc: 'Environmental', boycott_count: 50 },
        { cause_id: 'cause-2', cause_desc: 'Labor Rights', boycott_count: 30 },
        { cause_id: 'cause-3', cause_desc: 'Privacy', boycott_count: 20 }
      ];

      mockApiGet.mockResolvedValueOnce(multipleCauses);

      const result = await getCompanyCauses(companyId);

      expect(result).toHaveLength(3);
      expect(result).toEqual(multipleCauses);
    });

    it('should handle company with no causes', async () => {
      const companyId = 'no-causes-company';

      mockApiGet.mockResolvedValueOnce([]);

      const result = await getCompanyCauses(companyId);

      expect(result).toEqual([]);
    });

    it('should handle API errors for causes', async () => {
      const companyId = 'error-company';
      const causesError = { status: 500, message: 'Internal server error' };

      mockApiGet.mockRejectedValueOnce(causesError);

      await expect(getCompanyCauses(companyId)).rejects.toEqual(causesError);
    });
  });

  describe('getAllCompanies', () => {
    it('should fetch all companies', async () => {
      const mockCompanies = [mockCompany, { ...mockCompany, company_id: 'company-456' }];

      mockApiGet.mockResolvedValueOnce(mockCompanies);

      const result = await getAllCompanies();

      expect(mockApiGet).toHaveBeenCalledWith('/companies');
      expect(result).toEqual(mockCompanies);
    });

    it('should handle large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        ...mockCompany,
        company_id: `company-${i}`,
        company_name: `Company ${i}`
      }));

      mockApiGet.mockResolvedValueOnce(largeDataset);

      const result = await getAllCompanies();

      expect(result).toHaveLength(1000);
      expect(result[0].company_id).toBe('company-0');
      expect(result[999].company_id).toBe('company-999');
    });

    it('should handle empty company list', async () => {
      mockApiGet.mockResolvedValueOnce([]);

      const result = await getAllCompanies();

      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');

      mockApiGet.mockRejectedValueOnce(networkError);

      await expect(getAllCompanies()).rejects.toThrow('Network connection failed');
    });
  });

  describe('addCompany', () => {
    it('should add a new company', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addCompany(mockCompany);

      expect(mockApiPost).toHaveBeenCalledWith('/companies', mockCompany);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle company with minimal data', async () => {
      const minimalCompany: Company = {
        company_id: 'minimal-123',
        company_name: 'Minimal Corp',
        industry: 'Unknown',
        city: 'Unknown',
        state: 'Unknown',
        zip: '00000',
        employees: 0,
        revenue: 0,
        valuation: 0,
        profits: 0,
        ceo: 'Unknown',
        boycott_count: 0
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addCompany(minimalCompany);

      expect(mockApiPost).toHaveBeenCalledWith('/companies', minimalCompany);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle company with complete data', async () => {
      const completeCompany: Company = {
        ...mockCompany,
        description: 'Complete company description',
        stock_symbol: 'FULL'
      };

      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addCompany(completeCompany);

      expect(mockApiPost).toHaveBeenCalledWith('/companies', completeCompany);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle validation errors', async () => {
      const invalidCompany = mockCompany;
      const validationError = {
        status: 400,
        message: 'Validation failed',
        devMsg: 'Company name is required'
      };

      mockApiPost.mockRejectedValueOnce(validationError);

      await expect(addCompany(invalidCompany)).rejects.toEqual(validationError);
    });

    it('should handle duplicate company errors', async () => {
      const duplicateError = {
        status: 409,
        message: 'Company already exists',
        devMsg: 'Company with this ID already exists'
      };

      mockApiPost.mockRejectedValueOnce(duplicateError);

      await expect(addCompany(mockCompany)).rejects.toEqual(duplicateError);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company by ID', async () => {
      const companyId = 'company-to-delete';
      const deleteResponse = { success: true };

      mockApiDelete.mockResolvedValueOnce(deleteResponse);

      const result = await deleteCompany(companyId);

      expect(mockApiDelete).toHaveBeenCalledWith(`/companies/${companyId}`);
      expect(result).toEqual(deleteResponse);
    });

    it('should handle different company ID formats for deletion', async () => {
      const companyIds = ['123', 'company-456', 'COMP_789'];
      const deleteResponse = { success: true };

      for (const id of companyIds) {
        mockApiDelete.mockResolvedValueOnce(deleteResponse);

        await deleteCompany(id);

        expect(mockApiDelete).toHaveBeenCalledWith(`/companies/${id}`);
      }
    });

    it('should handle company not found during deletion', async () => {
      const companyId = 'nonexistent-company';
      const notFoundError = {
        status: 404,
        message: 'Company not found for deletion'
      };

      mockApiDelete.mockRejectedValueOnce(notFoundError);

      await expect(deleteCompany(companyId)).rejects.toEqual(notFoundError);
    });

    it('should handle authorization errors for deletion', async () => {
      const companyId = 'protected-company';
      const authError = {
        status: 403,
        message: 'Insufficient permissions to delete company'
      };

      mockApiDelete.mockRejectedValueOnce(authError);

      await expect(deleteCompany(companyId)).rejects.toEqual(authError);
    });

    it('should handle server errors during deletion', async () => {
      const companyId = 'server-error-company';
      const serverError = new Error('Internal server error');

      mockApiDelete.mockRejectedValueOnce(serverError);

      await expect(deleteCompany(companyId)).rejects.toThrow('Internal server error');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete company management workflow', async () => {
      // 1. Get all companies initially
      mockApiGet.mockResolvedValueOnce([]);

      const initialCompanies = await getAllCompanies();
      expect(initialCompanies).toEqual([]);

      // 2. Add a new company
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const addResult = await addCompany(mockCompany);
      expect(addResult).toEqual(mockResponseMessage);

      // 3. Get company by ID
      mockApiGet.mockResolvedValueOnce(mockCompany);

      const retrievedCompany = await getCompanyById(mockCompany.company_id);
      expect(retrievedCompany).toEqual(mockCompany);

      // 4. Get company causes
      mockApiGet.mockResolvedValueOnce([mockCompanyCause]);

      const companyCauses = await getCompanyCauses(mockCompany.company_id);
      expect(companyCauses).toEqual([mockCompanyCause]);

      // 5. Delete the company
      mockApiDelete.mockResolvedValueOnce({ success: true });

      const deleteResult = await deleteCompany(mockCompany.company_id);
      expect(deleteResult).toEqual({ success: true });
    });

    it('should handle concurrent API calls', async () => {
      const companyIds = ['company-1', 'company-2', 'company-3'];

      // Mock concurrent responses
      companyIds.forEach(() => {
        mockApiGet.mockResolvedValueOnce(mockCompany);
      });

      // Make concurrent calls
      const promises = companyIds.map(id => getCompanyById(id));
      const results = await Promise.all(promises);

      // All should resolve successfully
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockCompany);
      });

      expect(mockApiGet).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success and error responses', async () => {
      const operations = [
        () => {
          mockApiGet.mockResolvedValueOnce(mockCompany);
          return getCompanyById('valid-company');
        },
        () => {
          mockApiGet.mockRejectedValueOnce({ status: 404, message: 'Not found' });
          return getCompanyById('invalid-company');
        },
        () => {
          mockApiPost.mockResolvedValueOnce(mockResponseMessage);
          return addCompany(mockCompany);
        }
      ];

      const results = await Promise.allSettled(operations.map(op => op()));

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');
    });
  });
});