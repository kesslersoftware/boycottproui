/**
 * Test suite for MyTrendsScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import MyTrendsScreen from '../../../screens/myTrendsScreen/MyTrendsScreen';

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: { accessToken: 'mock-token' } }),
}));


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
  useIsFocused: () => true,
}));

// Mock API calls
jest.mock('../../../api/companies', () => ({
  getMyCompanies: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../api/causes', () => ({
  getMyCauses: jest.fn().mockResolvedValue([]),
}));

// Mock services
jest.mock('../../../services/LocalBoycottStore', () => ({
  LocalBoycottStore: {
    load: jest.fn().mockResolvedValue({ user_boycotts: [], user_causes: [] }),
  },
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/companiesOrCauses/TrendsList', () => 'MockedTrendsList');
jest.mock('../../../components/toggle/ToggleSection', () => 'MockedToggleSection');
jest.mock('../../../components/common/LoadingOverlay', () => 'MockedLoadingOverlay');

describe('MyTrendsScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<MyTrendsScreen />);
    }).not.toThrow();
  });
});