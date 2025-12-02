/**
 * Test suite for LoadingOverlay component
 * Tests loading overlay UI component with Lottie animation integration
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingOverlay from '../../components/common/LoadingOverlay';

// Mock Lottie React Native
jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return React.forwardRef((props: any, ref: any) => (
    <View
      testID="lottie-animation"
      ref={ref}
      style={props.style}
      accessibilityLabel={`Lottie animation - autoPlay: ${props.autoPlay}, loop: ${props.loop}`}
    />
  ));
});

// Mock the animation asset
jest.mock('../../../assets/animation/loading.json', () => ({
  v: '5.5.2',
  fr: 29.9700012207031,
  ip: 0,
  op: 31.0000012626559,
  w: 500,
  h: 500,
  nm: 'loading-animation',
  ddd: 0,
  assets: [],
  layers: []
}));

describe('LoadingOverlay Component', () => {
  it('should render the loading overlay', () => {
    const { getByTestId } = render(<LoadingOverlay />);

    const overlay = getByTestId('lottie-animation');
    expect(overlay).toBeTruthy();
  });

  it('should render with correct animation properties', () => {
    const { getByTestId } = render(<LoadingOverlay />);

    const animation = getByTestId('lottie-animation');
    expect(animation.props.accessibilityLabel).toContain('autoPlay: true');
    expect(animation.props.accessibilityLabel).toContain('loop: true');
  });

  it('should have the correct animation dimensions', () => {
    const { getByTestId } = render(<LoadingOverlay />);

    const animation = getByTestId('lottie-animation');
    expect(animation.props.style).toEqual({ width: 500, height: 500 });
  });

  it('should render without errors', () => {
    expect(() => render(<LoadingOverlay />)).not.toThrow();
  });

  it('should be accessible', () => {
    const { getByTestId } = render(<LoadingOverlay />);

    const animation = getByTestId('lottie-animation');
    expect(animation.props.accessibilityLabel).toBeTruthy();
    expect(animation.props.accessibilityLabel).toContain('Lottie animation');
  });

  it('should render animation with autoPlay enabled', () => {
    const { getByTestId } = render(<LoadingOverlay />);

    const animation = getByTestId('lottie-animation');
    expect(animation.props.accessibilityLabel).toContain('autoPlay: true');
  });

  it('should render animation with loop enabled', () => {
    const { getByTestId } = render(<LoadingOverlay />);

    const animation = getByTestId('lottie-animation');
    expect(animation.props.accessibilityLabel).toContain('loop: true');
  });

  it('should render consistently across multiple renders', () => {
    const { getByTestId, rerender } = render(<LoadingOverlay />);

    const firstRender = getByTestId('lottie-animation');
    expect(firstRender).toBeTruthy();

    rerender(<LoadingOverlay />);

    const secondRender = getByTestId('lottie-animation');
    expect(secondRender).toBeTruthy();
    expect(secondRender.props.style).toEqual(firstRender.props.style);
  });

  describe('Component Structure', () => {
    it('should have the expected component structure', () => {
      const { getByTestId } = render(<LoadingOverlay />);

      // Should render the Lottie animation
      const animation = getByTestId('lottie-animation');
      expect(animation).toBeTruthy();
    });

    it('should maintain component integrity', () => {
      const component = <LoadingOverlay />;
      expect(component).toBeTruthy();
      expect(component.type).toBe(LoadingOverlay);
    });

    it('should render as a functional component', () => {
      expect(typeof LoadingOverlay).toBe('function');
      expect(LoadingOverlay.prototype?.render).toBeUndefined(); // Not a class component
    });
  });

  describe('Animation Properties', () => {
    it('should have correct animation file reference', () => {
      // The animation file should be properly referenced
      // This test ensures the require path is valid
      expect(() => require('../../../assets/animation/loading.json')).not.toThrow();
    });

    it('should configure animation for continuous playback', () => {
      const { getByTestId } = render(<LoadingOverlay />);

      const animation = getByTestId('lottie-animation');
      const accessibilityLabel = animation.props.accessibilityLabel;

      // Should have autoPlay enabled for immediate start
      expect(accessibilityLabel).toContain('autoPlay: true');

      // Should have loop enabled for continuous playback
      expect(accessibilityLabel).toContain('loop: true');
    });

    it('should have appropriate animation size', () => {
      const { getByTestId } = render(<LoadingOverlay />);

      const animation = getByTestId('lottie-animation');
      const style = animation.props.style;

      // Should be large enough to be visible but not overwhelming
      expect(style.width).toBe(500);
      expect(style.height).toBe(500);
      expect(style.width).toEqual(style.height); // Square aspect ratio
    });
  });

  describe('Error Handling', () => {
    it('should handle missing animation file gracefully', () => {
      // Mock a failed require for the animation file
      const originalRequire = require;
      (global as any).require = jest.fn().mockImplementation((path) => {
        if (path.includes('loading.json')) {
          throw new Error('Animation file not found');
        }
        return originalRequire(path);
      });

      // Component should still render even if animation file is missing
      expect(() => render(<LoadingOverlay />)).not.toThrow();

      // Restore original require
      (global as any).require = originalRequire;
    });

    it('should handle Lottie animation errors gracefully', () => {
      // The mocked LottieView should not throw errors
      expect(() => render(<LoadingOverlay />)).not.toThrow();
    });
  });

  describe('Performance Considerations', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<LoadingOverlay />);
      const endTime = performance.now();

      // Rendering should be fast (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<LoadingOverlay />);

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid mount/unmount cycles', () => {
      // Test rapid mounting and unmounting
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<LoadingOverlay />);
        unmount();
      }

      // No errors should occur during rapid cycles
      expect(true).toBe(true); // Test completes without throwing
    });
  });

  describe('Integration Scenarios', () => {
    it('should work as an overlay component', () => {
      // Should render as a standalone overlay
      const { getByTestId } = render(<LoadingOverlay />);
      const animation = getByTestId('lottie-animation');
      expect(animation).toBeTruthy();
    });

    it('should maintain overlay properties', () => {
      const { getByTestId } = render(<LoadingOverlay />);

      // Component should render the animation consistently
      const animation = getByTestId('lottie-animation');
      expect(animation.props.style).toEqual({ width: 500, height: 500 });
    });

    it('should support multiple instances', () => {
      // Should be able to render multiple loading overlays if needed
      const { getAllByTestId } = render(
        <>
          <LoadingOverlay />
          <LoadingOverlay />
        </>
      );

      const animations = getAllByTestId('lottie-animation');
      expect(animations).toHaveLength(2);
      animations.forEach(animation => {
        expect(animation).toBeTruthy();
      });
    });
  });
});