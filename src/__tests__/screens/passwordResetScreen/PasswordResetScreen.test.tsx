/**
 * Test suite for PasswordResetScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import PasswordResetScreen from '../../../screens/passwordResetScreen/PasswordResetScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  confirmResetPassword: jest.fn().mockResolvedValue(undefined),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: { accessToken: 'mock-token' } }),
}));

jest.mock('@aws-amplify/auth', () => ({
  updatePassword: jest.fn().mockResolvedValue(undefined),
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
  useRoute: () => ({ params: { email: 'test@test.com' } }),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');
jest.mock('../../../components/labelAndField/FormPasswordField', () => 'MockedFormPasswordField');

describe('PasswordResetScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<PasswordResetScreen />);
    }).not.toThrow();
  });
});