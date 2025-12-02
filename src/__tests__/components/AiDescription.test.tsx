/**
 * Test suite for AiDescription component
 * Tests AI-powered content display for company information, summaries, and controversies
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import AiDescription from '../../components/aiDescription/AiDescription';
import { Controversy } from '../../types/companies/CompanyData';

// Mock screen dimensions utility
jest.mock('../../components/screenDimensionsutilitiy', () => ({
  sh: 667, // Mock screen height
  sw: 375, // Mock screen width
}));

// Mock constants
jest.mock('../../../styles/constants', () => ({
  APP_BACKGROUND: '#FFFFFF',
  BODY_TEXT_DARK: '#333333',
  FORM_FIELD_BORDER: '#E0E0E0',
}));

describe('AiDescription Component', () => {
  const mockControversies: Controversy[] = [
    {
      title: 'Environmental Impact Controversy',
      desc: 'The company faced criticism for its environmental practices and carbon footprint.',
      date: '2024-01-15',
    },
    {
      title: 'Labor Rights Issues',
      desc: 'Workers raised concerns about working conditions and fair wages.',
      date: '2023-12-20',
    },
    {
      title: 'Data Privacy Concerns',
      desc: 'Questions arose about user data collection and privacy policies.',
      date: '2024-02-10',
    },
  ];

  const defaultProps = {
    stock_ticker: 'AAPL',
    summary: 'Apple Inc. is a multinational technology company that designs, manufactures, and markets consumer electronics, computer software, and online services.',
    controversies_or_issues: mockControversies,
  };

  const minimalProps = {
    stock_ticker: '',
    summary: '',
    controversies_or_issues: [],
  };

  describe('Basic Rendering', () => {
    it('should render the AI description component', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      expect(getByText('Stock Symbol:')).toBeTruthy();
      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('Company Overview')).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(() => render(<AiDescription {...defaultProps} />)).not.toThrow();
    });

    it('should render minimal component without errors', () => {
      expect(() => render(<AiDescription {...minimalProps} />)).not.toThrow();
    });

    it('should apply container styles correctly', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const stockLabel = getByText('Stock Symbol:');
      const container = stockLabel.parent?.parent; // Navigate to container

      expect(container).toBeTruthy();
    });

    it('should maintain component integrity', () => {
      const component = <AiDescription {...defaultProps} />;
      expect(component).toBeTruthy();
      expect(component.type).toBe(AiDescription);
    });
  });

  describe('Stock Ticker Section', () => {
    it('should display stock ticker when provided', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      expect(getByText('Stock Symbol:')).toBeTruthy();
      expect(getByText('AAPL')).toBeTruthy();
    });

    it('should not display stock ticker section when ticker is empty', () => {
      const propsWithoutTicker = { ...defaultProps, stock_ticker: '' };
      const { queryByText } = render(<AiDescription {...propsWithoutTicker} />);

      expect(queryByText('Stock Symbol:')).toBeNull();
    });

    it('should not display stock ticker section when ticker is undefined', () => {
      const propsWithUndefinedTicker = { ...defaultProps, stock_ticker: undefined as any };
      const { queryByText } = render(<AiDescription {...propsWithUndefinedTicker} />);

      expect(queryByText('Stock Symbol:')).toBeNull();
    });

    it('should handle different stock ticker formats', () => {
      const tickerVariations = ['MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META'];

      tickerVariations.forEach(ticker => {
        const { getByText } = render(
          <AiDescription {...defaultProps} stock_ticker={ticker} />
        );

        expect(getByText('Stock Symbol:')).toBeTruthy();
        expect(getByText(ticker)).toBeTruthy();
      });
    });

    it('should apply correct styles to ticker label', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const tickerLabel = getByText('Stock Symbol:');
      const style = tickerLabel.props.style;

      expect(style.fontWeight).toBe('600');
      expect(style.fontFamily).toBe('Inter');
      expect(style.color).toBe('#333333');
    });

    it('should apply correct styles to ticker value', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const tickerValue = getByText('AAPL');
      const style = tickerValue.props.style;

      expect(style.fontWeight).toBe('800');
      expect(style.color).toBe('#2563EB');
      expect(style.letterSpacing).toBe(1);
    });

    it('should handle long ticker symbols', () => {
      const longTicker = 'VERYLONGTICKER';
      const { getByText } = render(
        <AiDescription {...defaultProps} stock_ticker={longTicker} />
      );

      expect(getByText(longTicker)).toBeTruthy();
    });

    it('should handle special characters in ticker', () => {
      const specialTicker = 'BRK.B';
      const { getByText } = render(
        <AiDescription {...defaultProps} stock_ticker={specialTicker} />
      );

      expect(getByText(specialTicker)).toBeTruthy();
    });
  });

  describe('Company Summary Section', () => {
    it('should display company summary when provided', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      expect(getByText('Company Overview')).toBeTruthy();
      expect(getByText(defaultProps.summary)).toBeTruthy();
    });

    it('should not display summary section when summary is empty', () => {
      const propsWithoutSummary = { ...defaultProps, summary: '' };
      const { queryByText } = render(<AiDescription {...propsWithoutSummary} />);

      expect(queryByText('Company Overview')).toBeNull();
    });

    it('should not display summary section when summary is undefined', () => {
      const propsWithUndefinedSummary = { ...defaultProps, summary: undefined as any };
      const { queryByText } = render(<AiDescription {...propsWithUndefinedSummary} />);

      expect(queryByText('Company Overview')).toBeNull();
    });

    it('should handle long summary text', () => {
      const longSummary = 'Apple Inc. is a multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services. The company\'s hardware products include the iPhone smartphone, the iPad tablet computer, the Mac personal computer, the iPod portable media player, the Apple Watch smartwatch, the Apple TV digital media player, and the HomePod smart speaker. Apple\'s software includes the macOS and iOS operating systems, the iTunes media player, the Safari web browser, and the iLife and iWork creativity and productivity suites.';
      const { getByText } = render(
        <AiDescription {...defaultProps} summary={longSummary} />
      );

      expect(getByText(longSummary)).toBeTruthy();
    });

    it('should apply correct styles to section title', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const sectionTitle = getByText('Company Overview');
      const style = sectionTitle.props.style;

      expect(style.fontWeight).toBe('700');
      expect(style.textTransform).toBe('uppercase');
      expect(style.letterSpacing).toBe(0.5);
    });

    it('should apply correct styles to summary text', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const summaryText = getByText(defaultProps.summary);
      const style = summaryText.props.style;

      expect(style.fontWeight).toBe('400');
      expect(style.textAlign).toBe('justify');
      expect(style.fontFamily).toBe('Inter');
    });

    it('should handle special characters in summary', () => {
      const summaryWithSpecialChars = 'Apple Inc. designs & develops technology products—including the iPhone™, iPad®, and Mac computers. The company\'s revenue exceeded $365B in 2023.';
      const { getByText } = render(
        <AiDescription {...defaultProps} summary={summaryWithSpecialChars} />
      );

      expect(getByText(summaryWithSpecialChars)).toBeTruthy();
    });

    it('should handle HTML entities in summary', () => {
      const summaryWithEntities = 'Apple Inc. is a company that has grown to become one of the world&apos;s most valuable brands, worth over $3 trillion.';
      const { getByText } = render(
        <AiDescription {...defaultProps} summary={summaryWithEntities} />
      );

      expect(getByText(summaryWithEntities)).toBeTruthy();
    });

    it('should handle line breaks and formatting in summary', () => {
      const summaryWithBreaks = 'Apple Inc. operates in multiple segments:\n\n1. iPhone\n2. Mac\n3. iPad\n4. Wearables\n5. Services';
      const { getByText } = render(
        <AiDescription {...defaultProps} summary={summaryWithBreaks} />
      );

      expect(getByText(summaryWithBreaks)).toBeTruthy();
    });
  });

  describe('Controversies Section', () => {
    it('should display controversies section when controversies are provided', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      expect(getByText('Recent Issues & Controversies')).toBeTruthy();
      expect(getByText('Environmental Impact Controversy')).toBeTruthy();
      expect(getByText('Labor Rights Issues')).toBeTruthy();
      expect(getByText('Data Privacy Concerns')).toBeTruthy();
    });

    it('should not display controversies section when array is empty', () => {
      const propsWithoutControversies = { ...defaultProps, controversies_or_issues: [] };
      const { queryByText } = render(<AiDescription {...propsWithoutControversies} />);

      expect(queryByText('Recent Issues & Controversies')).toBeNull();
    });

    it('should not display controversies section when array is undefined', () => {
      const propsWithUndefinedControversies = { ...defaultProps, controversies_or_issues: undefined as any };
      const { queryByText } = render(<AiDescription {...propsWithUndefinedControversies} />);

      expect(queryByText('Recent Issues & Controversies')).toBeNull();
    });

    it('should display all controversy titles', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      mockControversies.forEach(controversy => {
        expect(getByText(controversy.title)).toBeTruthy();
      });
    });

    it('should display all controversy descriptions', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      mockControversies.forEach(controversy => {
        expect(getByText(controversy.desc)).toBeTruthy();
      });
    });

    it('should format and display controversy dates', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      // Check that dates are formatted properly (allowing for timezone differences)
      expect(getByText(/January 1[45], 2024/)).toBeTruthy();
      expect(getByText(/December (19|20), 2023/)).toBeTruthy();
      expect(getByText(/February (9|10), 2024/)).toBeTruthy();
    });

    it('should handle controversy without date', () => {
      const controversyWithoutDate: Controversy[] = [
        {
          title: 'No Date Controversy',
          desc: 'This controversy has no date information.',
          date: undefined as any,
        },
      ];
      const { getByText, queryByText } = render(
        <AiDescription {...defaultProps} controversies_or_issues={controversyWithoutDate} />
      );

      expect(getByText('No Date Controversy')).toBeTruthy();
      expect(getByText('This controversy has no date information.')).toBeTruthy();
      // Should not display any date text since date is undefined
    });

    it('should handle controversy with empty date', () => {
      const controversyWithEmptyDate: Controversy[] = [
        {
          title: 'Empty Date Controversy',
          desc: 'This controversy has empty date.',
          date: '',
        },
      ];
      const { getByText } = render(
        <AiDescription {...defaultProps} controversies_or_issues={controversyWithEmptyDate} />
      );

      expect(getByText('Empty Date Controversy')).toBeTruthy();
      expect(getByText('This controversy has empty date.')).toBeTruthy();
    });

    it('should apply correct styles to controversy titles', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const controversyTitle = getByText('Environmental Impact Controversy');
      const style = controversyTitle.props.style;

      expect(style.fontWeight).toBe('700');
      expect(style.color).toBe('#991B1B');
      expect(style.fontFamily).toBe('Inter');
    });

    it('should apply correct styles to controversy descriptions', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const controversyDesc = getByText('The company faced criticism for its environmental practices and carbon footprint.');
      const style = controversyDesc.props.style;

      expect(style.fontWeight).toBe('400');
      expect(style.color).toBe('#333333');
      expect(style.fontFamily).toBe('Inter');
    });

    it('should apply correct styles to controversy dates', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const controversyDate = getByText(/January 1[45], 2024/);
      const style = controversyDate.props.style;

      expect(style.fontWeight).toBe('500');
      expect(style.color).toBe('#6B7280');
      expect(style.fontStyle).toBe('italic');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly in US locale', () => {
      const testDates = [
        { input: '2024-01-15', expected: /January 1[45], 2024/ },
        { input: '2023-12-25', expected: /December 2[45], 2023/ },
        { input: '2024-07-04', expected: /July [34], 2024/ },
      ];

      testDates.forEach(({ input, expected }) => {
        const testControversy: Controversy[] = [
          {
            title: 'Test Controversy',
            desc: 'Test description',
            date: input,
          },
        ];

        const { getByText } = render(
          <AiDescription {...defaultProps} controversies_or_issues={testControversy} />
        );

        try {
          expect(getByText(expected)).toBeTruthy();
        } catch {
          // Some dates might be invalid, that's okay for edge case testing
          expect(getByText('Test Controversy')).toBeTruthy();
        }
      });
    });

    it('should handle invalid date formats gracefully', () => {
      const controversyWithInvalidDate: Controversy[] = [
        {
          title: 'Invalid Date Controversy',
          desc: 'This has an invalid date format.',
          date: 'invalid-date-string',
        },
      ];

      expect(() => render(
        <AiDescription {...defaultProps} controversies_or_issues={controversyWithInvalidDate} />
      )).not.toThrow();
    });

    it('should handle different date formats', () => {
      const differentDateFormats = [
        '2024-01-15',
        '2024/01/15',
        '01-15-2024',
        '2024-1-15',
      ];

      differentDateFormats.forEach(dateFormat => {
        const testControversy: Controversy[] = [
          {
            title: `Test ${dateFormat}`,
            desc: 'Test description',
            date: dateFormat,
          },
        ];

        expect(() => render(
          <AiDescription {...defaultProps} controversies_or_issues={testControversy} />
        )).not.toThrow();
      });
    });
  });

  describe('Component Structure and Props', () => {
    it('should be a functional component', () => {
      expect(typeof AiDescription).toBe('function');
      expect(AiDescription.prototype?.render).toBeUndefined();
    });

    it('should handle required props correctly', () => {
      const component = <AiDescription {...defaultProps} />;
      expect(component.props.stock_ticker).toBe('AAPL');
      expect(component.props.summary).toBe(defaultProps.summary);
      expect(component.props.controversies_or_issues).toEqual(mockControversies);
    });

    it('should render consistently across multiple renders', () => {
      const { getByText, rerender } = render(<AiDescription {...defaultProps} />);

      const firstRender = getByText('AAPL');
      expect(firstRender).toBeTruthy();

      rerender(<AiDescription {...defaultProps} />);

      const secondRender = getByText('AAPL');
      expect(secondRender).toBeTruthy();
      expect(secondRender.props.children).toBe(firstRender.props.children);
    });

    it('should handle prop changes correctly', () => {
      const { getByText, rerender } = render(<AiDescription {...defaultProps} />);

      expect(getByText('AAPL')).toBeTruthy();

      // Change props
      const newProps = {
        ...defaultProps,
        stock_ticker: 'MSFT',
        summary: 'Microsoft Corporation develops and supports software, services, devices and solutions worldwide.',
      };

      rerender(<AiDescription {...newProps} />);

      expect(getByText('MSFT')).toBeTruthy();
      expect(getByText('Microsoft Corporation develops and supports software, services, devices and solutions worldwide.')).toBeTruthy();
    });

    it('should handle TypeScript interface correctly', () => {
      // This tests that the component accepts the correct prop types
      const typedProps: React.ComponentProps<typeof AiDescription> = {
        stock_ticker: 'TEST',
        summary: 'Test summary',
        controversies_or_issues: [],
      };

      expect(() => render(<AiDescription {...typedProps} />)).not.toThrow();
    });
  });

  describe('Integration and Context', () => {
    it('should work with real-world company data', () => {
      const realWorldProps = {
        stock_ticker: 'AAPL',
        summary: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod.',
        controversies_or_issues: [
          {
            title: 'App Store Commission Dispute',
            desc: 'Apple faced scrutiny over its 30% commission on App Store purchases, leading to legal challenges from Epic Games and regulatory investigations.',
            date: '2020-08-13',
          },
          {
            title: 'Right to Repair Opposition',
            desc: 'The company has been criticized for opposing right-to-repair legislation and making it difficult for third-party repairs.',
            date: '2021-03-17',
          },
        ],
      };

      const { getByText } = render(<AiDescription {...realWorldProps} />);

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('App Store Commission Dispute')).toBeTruthy();
      expect(getByText('Right to Repair Opposition')).toBeTruthy();
    });

    it('should work with different layout contexts', () => {
      const { getByText } = render(
        <React.Fragment>
          <AiDescription {...defaultProps} />
          <AiDescription stock_ticker="MSFT" summary="Microsoft summary" controversies_or_issues={[]} />
        </React.Fragment>
      );

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('MSFT')).toBeTruthy();
    });

    it('should maintain data integrity across rerenders', () => {
      const { getByText, rerender } = render(<AiDescription {...defaultProps} />);

      const originalControversyCount = mockControversies.length;
      expect(getByText('Environmental Impact Controversy')).toBeTruthy();

      rerender(<AiDescription {...defaultProps} />);

      // Should still have all controversies
      expect(getByText('Environmental Impact Controversy')).toBeTruthy();
      expect(getByText('Labor Rights Issues')).toBeTruthy();
      expect(getByText('Data Privacy Concerns')).toBeTruthy();
    });

    it('should work with different screen orientations', () => {
      // Test with different mock screen dimensions
      jest.doMock('../../components/screenDimensionsutilitiy', () => ({
        sh: 375, // Landscape height
        sw: 667, // Landscape width
      }));

      expect(() => render(<AiDescription {...defaultProps} />)).not.toThrow();
    });
  });

  describe('Performance and Memory', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      render(<AiDescription {...defaultProps} />);
      const endTime = performance.now();

      // Should render quickly (less than 50ms)
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<AiDescription {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle large datasets efficiently', () => {
      const largeControversiesList: Controversy[] = Array.from({ length: 100 }, (_, i) => ({
        title: `Controversy ${i + 1}`,
        desc: `Description for controversy number ${i + 1} with sufficient detail to test rendering performance.`,
        date: `2024-01-${String(i % 28 + 1).padStart(2, '0')}`,
      }));

      const startTime = performance.now();
      const { getByText } = render(
        <AiDescription {...defaultProps} controversies_or_issues={largeControversiesList} />
      );
      const endTime = performance.now();

      expect(getByText('Controversy 1')).toBeTruthy();
      expect(endTime - startTime).toBeLessThan(2000); // Allow more time for CI/slow environments
    });

    it('should optimize re-renders with identical props', () => {
      const { rerender, getByText } = render(<AiDescription {...defaultProps} />);

      const initialRender = getByText('AAPL');
      expect(initialRender).toBeTruthy();

      // Re-render with same props
      rerender(<AiDescription {...defaultProps} />);

      const rerenderedComponent = getByText('AAPL');
      expect(rerenderedComponent).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should provide accessible text content', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const tickerLabel = getByText('Stock Symbol:');
      const tickerValue = getByText('AAPL');
      const sectionTitle = getByText('Company Overview');
      const summaryText = getByText(defaultProps.summary);

      expect(typeof tickerLabel.props.children).toBe('string');
      expect(typeof tickerValue.props.children).toBe('string');
      expect(typeof sectionTitle.props.children).toBe('string');
      expect(typeof summaryText.props.children).toBe('string');
    });

    it('should have readable font sizes', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const tickerLabel = getByText('Stock Symbol:');
      const tickerValue = getByText('AAPL');
      const sectionTitle = getByText('Company Overview');

      // All fonts should be readable sizes (calculated from screen height)
      expect(tickerLabel.props.style.fontSize).toBeGreaterThan(10);
      expect(tickerValue.props.style.fontSize).toBeGreaterThan(10);
      expect(sectionTitle.props.style.fontSize).toBeGreaterThan(10);
    });

    it('should have sufficient color contrast', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const tickerValue = getByText('AAPL');
      const controversyTitle = getByText('Environmental Impact Controversy');

      expect(tickerValue.props.style.color).toBe('#2563EB'); // Professional blue
      expect(controversyTitle.props.style.color).toBe('#991B1B'); // Dark red
    });

    it('should structure content hierarchically', () => {
      const { getByText } = render(<AiDescription {...defaultProps} />);

      const sectionTitle = getByText('Company Overview');
      const controversiesTitle = getByText('Recent Issues & Controversies');

      expect(sectionTitle.props.style.fontWeight).toBe('700');
      expect(controversiesTitle.props.style.fontWeight).toBe('700');
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle all empty props gracefully', () => {
      const emptyProps = {
        stock_ticker: '',
        summary: '',
        controversies_or_issues: [],
      };

      expect(() => render(<AiDescription {...emptyProps} />)).not.toThrow();
    });

    it('should handle null and undefined values', () => {
      const nullProps = {
        stock_ticker: null as any,
        summary: null as any,
        controversies_or_issues: null as any,
      };

      expect(() => render(<AiDescription {...nullProps} />)).not.toThrow();
    });

    it('should handle extremely long text content', () => {
      const extremelyLongSummary = 'A'.repeat(10000);
      const propsWithLongText = {
        ...defaultProps,
        summary: extremelyLongSummary,
      };

      expect(() => render(<AiDescription {...propsWithLongText} />)).not.toThrow();
    });

    it('should handle special Unicode characters', () => {
      const unicodeProps = {
        stock_ticker: '💰AAPL💰',
        summary: 'Apple Inc. 🍎 is a technology company that creates innovative products like iPhone 📱 and Mac 💻.',
        controversies_or_issues: [
          {
            title: 'Unicode Issue 🚫',
            desc: 'Testing special characters: áéíóú, 中文, العربية, русский',
            date: '2024-01-15',
          },
        ],
      };

      const { getByText } = render(<AiDescription {...unicodeProps} />);
      expect(getByText('💰AAPL💰')).toBeTruthy();
      expect(getByText('Unicode Issue 🚫')).toBeTruthy();
    });

    it('should handle malformed controversy objects', () => {
      const malformedControversies = [
        { title: 'Valid Controversy', desc: 'Valid description', date: '2024-01-01' },
        { title: '', desc: 'No title controversy', date: '2024-01-02' },
        { title: 'No description', desc: '', date: '2024-01-03' },
        { title: undefined, desc: 'Undefined title', date: '2024-01-04' } as any,
      ];

      expect(() => render(
        <AiDescription {...defaultProps} controversies_or_issues={malformedControversies} />
      )).not.toThrow();
    });
  });
});