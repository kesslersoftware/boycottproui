/**
 * Test suite for CenteredButton component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import CenteredButton from '../../../components/button/CenteredButton';

describe('CenteredButton Component', () => {
  const defaultProps = {
    text: 'Test Button',
    widthPercent: 0.8,
    heightPercent: 0.06,
    marginTopPercent: 0.02,
    onPress: jest.fn(),
  };

  it('should render without crashing', () => {
    expect(() => {
      render(<CenteredButton {...defaultProps} />);
    }).not.toThrow();
  });

  it('should render with disabled true', () => {
    expect(() => {
      render(<CenteredButton {...defaultProps} disabled={true} />);
    }).not.toThrow();
  });

  it('should render with disabled false', () => {
    expect(() => {
      render(<CenteredButton {...defaultProps} disabled={false} />);
    }).not.toThrow();
  });

  it('should render with custom text', () => {
    expect(() => {
      render(<CenteredButton {...defaultProps} text="Custom Text" />);
    }).not.toThrow();
  });

  it('should render with empty text', () => {
    expect(() => {
      render(<CenteredButton {...defaultProps} text="" />);
    }).not.toThrow();
  });

  it('should render with custom color', () => {
    expect(() => {
      render(<CenteredButton {...defaultProps} color="#FF0000" />);
    }).not.toThrow();
  });
});