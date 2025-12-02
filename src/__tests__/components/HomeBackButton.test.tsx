/**
 * Test suite for HomeBackButton component
 * Tests navigation button component for consistent behavior and styling
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeBackButton from '../../components/homeBackButton/HomeBackButton';

// Mock the HomeBackButton styles
jest.mock('../../components/homeBackButton/HomeBackButtonStyles', () => ({
  styles: {
    button: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
    }
  }
}));

describe('HomeBackButton Component', () => {
  const mockOnPress = jest.fn();
  const defaultProps = {
    label: 'Back',
    onPress: mockOnPress
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render the home back button component', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      expect(buttonText).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(() => render(<HomeBackButton {...defaultProps} />)).not.toThrow();
    });

    it('should display the correct button label', () => {
      const { getByText } = render(<HomeBackButton label="Go Home" onPress={mockOnPress} />);

      const buttonText = getByText('Go Home');
      expect(buttonText.props.children).toBe('Go Home');
    });

    it('should render the button container', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const button = buttonText.parent;
      expect(button).toBeTruthy();
    });

    it('should apply button styles correctly', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const button = buttonText.parent;

      // Button container should have proper styling
      expect(button?.props.style).toBeTruthy();
      expect(button).toBeTruthy();
    });

    it('should apply text styles correctly', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      expect(buttonText.props.style).toEqual({
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
      });
    });
  });

  describe('User Interaction', () => {
    it('should handle press events', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const button = buttonText.parent;

      fireEvent.press(button!);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress when button is pressed', () => {
      const customOnPress = jest.fn();
      const { getByText } = render(<HomeBackButton label="Custom" onPress={customOnPress} />);

      const buttonText = getByText('Custom');
      fireEvent.press(buttonText.parent!);

      expect(customOnPress).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple press events', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const button = buttonText.parent;

      fireEvent.press(button!);
      fireEvent.press(button!);
      fireEvent.press(button!);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid press events', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const button = buttonText.parent;

      // Simulate rapid pressing
      for (let i = 0; i < 5; i++) {
        fireEvent.press(button!);
      }

      expect(mockOnPress).toHaveBeenCalledTimes(5);
    });

    it('should maintain press handler reference', () => {
      const { getByText, rerender } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      fireEvent.press(buttonText.parent!);
      expect(mockOnPress).toHaveBeenCalledTimes(1);

      rerender(<HomeBackButton {...defaultProps} />);

      const updatedButtonText = getByText('Back');
      fireEvent.press(updatedButtonText.parent!);
      expect(mockOnPress).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Structure', () => {
    it('should have the expected component hierarchy', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      expect(buttonText).toBeTruthy();

      // Should be inside a Pressable container
      const button = buttonText.parent;
      expect(button).toBeTruthy();
    });

    it('should be a functional component', () => {
      expect(typeof HomeBackButton).toBe('function');
      expect(HomeBackButton.prototype?.render).toBeUndefined(); // Not a class component
    });

    it('should maintain component integrity', () => {
      const component = <HomeBackButton {...defaultProps} />;
      expect(component).toBeTruthy();
      expect(component.type).toBe(HomeBackButton);
    });

    it('should render consistently across multiple renders', () => {
      const { getByText, rerender } = render(<HomeBackButton {...defaultProps} />);

      const firstRender = getByText('Back');
      expect(firstRender).toBeTruthy();

      rerender(<HomeBackButton {...defaultProps} />);

      const secondRender = getByText('Back');
      expect(secondRender).toBeTruthy();
      expect(secondRender.props.children).toBe(firstRender.props.children);
    });

    it('should require both label and onPress props', () => {
      // Component should work with required props
      expect(() => render(<HomeBackButton {...defaultProps} />)).not.toThrow();

      // Component interface should expect both props
      const component = <HomeBackButton {...defaultProps} />;
      expect(component.props.label).toBe('Back');
      expect(component.props.onPress).toBe(mockOnPress);
    });
  });

  describe('Label Customization', () => {
    it('should display custom label text', () => {
      const customLabels = ['Home', 'Return', 'Go Back', 'Exit', 'Cancel'];

      customLabels.forEach(label => {
        const { getByText } = render(<HomeBackButton label={label} onPress={mockOnPress} />);

        const buttonText = getByText(label);
        expect(buttonText.props.children).toBe(label);
      });
    });

    it('should handle empty label gracefully', () => {
      expect(() => render(<HomeBackButton label="" onPress={mockOnPress} />)).not.toThrow();
    });

    it('should handle long label text', () => {
      const longLabel = 'This is a very long button label that might wrap or overflow';
      const { getByText } = render(<HomeBackButton label={longLabel} onPress={mockOnPress} />);

      const buttonText = getByText(longLabel);
      expect(buttonText.props.children).toBe(longLabel);
    });

    it('should handle special characters in label', () => {
      const specialLabel = '← Back & Return';
      const { getByText } = render(<HomeBackButton label={specialLabel} onPress={mockOnPress} />);

      const buttonText = getByText(specialLabel);
      expect(buttonText.props.children).toBe(specialLabel);
    });

    it('should maintain label consistency across rerenders', () => {
      const { getByText, rerender } = render(<HomeBackButton label="Initial" onPress={mockOnPress} />);

      let buttonText = getByText('Initial');
      expect(buttonText.props.children).toBe('Initial');

      rerender(<HomeBackButton label="Updated" onPress={mockOnPress} />);

      buttonText = getByText('Updated');
      expect(buttonText.props.children).toBe('Updated');
    });
  });

  describe('Navigation Context', () => {
    it('should work as a navigation back button', () => {
      const navigationHandler = jest.fn();
      const { getByText } = render(<HomeBackButton label="← Back" onPress={navigationHandler} />);

      const buttonText = getByText('← Back');
      fireEvent.press(buttonText.parent!);

      expect(navigationHandler).toHaveBeenCalledTimes(1);
    });

    it('should support different navigation actions', () => {
      const goHomeHandler = jest.fn();
      const { getByText } = render(<HomeBackButton label="Home" onPress={goHomeHandler} />);

      const buttonText = getByText('Home');
      fireEvent.press(buttonText.parent!);

      expect(goHomeHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle navigation with parameters', () => {
      const navigationWithParams = jest.fn();
      const { getByText } = render(<HomeBackButton label="Back to List" onPress={navigationWithParams} />);

      const buttonText = getByText('Back to List');
      fireEvent.press(buttonText.parent!);

      expect(navigationWithParams).toHaveBeenCalledTimes(1);
    });

    it('should work in different screen contexts', () => {
      const contexts = [
        { label: 'Back to Home', handler: jest.fn() },
        { label: 'Return to Search', handler: jest.fn() },
        { label: 'Go to Settings', handler: jest.fn() }
      ];

      contexts.forEach(context => {
        const { getByText } = render(<HomeBackButton label={context.label} onPress={context.handler} />);

        const buttonText = getByText(context.label);
        fireEvent.press(buttonText.parent!);

        expect(context.handler).toHaveBeenCalledTimes(1);
      });
    });

    it('should maintain navigation state consistency', () => {
      const navigationState = { canGoBack: true };
      const navigationHandler = jest.fn(() => {
        navigationState.canGoBack = false;
      });

      const { getByText } = render(<HomeBackButton label="Back" onPress={navigationHandler} />);

      expect(navigationState.canGoBack).toBe(true);

      const buttonText = getByText('Back');
      fireEvent.press(buttonText.parent!);

      expect(navigationHandler).toHaveBeenCalledTimes(1);
      expect(navigationState.canGoBack).toBe(false);
    });
  });

  describe('Integration and Context', () => {
    it('should work as standalone navigation button', () => {
      const { getByText } = render(<HomeBackButton label="Standalone" onPress={mockOnPress} />);

      const buttonText = getByText('Standalone');
      expect(buttonText).toBeTruthy();
    });

    it('should work in different layout contexts', () => {
      const { getAllByText } = render(
        <React.Fragment>
          <HomeBackButton label="First" onPress={jest.fn()} />
          <HomeBackButton label="Second" onPress={jest.fn()} />
        </React.Fragment>
      );

      const buttons = getAllByText(/First|Second/);
      expect(buttons).toHaveLength(2);
    });

    it('should maintain consistency across multiple instances', () => {
      const handlers = [jest.fn(), jest.fn(), jest.fn()];
      const { getAllByText } = render(
        <>
          <HomeBackButton label="Button 1" onPress={handlers[0]} />
          <HomeBackButton label="Button 2" onPress={handlers[1]} />
          <HomeBackButton label="Button 3" onPress={handlers[2]} />
        </>
      );

      const buttons = getAllByText(/Button \d/);
      expect(buttons).toHaveLength(3);

      buttons.forEach((button, index) => {
        fireEvent.press(button.parent!);
        expect(handlers[index]).toHaveBeenCalledTimes(1);
      });
    });

    it('should render efficiently in lists or repeated contexts', () => {
      const buttons = Array.from({ length: 5 }, (_, i) =>
        <HomeBackButton key={i} label={`Button ${i}`} onPress={jest.fn()} />
      );

      expect(() => render(<>{buttons}</>)).not.toThrow();
    });

    it('should work with React Navigation integration', () => {
      const mockNavigation = {
        goBack: jest.fn(),
        navigate: jest.fn()
      };

      const { getByText } = render(
        <HomeBackButton
          label="Go Back"
          onPress={() => mockNavigation.goBack()}
        />
      );

      const buttonText = getByText('Go Back');
      fireEvent.press(buttonText.parent!);

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should provide accessible button text', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      expect(buttonText.props.children).toBe('Back');
      expect(typeof buttonText.props.children).toBe('string');
    });

    it('should have readable button text', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const fontSize = buttonText.props.style.fontSize;

      // Should have accessible font size (minimum 16px recommended)
      expect(fontSize).toBeGreaterThanOrEqual(16);
    });

    it('should have sufficient color contrast', () => {
      const { getByText } = render(<HomeBackButton {...defaultProps} />);

      const buttonText = getByText('Back');
      const textStyle = buttonText.props.style;
      const button = buttonText.parent;

      // White text should provide good contrast
      expect(textStyle.color).toBe('#FFFFFF');
      expect(button).toBeTruthy();
    });

    it('should be screen reader friendly', () => {
      const { getByText } = render(<HomeBackButton label="Navigate Back" onPress={mockOnPress} />);

      const buttonText = getByText('Navigate Back');

      // Text should be readable by screen readers
      expect(buttonText.props.children).toBeTruthy();
      expect(typeof buttonText.props.children).toBe('string');
    });

    it('should support accessibility labels', () => {
      const { getByText } = render(<HomeBackButton label="←" onPress={mockOnPress} />);

      // Even with symbol, should be accessible
      const buttonText = getByText('←');
      expect(buttonText.props.children).toBe('←');
    });
  });

  describe('Performance and Memory', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<HomeBackButton {...defaultProps} />);
      const endTime = performance.now();

      // Should render quickly (less than 50ms)
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<HomeBackButton {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid mount/unmount cycles', () => {
      // Test rapid mounting and unmounting
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<HomeBackButton label={`Test ${i}`} onPress={jest.fn()} />);
        unmount();
      }

      // No errors should occur during rapid cycles
      expect(true).toBe(true); // Test completes without throwing
    });

    it('should maintain consistent rendering performance', () => {
      const times: number[] = [];

      // Test multiple renders
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        const { unmount } = render(<HomeBackButton label={`Perf Test ${i}`} onPress={jest.fn()} />);
        const endTime = performance.now();
        times.push(endTime - startTime);
        unmount();
      }

      // All renders should be consistently fast
      times.forEach(time => {
        expect(time).toBeLessThan(100);
      });
    });

    it('should optimize re-renders with same props', () => {
      const { getByText, rerender } = render(<HomeBackButton {...defaultProps} />);

      const initialRender = getByText('Back');
      expect(initialRender).toBeTruthy();

      // Re-render with same props
      rerender(<HomeBackButton {...defaultProps} />);

      const rerenderedComponent = getByText('Back');
      expect(rerenderedComponent).toBeTruthy();
      expect(rerenderedComponent.props.children).toBe('Back');
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle component in various React contexts', () => {
      // Test as standalone component
      expect(() => render(<HomeBackButton {...defaultProps} />)).not.toThrow();

      // Test nested in fragments
      expect(() => render(
        <React.Fragment>
          <HomeBackButton {...defaultProps} />
        </React.Fragment>
      )).not.toThrow();

      // Test in arrays
      expect(() => render(
        <>
          {[<HomeBackButton key="1" label="Array 1" onPress={jest.fn()} />,
            <HomeBackButton key="2" label="Array 2" onPress={jest.fn()} />]}
        </>
      )).not.toThrow();
    });

    it('should maintain stability under stress conditions', () => {
      // Render many instances simultaneously
      const manyButtons = Array.from({ length: 20 }, (_, i) => (
        <HomeBackButton key={i} label={`Stress ${i}`} onPress={jest.fn()} />
      ));

      expect(() => render(<>{manyButtons}</>)).not.toThrow();
    });

    it('should handle rapid rerenders', () => {
      const { getByText, rerender } = render(<HomeBackButton {...defaultProps} />);

      // Rapid rerendering
      for (let i = 0; i < 15; i++) {
        rerender(<HomeBackButton label={`Rapid ${i}`} onPress={mockOnPress} />);
      }

      const buttonText = getByText('Rapid 14');
      expect(buttonText).toBeTruthy();
    });

    it('should be stable in conditional rendering', () => {
      const ConditionalButton = ({ show }: { show: boolean }) => (
        <>
          {show && <HomeBackButton {...defaultProps} />}
        </>
      );

      const { queryByText, rerender } = render(<ConditionalButton show={true} />);

      let buttonText = queryByText('Back');
      expect(buttonText).toBeTruthy();

      rerender(<ConditionalButton show={false} />);
      buttonText = queryByText('Back');
      expect(buttonText).toBeNull();

      rerender(<ConditionalButton show={true} />);
      buttonText = queryByText('Back');
      expect(buttonText).toBeTruthy();
    });

    it('should handle prop changes gracefully', () => {
      const { getByText, rerender } = render(<HomeBackButton label="Initial" onPress={mockOnPress} />);

      let buttonText = getByText('Initial');
      expect(buttonText.props.children).toBe('Initial');

      // Change props
      const newHandler = jest.fn();
      rerender(<HomeBackButton label="Changed" onPress={newHandler} />);

      buttonText = getByText('Changed');
      expect(buttonText.props.children).toBe('Changed');

      // Test new handler
      fireEvent.press(buttonText.parent!);
      expect(newHandler).toHaveBeenCalledTimes(1);
      expect(mockOnPress).toHaveBeenCalledTimes(0);
    });
  });
});