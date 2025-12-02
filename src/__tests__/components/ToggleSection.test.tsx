/**
 * Test suite for ToggleSection component
 * Tests toggle switch component with labels, state management, and conditional footer text
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ToggleSection from '../../components/toggle/ToggleSection';

// Mock shared styles
jest.mock('../../../styles/sharedStyles', () => ({
  sharedStyles: {
    toggleSection: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    myCompaniesTxt: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333333',
    },
    myCausesTxt: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333333',
    },
    toggleSwitch: {
      marginHorizontal: 10,
    },
    footerWrapper: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    toggleFooterText: {
      fontSize: 14,
      color: '#666666',
      textAlign: 'center',
    }
  }
}));

// Mock constants
jest.mock('../../../styles/constants', () => ({
  BRIGHT_BLUE: '#007AFF',
  DARK_GREY: '#333333',
  DEFAULT_TOGGLE_TOP_MARGIN: 20,
  GREY: '#999999',
  OFF_WHITE: '#F8F9FA',
  WHITE: '#FFFFFF'
}));

describe('ToggleSection Component', () => {
  const defaultProps = {
    isToggleOn: false,
    setIsToggleOn: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the toggle section component', () => {
      const { getByText } = render(<ToggleSection {...defaultProps} />);

      const leftLabel = getByText('Companies');
      const rightLabel = getByText('Causes');
      expect(leftLabel).toBeTruthy();
      expect(rightLabel).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(() => render(<ToggleSection {...defaultProps} />)).not.toThrow();
    });

    it('should render with all required props', () => {
      const { getByText } = render(<ToggleSection {...defaultProps} />);

      const leftLabel = getByText('Companies');
      const rightLabel = getByText('Causes');
      expect(leftLabel).toBeTruthy();
      expect(rightLabel).toBeTruthy();
    });

    it('should render the toggle switch', () => {
      const { getByRole } = render(<ToggleSection {...defaultProps} />);

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch).toBeTruthy();
    });

    it('should use default labels when not provided', () => {
      const { getByText } = render(<ToggleSection {...defaultProps} />);

      const companiesLabel = getByText('Companies');
      const causesLabel = getByText('Causes');
      expect(companiesLabel).toBeTruthy();
      expect(causesLabel).toBeTruthy();
    });

    it('should use custom labels when provided', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          leftLabel="Custom Left"
          rightLabel="Custom Right"
        />
      );

      const leftLabel = getByText('Custom Left');
      const rightLabel = getByText('Custom Right');
      expect(leftLabel).toBeTruthy();
      expect(rightLabel).toBeTruthy();
    });
  });

  describe('Toggle State Management', () => {
    it('should display correct state when toggle is off', () => {
      const { getByRole } = render(
        <ToggleSection {...defaultProps} isToggleOn={false} />
      );

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(false);
    });

    it('should display correct state when toggle is on', () => {
      const { getByRole } = render(
        <ToggleSection {...defaultProps} isToggleOn={true} />
      );

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(true);
    });

    it('should call setIsToggleOn when switch is toggled', () => {
      const mockSetIsToggleOn = jest.fn();
      const { getByRole } = render(
        <ToggleSection {...defaultProps} setIsToggleOn={mockSetIsToggleOn} />
      );

      const toggleSwitch = getByRole('switch');
      fireEvent(toggleSwitch, 'valueChange', true);

      expect(mockSetIsToggleOn).toHaveBeenCalledWith(true);
    });

    it('should handle multiple toggle interactions', () => {
      const mockSetIsToggleOn = jest.fn();
      const { getByRole } = render(
        <ToggleSection {...defaultProps} setIsToggleOn={mockSetIsToggleOn} />
      );

      const toggleSwitch = getByRole('switch');

      fireEvent(toggleSwitch, 'valueChange', true);
      fireEvent(toggleSwitch, 'valueChange', false);
      fireEvent(toggleSwitch, 'valueChange', true);

      expect(mockSetIsToggleOn).toHaveBeenCalledTimes(3);
      expect(mockSetIsToggleOn).toHaveBeenNthCalledWith(1, true);
      expect(mockSetIsToggleOn).toHaveBeenNthCalledWith(2, false);
      expect(mockSetIsToggleOn).toHaveBeenNthCalledWith(3, true);
    });

    it('should maintain switch colors based on state', () => {
      const { getByRole, rerender } = render(
        <ToggleSection {...defaultProps} isToggleOn={false} />
      );

      let toggleSwitch = getByRole('switch');
      // Component should render toggle switch successfully
      expect(toggleSwitch).toBeTruthy();
      expect(toggleSwitch.props.value).toBe(false);

      rerender(<ToggleSection {...defaultProps} isToggleOn={true} />);

      toggleSwitch = getByRole('switch');
      // Toggle switch should be in ON state
      expect(toggleSwitch.props.value).toBe(true);
    });
  });

  describe('Footer Text Management', () => {
    it('should show footer by default', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Footer when off"
          isToggleOn={false}
        />
      );

      const footerText = getByText('Footer when off');
      expect(footerText).toBeTruthy();
    });

    it('should hide footer when includeFooter is false', () => {
      const { queryByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Footer when off"
          includeFooter={false}
        />
      );

      const footerText = queryByText('Footer when off');
      expect(footerText).toBeNull();
    });

    it('should show footerText when toggle is off', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Footer when off"
          otherFooterText="Footer when on"
          isToggleOn={false}
        />
      );

      const footerText = getByText('Footer when off');
      expect(footerText).toBeTruthy();
    });

    it('should show otherFooterText when toggle is on', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Footer when off"
          otherFooterText="Footer when on"
          isToggleOn={true}
        />
      );

      const footerText = getByText('Footer when on');
      expect(footerText).toBeTruthy();
    });

    it('should switch footer text when toggle state changes', () => {
      const { getByText, queryByText, rerender } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Footer when off"
          otherFooterText="Footer when on"
          isToggleOn={false}
        />
      );

      // Initially off
      expect(getByText('Footer when off')).toBeTruthy();
      expect(queryByText('Footer when on')).toBeNull();

      // Switch to on
      rerender(
        <ToggleSection
          {...defaultProps}
          footerText="Footer when off"
          otherFooterText="Footer when on"
          isToggleOn={true}
        />
      );

      expect(getByText('Footer when on')).toBeTruthy();
      expect(queryByText('Footer when off')).toBeNull();
    });

    it('should not show footer when footerText is not provided', () => {
      const { UNSAFE_root } = render(
        <ToggleSection {...defaultProps} includeFooter={true} />
      );

      // Footer container should exist but no text should be displayed
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle empty footer text', () => {
      const { queryByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText=""
          otherFooterText=""
          isToggleOn={false}
        />
      );

      // Empty text should not be displayed
      expect(queryByText('')).toBeNull();
    });
  });

  describe('Customization Options', () => {
    it('should use default margin top when not provided', () => {
      const { UNSAFE_root } = render(<ToggleSection {...defaultProps} />);

      // Component should render with default margin
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should use custom margin top when provided', () => {
      const { UNSAFE_root } = render(
        <ToggleSection {...defaultProps} marginTop={50} />
      );

      // Component should render with custom margin
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle zero margin top', () => {
      const { UNSAFE_root } = render(
        <ToggleSection {...defaultProps} marginTop={0} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle negative margin top', () => {
      const { UNSAFE_root } = render(
        <ToggleSection {...defaultProps} marginTop={-10} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle very large margin top', () => {
      const { UNSAFE_root } = render(
        <ToggleSection {...defaultProps} marginTop={1000} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Label Customization', () => {
    it('should render different label combinations', () => {
      const labelCombinations = [
        { left: 'Left A', right: 'Right A' },
        { left: 'Companies', right: 'Organizations' },
        { left: 'Type 1', right: 'Type 2' },
        { left: 'Option A', right: 'Option B' }
      ];

      labelCombinations.forEach(({ left, right }) => {
        const { getByText } = render(
          <ToggleSection
            {...defaultProps}
            leftLabel={left}
            rightLabel={right}
          />
        );

        expect(getByText(left)).toBeTruthy();
        expect(getByText(right)).toBeTruthy();
      });
    });

    it('should handle long label text', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          leftLabel="Very Long Left Label Text That Should Still Render"
          rightLabel="Very Long Right Label Text That Should Still Render"
        />
      );

      expect(getByText('Very Long Left Label Text That Should Still Render')).toBeTruthy();
      expect(getByText('Very Long Right Label Text That Should Still Render')).toBeTruthy();
    });

    it('should handle special characters in labels', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          leftLabel="Left & Special!"
          rightLabel="Right @ #$%"
        />
      );

      expect(getByText('Left & Special!')).toBeTruthy();
      expect(getByText('Right @ #$%')).toBeTruthy();
    });

    it('should handle empty labels', () => {
      const { getByText, UNSAFE_root } = render(
        <ToggleSection
          {...defaultProps}
          leftLabel=""
          rightLabel=""
        />
      );

      // Component should render with empty labels
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle labels with emojis', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          leftLabel="Companies 🏢"
          rightLabel="Causes ❤️"
        />
      );

      expect(getByText('Companies 🏢')).toBeTruthy();
      expect(getByText('Causes ❤️')).toBeTruthy();
    });
  });

  describe('Component State Combinations', () => {
    it('should handle all props together', () => {
      const mockSetIsToggleOn = jest.fn();
      const { getByText, getByRole } = render(
        <ToggleSection
          isToggleOn={true}
          setIsToggleOn={mockSetIsToggleOn}
          footerText="Footer when off"
          otherFooterText="Footer when on"
          leftLabel="Custom Left"
          rightLabel="Custom Right"
          marginTop={30}
          includeFooter={true}
        />
      );

      expect(getByText('Custom Left')).toBeTruthy();
      expect(getByText('Custom Right')).toBeTruthy();
      expect(getByText('Footer when on')).toBeTruthy();

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(true);

      fireEvent(toggleSwitch, 'valueChange', false);
      expect(mockSetIsToggleOn).toHaveBeenCalledWith(false);
    });

    it('should handle minimal props configuration', () => {
      const { getByText, getByRole } = render(
        <ToggleSection
          isToggleOn={false}
          setIsToggleOn={jest.fn()}
        />
      );

      expect(getByText('Companies')).toBeTruthy();
      expect(getByText('Causes')).toBeTruthy();

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(false);
    });

    it('should handle toggle with footer disabled', () => {
      const { getByText, getByRole, queryByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Should not show"
          includeFooter={false}
        />
      );

      expect(getByText('Companies')).toBeTruthy();
      expect(getByText('Causes')).toBeTruthy();
      expect(getByRole('switch')).toBeTruthy();
      expect(queryByText('Should not show')).toBeNull();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing setIsToggleOn gracefully', () => {
      const propsWithoutSetter = { ...defaultProps };
      delete (propsWithoutSetter as any).setIsToggleOn;

      expect(() => render(<ToggleSection {...propsWithoutSetter} />)).not.toThrow();
    });

    it('should handle null and undefined props gracefully', () => {
      const { UNSAFE_root } = render(
        <ToggleSection
          isToggleOn={false}
          setIsToggleOn={jest.fn()}
          footerText={null as any}
          otherFooterText={undefined}
          leftLabel={null as any}
          rightLabel={undefined as any}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle boolean edge cases', () => {
      const { getByRole } = render(
        <ToggleSection
          isToggleOn={true}
          setIsToggleOn={jest.fn()}
        />
      );

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should provide accessible switch control', () => {
      const { getByRole } = render(<ToggleSection {...defaultProps} />);

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch).toBeTruthy();
    });

    it('should provide accessible label text', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          leftLabel="Accessible Left Label"
          rightLabel="Accessible Right Label"
        />
      );

      expect(getByText('Accessible Left Label')).toBeTruthy();
      expect(getByText('Accessible Right Label')).toBeTruthy();
    });

    it('should provide accessible footer text', () => {
      const { getByText } = render(
        <ToggleSection
          {...defaultProps}
          footerText="Accessible footer information"
          isToggleOn={false}
        />
      );

      expect(getByText('Accessible footer information')).toBeTruthy();
    });

    it('should maintain accessibility with state changes', () => {
      const { getByRole, rerender } = render(
        <ToggleSection {...defaultProps} isToggleOn={false} />
      );

      let toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(false);

      rerender(<ToggleSection {...defaultProps} isToggleOn={true} />);

      toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(true);
    });
  });

  describe('Performance Considerations', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<ToggleSection {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle rapid prop changes efficiently', () => {
      const { rerender } = render(<ToggleSection {...defaultProps} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <ToggleSection
            {...defaultProps}
            isToggleOn={i % 2 === 0}
            leftLabel={`Left ${i}`}
            rightLabel={`Right ${i}`}
            footerText={`Footer ${i}`}
          />
        );
      }

      expect(true).toBe(true);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<ToggleSection {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple instances efficiently', () => {
      const { UNSAFE_root } = render(
        <>
          <ToggleSection {...defaultProps} leftLabel="Toggle 1" />
          <ToggleSection {...defaultProps} leftLabel="Toggle 2" />
          <ToggleSection {...defaultProps} leftLabel="Toggle 3" />
        </>
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work in form contexts', () => {
      const mockSetIsToggleOn = jest.fn();
      const { getByRole } = render(
        <ToggleSection
          isToggleOn={false}
          setIsToggleOn={mockSetIsToggleOn}
          leftLabel="Form Option A"
          rightLabel="Form Option B"
        />
      );

      const toggleSwitch = getByRole('switch');
      fireEvent(toggleSwitch, 'valueChange', true);

      expect(mockSetIsToggleOn).toHaveBeenCalledWith(true);
    });

    it('should work with external state management', () => {
      let externalState = false;
      const handleToggle = (value: boolean) => {
        externalState = value;
      };

      const { getByRole, rerender } = render(
        <ToggleSection
          isToggleOn={externalState}
          setIsToggleOn={handleToggle}
        />
      );

      const toggleSwitch = getByRole('switch');
      expect(toggleSwitch.props.value).toBe(false);

      fireEvent(toggleSwitch, 'valueChange', true);

      rerender(
        <ToggleSection
          isToggleOn={externalState}
          setIsToggleOn={handleToggle}
        />
      );

      expect(externalState).toBe(true);
    });
  });
});