/**
 * Test suite for CauseDetailsScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import CauseDetailsScreen from '../../../screens/causeDetailsScreen/CauseDetailsScreen';

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
  useRoute: () => ({ params: { cause_id: '123', back_navigation: 'Test' } }),
  useIsFocused: () => true,
}));

// Mock API calls
jest.mock('../../../api/causes', () => ({
  getCauseById: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../api/users', () => ({
  addUserCause: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
  removeUserCause: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
}));

// Mock services
jest.mock('../../../services/LocalBoycottStore', () => ({
  LocalBoycottStore: {
    load: jest.fn().mockResolvedValue({ user_causes: [] }),
    save: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../../services/AnonymousStatsService', () => ({
  postAnonymousStat: jest.fn().mockResolvedValue(undefined),
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/button/CenteredButton', () => 'MockedCenteredButton');
jest.mock('../../../components/common/LoadingOverlay', () => 'MockedLoadingOverlay');

describe('CauseDetailsScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<CauseDetailsScreen />);
    }).not.toThrow();
  });
});