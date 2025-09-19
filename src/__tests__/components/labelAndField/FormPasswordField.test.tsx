/**
 * Test suite for FormPasswordField component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import FormPasswordField from '../../../components/labelAndField/FormPasswordField';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MockedIcon');

describe('FormPasswordField Component', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(
        <FormPasswordField
          labelText="Password"
          labelMarginTop={16}
        />
      );
    }).not.toThrow();
  });

  it('should render with custom label', () => {
    expect(() => {
      render(
        <FormPasswordField
          labelText="Custom Password"
          labelMarginTop={16}
        />
      );
    }).not.toThrow();
  });

  it('should render with value', () => {
    expect(() => {
      render(
        <FormPasswordField
          labelText="Password"
          labelMarginTop={16}
          value="test123"
        />
      );
    }).not.toThrow();
  });
});