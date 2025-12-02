/**
 * Test suite for UserContext and authentication helpers
 * Tests user state management, authentication flow, and local storage integration
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage FIRST
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock AWS Amplify auth
jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  fetchAuthSession: jest.fn(),
  resendSignUpCode: jest.fn(),
}));

// Mock users API
jest.mock('../../api/users', () => ({
  getUserById: jest.fn(),
}));

import {
  UserProvider,
  useUser,
  useAuthHelpers,
  SignInResult
} from '../../context/UserContext';

import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resendSignUpCode,
} from 'aws-amplify/auth';

import { getUserById } from '../../api/users';
import { User } from '../../types/users/User';

// Type the mocked functions
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;
const mockFetchAuthSession = fetchAuthSession as jest.MockedFunction<typeof fetchAuthSession>;
const mockResendSignUpCode = resendSignUpCode as jest.MockedFunction<typeof resendSignUpCode>;
const mockGetUserById = getUserById as jest.MockedFunction<typeof getUserById>;

// Mock console methods to reduce test noise
const originalConsoleLog = console.log;

describe('UserContext', () => {
  // Sample test data
  const mockUser: User = {
    user_id: 'user-123',
    email_addr: 'test@example.com',
    username: 'testuser',
    paying_user: false
  };

  const mockAuthSession = {
    tokens: {
      idToken: {
        toString: () => 'mock-jwt-token',
        payload: {
          sub: 'user-123',
          email: 'test@example.com'
        }
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.log to reduce test noise
    console.log = jest.fn();

    // Default AsyncStorage mocks
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
  });

  afterAll(() => {
    // Restore console.log
    console.log = originalConsoleLog;
  });

  // Helper to create wrapper with UserProvider
  const createWrapper = ({ children }: { children: React.ReactNode }) => (
    <UserProvider>{children}</UserProvider>
  );

  describe('UserProvider and useUser', () => {
    it('should provide initial empty user state', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      // Initial state should be loading
      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeUndefined();

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeUndefined();
    });

    it('should restore user from AsyncStorage on mount', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should handle corrupted AsyncStorage data gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid json data');

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeUndefined();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeUndefined();
    });

    it('should set user and persist to AsyncStorage', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    it('should clear user and remove from AsyncStorage', async () => {
      // Start with a user
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Clear the user
      await act(async () => {
        await result.current.setUser(undefined);
      });

      expect(result.current.user).toBeUndefined();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('should provide memoized context value', async () => {
      const { result, rerender } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstValue = result.current;

      // Rerender should provide same reference when values haven't changed
      rerender();

      expect(result.current).toBe(firstValue);
    });
  });

  describe('useAuthHelpers', () => {
    let authHelpers: ReturnType<typeof useAuthHelpers>;

    beforeEach(async () => {
      const { result } = renderHook(
        () => ({ user: useUser(), auth: useAuthHelpers() }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.user.loading).toBe(false);
      });

      authHelpers = result.current.auth;
    });

    describe('signInAndLoadUser', () => {
      it('should sign in successfully and load user', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        // Mock successful sign in
        mockSignIn.mockResolvedValueOnce({
          nextStep: { signInStep: 'DONE' }
        } as any);

        mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);
        mockGetUserById.mockResolvedValueOnce(mockUser);

        const result = await authHelpers.signInAndLoadUser(email, password);

        expect(result).toEqual({ status: 'DONE' });
        expect(mockSignIn).toHaveBeenCalledWith({
          username: email.trim(),
          password
        });
        expect(mockGetUserById).toHaveBeenCalled();
      });

      it('should handle sign in without nextStep', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        // Mock sign in without nextStep (completed)
        mockSignIn.mockResolvedValueOnce({} as any);
        mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);
        mockGetUserById.mockResolvedValueOnce(mockUser);

        const result = await authHelpers.signInAndLoadUser(email, password);

        expect(result).toEqual({ status: 'DONE' });
      });

      it('should handle user needs confirmation from nextStep', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        mockSignIn.mockResolvedValueOnce({
          nextStep: { signInStep: 'CONFIRM_SIGN_UP' }
        } as any);

        mockResendSignUpCode.mockResolvedValueOnce({} as any);

        const result = await authHelpers.signInAndLoadUser(email, password);

        expect(result).toEqual({ status: 'NEEDS_CONFIRM' });
        expect(mockResendSignUpCode).toHaveBeenCalledWith({
          username: email.trim()
        });
      });

      it('should handle UserNotConfirmedException error', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        const confirmationError = new Error('User not confirmed');
        confirmationError.name = 'UserNotConfirmedException';

        mockSignIn.mockRejectedValueOnce(confirmationError);
        mockResendSignUpCode.mockResolvedValueOnce({} as any);

        const result = await authHelpers.signInAndLoadUser(email, password);

        expect(result).toEqual({ status: 'NEEDS_CONFIRM' });
        expect(mockResendSignUpCode).toHaveBeenCalledWith({
          username: email.trim()
        });
      });

      it('should handle general sign in errors', async () => {
        const email = 'test@example.com';
        const password = 'wrongpassword';

        const authError = new Error('Invalid credentials');
        authError.name = 'NotAuthorizedException';

        mockSignIn.mockRejectedValueOnce(authError);

        const result = await authHelpers.signInAndLoadUser(email, password);

        expect(result).toEqual({ status: 'ERROR', error: authError });
      });

      it('should handle unhandled sign in steps', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        mockSignIn.mockResolvedValueOnce({
          nextStep: { signInStep: 'UNKNOWN_STEP' }
        } as any);

        const result = await authHelpers.signInAndLoadUser(email, password);

        expect(result.status).toBe('ERROR');
        expect(result).toHaveProperty('error');
      });

      it('should handle resendSignUpCode failures gracefully', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        const confirmationError = new Error('User not confirmed');
        confirmationError.name = 'UserNotConfirmedException';

        mockSignIn.mockRejectedValueOnce(confirmationError);
        mockResendSignUpCode.mockRejectedValueOnce(new Error('Resend failed'));

        const result = await authHelpers.signInAndLoadUser(email, password);

        // Should still return NEEDS_CONFIRM even if resend fails
        expect(result).toEqual({ status: 'NEEDS_CONFIRM' });
      });

      it('should trim email whitespace', async () => {
        const email = '  test@example.com  ';
        const password = 'password123';

        mockSignIn.mockResolvedValueOnce({
          nextStep: { signInStep: 'DONE' }
        } as any);

        mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);
        mockGetUserById.mockResolvedValueOnce(mockUser);

        await authHelpers.signInAndLoadUser(email, password);

        expect(mockSignIn).toHaveBeenCalledWith({
          username: 'test@example.com',
          password
        });
      });
    });

    describe('bootstrapIfSignedIn', () => {
      it('should bootstrap user when already signed in', async () => {
        mockGetCurrentUser.mockResolvedValueOnce({} as any);
        mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);
        mockGetUserById.mockResolvedValueOnce(mockUser);

        await authHelpers.bootstrapIfSignedIn();

        expect(mockGetCurrentUser).toHaveBeenCalled();
        expect(mockFetchAuthSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalled();
      });

      it('should clear user when not signed in', async () => {
        mockGetCurrentUser.mockRejectedValueOnce(new Error('Not signed in'));

        await authHelpers.bootstrapIfSignedIn();

        expect(mockGetCurrentUser).toHaveBeenCalled();
        // Should clear user state
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user');
      });

      it('should handle API errors during bootstrap', async () => {
        mockGetCurrentUser.mockResolvedValueOnce({} as any);
        mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);
        mockGetUserById.mockRejectedValueOnce(new Error('API error'));

        // Should not throw, but handle gracefully
        await expect(authHelpers.bootstrapIfSignedIn()).resolves.not.toThrow();
      });
    });

    describe('signOutAll', () => {
      it('should sign out and clear user', async () => {
        mockSignOut.mockResolvedValueOnce();

        await authHelpers.signOutAll();

        expect(mockSignOut).toHaveBeenCalled();
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user');
      });

      it('should handle sign out errors gracefully', async () => {
        mockSignOut.mockRejectedValueOnce(new Error('Sign out failed'));

        // Should still clear user even if Amplify sign out fails
        await expect(authHelpers.signOutAll()).rejects.toThrow('Sign out failed');
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete authentication flow', async () => {
      const { result } = renderHook(
        () => ({ user: useUser(), auth: useAuthHelpers() }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.user.loading).toBe(false);
      });

      // 1. Start with no user
      expect(result.current.user.user).toBeUndefined();

      // 2. Sign in successfully
      mockSignIn.mockResolvedValueOnce({
        nextStep: { signInStep: 'DONE' }
      } as any);
      mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);
      mockGetUserById.mockResolvedValueOnce(mockUser);

      await act(async () => {
        const signInResult = await result.current.auth.signInAndLoadUser(
          'test@example.com',
          'password123'
        );
        expect(signInResult).toEqual({ status: 'DONE' });
      });

      // 3. User should be set
      await waitFor(() => {
        expect(result.current.user.user).toEqual(mockUser);
      });

      // 4. Sign out
      mockSignOut.mockResolvedValueOnce();

      await act(async () => {
        await result.current.auth.signOutAll();
      });

      // 5. User should be cleared
      expect(result.current.user.user).toBeUndefined();
    });

    it('should handle bootstrap on app start', async () => {
      // Mock user in storage
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

      const { result } = renderHook(
        () => ({ user: useUser(), auth: useAuthHelpers() }),
        { wrapper: createWrapper }
      );

      // Wait for initial load from storage
      await waitFor(() => {
        expect(result.current.user.user).toEqual(mockUser);
      });

      // Bootstrap should refresh user from API
      mockGetCurrentUser.mockResolvedValueOnce({} as any);
      mockFetchAuthSession.mockResolvedValueOnce(mockAuthSession as any);

      const freshUser = { ...mockUser, username: 'updated_username' };
      mockGetUserById.mockResolvedValueOnce(freshUser);

      await act(async () => {
        await result.current.auth.bootstrapIfSignedIn();
      });

      // User should be updated with fresh data
      await waitFor(() => {
        expect(result.current.user.user).toEqual(freshUser);
      });
    });

    it('should handle user state updates and persistence', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Set user
      await act(async () => {
        await result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));

      // Update user
      const updatedUser = { ...mockUser, paying_user: true };
      await act(async () => {
        await result.current.setUser(updatedUser);
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));

      // Clear user
      await act(async () => {
        await result.current.setUser(undefined);
      });

      expect(result.current.user).toBeUndefined();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle missing context provider', () => {
      // Render hook without UserProvider wrapper
      const { result } = renderHook(() => useUser());

      // Should provide default context value
      expect(result.current.user).toBeUndefined();
      expect(result.current.loading).toBe(true);
      expect(typeof result.current.setUser).toBe('function');
    });

    it('should handle concurrent setUser calls', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const user1 = { ...mockUser, user_id: 'user-1' };
      const user2 = { ...mockUser, user_id: 'user-2' };

      // Make concurrent setUser calls
      await act(async () => {
        await Promise.all([
          result.current.setUser(user1),
          result.current.setUser(user2)
        ]);
      });

      // One of them should win (likely the last one)
      expect(result.current.user).toBeDefined();
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should handle AsyncStorage persistence errors gracefully', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Mock storage error
      mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage full'));

      // setUser should still update state even if persistence fails
      await act(async () => {
        await expect(result.current.setUser(mockUser)).rejects.toThrow('Storage full');
      });

      // State should still be updated
      expect(result.current.user).toEqual(mockUser);
    });
  });
});