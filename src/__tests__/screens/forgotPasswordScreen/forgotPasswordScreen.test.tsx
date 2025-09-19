/**
 * Test suite for forgotPasswordScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ForgotPasswordScreen from '../../../screens/forgotPasswordScreen/forgotPasswordScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  resetPassword: jest.fn().mockResolvedValue(undefined),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: { accessToken: 'mock-token' } }),
}));

// Mock all the dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: () => ({
    user: null,
    setUser: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({}),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');

describe('forgotPasswordScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<ForgotPasswordScreen />);
    }).not.toThrow();
  });
});