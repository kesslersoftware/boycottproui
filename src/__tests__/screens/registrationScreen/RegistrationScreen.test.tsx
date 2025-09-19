/**
 * Test suite for RegistrationScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import RegistrationScreen from '../../../screens/registrationScreen/RegistrationScreen';

// Mock all the dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: () => ({
    setUser: jest.fn(),
  }),
  useAuthHelpers: () => ({
    signUpUser: jest.fn().mockResolvedValue({ status: 'DONE' }),
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

jest.mock('aws-amplify/auth', () => ({
  signUp: jest.fn().mockResolvedValue({ isSignUpComplete: false }),
  confirmSignUp: jest.fn().mockResolvedValue(undefined),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');
jest.mock('../../../components/labelAndField/FormPasswordField', () => 'MockedFormPasswordField');
jest.mock('../../../components/customCheckbox/CustomCheckbox', () => 'MockedCustomCheckbox');

describe('RegistrationScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<RegistrationScreen />);
    }).not.toThrow();
  });
});