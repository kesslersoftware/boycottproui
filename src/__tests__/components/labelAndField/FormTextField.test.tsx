/**
 * Test suite for FormTextField component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import FormTextField from '../../../components/labelAndField/FormTextField';

describe('FormTextField Component', () => {
  const defaultProps = {
    labelText: 'Test Label',
    labelMarginTop: 16,
  };

  it('should render with required props', () => {
    render(<FormTextField {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByDisplayValue('')).toBeTruthy();
  });

  it('should render label text correctly', () => {
    const customLabel = 'Custom Field Label';
    render(<FormTextField {...defaultProps} labelText={customLabel} />);
    expect(screen.getByText(customLabel)).toBeTruthy();
  });

  it('should hide label when hideLabel is true', () => {
    render(<FormTextField {...defaultProps} hideLabel={true} />);
    expect(screen.queryByText('Test Label')).toBeNull();
    expect(screen.getByDisplayValue('')).toBeTruthy();
  });

  it('should show label when hideLabel is false', () => {
    render(<FormTextField {...defaultProps} hideLabel={false} />);
    expect(screen.getByText('Test Label')).toBeTruthy();
  });

  it('should handle text input changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <FormTextField {...defaultProps} onChangeText={mockOnChangeText} />
    );

    const textInput = getByDisplayValue('');
    fireEvent.changeText(textInput, 'test input');
    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('should display initial value', () => {
    const initialValue = 'Initial text value';
    render(<FormTextField {...defaultProps} value={initialValue} />);
    expect(screen.getByDisplayValue(initialValue)).toBeTruthy();
  });

  it('should display placeholder text', () => {
    const placeholderText = 'Enter your text here';
    const { getByPlaceholderText } = render(
      <FormTextField {...defaultProps} placeholder={placeholderText} />
    );
    expect(getByPlaceholderText(placeholderText)).toBeTruthy();
  });

  it('should use number keyboard when isNumber is true', () => {
    const { getByDisplayValue } = render(
      <FormTextField {...defaultProps} isNumber={true} />
    );
    const numberInput = getByDisplayValue('');
    expect(numberInput.props.keyboardType).toBe('number-pad');
  });

  it('should not use number keyboard when isNumber is false', () => {
    const { getByDisplayValue } = render(
      <FormTextField {...defaultProps} isNumber={false} />
    );
    const textInput = getByDisplayValue('');
    expect(textInput.props.keyboardType).toBeUndefined();
  });

  it('should handle number input changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <FormTextField {...defaultProps} isNumber={true} onChangeText={mockOnChangeText} />
    );

    const numberInput = getByDisplayValue('');
    fireEvent.changeText(numberInput, '12345');
    expect(mockOnChangeText).toHaveBeenCalledWith('12345');
  });

  it('should handle multiple text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <FormTextField {...defaultProps} onChangeText={mockOnChangeText} />
    );

    const textInput = getByDisplayValue('');
    fireEvent.changeText(textInput, 'first');
    fireEvent.changeText(textInput, 'second');
    fireEvent.changeText(textInput, 'third');

    expect(mockOnChangeText).toHaveBeenCalledTimes(3);
    expect(mockOnChangeText).toHaveBeenNthCalledWith(1, 'first');
    expect(mockOnChangeText).toHaveBeenNthCalledWith(2, 'second');
    expect(mockOnChangeText).toHaveBeenNthCalledWith(3, 'third');
  });

  it('should handle empty string values', () => {
    render(<FormTextField {...defaultProps} value="" />);
    expect(screen.getByDisplayValue('')).toBeTruthy();
  });

  it('should handle special characters in text', () => {
    const specialText = 'Special chars: @#$%^&*()';
    const { getByDisplayValue } = render(
      <FormTextField {...defaultProps} value={specialText} />
    );
    expect(getByDisplayValue(specialText)).toBeTruthy();
  });

  it('should work with multiple instances', () => {
    const { getByText } = render(
      <>
        <FormTextField labelText="First Field" labelMarginTop={16} />
        <FormTextField labelText="Second Field" labelMarginTop={24} />
      </>
    );

    expect(getByText('First Field')).toBeTruthy();
    expect(getByText('Second Field')).toBeTruthy();
  });

  it('should maintain independent state between instances', () => {
    const mockOnChangeFirst = jest.fn();
    const mockOnChangeSecond = jest.fn();

    const { getAllByDisplayValue } = render(
      <>
        <FormTextField
          labelText="First Field"
          labelMarginTop={16}
          onChangeText={mockOnChangeFirst}
        />
        <FormTextField
          labelText="Second Field"
          labelMarginTop={24}
          onChangeText={mockOnChangeSecond}
        />
      </>
    );

    const textInputs = getAllByDisplayValue('');
    fireEvent.changeText(textInputs[0], 'first input');
    fireEvent.changeText(textInputs[1], 'second input');

    expect(mockOnChangeFirst).toHaveBeenCalledWith('first input');
    expect(mockOnChangeSecond).toHaveBeenCalledWith('second input');
  });
});