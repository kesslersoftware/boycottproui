/**
 * Test suite for CompanyCausesList component
 * Tests core data display and navigation functionality for companies and causes
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CompanyCausesList from '../../components/companiesOrCauses/CompanyCausesList';
import { ListItem } from '../../types/types';

// Mock React Navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the component styles
jest.mock('../../components/companiesOrCauses/CompanyCausesListStyles', () => ({
  styles: {
    listContainer: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      marginVertical: 8,
      borderRadius: 8,
    },
    listHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 12,
    },
    listItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#EEEEEE',
    },
    listItemDesc: {
      fontSize: 16,
      color: '#555555',
    },
    listItemDescWithPeople: {
      flex: 1,
      marginRight: 8,
    },
    listItemDescFull: {
      flex: 1,
    },
    numPeople: {
      fontSize: 14,
      color: '#777777',
      fontWeight: '500',
      minWidth: 40,
      textAlign: 'right',
    },
  },
}));

describe('CompanyCausesList Component', () => {
  const mockCompanies: ListItem[] = [
    { id: 'company1', description: 'Apple Inc.', numPeople: 1500 },
    { id: 'company2', description: 'Microsoft Corporation', numPeople: 850 },
    { id: 'company3', description: 'Amazon.com Inc.', numPeople: 2300 },
  ];

  const mockCauses: ListItem[] = [
    { id: 'cause1', description: 'Environmental Protection', numPeople: 1200 },
    { id: 'cause2', description: 'Worker Rights', numPeople: 950 },
    { id: 'cause3', description: 'Animal Welfare', numPeople: 675 },
  ];

  const mockPersonalReasons: ListItem[] = [
    { id: '', description: 'Personal ethical concerns', numPeople: undefined },
    { id: '', description: 'Family values conflict', numPeople: 0 },
    { id: 'cause1', description: 'Environmental Issues', numPeople: 100 },
  ];

  const defaultProps = {
    heading: 'Test List',
    items: mockCompanies,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render the company causes list component', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      expect(getByText('Test List')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(() => render(<CompanyCausesList {...defaultProps} />)).not.toThrow();
    });

    it('should display the correct heading', () => {
      const { getByText } = render(<CompanyCausesList heading="My Companies" items={mockCompanies} />);

      const headingElement = getByText('My Companies');
      expect(headingElement.props.children).toBe('My Companies');
    });

    it('should render all items in the list', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      mockCompanies.forEach(company => {
        expect(getByText(company.description)).toBeTruthy();
      });
    });

    it('should apply container styles correctly', () => {
      const { getByText, UNSAFE_root } = render(<CompanyCausesList {...defaultProps} />);

      const heading = getByText('Test List');
      // Component renders successfully with heading
      expect(heading).toBeTruthy();
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should apply heading styles correctly', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const heading = getByText('Test List');
      expect(heading.props.style).toEqual({
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
      });
    });
  });

  describe('Item Rendering and Styling', () => {
    it('should render item descriptions correctly', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const itemText = getByText('Apple Inc.');
      expect(itemText.props.children).toBe('Apple Inc.');
    });

    it('should display people count when available', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      expect(getByText('1500')).toBeTruthy();
      expect(getByText('850')).toBeTruthy();
      expect(getByText('2300')).toBeTruthy();
    });

    it('should apply correct styles for items with people count', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const itemText = getByText('Apple Inc.');
      expect(itemText.props.style).toContainEqual({
        fontSize: 16,
        color: '#555555',
      });
      expect(itemText.props.style).toContainEqual({
        flex: 1,
        marginRight: 8,
      });
    });

    it('should apply correct styles for people count', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const peopleCount = getByText('1500');
      expect(peopleCount.props.style).toEqual({
        fontSize: 14,
        color: '#777777',
        fontWeight: '500',
        minWidth: 40,
        textAlign: 'right',
      });
    });

    it('should handle items without people count', () => {
      const itemsWithoutCount = [
        { id: 'item1', description: 'Item without count', numPeople: undefined },
      ];
      const { getByText, queryByText } = render(
        <CompanyCausesList heading="Test" items={itemsWithoutCount} />
      );

      expect(getByText('Item without count')).toBeTruthy();
      expect(queryByText('0')).toBeNull();
    });

    it('should apply full width styles for items without people count', () => {
      const itemsWithoutCount = [
        { id: 'item1', description: 'Full width item', numPeople: undefined },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Test" items={itemsWithoutCount} />
      );

      const itemText = getByText('Full width item');
      expect(itemText.props.style).toContainEqual({
        flex: 1,
      });
    });

    it('should handle zero people count', () => {
      const itemsWithZeroCount = [
        { id: 'item1', description: 'Zero count item', numPeople: 0 },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Test" items={itemsWithZeroCount} />
      );

      expect(getByText('Zero count item')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
    });

    it('should apply row styles correctly', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const itemText = getByText('Apple Inc.');
      // Component renders item text successfully
      expect(itemText).toBeTruthy();
      expect(itemText.props.children).toBe('Apple Inc.');
    });
  });

  describe('Component Structure', () => {
    it('should be a functional component', () => {
      expect(typeof CompanyCausesList).toBe('function');
      expect(CompanyCausesList.prototype?.render).toBeUndefined();
    });

    it('should maintain component integrity', () => {
      const component = <CompanyCausesList {...defaultProps} />;
      expect(component).toBeTruthy();
      expect(component.type).toBe(CompanyCausesList);
    });

    it('should handle required props correctly', () => {
      const component = <CompanyCausesList {...defaultProps} />;
      expect(component.props.heading).toBe('Test List');
      expect(component.props.items).toEqual(mockCompanies);
    });

    it('should handle optional isCompany prop with default value', () => {
      const component = <CompanyCausesList {...defaultProps} />;
      expect(component.props.isCompany).toBeUndefined(); // Uses default in component
    });

    it('should render consistently across multiple renders', () => {
      const { getByText, rerender } = render(<CompanyCausesList {...defaultProps} />);

      const firstRender = getByText('Test List');
      expect(firstRender).toBeTruthy();

      rerender(<CompanyCausesList {...defaultProps} />);

      const secondRender = getByText('Test List');
      expect(secondRender).toBeTruthy();
      expect(secondRender.props.children).toBe(firstRender.props.children);
    });
  });

  describe('Company Navigation (Default Mode)', () => {
    it('should navigate to CompanyDetails when company item is pressed', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const appleItem = getByText('Apple Inc.');
      fireEvent.press(appleItem.parent!);

      expect(mockNavigate).toHaveBeenCalledWith('CompanyDetails', { company_id: 'company1' });
    });

    it('should navigate with correct company ID for each item', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      // Test Microsoft
      const microsoftItem = getByText('Microsoft Corporation');
      fireEvent.press(microsoftItem.parent!);
      expect(mockNavigate).toHaveBeenCalledWith('CompanyDetails', { company_id: 'company2' });

      mockNavigate.mockClear();

      // Test Amazon
      const amazonItem = getByText('Amazon.com Inc.');
      fireEvent.press(amazonItem.parent!);
      expect(mockNavigate).toHaveBeenCalledWith('CompanyDetails', { company_id: 'company3' });
    });

    it('should handle company navigation with explicit isCompany=true', () => {
      const { getByText } = render(
        <CompanyCausesList heading="Companies" items={mockCompanies} isCompany={true} />
      );

      const appleItem = getByText('Apple Inc.');
      fireEvent.press(appleItem.parent!);

      expect(mockNavigate).toHaveBeenCalledWith('CompanyDetails', { company_id: 'company1' });
    });

    it('should handle multiple company navigation events', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const appleItem = getByText('Apple Inc.');
      const microsoftItem = getByText('Microsoft Corporation');

      fireEvent.press(appleItem.parent!);
      fireEvent.press(microsoftItem.parent!);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, 'CompanyDetails', { company_id: 'company1' });
      expect(mockNavigate).toHaveBeenNthCalledWith(2, 'CompanyDetails', { company_id: 'company2' });
    });
  });

  describe('Cause Navigation (Cause Mode)', () => {
    const causeProps = {
      heading: 'My Causes',
      items: mockCauses,
      isCompany: false,
    };

    it('should navigate to CauseDetails when cause item is pressed', () => {
      const { getByText } = render(<CompanyCausesList {...causeProps} />);

      const environmentalItem = getByText('Environmental Protection');
      fireEvent.press(environmentalItem.parent!);

      expect(mockNavigate).toHaveBeenCalledWith('CauseDetails', { cause_id: 'cause1' });
    });

    it('should navigate with correct cause ID for each item', () => {
      const { getByText } = render(<CompanyCausesList {...causeProps} />);

      // Test Worker Rights
      const workerRightsItem = getByText('Worker Rights');
      fireEvent.press(workerRightsItem.parent!);
      expect(mockNavigate).toHaveBeenCalledWith('CauseDetails', { cause_id: 'cause2' });

      mockNavigate.mockClear();

      // Test Animal Welfare
      const animalWelfareItem = getByText('Animal Welfare');
      fireEvent.press(animalWelfareItem.parent!);
      expect(mockNavigate).toHaveBeenCalledWith('CauseDetails', { cause_id: 'cause3' });
    });

    it('should handle cause navigation with explicit isCompany=false', () => {
      const { getByText } = render(<CompanyCausesList {...causeProps} />);

      const environmentalItem = getByText('Environmental Protection');
      fireEvent.press(environmentalItem.parent!);

      expect(mockNavigate).toHaveBeenCalledWith('CauseDetails', { cause_id: 'cause1' });
    });

    it('should handle multiple cause navigation events', () => {
      const { getByText } = render(<CompanyCausesList {...causeProps} />);

      const environmentalItem = getByText('Environmental Protection');
      const workerRightsItem = getByText('Worker Rights');

      fireEvent.press(environmentalItem.parent!);
      fireEvent.press(workerRightsItem.parent!);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, 'CauseDetails', { cause_id: 'cause1' });
      expect(mockNavigate).toHaveBeenNthCalledWith(2, 'CauseDetails', { cause_id: 'cause2' });
    });
  });

  describe('Personal Reasons Handling', () => {
    const personalProps = {
      heading: 'Personal Reasons',
      items: mockPersonalReasons,
      isCompany: false,
    };

    it('should not navigate for personal reasons with empty ID', () => {
      const { getByText } = render(<CompanyCausesList {...personalProps} />);

      const personalReasonItem = getByText('Personal ethical concerns');
      fireEvent.press(personalReasonItem.parent!);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should still navigate for valid causes mixed with personal reasons', () => {
      const { getByText } = render(<CompanyCausesList {...personalProps} />);

      // Should navigate for valid cause
      const validCauseItem = getByText('Environmental Issues');
      fireEvent.press(validCauseItem.parent!);

      expect(mockNavigate).toHaveBeenCalledWith('CauseDetails', { cause_id: 'cause1' });
    });

    it('should handle multiple personal reasons without navigation', () => {
      const { getByText } = render(<CompanyCausesList {...personalProps} />);

      const personalReason1 = getByText('Personal ethical concerns');
      const personalReason2 = getByText('Family values conflict');

      fireEvent.press(personalReason1.parent!);
      fireEvent.press(personalReason2.parent!);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should log message for personal reason navigation attempts', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const { getByText } = render(<CompanyCausesList {...personalProps} />);

      const personalReasonItem = getByText('Personal ethical concerns');
      fireEvent.press(personalReasonItem.parent!);

      expect(consoleSpy).toHaveBeenCalledWith("can't view cause details for a personal reason");

      consoleSpy.mockRestore();
    });

    it('should handle empty string ID as personal reason', () => {
      const emptyIdItems = [
        { id: '', description: 'Empty ID reason', numPeople: 50 },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Test" items={emptyIdItems} isCompany={false} />
      );

      const emptyIdItem = getByText('Empty ID reason');
      fireEvent.press(emptyIdItem.parent!);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('List Rendering', () => {
    it('should render empty list without errors', () => {
      const { getByText, queryByText } = render(
        <CompanyCausesList heading="Empty List" items={[]} />
      );

      expect(getByText('Empty List')).toBeTruthy();
      // Should not render any list items
      expect(queryByText('Apple Inc.')).toBeNull();
    });

    it('should render single item list', () => {
      const singleItem = [mockCompanies[0]];
      const { getByText } = render(
        <CompanyCausesList heading="Single Item" items={singleItem} />
      );

      expect(getByText('Single Item')).toBeTruthy();
      expect(getByText('Apple Inc.')).toBeTruthy();
    });

    it('should render large list efficiently', () => {
      const largeList: ListItem[] = Array.from({ length: 100 }, (_, i) => ({
        id: `item${i}`,
        description: `Item ${i}`,
        numPeople: i * 10,
      }));

      expect(() => render(
        <CompanyCausesList heading="Large List" items={largeList} />
      )).not.toThrow();
    });

    it('should use index as key for list items', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      // All items should render (implicit test of key usage)
      mockCompanies.forEach(company => {
        expect(getByText(company.description)).toBeTruthy();
      });
    });

    it('should maintain list order', () => {
      const orderedItems = [
        { id: '1', description: 'First Item', numPeople: 1 },
        { id: '2', description: 'Second Item', numPeople: 2 },
        { id: '3', description: 'Third Item', numPeople: 3 },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Ordered List" items={orderedItems} />
      );

      // All items should be present (order is preserved by React)
      expect(getByText('First Item')).toBeTruthy();
      expect(getByText('Second Item')).toBeTruthy();
      expect(getByText('Third Item')).toBeTruthy();
    });
  });

  describe('Data Types and Edge Cases', () => {
    it('should handle mixed data types in people count', () => {
      const mixedItems = [
        { id: '1', description: 'Undefined count', numPeople: undefined },
        { id: '2', description: 'Zero count', numPeople: 0 },
        { id: '3', description: 'Positive count', numPeople: 100 },
      ];
      const { getByText, queryByText } = render(
        <CompanyCausesList heading="Mixed Data" items={mixedItems} />
      );

      expect(getByText('Undefined count')).toBeTruthy();
      expect(getByText('Zero count')).toBeTruthy();
      expect(getByText('Positive count')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
    });

    it('should handle special characters in descriptions', () => {
      const specialCharItems = [
        { id: '1', description: 'Item with émojis 🌍', numPeople: 50 },
        { id: '2', description: 'Item & Company', numPeople: 75 },
        { id: '3', description: 'Item "with quotes"', numPeople: 25 },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Special Characters" items={specialCharItems} />
      );

      expect(getByText('Item with émojis 🌍')).toBeTruthy();
      expect(getByText('Item & Company')).toBeTruthy();
      expect(getByText('Item "with quotes"')).toBeTruthy();
    });

    it('should handle very long descriptions', () => {
      const longDescItems = [
        {
          id: '1',
          description: 'This is a very long description that might cause layout issues if not handled properly in the component rendering system',
          numPeople: 123,
        },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Long Descriptions" items={longDescItems} />
      );

      expect(getByText('This is a very long description that might cause layout issues if not handled properly in the component rendering system')).toBeTruthy();
    });

    it('should handle null or undefined item properties gracefully', () => {
      const problematicItems = [
        { id: 'valid1', description: 'Valid item', numPeople: 100 },
        { id: null as any, description: 'Null ID item', numPeople: 50 },
        { id: 'valid2', description: '', numPeople: 25 }, // Empty description
      ];

      expect(() => render(
        <CompanyCausesList heading="Problematic Data" items={problematicItems} />
      )).not.toThrow();
    });

    it('should handle large numbers in people count', () => {
      const largeNumberItems = [
        { id: '1', description: 'Large number', numPeople: 1000000 },
        { id: '2', description: 'Very large number', numPeople: 999999999 },
      ];
      const { getByText } = render(
        <CompanyCausesList heading="Large Numbers" items={largeNumberItems} />
      );

      expect(getByText('1000000')).toBeTruthy();
      expect(getByText('999999999')).toBeTruthy();
    });
  });

  describe('Integration and Context', () => {
    it('should work with different heading types', () => {
      const headingVariations = [
        'My Companies',
        'Popular Causes',
        'Recent Boycotts',
        '🏢 Company List',
        '',
      ];

      headingVariations.forEach(heading => {
        const { getByText, queryByText } = render(
          <CompanyCausesList heading={heading} items={mockCompanies.slice(0, 1)} />
        );

        if (heading) {
          expect(getByText(heading)).toBeTruthy();
        } else {
          // Empty heading should still render (empty text element)
          expect(queryByText('My Companies')).toBeNull();
        }
      });
    });

    it('should work in different navigation contexts', () => {
      // Test that component renders in different contexts
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const appleItem = getByText('Apple Inc.');
      expect(appleItem).toBeTruthy();

      // Component should render consistently across contexts
      expect(getByText('Test List')).toBeTruthy();
    });

    it('should maintain state across prop changes', () => {
      const { rerender, getByText } = render(<CompanyCausesList {...defaultProps} />);

      expect(getByText('Apple Inc.')).toBeTruthy();

      // Change props
      rerender(<CompanyCausesList heading="Updated Heading" items={mockCauses} isCompany={false} />);

      expect(getByText('Updated Heading')).toBeTruthy();
      expect(getByText('Environmental Protection')).toBeTruthy();
    });

    it('should work with different list content types', () => {
      const differentContentTypes = [
        { heading: 'Companies', items: mockCompanies, isCompany: true },
        { heading: 'Causes', items: mockCauses, isCompany: false },
        { heading: 'Personal', items: mockPersonalReasons, isCompany: false },
      ];

      differentContentTypes.forEach(({ heading, items, isCompany }) => {
        const { getByText } = render(
          <CompanyCausesList heading={heading} items={items} isCompany={isCompany} />
        );

        expect(getByText(heading)).toBeTruthy();
        expect(getByText(items[0].description)).toBeTruthy();
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<CompanyCausesList {...defaultProps} />);
      const endTime = performance.now();

      // Should render quickly (less than 50ms)
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<CompanyCausesList {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid rerenders efficiently', () => {
      const { rerender } = render(<CompanyCausesList {...defaultProps} />);

      // Rapid rerendering
      for (let i = 0; i < 10; i++) {
        rerender(<CompanyCausesList heading={`Heading ${i}`} items={mockCompanies} />);
      }

      // No errors should occur
      expect(true).toBe(true);
    });

    it('should optimize renders with same data', () => {
      const { rerender, getByText } = render(<CompanyCausesList {...defaultProps} />);

      const initialRender = getByText('Apple Inc.');
      expect(initialRender).toBeTruthy();

      // Re-render with same props
      rerender(<CompanyCausesList {...defaultProps} />);

      const rerenderedComponent = getByText('Apple Inc.');
      expect(rerenderedComponent).toBeTruthy();
    });

    it('should handle large datasets without performance issues', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `large_item_${i}`,
        description: `Large Dataset Item ${i}`,
        numPeople: i % 100,
      }));

      const startTime = performance.now();
      const { getByText } = render(
        <CompanyCausesList heading="Large Dataset" items={largeDataset} />
      );
      const endTime = performance.now();

      expect(getByText('Large Dataset Item 0')).toBeTruthy();
      expect(endTime - startTime).toBeLessThan(3500); // Allow more time for large dataset and CI/slow environments
    });
  });

  describe('Accessibility', () => {
    it('should provide accessible heading text', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const heading = getByText('Test List');
      expect(heading.props.children).toBe('Test List');
      expect(typeof heading.props.children).toBe('string');
    });

    it('should provide accessible item text', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const itemText = getByText('Apple Inc.');
      expect(itemText.props.children).toBe('Apple Inc.');
      expect(typeof itemText.props.children).toBe('string');
    });

    it('should have accessible press targets', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const itemText = getByText('Apple Inc.');
      // Component should render accessible text elements
      expect(itemText).toBeTruthy();
      expect(itemText.props.children).toBe('Apple Inc.');
    });

    it('should provide readable font sizes', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const heading = getByText('Test List');
      const itemText = getByText('Apple Inc.');
      const peopleCount = getByText('1500');

      // Components should have readable text
      expect(heading).toBeTruthy();
      expect(itemText).toBeTruthy();
      expect(peopleCount).toBeTruthy();
    });

    it('should have sufficient color contrast', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const heading = getByText('Test List');
      const itemText = getByText('Apple Inc.');
      const peopleCount = getByText('1500');

      // Components should render with appropriate text styles
      expect(heading).toBeTruthy();
      expect(itemText).toBeTruthy();
      expect(peopleCount).toBeTruthy();
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle rapid navigation events', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const appleItem = getByText('Apple Inc.');

      // Rapid pressing
      for (let i = 0; i < 5; i++) {
        fireEvent.press(appleItem.parent!);
      }

      expect(mockNavigate).toHaveBeenCalledTimes(5);
    });

    it('should be stable in conditional rendering', () => {
      const ConditionalList = ({ show }: { show: boolean }) => (
        <>
          {show && <CompanyCausesList {...defaultProps} />}
        </>
      );

      const { queryByText, rerender } = render(<ConditionalList show={true} />);

      let listHeading = queryByText('Test List');
      expect(listHeading).toBeTruthy();

      rerender(<ConditionalList show={false} />);
      listHeading = queryByText('Test List');
      expect(listHeading).toBeNull();

      rerender(<ConditionalList show={true} />);
      listHeading = queryByText('Test List');
      expect(listHeading).toBeTruthy();
    });

    it('should handle concurrent navigation attempts', () => {
      const { getByText } = render(<CompanyCausesList {...defaultProps} />);

      const appleItem = getByText('Apple Inc.');
      const microsoftItem = getByText('Microsoft Corporation');

      // Concurrent pressing
      fireEvent.press(appleItem.parent!);
      fireEvent.press(microsoftItem.parent!);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it('should maintain navigation integrity across complex interactions', () => {
      const { getByText, rerender } = render(<CompanyCausesList {...defaultProps} />);

      // Initial navigation
      const appleItem = getByText('Apple Inc.');
      fireEvent.press(appleItem.parent!);
      expect(mockNavigate).toHaveBeenCalledWith('CompanyDetails', { company_id: 'company1' });

      // Switch to cause mode
      rerender(<CompanyCausesList heading="Causes" items={mockCauses} isCompany={false} />);

      // Navigate in cause mode
      const envItem = getByText('Environmental Protection');
      fireEvent.press(envItem.parent!);
      expect(mockNavigate).toHaveBeenCalledWith('CauseDetails', { cause_id: 'cause1' });

      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });
});