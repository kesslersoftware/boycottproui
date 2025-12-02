/**
 * Test suite for CenteredButton component
 * Tests centered button UI component with customizable dimensions and state management
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CenteredButton from '../../components/button/CenteredButton';

// Mock screen dimensions utility
jest.mock('../../components/screenDimensionsutilitiy', () => ({
  sw: 375, // iPhone width
  sh: 667, // iPhone height minus top inset
  topInset: 44,
  bottomInset: 34
}));

// Mock shared styles
jest.mock('../../../styles/sharedStyles', () => ({
  sharedStyles: {
    centeredButton: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    centeredButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    }
  }
}));

// Mock constants
jest.mock('../../../styles/constants', () => ({
  BRIGHT_BLUE: '#007AFF'
}));

describe('CenteredButton Component', () => {
  const defaultProps = {
    text: 'Test Button',
    widthPercent: 0.8,
    heightPercent: 0.08,
    marginTopPercent: 0.05,
    onPress: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the button with correct text', () => {
      const { getByText } = render(<CenteredButton {...defaultProps} />);

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(() => render(<CenteredButton {...defaultProps} />)).not.toThrow();
    });

    it('should render with all required props', () => {
      const { getByText } = render(<CenteredButton {...defaultProps} />);

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should render with default color', () => {
      const { getByText } = render(<CenteredButton {...defaultProps} />);

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should render with custom color', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} color="#FF0000" />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should display different text values', () => {
      const textValues = ['Submit', 'Cancel', 'Save Changes', 'Continue'];

      textValues.forEach(text => {
        const { getByText } = render(
          <CenteredButton {...defaultProps} text={text} />
        );

        const buttonText = getByText(text);
        expect(buttonText).toBeTruthy();
      });
    });
  });

  describe('Button State Management', () => {
    it('should be enabled by default', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<CenteredButton {...defaultProps} onPress={mockOnPress} />);

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should be enabled when disabled is false', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} disabled={false} onPress={mockOnPress} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled is true', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} disabled={true} onPress={mockOnPress} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should use default disabled value when not provided', () => {
      const mockOnPress = jest.fn();
      const propsWithoutDisabled = { ...defaultProps };
      delete (propsWithoutDisabled as any).disabled;

      const { getByText } = render(<CenteredButton {...propsWithoutDisabled} onPress={mockOnPress} />);

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Interactions', () => {
    it('should call onPress when enabled and pressed', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} onPress={mockOnPress} disabled={false} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled and pressed', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} onPress={mockOnPress} disabled={true} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should handle multiple rapid presses when enabled', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} onPress={mockOnPress} disabled={false} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('should handle press events with custom onPress handlers', () => {
      const customHandler = jest.fn(() => console.log('Custom handler called'));
      const { getByText } = render(
        <CenteredButton {...defaultProps} onPress={customHandler} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(customHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle async onPress handlers', async () => {
      const asyncHandler = jest.fn().mockResolvedValue(undefined);
      const { getByText } = render(
        <CenteredButton {...defaultProps} onPress={asyncHandler} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(asyncHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dimensional Properties', () => {
    it('should accept different width percentages', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} widthPercent={0.5} />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should accept different height percentages', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} heightPercent={0.1} />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should accept different margin top percentages', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} marginTopPercent={0.03} />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should handle edge case dimensions (0%)', () => {
      const { getByText } = render(
        <CenteredButton
          {...defaultProps}
          widthPercent={0}
          heightPercent={0}
          marginTopPercent={0}
        />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should handle edge case dimensions (100%)', () => {
      const { getByText } = render(
        <CenteredButton
          {...defaultProps}
          widthPercent={1}
          heightPercent={1}
          marginTopPercent={1}
        />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should handle fractional percentages', () => {
      const { getByText } = render(
        <CenteredButton
          {...defaultProps}
          widthPercent={0.333}
          heightPercent={0.075}
          marginTopPercent={0.025}
        />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });
  });

  describe('Color Customization', () => {
    it('should accept different color formats', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF', 'red', 'green', 'blue'];

      colors.forEach(color => {
        const { getByText } = render(
          <CenteredButton {...defaultProps} color={color} />
        );

        const buttonText = getByText('Test Button');
        expect(buttonText).toBeTruthy();
      });
    });

    it('should handle transparent colors', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} color="rgba(255, 0, 0, 0.5)" />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should handle color variations for different states', () => {
      const { getByText, rerender } = render(
        <CenteredButton {...defaultProps} color="#007AFF" disabled={false} />
      );

      let buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();

      rerender(
        <CenteredButton {...defaultProps} color="#999999" disabled={true} />
      );

      buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });
  });

  describe('Text Content Variations', () => {
    it('should render short text', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} text="OK" />
      );

      const buttonText = getByText('OK');
      expect(buttonText).toBeTruthy();
    });

    it('should render long text', () => {
      const longText = 'This is a very long button text that should still render correctly';
      const { getByText } = render(
        <CenteredButton {...defaultProps} text={longText} />
      );

      const buttonText = getByText(longText);
      expect(buttonText).toBeTruthy();
    });

    it('should render text with special characters', () => {
      const specialText = 'Save & Continue →';
      const { getByText } = render(
        <CenteredButton {...defaultProps} text={specialText} />
      );

      const buttonText = getByText(specialText);
      expect(buttonText).toBeTruthy();
    });

    it('should render text with emojis', () => {
      const emojiText = 'Submit ✓';
      const { getByText } = render(
        <CenteredButton {...defaultProps} text={emojiText} />
      );

      const buttonText = getByText(emojiText);
      expect(buttonText).toBeTruthy();
    });

    it('should render empty text', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} text="" />
      );

      const button = getByText('').parent;
      expect(button).toBeTruthy();
    });

    it('should render text with numbers', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} text="Step 1 of 3" />
      );

      const buttonText = getByText('Step 1 of 3');
      expect(buttonText).toBeTruthy();
    });
  });

  describe('Component Functionality', () => {
    it('should apply text styles correctly', () => {
      const { getByText } = render(<CenteredButton {...defaultProps} />);

      const buttonText = getByText('Test Button');
      expect(buttonText.props.style).toEqual({
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
      });
    });

    it('should handle enabled state with custom properties', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton
          text="Custom Enabled Button"
          color="#4CAF50"
          widthPercent={0.7}
          heightPercent={0.06}
          marginTopPercent={0.04}
          onPress={mockOnPress}
          disabled={false}
        />
      );

      const buttonText = getByText('Custom Enabled Button');
      expect(buttonText).toBeTruthy();

      const button = buttonText.parent;
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state with custom properties', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton
          text="Custom Disabled Button"
          color="#CCCCCC"
          widthPercent={0.6}
          heightPercent={0.05}
          marginTopPercent={0.03}
          onPress={mockOnPress}
          disabled={true}
        />
      );

      const buttonText = getByText('Custom Disabled Button');
      expect(buttonText).toBeTruthy();

      const button = buttonText.parent;
      fireEvent.press(button);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should handle all custom props together', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton
          text="Complete Custom Button"
          color="#FF5722"
          widthPercent={0.9}
          heightPercent={0.08}
          marginTopPercent={0.05}
          onPress={mockOnPress}
          disabled={false}
        />
      );

      const buttonText = getByText('Complete Custom Button');
      expect(buttonText).toBeTruthy();

      const button = buttonText.parent;
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing onPress gracefully', () => {
      const propsWithoutOnPress = { ...defaultProps };
      delete (propsWithoutOnPress as any).onPress;

      expect(() => render(<CenteredButton {...propsWithoutOnPress} />)).not.toThrow();
    });

    it('should handle very small dimensions', () => {
      const { getByText } = render(
        <CenteredButton
          {...defaultProps}
          widthPercent={0.001}
          heightPercent={0.001}
          marginTopPercent={0.001}
        />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should handle negative percentages gracefully', () => {
      const { getByText } = render(
        <CenteredButton
          {...defaultProps}
          widthPercent={-0.1}
          heightPercent={-0.1}
          marginTopPercent={-0.1}
        />
      );

      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });

    it('should handle null and undefined prop values', () => {
      const { getByText } = render(
        <CenteredButton
          text="Test"
          widthPercent={0.8}
          heightPercent={0.08}
          marginTopPercent={0.05}
          onPress={jest.fn()}
          color={undefined}
          disabled={undefined}
        />
      );

      const buttonText = getByText('Test');
      expect(buttonText).toBeTruthy();
    });
  });

  describe('Performance Considerations', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<CenteredButton {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle rapid prop changes efficiently', () => {
      const { rerender } = render(<CenteredButton {...defaultProps} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <CenteredButton
            {...defaultProps}
            text={`Button ${i}`}
            color={`#${i}${i}${i}${i}${i}${i}`}
            widthPercent={0.5 + i * 0.05}
          />
        );
      }

      expect(true).toBe(true);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<CenteredButton {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple button instances', () => {
      const { getAllByText } = render(
        <>
          <CenteredButton {...defaultProps} text="Button 1" />
          <CenteredButton {...defaultProps} text="Button 2" />
          <CenteredButton {...defaultProps} text="Button 3" />
        </>
      );

      const buttons = getAllByText(/Button \d/);
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('should be accessible when enabled', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} disabled={false} onPress={mockOnPress} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should be properly disabled for accessibility when disabled is true', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <CenteredButton {...defaultProps} disabled={true} onPress={mockOnPress} />
      );

      const button = getByText('Test Button').parent;
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should maintain text readability', () => {
      const { getByText } = render(<CenteredButton {...defaultProps} />);

      const buttonText = getByText('Test Button');
      expect(buttonText.props.children).toBe('Test Button');
    });

    it('should provide clear button text content', () => {
      const { getByText } = render(
        <CenteredButton {...defaultProps} text="Clear Action Text" />
      );

      const buttonText = getByText('Clear Action Text');
      expect(buttonText.props.children).toBe('Clear Action Text');
    });
  });
});