/**
 * Test suite for ProfileSettingsScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileSettingsScreen from '../../../screens/profileSettingsScreen/ProfileSettingsScreen';

// Mock all the dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: () => ({
    user: { user_id: '123', username: 'testuser', email: 'test@test.com' },
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

jest.mock('../../../api/users', () => ({
  changeUsername: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
  getUserById: jest.fn().mockResolvedValue({}),
}));

jest.mock('aws-amplify/auth', () => ({
  updatePassword: jest.fn().mockResolvedValue(undefined),
  signOut: jest.fn().mockResolvedValue(undefined),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');
jest.mock('../../../components/labelAndField/FormPasswordField', () => 'MockedFormPasswordField');
jest.mock('../../../components/common/LoadingOverlay', () => 'MockedLoadingOverlay');

describe('ProfileSettingsScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<ProfileSettingsScreen />);
    }).not.toThrow();
  });
});