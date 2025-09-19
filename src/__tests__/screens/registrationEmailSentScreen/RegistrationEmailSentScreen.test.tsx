/**
 * Test suite for RegistrationEmailSentScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import RegistrationEmailSentScreen from '../../../screens/registrationEmailSentScreen/RegistrationEmailSentScreen';

// Mock all the dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({ params: { email: 'test@test.com' } }),
}));

jest.mock('aws-amplify/auth', () => ({
  resendSignUpCode: jest.fn().mockResolvedValue(undefined),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');

describe('RegistrationEmailSentScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<RegistrationEmailSentScreen />);
    }).not.toThrow();
  });
});