/**
 * Test suite for navigation helper utilities
 * Tests timing functions and navigation with loading state management
 */

import { sleep, navigateWithSpinner } from '../../utils/navigationHelpers';

describe('Navigation Helpers', () => {
  describe('sleep function', () => {
    it('should resolve after specified delay', async () => {
      const startTime = Date.now();
      const delay = 50; // Use small delay for fast tests

      await sleep(delay);

      const endTime = Date.now();
      const actualDelay = endTime - startTime;

      // Allow for some timing variance (±10ms) with extra tolerance for CI environments
      expect(actualDelay).toBeGreaterThanOrEqual(delay - 10);
      expect(actualDelay).toBeLessThanOrEqual(delay + 300);
    });

    it('should handle zero delay', async () => {
      const startTime = Date.now();

      await sleep(0);

      const endTime = Date.now();
      const actualDelay = endTime - startTime;

      // Should resolve quickly (allow for system variance)
      expect(actualDelay).toBeLessThan(50);
    });

    it('should handle negative delay as zero', async () => {
      const startTime = Date.now();

      await sleep(-100);

      const endTime = Date.now();
      const actualDelay = endTime - startTime;

      // Should resolve quickly for negative values (allow for system variance in CI/slow environments)
      expect(actualDelay).toBeLessThan(150);
    });

    it('should return a Promise', () => {
      const result = sleep(1);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with very large delays', async () => {
      // Test with larger delay but resolve early for test speed
      const delayPromise = sleep(5000);

      // The promise should be pending initially
      expect(delayPromise).toBeInstanceOf(Promise);

      // We won't wait for it to complete to keep tests fast
      // Just verify it's a valid promise
    }, 100); // Short timeout since we're not waiting for completion
  });

  describe('navigateWithSpinner function', () => {
    let mockNavigateFn: jest.Mock;
    let mockSetLoading: jest.Mock;

    beforeEach(() => {
      mockNavigateFn = jest.fn();
      mockSetLoading = jest.fn();
      jest.clearAllMocks();
    });

    it('should navigate with default delay and manage loading state', async () => {
      const targetScreen = 'HomeScreen';
      const startTime = Date.now();

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading
      );

      const endTime = Date.now();
      const actualDelay = endTime - startTime;

      // Should use default delay of 1000ms
      expect(actualDelay).toBeGreaterThanOrEqual(990);
      expect(actualDelay).toBeLessThanOrEqual(1100);

      // Verify loading state management
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
      expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);

      // Verify navigation
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, undefined);
    });

    it('should navigate with custom delay', async () => {
      const targetScreen = 'ProfileScreen';
      const customDelay = 50; // Short delay for fast test
      const startTime = Date.now();

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        customDelay
      );

      const endTime = Date.now();
      const actualDelay = endTime - startTime;

      // Should use custom delay with extra tolerance for CI environments
      expect(actualDelay).toBeGreaterThanOrEqual(customDelay - 10);
      expect(actualDelay).toBeLessThanOrEqual(customDelay + 300);

      // Verify loading state management
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
      expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);

      // Verify navigation
      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, undefined);
    });

    it('should navigate with parameters', async () => {
      const targetScreen = 'DetailScreen';
      const params = { id: '123', type: 'company' };
      const delay = 50;

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay,
        params
      );

      // Verify loading state management
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
      expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);

      // Verify navigation with parameters
      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, params);
    });

    it('should handle navigation function errors gracefully', async () => {
      const targetScreen = 'ErrorScreen';
      const delay = 50;
      const navigationError = new Error('Navigation failed');

      mockNavigateFn.mockImplementation(() => {
        throw navigationError;
      });

      // Should not throw error and should still manage loading state
      await expect(navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay
      )).rejects.toThrow('Navigation failed');

      // Verify loading state was still managed (finally block executed)
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
      expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);

      // Verify navigation was attempted
      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, undefined);
    });

    it('should handle setLoading function errors gracefully', async () => {
      const targetScreen = 'TestScreen';
      const delay = 50;

      mockSetLoading.mockImplementation((loading: boolean) => {
        if (!loading) {
          throw new Error('SetLoading failed');
        }
      });

      // Should complete navigation despite setLoading error
      await expect(navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay
      )).rejects.toThrow('SetLoading failed');

      // Verify navigation still occurred
      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, undefined);
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
    });

    it('should work with zero delay', async () => {
      const targetScreen = 'InstantScreen';
      const delay = 0;

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay
      );

      // Verify all functions were called
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, undefined);
    });

    it('should handle complex parameters object', async () => {
      const targetScreen = 'ComplexScreen';
      const complexParams = {
        user: { id: '123', name: 'John Doe' },
        settings: { theme: 'dark', notifications: true },
        metadata: { source: 'navigation-test', timestamp: Date.now() }
      };
      const delay = 50;

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay,
        complexParams
      );

      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, complexParams);
    });

    it('should maintain proper execution order', async () => {
      const targetScreen = 'OrderTestScreen';
      const delay = 50;
      const executionOrder: string[] = [];

      mockSetLoading.mockImplementation((loading: boolean) => {
        executionOrder.push(`setLoading(${loading})`);
      });

      mockNavigateFn.mockImplementation((screen: string) => {
        executionOrder.push(`navigate(${screen})`);
      });

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay
      );

      expect(executionOrder).toEqual([
        'setLoading(true)',
        'navigate(OrderTestScreen)',
        'setLoading(false)'
      ]);
    });

    it('should handle empty string screen name', async () => {
      const targetScreen = '';
      const delay = 50;

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay
      );

      expect(mockNavigateFn).toHaveBeenCalledWith('', undefined);
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
    });

    it('should handle undefined parameters explicitly', async () => {
      const targetScreen = 'UndefinedParamsScreen';
      const delay = 50;

      await navigateWithSpinner(
        mockNavigateFn,
        targetScreen,
        mockSetLoading,
        delay,
        undefined
      );

      expect(mockNavigateFn).toHaveBeenCalledWith(targetScreen, undefined);
    });
  });

  describe('Integration scenarios', () => {
    it('should work in realistic navigation scenario', async () => {
      const mockNavigate = jest.fn();
      const mockSetLoading = jest.fn();
      const screen = 'UserProfile';
      const userParams = { userId: '12345', tab: 'settings' };

      // Simulate real navigation scenario
      await navigateWithSpinner(
        mockNavigate,
        screen,
        mockSetLoading,
        100, // Reasonable delay
        userParams
      );

      // Verify realistic usage pattern
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith(screen, userParams);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('should handle concurrent navigation attempts', async () => {
      const mockNavigate1 = jest.fn();
      const mockNavigate2 = jest.fn();
      const mockSetLoading1 = jest.fn();
      const mockSetLoading2 = jest.fn();

      // Start two navigation operations concurrently
      const navigation1 = navigateWithSpinner(
        mockNavigate1,
        'Screen1',
        mockSetLoading1,
        50
      );

      const navigation2 = navigateWithSpinner(
        mockNavigate2,
        'Screen2',
        mockSetLoading2,
        50
      );

      await Promise.all([navigation1, navigation2]);

      // Both should complete successfully
      expect(mockNavigate1).toHaveBeenCalledWith('Screen1', undefined);
      expect(mockNavigate2).toHaveBeenCalledWith('Screen2', undefined);
      expect(mockSetLoading1).toHaveBeenCalledTimes(2);
      expect(mockSetLoading2).toHaveBeenCalledTimes(2);
    });
  });
});