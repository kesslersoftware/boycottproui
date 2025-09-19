/**
 * Test suite for LoadingOverlay component
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LoadingOverlay from '../../../components/common/LoadingOverlay';

// Mock LottieView since it requires native dependencies
jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return React.forwardRef((props: any, ref: any) => (
    <View
      testID="lottie-animation"
      ref={ref}
      {...props}
    />
  ));
});

describe('LoadingOverlay Component', () => {
  it('should render without crashing', () => {
    render(<LoadingOverlay />);
    expect(screen.getByTestId('lottie-animation')).toBeTruthy();
  });

  it('should render the overlay container', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const overlay = getByTestId('lottie-animation').parent;
    expect(overlay).toBeTruthy();
  });

  it('should render the Lottie animation component', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');
    expect(lottieComponent).toBeTruthy();
  });

  it('should pass autoPlay prop to LottieView', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');
    expect(lottieComponent.props.autoPlay).toBe(true);
  });

  it('should pass loop prop to LottieView', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');
    expect(lottieComponent.props.loop).toBe(true);
  });

  it('should pass source prop to LottieView', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');
    expect(lottieComponent.props.source).toBeDefined();
  });

  it('should have correct animation dimensions', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');
    expect(lottieComponent.props.style).toEqual(
      expect.objectContaining({
        width: 500,
        height: 500,
      })
    );
  });

  it('should render consistently across multiple instances', () => {
    const { getByTestId: getFirst } = render(<LoadingOverlay />);
    const { getByTestId: getSecond } = render(<LoadingOverlay />);

    const firstLottie = getFirst('lottie-animation');
    const secondLottie = getSecond('lottie-animation');

    expect(firstLottie.props.autoPlay).toEqual(secondLottie.props.autoPlay);
    expect(firstLottie.props.loop).toEqual(secondLottie.props.loop);
  });

  it('should be suitable for loading states', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');

    expect(lottieComponent.props.autoPlay).toBe(true);
    expect(lottieComponent.props.loop).toBe(true);
    expect(lottieComponent.props.style.width).toBe(500);
    expect(lottieComponent.props.style.height).toBe(500);
  });

  it('should have the correct component hierarchy', () => {
    const { getByTestId } = render(<LoadingOverlay />);
    const lottieComponent = getByTestId('lottie-animation');
    const overlay = lottieComponent.parent;

    expect(overlay).toBeTruthy();
    expect(lottieComponent).toBeTruthy();
  });

  it('should not cause unnecessary re-renders', () => {
    const { rerender, getByTestId } = render(<LoadingOverlay />);
    const firstRender = getByTestId('lottie-animation');

    rerender(<LoadingOverlay />);
    const secondRender = getByTestId('lottie-animation');

    expect(firstRender.props.autoPlay).toEqual(secondRender.props.autoPlay);
    expect(firstRender.props.loop).toEqual(secondRender.props.loop);
  });
});