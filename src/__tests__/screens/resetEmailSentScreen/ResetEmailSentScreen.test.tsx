/**
 * Test suite for ResetEmailSentScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ResetEmailSentScreen from '../../../screens/resetEmailSentScreen/ResetEmailSentScreen';

// Mock all the dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: () => ({
    user: { user_id: '123', email: 'test@test.com' },
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

jest.mock('aws-amplify/auth', () => ({
  resetPassword: jest.fn().mockResolvedValue(undefined),
  confirmResetPassword: jest.fn().mockResolvedValue(undefined),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/common/LoadingOverlay', () => 'MockedLoadingOverlay');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');
jest.mock('../../../components/labelAndField/FormPasswordField', () => 'MockedFormPasswordField');

describe('ResetEmailSentScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<ResetEmailSentScreen />);
    }).not.toThrow();
  });
});