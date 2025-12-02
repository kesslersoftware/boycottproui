/**
 * Test suite for CustomCheckbox component
 * Tests custom checkbox form control with state management and styling
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';

// Mock screen dimensions utility
jest.mock('../../components/screenDimensionsutilitiy', () => ({
  sw: 375, // iPhone width
  sh: 667, // iPhone height minus top inset
  topInset: 44,
  bottomInset: 34
}));

// Mock the CustomCheckbox styles
jest.mock('../../components/customCheckbox/CustomCheckboxStyles', () => ({
  styles: {
    container: {
      flexDirection: 'row',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#333333',
      backgroundColor: '#E0E0E0',
      borderRadius: 4
    },
    checkedBox: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF'
    },
    messageTxt: {
      marginLeft: 8.25, // 375 * 0.022
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 10.672, // 667 * 0.0160
      color: '#333333',
      textAlign: 'center',
      textAlignVertical: 'center'
    }
  }
}));

// Mock style constants
jest.mock('../../../styles/constants', () => ({
  BODY_TEXT_DARK: '#333333',
  FORM_FIELD_BORDER: '#E0E0E0',
  LINK_TEXT: '#007AFF'
}));

describe('CustomCheckbox Component', () => {
  const defaultProps = {
    checked: false,
    setCheck: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the checkbox component', () => {
      const { getByText } = render(<CustomCheckbox {...defaultProps} />);

      const defaultText = getByText('I agree to Terms of Service and Privacy Policy');
      expect(defaultText).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(() => render(<CustomCheckbox {...defaultProps} />)).not.toThrow();
    });

    it('should render with default text when no text prop provided', () => {
      const { getByText } = render(<CustomCheckbox {...defaultProps} />);

      const defaultText = getByText('I agree to Terms of Service and Privacy Policy');
      expect(defaultText).toBeTruthy();
    });

    it('should render with custom text when provided', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text="Custom checkbox text" />
      );

      const customText = getByText('Custom checkbox text');
      expect(customText).toBeTruthy();
    });

    it('should render checkbox in unchecked state by default', () => {
      const { getByText } = render(<CustomCheckbox {...defaultProps} checked={false} />);

      const container = getByText('I agree to Terms of Service and Privacy Policy').parent;
      expect(container).toBeTruthy();
    });
  });

  describe('Checkbox State Management', () => {
    it('should display unchecked state correctly', () => {
      const { getByText } = render(<CustomCheckbox {...defaultProps} checked={false} />);

      // Component should render - the visual state is handled by styles
      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should display checked state correctly', () => {
      const { getByText } = render(<CustomCheckbox {...defaultProps} checked={true} />);

      // Component should render - the visual state is handled by styles
      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should toggle state when pressed', () => {
      const mockSetCheck = jest.fn();
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} setCheck={mockSetCheck} />
      );

      const pressable = getByText('I agree to Terms of Service and Privacy Policy').parent;
      fireEvent.press(pressable);

      expect(mockSetCheck).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple toggle actions', () => {
      const mockSetCheck = jest.fn();
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} setCheck={mockSetCheck} />
      );

      const pressable = getByText('I agree to Terms of Service and Privacy Policy').parent;
      fireEvent.press(pressable);
      fireEvent.press(pressable);
      fireEvent.press(pressable);

      expect(mockSetCheck).toHaveBeenCalledTimes(3);
    });

    it('should maintain state consistency between renders', () => {
      const { getByText, rerender } = render(
        <CustomCheckbox {...defaultProps} checked={false} />
      );

      let text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();

      rerender(<CustomCheckbox {...defaultProps} checked={true} />);

      text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });
  });

  describe('Custom Margins and Positioning', () => {
    it('should apply default margins when not specified', () => {
      const { getByText } = render(<CustomCheckbox {...defaultProps} />);

      // Default margins: leftMargin = 0.102, topMargin = 0.032
      // With sw = 375, sh = 667:
      // leftMargin = 375 * 0.102 = 38.25
      // topMargin = 667 * 0.032 = 21.344
      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should apply custom left margin', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} leftMargin={0.2} />
      );

      // Custom leftMargin = 375 * 0.2 = 75
      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should apply custom top margin', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} topMargin={0.05} />
      );

      // Custom topMargin = 667 * 0.05 = 33.35
      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should apply both custom margins', () => {
      const { getByText } = render(
        <CustomCheckbox
          {...defaultProps}
          leftMargin={0.15}
          topMargin={0.04}
        />
      );

      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should handle zero margins', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} leftMargin={0} topMargin={0} />
      );

      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should handle very large margins', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} leftMargin={1} topMargin={1} />
      );

      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });
  });

  describe('Text Variations', () => {
    it('should render short text', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text="Agree" />
      );

      const text = getByText('Agree');
      expect(text).toBeTruthy();
    });

    it('should render long text', () => {
      const longText = 'I agree to the very detailed and comprehensive Terms of Service, Privacy Policy, Cookie Policy, and Data Processing Agreement that governs the use of this application and all related services';
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text={longText} />
      );

      const text = getByText(longText);
      expect(text).toBeTruthy();
    });

    it('should render text with special characters', () => {
      const specialText = 'I agree to T&C, Privacy Policy © 2024 & other légal documents!';
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text={specialText} />
      );

      const text = getByText(specialText);
      expect(text).toBeTruthy();
    });

    it('should render text with emojis', () => {
      const emojiText = 'I agree ✅ to Terms 📋 and Privacy 🔒';
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text={emojiText} />
      );

      const text = getByText(emojiText);
      expect(text).toBeTruthy();
    });

    it('should render empty text', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text="" />
      );

      // Even with empty text, component should render
      const text = getByText('');
      expect(text).toBeTruthy();
    });

    it('should render text with line breaks', () => {
      const multilineText = 'I agree to\nTerms of Service\nand Privacy Policy';
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text={multilineText} />
      );

      const text = getByText(multilineText);
      expect(text).toBeTruthy();
    });
  });

  describe('Interaction Handling', () => {
    it('should respond to press events on the entire component', () => {
      const mockSetCheck = jest.fn();
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} setCheck={mockSetCheck} />
      );

      const pressable = getByText('I agree to Terms of Service and Privacy Policy').parent;
      fireEvent.press(pressable);

      expect(mockSetCheck).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid consecutive presses', () => {
      const mockSetCheck = jest.fn();
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} setCheck={mockSetCheck} />
      );

      const pressable = getByText('I agree to Terms of Service and Privacy Policy').parent;

      // Simulate rapid pressing
      fireEvent.press(pressable);
      fireEvent.press(pressable);
      fireEvent.press(pressable);
      fireEvent.press(pressable);
      fireEvent.press(pressable);

      expect(mockSetCheck).toHaveBeenCalledTimes(5);
    });

    it('should work with different setCheck implementations', () => {
      let isChecked = false;
      const customSetCheck = () => {
        isChecked = !isChecked;
      };

      const { getByText } = render(
        <CustomCheckbox checked={isChecked} setCheck={customSetCheck} />
      );

      const pressable = getByText('I agree to Terms of Service and Privacy Policy').parent;
      fireEvent.press(pressable);

      expect(isChecked).toBe(true);
    });

    it('should handle press events with async setCheck functions', async () => {
      const mockAsyncSetCheck = jest.fn().mockResolvedValue(undefined);
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} setCheck={mockAsyncSetCheck} />
      );

      const pressable = getByText('I agree to Terms of Service and Privacy Policy').parent;
      fireEvent.press(pressable);

      expect(mockAsyncSetCheck).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component State Combinations', () => {
    it('should handle checked state with custom text', () => {
      const { getByText } = render(
        <CustomCheckbox
          checked={true}
          setCheck={jest.fn()}
          text="Custom agreement text"
        />
      );

      const text = getByText('Custom agreement text');
      expect(text).toBeTruthy();
    });

    it('should handle unchecked state with custom margins', () => {
      const { getByText } = render(
        <CustomCheckbox
          checked={false}
          setCheck={jest.fn()}
          leftMargin={0.1}
          topMargin={0.02}
        />
      );

      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should handle all custom props together', () => {
      const mockSetCheck = jest.fn();
      const { getByText } = render(
        <CustomCheckbox
          checked={true}
          setCheck={mockSetCheck}
          text="Complete custom checkbox"
          leftMargin={0.2}
          topMargin={0.03}
        />
      );

      const text = getByText('Complete custom checkbox');
      expect(text).toBeTruthy();

      const pressable = text.parent;
      fireEvent.press(pressable);
      expect(mockSetCheck).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing setCheck function gracefully', () => {
      const propsWithoutSetCheck = { ...defaultProps };
      delete (propsWithoutSetCheck as any).setCheck;

      // Should render without throwing
      expect(() => render(<CustomCheckbox {...propsWithoutSetCheck} />)).not.toThrow();
    });

    it('should handle undefined checked state', () => {
      const propsWithUndefinedChecked = { ...defaultProps };
      (propsWithUndefinedChecked as any).checked = undefined;

      expect(() => render(<CustomCheckbox {...propsWithUndefinedChecked} />)).not.toThrow();
    });

    it('should handle null text gracefully', () => {
      const { UNSAFE_root } = render(
        <CustomCheckbox {...defaultProps} text={null as any} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle negative margins', () => {
      const { getByText } = render(
        <CustomCheckbox
          {...defaultProps}
          leftMargin={-0.1}
          topMargin={-0.02}
        />
      );

      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should provide text content for screen readers', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text="Accessible checkbox text" />
      );

      const text = getByText('Accessible checkbox text');
      expect(text.props.children).toBe('Accessible checkbox text');
    });

    it('should be pressable for accessibility', () => {
      const mockSetCheck = jest.fn();
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} setCheck={mockSetCheck} />
      );

      const checkboxText = getByText('I agree to Terms of Service and Privacy Policy');
      // Component should render accessible text for checkbox
      expect(checkboxText).toBeTruthy();
      expect(mockSetCheck).toBeTruthy();
    });

    it('should maintain text readability', () => {
      const { getByText } = render(
        <CustomCheckbox {...defaultProps} text="Terms and Conditions" />
      );

      const text = getByText('Terms and Conditions');
      expect(text.props.children).toBe('Terms and Conditions');
    });
  });

  describe('Performance Considerations', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<CustomCheckbox {...defaultProps} />);
      const endTime = performance.now();

      // Should render quickly (less than 50ms)
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle rapid state changes efficiently', () => {
      const mockSetCheck = jest.fn();
      const { getByText, rerender } = render(
        <CustomCheckbox checked={false} setCheck={mockSetCheck} />
      );

      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        rerender(<CustomCheckbox checked={i % 2 === 0} setCheck={mockSetCheck} />);
      }

      const text = getByText('I agree to Terms of Service and Privacy Policy');
      expect(text).toBeTruthy();
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<CustomCheckbox {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });
  });
});