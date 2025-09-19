/**
 * Test suite for NewReasonsList
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import NewReasonsList from '../../../screens/companyDetailsScreen/NewReasonsList';

describe('NewReasonsList', () => {
  const defaultProps = {
    newReasons: [],
    onRemove: jest.fn(),
  };

  it('should render without crashing', () => {
    expect(() => {
      render(<NewReasonsList {...defaultProps} />);
    }).not.toThrow();
  });
});