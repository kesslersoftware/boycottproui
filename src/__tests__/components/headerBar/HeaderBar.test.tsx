/**
 * Test suite for HeaderBar component
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HeaderBar from '../../../components/headerBar/HeaderBar';

describe('HeaderBar Component', () => {
  it('should render without crashing', () => {
    render(<HeaderBar />);
    expect(screen.getByText('BoycottPro')).toBeTruthy();
  });

  it('should display the correct title text', () => {
    render(<HeaderBar />);
    const titleElement = screen.getByText('BoycottPro');
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.children).toBe('BoycottPro');
  });

  it('should render the header container', () => {
    const { getByText } = render(<HeaderBar />);
    const titleText = getByText('BoycottPro');
    const headerContainer = titleText.parent;
    expect(headerContainer).toBeTruthy();
  });

  it('should have exactly one title text element', () => {
    render(<HeaderBar />);
    const titleElements = screen.getAllByText('BoycottPro');
    expect(titleElements).toHaveLength(1);
  });

  it('should render as a View component with Text child', () => {
    const { getByText } = render(<HeaderBar />);
    const titleText = getByText('BoycottPro');
    const headerContainer = titleText.parent;

    expect(headerContainer).toBeTruthy();
    expect(titleText.props.children).toBe('BoycottPro');
  });

  it('should render consistently across multiple instances', () => {
    const { getByText: getFirst } = render(<HeaderBar />);
    const { getByText: getSecond } = render(<HeaderBar />);

    const firstTitle = getFirst('BoycottPro');
    const secondTitle = getSecond('BoycottPro');

    expect(firstTitle.props.children).toEqual(secondTitle.props.children);
  });

  it('should have accessible text content', () => {
    const { getByText } = render(<HeaderBar />);
    const titleText = getByText('BoycottPro');
    expect(titleText).toBeTruthy();
    expect(titleText.props.children).toBe('BoycottPro');
  });
});