/**
 * Test suite for Company interface
 *
 * Tests data structure validation, type safety, and business logic constraints
 * for the Company interface used throughout the BoycottPro application.
 */

import { Company } from '../../../types/companies/Company';

describe('Company Interface', () => {
  describe('Required Fields', () => {
    it('should accept valid company with all required fields', () => {
      const validCompany: Company = {
        company_id: 'comp_123',
        company_name: 'Test Corporation',
        industry: 'Technology',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        employees: 1000,
        revenue: 50000000,
        valuation: 100000000,
        profits: 5000000,
        ceo: 'John Doe',
        boycott_count: 5
      };

      expect(validCompany.company_id).toBe('comp_123');
      expect(validCompany.company_name).toBe('Test Corporation');
      expect(validCompany.industry).toBe('Technology');
      expect(validCompany.city).toBe('San Francisco');
      expect(validCompany.state).toBe('CA');
      expect(validCompany.zip).toBe('94102');
      expect(validCompany.employees).toBe(1000);
      expect(validCompany.revenue).toBe(50000000);
      expect(validCompany.valuation).toBe(100000000);
      expect(validCompany.profits).toBe(5000000);
      expect(validCompany.ceo).toBe('John Doe');
      expect(validCompany.boycott_count).toBe(5);
    });

    it('should handle company with optional fields included', () => {
      const companyWithOptionals: Company = {
        company_id: 'comp_456',
        company_name: 'Tech Innovators Inc',
        description: 'A leading technology company specializing in innovative solutions',
        industry: 'Software',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        employees: 2500,
        revenue: 125000000,
        valuation: 500000000,
        profits: 15000000,
        stock_symbol: 'TECH',
        ceo: 'Jane Smith',
        boycott_count: 12
      };

      expect(companyWithOptionals.description).toBe('A leading technology company specializing in innovative solutions');
      expect(companyWithOptionals.stock_symbol).toBe('TECH');
    });

    it('should handle company without optional fields', () => {
      const companyMinimal: Company = {
        company_id: 'comp_789',
        company_name: 'Minimal Corp',
        industry: 'Manufacturing',
        city: 'Detroit',
        state: 'MI',
        zip: '48201',
        employees: 500,
        revenue: 25000000,
        valuation: 40000000,
        profits: 2000000,
        ceo: 'Bob Johnson',
        boycott_count: 0
      };

      expect(companyMinimal.description).toBeUndefined();
      expect(companyMinimal.stock_symbol).toBeUndefined();
      expect(companyMinimal.boycott_count).toBe(0);
    });
  });

  describe('Data Types', () => {
    it('should enforce string types for text fields', () => {
      const company: Company = {
        company_id: 'comp_001',
        company_name: 'String Test Co',
        industry: 'Testing',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        employees: 100,
        revenue: 1000000,
        valuation: 2000000,
        profits: 100000,
        ceo: 'Test CEO',
        boycott_count: 1
      };

      expect(typeof company.company_id).toBe('string');
      expect(typeof company.company_name).toBe('string');
      expect(typeof company.industry).toBe('string');
      expect(typeof company.city).toBe('string');
      expect(typeof company.state).toBe('string');
      expect(typeof company.zip).toBe('string');
      expect(typeof company.ceo).toBe('string');
    });

    it('should enforce number types for numeric fields', () => {
      const company: Company = {
        company_id: 'comp_002',
        company_name: 'Number Test Co',
        industry: 'Finance',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        employees: 5000,
        revenue: 500000000,
        valuation: 1000000000,
        profits: 50000000,
        ceo: 'Finance CEO',
        boycott_count: 25
      };

      expect(typeof company.employees).toBe('number');
      expect(typeof company.revenue).toBe('number');
      expect(typeof company.valuation).toBe('number');
      expect(typeof company.profits).toBe('number');
      expect(typeof company.boycott_count).toBe('number');
    });
  });

  describe('Business Logic Validation', () => {
    it('should handle zero values appropriately', () => {
      const startupCompany: Company = {
        company_id: 'startup_001',
        company_name: 'New Startup',
        industry: 'Technology',
        city: 'Silicon Valley',
        state: 'CA',
        zip: '94301',
        employees: 5,
        revenue: 0,
        valuation: 1000000,
        profits: -100000, // Startups can have negative profits
        ceo: 'Founder Name',
        boycott_count: 0
      };

      expect(startupCompany.revenue).toBe(0);
      expect(startupCompany.boycott_count).toBe(0);
      expect(startupCompany.profits).toBe(-100000);
    });

    it('should handle large enterprise values', () => {
      const enterpriseCompany: Company = {
        company_id: 'enterprise_001',
        company_name: 'Global Mega Corp',
        industry: 'Conglomerate',
        city: 'New York',
        state: 'NY',
        zip: '10005',
        employees: 500000,
        revenue: 500000000000, // 500 billion
        valuation: 2000000000000, // 2 trillion
        profits: 50000000000, // 50 billion
        ceo: 'Enterprise CEO',
        boycott_count: 1000
      };

      expect(enterpriseCompany.employees).toBe(500000);
      expect(enterpriseCompany.revenue).toBe(500000000000);
      expect(enterpriseCompany.valuation).toBe(2000000000000);
      expect(enterpriseCompany.boycott_count).toBe(1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values where appropriate', () => {
      const companyWithEmptyStrings: Company = {
        company_id: 'comp_empty',
        company_name: '',
        description: '',
        industry: '',
        city: '',
        state: '',
        zip: '',
        employees: 0,
        revenue: 0,
        valuation: 0,
        profits: 0,
        stock_symbol: '',
        ceo: '',
        boycott_count: 0
      };

      expect(companyWithEmptyStrings.company_name).toBe('');
      expect(companyWithEmptyStrings.description).toBe('');
      expect(companyWithEmptyStrings.stock_symbol).toBe('');
    });

    it('should handle special characters in text fields', () => {
      const companyWithSpecialChars: Company = {
        company_id: 'comp_special_123',
        company_name: 'Café & Co™',
        description: 'A company with "special" characters & symbols',
        industry: 'Food & Beverage',
        city: 'São Paulo',
        state: 'SP',
        zip: '01310-100',
        employees: 250,
        revenue: 10000000,
        valuation: 25000000,
        profits: 1500000,
        stock_symbol: 'CAFÉ',
        ceo: 'José María',
        boycott_count: 3
      };

      expect(companyWithSpecialChars.company_name).toContain('™');
      expect(companyWithSpecialChars.description).toContain('"special"');
      expect(companyWithSpecialChars.city).toBe('São Paulo');
      expect(companyWithSpecialChars.ceo).toBe('José María');
    });
  });

  describe('Array Creation and Manipulation', () => {
    it('should work in arrays and collections', () => {
      const companies: Company[] = [
        {
          company_id: 'array_1',
          company_name: 'First Company',
          industry: 'Tech',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          employees: 1000,
          revenue: 50000000,
          valuation: 100000000,
          profits: 5000000,
          ceo: 'CEO One',
          boycott_count: 5
        },
        {
          company_id: 'array_2',
          company_name: 'Second Company',
          industry: 'Finance',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
          employees: 2000,
          revenue: 75000000,
          valuation: 150000000,
          profits: 7500000,
          ceo: 'CEO Two',
          boycott_count: 10
        }
      ];

      expect(companies).toHaveLength(2);
      expect(companies[0].company_name).toBe('First Company');
      expect(companies[1].company_name).toBe('Second Company');

      // Test array operations
      const techCompanies = companies.filter(c => c.industry === 'Tech');
      expect(techCompanies).toHaveLength(1);
      expect(techCompanies[0].company_id).toBe('array_1');
    });

    it('should support mapping and transformation operations', () => {
      const companies: Company[] = [
        {
          company_id: 'map_1',
          company_name: 'MapTest One',
          industry: 'Technology',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          employees: 500,
          revenue: 25000000,
          valuation: 50000000,
          profits: 2500000,
          ceo: 'Map CEO One',
          boycott_count: 2
        },
        {
          company_id: 'map_2',
          company_name: 'MapTest Two',
          industry: 'Healthcare',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          employees: 750,
          revenue: 40000000,
          valuation: 80000000,
          profits: 4000000,
          ceo: 'Map CEO Two',
          boycott_count: 8
        }
      ];

      // Test mapping to extract specific fields
      const companyNames = companies.map(c => c.company_name);
      expect(companyNames).toEqual(['MapTest One', 'MapTest Two']);

      // Test reduce operation
      const totalEmployees = companies.reduce((sum, c) => sum + c.employees, 0);
      expect(totalEmployees).toBe(1250);

      // Test sorting
      const sortedByBoycotts = companies.sort((a, b) => b.boycott_count - a.boycott_count);
      expect(sortedByBoycotts[0].company_name).toBe('MapTest Two');
    });
  });
});