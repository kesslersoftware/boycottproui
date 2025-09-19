/**
 * Test suite for CustomCheckbox component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import CustomCheckbox from '../../../components/customCheckbox/CustomCheckbox';

describe('CustomCheckbox Component', () => {
  const defaultProps = {
    checked: false,
    setCheck: jest.fn(),
  };

  it('should render without crashing', () => {
    expect(() => {
      render(<CustomCheckbox {...defaultProps} />);
    }).not.toThrow();
  });

  it('should render with checked true', () => {
    expect(() => {
      render(<CustomCheckbox {...defaultProps} checked={true} />);
    }).not.toThrow();
  });

  it('should render with checked false', () => {
    expect(() => {
      render(<CustomCheckbox {...defaultProps} checked={false} />);
    }).not.toThrow();
  });

  it('should render with custom text', () => {
    expect(() => {
      render(<CustomCheckbox {...defaultProps} text="Custom terms" />);
    }).not.toThrow();
  });

  it('should render with empty text', () => {
    expect(() => {
      render(<CustomCheckbox {...defaultProps} text="" />);
    }).not.toThrow();
  });

  it('should render with custom margins', () => {
    expect(() => {
      render(<CustomCheckbox {...defaultProps} leftMargin={0.1} topMargin={0.05} />);
    }).not.toThrow();
  });
});