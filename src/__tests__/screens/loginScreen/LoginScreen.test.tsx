/**
 * Test suite for LoginScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../../../screens/loginScreen/LoginScreen';

// Mock all the dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: () => ({
    setUser: jest.fn(),
  }),
  useAuthHelpers: () => ({
    signInAndLoadUser: jest.fn().mockResolvedValue({ status: 'DONE' }),
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
  resendSignUpCode: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('lottie-react-native', () => 'MockedLottieView');

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');
jest.mock('../../../components/labelAndField/FormPasswordField', () => 'MockedFormPasswordField');

describe('LoginScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<LoginScreen />);
    }).not.toThrow();
  });
});