/**
 * Test suite for SearchScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import SearchScreen from '../../../screens/searchScreen/SearchScreen';

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

jest.mock('../../../api/users', () => ({
  addUserCause: jest.fn().mockResolvedValue({ status: 200, message: 'Success' }),
}));

jest.mock('../../../services/AnonymousStatsService', () => ({
  postAnonymousStat: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../services/LocalBoycottStore', () => ({
  LocalBoycottStore: {
    load: jest.fn().mockResolvedValue({ user_causes: [] }),
    save: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock components
jest.mock('../../../components/headerBar/HeaderBar', () => 'MockedHeaderBar');
jest.mock('../../../components/homeBackButton/HomeBackButton', () => 'MockedHomeBackButton');
jest.mock('../../../components/slogan/Slogan', () => 'MockedSlogan');
jest.mock('../../../components/toggle/ToggleSection', () => 'MockedToggleSection');
jest.mock('../../../components/labelAndField/FormTextField', () => 'MockedFormTextField');
jest.mock('../../../components/companiesOrCauses/SelectableCompanyCausesList', () => 'MockedSelectableCompanyCausesList');
jest.mock('../../../components/button/ConditionalButton', () => 'MockedConditionalButton');
jest.mock('../../../components/reasonsForm/ReasonsForm', () => 'MockedReasonsForm');
jest.mock('../../../components/common/LoadingOverlay', () => 'MockedLoadingOverlay');

describe('SearchScreen', () => {
  it('should render without crashing', () => {
    expect(() => {
      render(<SearchScreen />);
    }).not.toThrow();
  });
});