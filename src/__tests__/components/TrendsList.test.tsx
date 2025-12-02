/**
 * Test suite for TrendsList component
 * Tests FlatList-based trends component with companies/causes and deduplication
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TrendsList, { deDuplicate, Item } from '../../components/companiesOrCauses/TrendsList';

// Mock screen dimensions utility
jest.mock('../../components/screenDimensionsutilitiy', () => ({
  sw: 100,
}));

describe('TrendsList Component', () => {
  const mockCompanyItems: Item[] = [
    {
      company_id: 'comp1',
      company_name: 'Apple Inc.',
      boycott_count: 1500,
      rank: 1,
    },
    {
      company_id: 'comp2',
      company_name: 'Microsoft Corp.',
      boycott_count: 850,
      rank: 2,
    },
  ];

  const mockCauseItems: Item[] = [
    {
      cause_id: 'cause1',
      cause_desc: 'Environmental Protection',
      follower_count: 2500,
      rank: 1,
    },
    {
      cause_id: 'cause2',
      cause_desc: 'Workers Rights',
      follower_count: 1200,
      rank: 2,
    },
  ];

  const defaultProps = {
    items: mockCompanyItems,
    onSelectCompany: jest.fn(),
    onSelectCause: jest.fn(),
    onDeleteCompany: jest.fn(),
    onDeleteCause: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the component', () => {
      const { UNSAFE_root } = render(<TrendsList {...defaultProps} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render company items', () => {
      const { getByText } = render(<TrendsList {...defaultProps} />);

      expect(getByText('Apple Inc.')).toBeTruthy();
      expect(getByText('Microsoft Corp.')).toBeTruthy();
    });

    it('should render cause items', () => {
      const { getByText } = render(
        <TrendsList {...defaultProps} items={mockCauseItems} />
      );

      expect(getByText('Environmental Protection')).toBeTruthy();
      expect(getByText('Workers Rights')).toBeTruthy();
    });

    it('should render rank numbers when provided', () => {
      const { getByText } = render(<TrendsList {...defaultProps} />);

      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
    });
  });

  describe('Item Selection', () => {
    it('should call onSelectCompany when company item is pressed', () => {
      const mockOnSelectCompany = jest.fn();
      const { getByText } = render(
        <TrendsList
          {...defaultProps}
          onSelectCompany={mockOnSelectCompany}
        />
      );

      fireEvent.press(getByText('Apple Inc.'));
      expect(mockOnSelectCompany).toHaveBeenCalledWith('comp1');
    });

    it('should call onSelectCause when cause item is pressed', () => {
      const mockOnSelectCause = jest.fn();
      const { getByText } = render(
        <TrendsList
          {...defaultProps}
          items={mockCauseItems}
          onSelectCause={mockOnSelectCause}
        />
      );

      fireEvent.press(getByText('Environmental Protection'));
      expect(mockOnSelectCause).toHaveBeenCalledWith('cause1');
    });

    it('should not crash when selection handlers are not provided', () => {
      const { getByText } = render(
        <TrendsList
          items={mockCompanyItems}
        />
      );

      expect(() => {
        fireEvent.press(getByText('Apple Inc.'));
      }).not.toThrow();
    });
  });

  describe('Delete Functionality', () => {
    it('should show delete buttons when showDelete is true', () => {
      const { getAllByText } = render(
        <TrendsList
          {...defaultProps}
          showDelete={true}
        />
      );

      const deleteButtons = getAllByText('✕');
      expect(deleteButtons).toHaveLength(2);
    });

    it('should not show delete buttons when showDelete is false', () => {
      const { queryByText } = render(
        <TrendsList
          {...defaultProps}
          showDelete={false}
        />
      );

      expect(queryByText('✕')).toBeNull();
    });

    it('should call onDeleteCompany when company delete button is pressed', () => {
      const mockOnDeleteCompany = jest.fn();
      const { getAllByText } = render(
        <TrendsList
          {...defaultProps}
          showDelete={true}
          onDeleteCompany={mockOnDeleteCompany}
        />
      );

      const deleteButtons = getAllByText('✕');
      fireEvent.press(deleteButtons[0]);
      expect(mockOnDeleteCompany).toHaveBeenCalledWith('comp1');
    });

    it('should call onDeleteCause when cause delete button is pressed', () => {
      const mockOnDeleteCause = jest.fn();
      const { getAllByText } = render(
        <TrendsList
          {...defaultProps}
          items={mockCauseItems}
          showDelete={true}
          onDeleteCause={mockOnDeleteCause}
        />
      );

      const deleteButtons = getAllByText('✕');
      fireEvent.press(deleteButtons[0]);
      expect(mockOnDeleteCause).toHaveBeenCalledWith('cause1');
    });
  });

  describe('Mixed Items', () => {
    it('should render both companies and causes', () => {
      const mixedItems = [...mockCompanyItems, ...mockCauseItems];
      const { getByText } = render(
        <TrendsList
          {...defaultProps}
          items={mixedItems}
        />
      );

      expect(getByText('Apple Inc.')).toBeTruthy();
      expect(getByText('Environmental Protection')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const { UNSAFE_root } = render(
        <TrendsList {...defaultProps} items={[]} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle items without rank', () => {
      const itemsWithoutRank: Item[] = [
        {
          company_id: 'comp1',
          company_name: 'Apple Inc.',
          boycott_count: 1500,
        },
      ];

      const { getByText, queryByText } = render(
        <TrendsList {...defaultProps} items={itemsWithoutRank} />
      );

      expect(getByText('Apple Inc.')).toBeTruthy();
      expect(queryByText('1')).toBeNull();
    });

    it('should handle items with neither company_id nor cause_id', () => {
      const invalidItems: Item[] = [
        {
          boycott_count: 1500,
        },
      ];

      const { UNSAFE_root } = render(
        <TrendsList {...defaultProps} items={invalidItems} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});

describe('deDuplicate function', () => {
  it('should remove duplicate companies', () => {
    const duplicateCompanies: Item[] = [
      { company_id: 'comp1', company_name: 'Apple Inc.' },
      { company_id: 'comp1', company_name: 'Apple Inc.' },
      { company_id: 'comp2', company_name: 'Microsoft Corp.' },
    ];

    const result = deDuplicate(duplicateCompanies);
    expect(result).toHaveLength(2);
    expect(result[0].company_id).toBe('comp1');
    expect(result[1].company_id).toBe('comp2');
  });

  it('should remove duplicate causes', () => {
    const duplicateCauses: Item[] = [
      { cause_id: 'cause1', cause_desc: 'Environment' },
      { cause_id: 'cause1', cause_desc: 'Environment' },
      { cause_id: 'cause2', cause_desc: 'Workers Rights' },
    ];

    const result = deDuplicate(duplicateCauses);
    expect(result).toHaveLength(2);
    expect(result[0].cause_id).toBe('cause1');
    expect(result[1].cause_id).toBe('cause2');
  });

  it('should handle mixed companies and causes', () => {
    const mixedItems: Item[] = [
      { company_id: 'comp1', company_name: 'Apple Inc.' },
      { cause_id: 'cause1', cause_desc: 'Environment' },
      { company_id: 'comp1', company_name: 'Apple Inc.' },
      { cause_id: 'cause1', cause_desc: 'Environment' },
    ];

    const result = deDuplicate(mixedItems);
    expect(result).toHaveLength(2);
    expect(result[0].company_id).toBe('comp1');
    expect(result[1].cause_id).toBe('cause1');
  });

  it('should handle empty array', () => {
    const result = deDuplicate([]);
    expect(result).toHaveLength(0);
  });

  it('should filter out items with no valid IDs', () => {
    const invalidItems: Item[] = [
      { company_id: 'comp1', company_name: 'Apple Inc.' },
      { boycott_count: 100 }, // No company_id or cause_id
      { cause_id: 'cause1', cause_desc: 'Environment' },
    ];

    const result = deDuplicate(invalidItems);
    expect(result).toHaveLength(2);
    expect(result[0].company_id).toBe('comp1');
    expect(result[1].cause_id).toBe('cause1');
  });
});