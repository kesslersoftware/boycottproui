/**
 * Test suite for Users API module
 * Tests all user-related API endpoints including authentication, management, and boycotts/causes
 */

// Mock the core API module FIRST before imports
jest.mock('../../api/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));

import {
  registerUser,
  loginUser,
  sendResetEmail,
  resetPassword,
  getUserStats,
  getUserById,
  changeUsername,
  deleteUser,
  upgradeUser,
  getUserBoycotts,
  getUserCauses,
  getUserBoycott,
  deleteUserBoycott,
  deleteUserCause,
  getUserCauseById,
  getUserBoycottsByCause,
  addUserBoycott,
  addUserCause,
} from '../../api/users';

import { apiGet, apiPost, apiPut, apiDelete } from '../../api/api';
import { User, UserStats, LoginForm, RegisterForm, ResetPasswordForm, ChangeUsernameForm, UserBoycott, CompanyMetadata, UserCause } from '../../types/users';
import { ResponseMessage } from '../../types/misc';
import { CauseMetadata } from '../../types/causes/CauseMetadata';
import { AddUserBoycottForm } from '../../types/users/AddUserBoycottForm';
import { AddCausesForm } from '../../types/users/AddCausesForm';
import { UpgradeUserForm } from '../../types/users/UpgradeUserForm';

// Type the mocked functions
const mockApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockApiPut = apiPut as jest.MockedFunction<typeof apiPut>;
const mockApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

describe('Users API', () => {
  // Sample test data
  const mockUser: User = {
    user_id: 'user-123',
    email_addr: 'test@example.com',
    username: 'testuser',
    paying_user: false
  };

  const mockUserStats: UserStats = {
    user_boycott_count: 5,
    user_cause_count: 3,
    user_top_cause: 'Environmental Issues'
  };

  const mockLoginForm: LoginForm = {
    email_addr: 'test@example.com',
    password: 'password123'
  };

  const mockRegisterForm: RegisterForm = {
    email_addr: 'newuser@example.com',
    username: 'newuser',
    password: 'password123'
  };

  const mockResetPasswordForm: ResetPasswordForm = {
    email_addr: 'test@example.com',
    reset_code: 'ABC123',
    new_password: 'newpassword123'
  };

  const mockChangeUsernameForm: ChangeUsernameForm = {
    new_username: 'updatedusername'
  };

  const mockUpgradeUserForm: UpgradeUserForm = {
    upgrade_type: 'premium',
    payment_info: 'stripe_token_123'
  };

  const mockUserBoycott: UserBoycott = {
    company_id: 'company-123',
    company_name: 'Test Company',
    cause_id: 'cause-456',
    cause_desc: 'Environmental Issues',
    personal_reason: 'Unethical practices',
    timestamp: '2024-01-01T00:00:00Z'
  };

  const mockUserCause: UserCause = {
    cause_id: 'cause-789',
    cause_desc: 'Labor Rights',
    timestamp: '2024-01-02T00:00:00Z'
  };

  const mockCompanyMetadata: CompanyMetadata = {
    company_id: 'company-123',
    company_name: 'Test Company',
    boycott_reason: 'Unethical practices',
    boycott_date: '2024-01-01'
  };

  const mockCauseMetadata: CauseMetadata = {
    cause_id: 'cause-789',
    cause_desc: 'Labor Rights',
    supporter_count: 1500
  };

  const mockAddUserBoycottForm: AddUserBoycottForm = {
    company_id: 'company-456',
    cause_id: 'cause-789',
    personal_reason: 'Ethical concerns'
  };

  const mockAddCausesForm: AddCausesForm = {
    cause_ids: ['cause-123', 'cause-456']
  };

  const mockResponseMessage: ResponseMessage = {
    message: 'Operation successful'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication and Registration', () => {
    it('should register a new user', async () => {
      mockApiPost.mockResolvedValueOnce(mockUser);

      const result = await registerUser(mockRegisterForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/register', mockRegisterForm);
      expect(result).toEqual(mockUser);
    });

    it('should login an existing user', async () => {
      mockApiPost.mockResolvedValueOnce(mockUser);

      const result = await loginUser(mockLoginForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/login', mockLoginForm);
      expect(result).toEqual(mockUser);
    });

    it('should handle registration errors', async () => {
      const errorResponse = { error: 'Email already exists' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(registerUser(mockRegisterForm)).rejects.toEqual(errorResponse);
      expect(mockApiPost).toHaveBeenCalledWith('/users/register', mockRegisterForm);
    });

    it('should handle login errors', async () => {
      const errorResponse = { error: 'Invalid credentials' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(loginUser(mockLoginForm)).rejects.toEqual(errorResponse);
      expect(mockApiPost).toHaveBeenCalledWith('/users/login', mockLoginForm);
    });
  });

  describe('Password Reset', () => {
    it('should send reset email', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await sendResetEmail({ email_addr: 'test@example.com' });

      expect(mockApiPost).toHaveBeenCalledWith('/users/resetemail/', { email_addr: 'test@example.com' });
      expect(result).toEqual(mockResponseMessage);
    });

    it('should reset password with valid code', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await resetPassword(mockResetPasswordForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/reset/', mockResetPasswordForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle reset email errors', async () => {
      const errorResponse = { error: 'User not found' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(sendResetEmail({ email_addr: 'nonexistent@example.com' })).rejects.toEqual(errorResponse);
    });

    it('should handle reset password errors', async () => {
      const errorResponse = { error: 'Invalid reset code' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      const invalidResetForm = { ...mockResetPasswordForm, reset_code: 'INVALID' };
      await expect(resetPassword(invalidResetForm)).rejects.toEqual(errorResponse);
    });
  });

  describe('User Stats and Details', () => {
    it('should get user statistics', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserStats);

      const result = await getUserStats();

      expect(mockApiGet).toHaveBeenCalledWith('/users/stats');
      expect(result).toEqual(mockUserStats);
    });

    it('should get user details by ID', async () => {
      mockApiGet.mockResolvedValueOnce(mockUser);

      const result = await getUserById();

      expect(mockApiGet).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUser);
    });

    it('should handle stats retrieval errors', async () => {
      const errorResponse = { error: 'User not authenticated' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getUserStats()).rejects.toEqual(errorResponse);
    });

    it('should handle user details retrieval errors', async () => {
      const errorResponse = { error: 'User not found' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getUserById()).rejects.toEqual(errorResponse);
    });
  });

  describe('User Management', () => {
    it('should change username', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await changeUsername(mockChangeUsernameForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/username', mockChangeUsernameForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should delete user account', async () => {
      mockApiDelete.mockResolvedValueOnce(mockResponseMessage);

      const result = await deleteUser();

      expect(mockApiDelete).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should upgrade user account', async () => {
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);

      const result = await upgradeUser(mockUpgradeUserForm);

      expect(mockApiPut).toHaveBeenCalledWith('/users', mockUpgradeUserForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle username change errors', async () => {
      const errorResponse = { error: 'Username already taken' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(changeUsername(mockChangeUsernameForm)).rejects.toEqual(errorResponse);
    });

    it('should handle account deletion errors', async () => {
      const errorResponse = { error: 'Cannot delete account with active subscriptions' };
      mockApiDelete.mockRejectedValueOnce(errorResponse);

      await expect(deleteUser()).rejects.toEqual(errorResponse);
    });

    it('should handle upgrade errors', async () => {
      const errorResponse = { error: 'Payment processing failed' };
      mockApiPut.mockRejectedValueOnce(errorResponse);

      await expect(upgradeUser(mockUpgradeUserForm)).rejects.toEqual(errorResponse);
    });
  });

  describe('User Boycotts', () => {
    it('should get all user boycotts', async () => {
      mockApiGet.mockResolvedValueOnce([mockUserBoycott]);

      const result = await getUserBoycotts();

      expect(mockApiGet).toHaveBeenCalledWith('/users/boycotts');
      expect(result).toEqual([mockUserBoycott]);
    });

    it('should get user boycott by company ID', async () => {
      mockApiGet.mockResolvedValueOnce(mockCompanyMetadata);

      const result = await getUserBoycott('company-123');

      expect(mockApiGet).toHaveBeenCalledWith('/users/companies/company-123');
      expect(result).toEqual(mockCompanyMetadata);
    });

    it('should get user boycotts by cause', async () => {
      mockApiGet.mockResolvedValueOnce(mockCauseMetadata);

      const result = await getUserBoycottsByCause('cause-789');

      expect(mockApiGet).toHaveBeenCalledWith('/users/boycotts/causes/cause-789');
      expect(result).toEqual(mockCauseMetadata);
    });

    it('should add a new user boycott', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addUserBoycott(mockAddUserBoycottForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/boycotts', mockAddUserBoycottForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should delete a user boycott', async () => {
      mockApiDelete.mockResolvedValueOnce(mockResponseMessage);

      const result = await deleteUserBoycott('company-123');

      expect(mockApiDelete).toHaveBeenCalledWith('/users/companies/company-123');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle boycott retrieval errors', async () => {
      const errorResponse = { error: 'No boycotts found' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getUserBoycotts()).rejects.toEqual(errorResponse);
    });

    it('should handle boycott addition errors', async () => {
      const errorResponse = { error: 'Boycott already exists' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(addUserBoycott(mockAddUserBoycottForm)).rejects.toEqual(errorResponse);
    });

    it('should handle boycott deletion errors', async () => {
      const errorResponse = { error: 'Boycott not found' };
      mockApiDelete.mockRejectedValueOnce(errorResponse);

      await expect(deleteUserBoycott('nonexistent-company')).rejects.toEqual(errorResponse);
    });
  });

  describe('User Causes', () => {
    it('should get all user causes', async () => {
      mockApiGet.mockResolvedValueOnce([mockUserCause]);

      const result = await getUserCauses();

      expect(mockApiGet).toHaveBeenCalledWith('/users/causes');
      expect(result).toEqual([mockUserCause]);
    });

    it('should get user cause by ID', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserCause);

      const result = await getUserCauseById('cause-789');

      expect(mockApiGet).toHaveBeenCalledWith('/users/causes/cause-789');
      expect(result).toEqual(mockUserCause);
    });

    it('should add user causes', async () => {
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);

      const result = await addUserCause(mockAddCausesForm);

      expect(mockApiPost).toHaveBeenCalledWith('/users/causes', mockAddCausesForm);
      expect(result).toEqual(mockResponseMessage);
    });

    it('should delete a user cause', async () => {
      mockApiDelete.mockResolvedValueOnce(mockResponseMessage);

      const result = await deleteUserCause('cause-789');

      expect(mockApiDelete).toHaveBeenCalledWith('/users/causes/cause-789');
      expect(result).toEqual(mockResponseMessage);
    });

    it('should handle cause retrieval errors', async () => {
      const errorResponse = { error: 'No causes found' };
      mockApiGet.mockRejectedValueOnce(errorResponse);

      await expect(getUserCauses()).rejects.toEqual(errorResponse);
    });

    it('should handle cause addition errors', async () => {
      const errorResponse = { error: 'Some causes already exist' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(addUserCause(mockAddCausesForm)).rejects.toEqual(errorResponse);
    });

    it('should handle cause deletion errors', async () => {
      const errorResponse = { error: 'Cause not found' };
      mockApiDelete.mockRejectedValueOnce(errorResponse);

      await expect(deleteUserCause('nonexistent-cause')).rejects.toEqual(errorResponse);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle empty response arrays', async () => {
      mockApiGet.mockResolvedValueOnce([]); // for getUserBoycotts
      mockApiGet.mockResolvedValueOnce([]); // for getUserCauses

      const boycotts = await getUserBoycotts();
      const causes = await getUserCauses();

      expect(boycotts).toEqual([]);
      expect(causes).toEqual([]);
    });

    it('should handle network timeouts', async () => {
      const networkError = new Error('Network timeout');
      mockApiGet.mockRejectedValueOnce(networkError);

      await expect(getUserStats()).rejects.toThrow('Network timeout');
    });

    it('should handle malformed request data', async () => {
      const malformedData = { invalid_field: 'test' } as any;
      const errorResponse = { error: 'Invalid request format' };
      mockApiPost.mockRejectedValueOnce(errorResponse);

      await expect(registerUser(malformedData)).rejects.toEqual(errorResponse);
    });

    it('should handle server errors', async () => {
      const serverError = { status: 500, message: 'Internal server error' };
      mockApiGet.mockRejectedValueOnce(serverError);

      await expect(getUserById()).rejects.toEqual(serverError);
    });

    it('should handle empty string parameters', async () => {
      mockApiGet.mockResolvedValueOnce(mockUserCause);

      await getUserCauseById('');

      expect(mockApiGet).toHaveBeenCalledWith('/users/causes/');
    });

    it('should handle special characters in IDs', async () => {
      const specialId = 'company-123@#$%';
      mockApiGet.mockResolvedValueOnce(mockCompanyMetadata);

      await getUserBoycott(specialId);

      expect(mockApiGet).toHaveBeenCalledWith(`/users/companies/${specialId}`);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete user registration to boycott flow', async () => {
      // Registration
      mockApiPost.mockResolvedValueOnce(mockUser);
      const user = await registerUser(mockRegisterForm);
      expect(user).toEqual(mockUser);

      // Get user stats
      mockApiGet.mockResolvedValueOnce(mockUserStats);
      const stats = await getUserStats();
      expect(stats).toEqual(mockUserStats);

      // Add boycott
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);
      const boycottResult = await addUserBoycott(mockAddUserBoycottForm);
      expect(boycottResult).toEqual(mockResponseMessage);

      // Get updated boycotts
      mockApiGet.mockResolvedValueOnce([mockUserBoycott]);
      const boycotts = await getUserBoycotts();
      expect(boycotts).toEqual([mockUserBoycott]);
    });

    it('should handle user account lifecycle', async () => {
      // Login
      mockApiPost.mockResolvedValueOnce(mockUser);
      await loginUser(mockLoginForm);

      // Change username
      mockApiPost.mockResolvedValueOnce(mockResponseMessage);
      await changeUsername(mockChangeUsernameForm);

      // Upgrade account
      mockApiPut.mockResolvedValueOnce(mockResponseMessage);
      await upgradeUser(mockUpgradeUserForm);

      // Delete account
      mockApiDelete.mockResolvedValueOnce(mockResponseMessage);
      await deleteUser();

      expect(mockApiPost).toHaveBeenCalledTimes(2); // login + changeUsername
      expect(mockApiPut).toHaveBeenCalledTimes(1); // upgrade
      expect(mockApiDelete).toHaveBeenCalledTimes(1); // delete
    });
  });
});