/**
 * Test suite for LocalBoycottStore service
 * Tests local data persistence, caching, and file system operations
 */

// Mock expo-file-system FIRST before any imports
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test-directory/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

// Mock API modules
jest.mock('../../api/companies', () => ({
  getAllCompanies: jest.fn(),
}));

jest.mock('../../api/causes', () => ({
  getAllCauses: jest.fn(),
}));

import * as FileSystem from 'expo-file-system';
import { LocalBoycottStore, BoycottData } from '../../services/LocalBoycottStore';
import { getAllCompanies } from '../../api/companies';
import { getAllCauses } from '../../api/causes';
import { LocalUserBoycott } from '../../types/users/LocalUserBoycott';
import { LocalUserCause } from '../../types/users/LocalUserCause';
import { Company } from '../../types/companies/Company';
import { Cause } from '../../types/causes/Cause';

// Type the mocked functions
const mockReadAsStringAsync = FileSystem.readAsStringAsync as jest.MockedFunction<typeof FileSystem.readAsStringAsync>;
const mockWriteAsStringAsync = FileSystem.writeAsStringAsync as jest.MockedFunction<typeof FileSystem.writeAsStringAsync>;
const mockGetAllCompanies = getAllCompanies as jest.MockedFunction<typeof getAllCompanies>;
const mockGetAllCauses = getAllCauses as jest.MockedFunction<typeof getAllCauses>;

// Mock console methods to reduce test noise
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

