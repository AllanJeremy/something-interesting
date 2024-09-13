import { describe, it, expect } from 'vitest';
import { FriendService } from './friend.service';

describe.skip('FriendService', () => {
	describe('Add friend', () => {
		describe('Valid inputs', () => {
			it('should send a friend request to the user with friendUserId', async () => {
				// TODO: Implement test
			});

			it('should increment the friendCount for the current user by 1', () => {
				// TODO: Implement test
			});

			// This prevents us from incorrectly modifying the pendingFriendCount
			it('should maintain the same friendCount', () => {
				// TODO: Implement test
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user tries to add themself as a friend', () => {
				// TODO: Implement test
			});

			it('should fail if user ID is invalid', async () => {
				// TODO: Implement test
			});

			it('should fail if friend user ID is invalid', async () => {
				// TODO: Implement test
			});

			it('should fail if users are already friends', async () => {
				// TODO: Implement test
			});
		});
	});

	describe('Remove friend', () => {
		describe('Valid inputs', () => {
			it('should allow friendship initiator to remove friend as a friend', async () => {
				// TODO: Implement test
			});

			it('should allow friend to remove friendship initiator as a friend', async () => {
				// TODO: Implement test
			});

			it('should deduct the number of friends a user has', async () => {
				// TODO: Implement test
			});

			describe('users are already friends', () => {
				it('should decrement the friendCount for the current user by 1', () => {
					// TODO: Implement test
				});

				// This prevents us from incorrectly modifying the pendingFriendCount
				it('should maintain the same pendingFriendCount', () => {
					// TODO: Implement test
				});
			});

			describe('friend request is pending', () => {
				it('should decrement the pendingFriendCount for the current user by 1', () => {
					// TODO: Implement test
				});

				// This prevents us from incorrectly modifying the pendingFriendCount
				it('should maintain the same friendCount', () => {
					// TODO: Implement test
				});
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user ID is invalid', async () => {
				// TODO: Implement test
			});

			it('should fail if friend user ID is invalid', async () => {
				// TODO: Implement test
			});

			it('should fail if users are not friends', async () => {
				// TODO: Implement test
			});
		});
	});

	describe('Get user friend list', () => {
		describe('Valid inputs', () => {
			it('should return an empty list if user has no friends', async () => {
				// TODO: Implement test
			});

			it('should return an array containing friends if the user has friends', async () => {
				// TODO: Implement test
			});

			it("should include the friend's nickname in the user info, if set", async () => {
				// TODO: Implement test
			});

			describe('Pagination', () => {
				it(`should return a maximum of ${FriendService.DEFAULT_FRIENDS_PER_PAGE} friends if no limit is specified`, async () => {
					// TODO: Implement test
				});

				it('should return the correct number of friends when limit is specified', async () => {
					// TODO: Implement test
				});

				it('should return the correct page of friends when pagination is specified', async () => {
					// TODO: Implement test
				});

				it('should fail when pagination page is out of bounds', () => {
					// TODO: Implement test
				});
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user ID is invalid', async () => {
				// TODO: Implement test
			});
		});
	});
});
