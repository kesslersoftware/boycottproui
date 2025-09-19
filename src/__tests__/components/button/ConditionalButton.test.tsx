/**
 * Test suite for ConditionalButton component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ConditionalButton from '../../../components/button/ConditionalButton';

describe('ConditionalButton Component', () => {
  const defaultProps = {
    text: 'Test Button',
    widthPercent: 0.8,
    heightPercent: 0.06,
    marginTopPercent: 0.02,
    onPress: jest.fn(),
  };

  it('should render without crashing', () => {
    expect(() => {
      render(<ConditionalButton {...defaultProps} />);
    }).not.toThrow();
  });

  it('should render with hasItems true', () => {
    expect(() => {
      render(<ConditionalButton {...defaultProps} hasItems={true} />);
    }).not.toThrow();
  });

  it('should render with hasItems false', () => {
    expect(() => {
      render(<ConditionalButton {...defaultProps} hasItems={false} />);
    }).not.toThrow();
  });

  it('should render with custom text', () => {
    expect(() => {
      render(<ConditionalButton {...defaultProps} text="Custom Text" />);
    }).not.toThrow();
  });

  it('should render with empty text', () => {
    expect(() => {
      render(<ConditionalButton {...defaultProps} text="" />);
    }).not.toThrow();
  });
});