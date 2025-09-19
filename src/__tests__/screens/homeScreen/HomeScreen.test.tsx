/**
 * Test suite for HomeScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../../../screens/homeScreen/HomeScreen';

// Mock all the dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: () => ({
    user: { user_id: '123', paying_user: false },
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
  getUserStats: jest.fn().mockResolvedValue({}),
  upgradeUser: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
  getUserById: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../services/LocalBoycottStore', () => ({
  LocalBoycottStore: {
    checkAndRefreshIfNeeded: jest.fn(),
    load: jest.fn().mockResolvedValue({ user_boycotts: [], user_causes: [] }),
    clear: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('aws-amplify/auth', () => ({
  signOut: jest.fn().mockResolvedValue(undefined),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/common/LoadingOverlay', () => 'MockedLoadingOverlay');

describe('HomeScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<HomeScreen />);
    }).not.toThrow();
  });
});