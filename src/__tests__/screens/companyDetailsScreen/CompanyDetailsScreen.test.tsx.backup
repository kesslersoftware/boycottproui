/**
 * Test suite for CompanyDetailsScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import CompanyDetailsScreen from '../../../screens/companyDetailsScreen/CompanyDetailsScreen';

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
  useRoute: () => ({ params: { company_id: '123', back_navigation: 'Test' } }),
  useIsFocused: () => true,
}));

// Mock API calls
jest.mock('../../../api/companies', () => ({
  getCompanyById: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../api/users', () => ({
  addUserBoycott: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
  removeUserBoycott: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
  updateReasons: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
}));

// Mock services
jest.mock('../../../services/LocalBoycottStore', () => ({
  LocalBoycottStore: {
    load: jest.fn().mockResolvedValue({ user_boycotts: [] }),
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
jest.mock('../../../screens/companyDetailsScreen/NewReasonsList', () => 'MockedNewReasonsList');

describe('CompanyDetailsScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<CompanyDetailsScreen />);
    }).not.toThrow();
  });
});