describe('LocalBoycottStore', () => {
  // Sample test data
  const mockBoycott: LocalUserBoycott = {
    company_id: 'company-123',
    company_name: 'Test Company',
    cause_id: 'cause-456',
    cause_desc: 'Environmental Issues',
    personal_reason: 'Personal ethical concerns',
    timestamp: '2024-01-01T00:00:00Z'
  };

  const mockCause: LocalUserCause = {
    cause_id: 'cause-789',
    cause_desc: 'Worker Rights',
    timestamp: '2024-01-02T00:00:00Z'
  };

  const mockCompany: Company = {
    company_id: 'company-456',
    company_name: 'Mock Corp',
    description: 'Test company description',
    industry: 'Technology',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    employees: 1000,
    revenue: 1000000,
    valuation: 5000000,
    profits: 200000,
    stock_symbol: 'MOCK',
    ceo: 'John Doe',
    boycott_count: 5
  };

  const mockCauseData: Cause = {
    cause_id: 'cause-123',
    cause_desc: 'Climate Change',
    cause_detail: 'Environmental protection',
    supporter_count: 1500
  };

  const mockData: BoycottData = {
    user_boycotts: [mockBoycott],
    user_causes: [mockCause],
    all_companies: [mockCompany],
    all_causes: [mockCauseData],
    lastLoaded: Date.now()
  };

  const emptyData: BoycottData = {
    user_boycotts: [],
    user_causes: [],
    all_companies: [],
    all_causes: [],
    lastLoaded: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console methods
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    // Restore console methods
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  });

  describe('Data Loading', () => {
    it('should load data from file system successfully', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(mockData));

      const result = await LocalBoycottStore.load();

      expect(mockReadAsStringAsync).toHaveBeenCalledWith('file://test-directory/boycott_data.json');
      expect(result).toEqual(mockData);
    });

    it('should return empty data when file does not exist', async () => {
      mockReadAsStringAsync.mockRejectedValueOnce(new Error('File not found'));

      const result = await LocalBoycottStore.load();

      expect(result).toEqual(emptyData);
      expect(console.warn).toHaveBeenCalledWith('Boycott store load failed. Returning empty dataset.');
    });

    it('should return empty data when file contains invalid JSON', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce('invalid json content');

      const result = await LocalBoycottStore.load();

      expect(result).toEqual(emptyData);
      expect(console.warn).toHaveBeenCalledWith('Boycott store load failed. Returning empty dataset.');
    });

    it('should handle empty file gracefully', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce('');

      const result = await LocalBoycottStore.load();

      expect(result).toEqual(emptyData);
      expect(console.warn).toHaveBeenCalledWith('Boycott store load failed. Returning empty dataset.');
    });
  });

  describe('Data Saving', () => {
    it('should save data to file system successfully', async () => {
      mockWriteAsStringAsync.mockResolvedValueOnce();

      await LocalBoycottStore.save(mockData);

      expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify(mockData)
      );
      expect(console.log).toHaveBeenCalledWith('data being saved = ', mockData);
    });

    it('should handle save errors gracefully', async () => {
      mockWriteAsStringAsync.mockRejectedValueOnce(new Error('Write failed'));

      await expect(LocalBoycottStore.save(mockData)).rejects.toThrow('Write failed');
    });
  });

  describe('Boycott Management', () => {
    beforeEach(() => {
      mockReadAsStringAsync.mockResolvedValue(JSON.stringify(emptyData));
      mockWriteAsStringAsync.mockResolvedValue();
    });

    it('should add a boycott successfully', async () => {
      await LocalBoycottStore.addBoycott(mockBoycott);

      expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify({
          ...emptyData,
          user_boycotts: [mockBoycott]
        })
      );
    });

    it('should add multiple boycotts', async () => {
      const secondBoycott: LocalUserBoycott = {
        company_id: 'company-789',
        company_name: 'Another Company',
        cause_id: 'cause-999',
        cause_desc: 'Labor Issues'
      };

      // First boycott
      await LocalBoycottStore.addBoycott(mockBoycott);

      // Mock the updated data for the second call
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify({
        ...emptyData,
        user_boycotts: [mockBoycott]
      }));

      // Second boycott
      await LocalBoycottStore.addBoycott(secondBoycott);

      expect(mockWriteAsStringAsync).toHaveBeenLastCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify({
          ...emptyData,
          user_boycotts: [mockBoycott, secondBoycott]
        })
      );
    });

    it('should get boycotts successfully', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(mockData));

      const boycotts = await LocalBoycottStore.getBoycotts();

      expect(boycotts).toEqual([mockBoycott]);
    });

    it('should return empty array when no boycotts exist', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(emptyData));

      const boycotts = await LocalBoycottStore.getBoycotts();

      expect(boycotts).toEqual([]);
    });
  });

  describe('Cause Management', () => {
    beforeEach(() => {
      mockReadAsStringAsync.mockResolvedValue(JSON.stringify(emptyData));
      mockWriteAsStringAsync.mockResolvedValue();
    });

    it('should add a cause successfully', async () => {
      await LocalBoycottStore.addCause(mockCause);

      expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify({
          ...emptyData,
          user_causes: [mockCause]
        })
      );
    });

    it('should get causes successfully', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(mockData));

      const causes = await LocalBoycottStore.getCauses();

      expect(causes).toEqual([mockCause]);
    });

    it('should return empty array when no causes exist', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(emptyData));

      const causes = await LocalBoycottStore.getCauses();

      expect(causes).toEqual([]);
    });
  });

  describe('Data Clearing', () => {
    it('should clear all data using clearData method', async () => {
      mockWriteAsStringAsync.mockResolvedValueOnce();

      await LocalBoycottStore.clearData();

      expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify(emptyData)
      );
    });

    it('should clear all data using clear method', async () => {
      mockWriteAsStringAsync.mockResolvedValueOnce();

      await LocalBoycottStore.clear();

      expect(mockWriteAsStringAsync).toHaveBeenCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify(emptyData)
      );
    });
  });

  describe('Data Refresh Logic', () => {
    beforeEach(() => {
      mockWriteAsStringAsync.mockResolvedValue();
    });

    it('should indicate refresh needed when no lastLoaded timestamp', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(emptyData));

      const shouldRefresh = await LocalBoycottStore.shouldRefreshData();

      expect(shouldRefresh).toBe(true);
    });

    it('should indicate refresh needed when data is older than 1 hour', async () => {
      const oneHourAgo = Date.now() - (61 * 60 * 1000); // 61 minutes ago
      const oldData = { ...emptyData, lastLoaded: oneHourAgo };

      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(oldData));

      const shouldRefresh = await LocalBoycottStore.shouldRefreshData();

      expect(shouldRefresh).toBe(true);
    });

    it('should indicate no refresh needed when data is fresh', async () => {
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000); // 30 minutes ago
      const freshData = { ...emptyData, lastLoaded: thirtyMinutesAgo };

      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(freshData));

      const shouldRefresh = await LocalBoycottStore.shouldRefreshData();

      expect(shouldRefresh).toBe(false);
    });
  });

  describe('Companies and Causes Refresh', () => {
    beforeEach(() => {
      mockReadAsStringAsync.mockResolvedValue(JSON.stringify(emptyData));
      mockWriteAsStringAsync.mockResolvedValue();
    });

    it('should refresh companies and causes successfully', async () => {
      const mockCompanies = [mockCompany];
      const mockCauses = [mockCauseData];

      mockGetAllCompanies.mockResolvedValueOnce(mockCompanies);
      mockGetAllCauses.mockResolvedValueOnce(mockCauses);

      const beforeTime = Date.now();
      await LocalBoycottStore.refreshCompaniesAndCauses();
      const afterTime = Date.now();

      expect(mockGetAllCompanies).toHaveBeenCalledTimes(1);
      expect(mockGetAllCauses).toHaveBeenCalledTimes(1);

      const savedData = JSON.parse(mockWriteAsStringAsync.mock.calls[0][1]);
      expect(savedData.all_companies).toEqual(mockCompanies);
      expect(savedData.all_causes).toEqual(mockCauses);
      expect(savedData.lastLoaded).toBeGreaterThanOrEqual(beforeTime);
      expect(savedData.lastLoaded).toBeLessThanOrEqual(afterTime);
    });

    it('should handle refresh errors gracefully', async () => {
      mockGetAllCompanies.mockRejectedValueOnce(new Error('API Error'));
      mockGetAllCauses.mockResolvedValueOnce([mockCauseData]);

      await LocalBoycottStore.refreshCompaniesAndCauses();

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to refresh companies and causes:',
        expect.any(Error)
      );
    });

    it('should check and refresh when needed', async () => {
      // Mock shouldRefreshData to return true
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(emptyData)); // for shouldRefreshData
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(emptyData)); // for refreshCompaniesAndCauses

      mockGetAllCompanies.mockResolvedValueOnce([mockCompany]);
      mockGetAllCauses.mockResolvedValueOnce([mockCauseData]);

      await LocalBoycottStore.checkAndRefreshIfNeeded();

      expect(mockGetAllCompanies).toHaveBeenCalledTimes(1);
      expect(mockGetAllCauses).toHaveBeenCalledTimes(1);
    });

    it('should not refresh when data is fresh', async () => {
      const freshData = { ...emptyData, lastLoaded: Date.now() - (30 * 60 * 1000) };
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(freshData));

      await LocalBoycottStore.checkAndRefreshIfNeeded();

      expect(mockGetAllCompanies).not.toHaveBeenCalled();
      expect(mockGetAllCauses).not.toHaveBeenCalled();
    });
  });

  describe('Data Retrieval', () => {
    it('should get all companies successfully', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(mockData));

      const companies = await LocalBoycottStore.getAllCompanies();

      expect(companies).toEqual([mockCompany]);
    });

    it('should get all causes successfully', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(mockData));

      const causes = await LocalBoycottStore.getAllCauses();

      expect(causes).toEqual([mockCauseData]);
    });

    it('should return empty arrays when no data exists', async () => {
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(emptyData));

      const companies = await LocalBoycottStore.getAllCompanies();
      const causes = await LocalBoycottStore.getAllCauses();

      expect(companies).toEqual([]);
      expect(causes).toEqual([]);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete workflow: load -> add boycott -> add cause -> save', async () => {
      // Start with empty data
      mockReadAsStringAsync.mockResolvedValue(JSON.stringify(emptyData));
      mockWriteAsStringAsync.mockResolvedValue();

      // Add boycott
      await LocalBoycottStore.addBoycott(mockBoycott);

      // Mock updated data for next load
      const dataWithBoycott = { ...emptyData, user_boycotts: [mockBoycott] };
      mockReadAsStringAsync.mockResolvedValueOnce(JSON.stringify(dataWithBoycott));

      // Add cause
      await LocalBoycottStore.addCause(mockCause);

      // Verify final state
      expect(mockWriteAsStringAsync).toHaveBeenLastCalledWith(
        'file://test-directory/boycott_data.json',
        JSON.stringify({
          ...emptyData,
          user_boycotts: [mockBoycott],
          user_causes: [mockCause]
        })
      );
    });

    it('should handle concurrent operations gracefully', async () => {
      mockReadAsStringAsync.mockResolvedValue(JSON.stringify(emptyData));
      mockWriteAsStringAsync.mockResolvedValue();

      // Simulate concurrent add operations
      const promises = [
        LocalBoycottStore.addBoycott(mockBoycott),
        LocalBoycottStore.addCause(mockCause)
      ];

      await Promise.all(promises);

      // Both operations should complete successfully
      expect(mockWriteAsStringAsync).toHaveBeenCalledTimes(2);
    });
  });
});