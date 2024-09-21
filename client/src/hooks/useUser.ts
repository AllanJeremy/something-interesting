import { getRequest, postRequest } from "@/utils/api";
import { CreateUserData, User } from "@server/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Custom hook to manage user-related operations.
 * @param {Function} [onCreateSuccess] - Callback function to be called on successful user creation.
 * @param {Function} [onCreateError] - Callback function to be called on user creation error.
 * @returns {Object} - An object containing user query, create user mutation, and exposed functions (such as handleCreateUser).
 */
export function useUser(
	onCreateSuccess?: (userCreated: User) => void,
	onCreateError?: (error: Error) => void
) {
	const queryClient = useQueryClient();

	//#region API requests
	/**
	 * Makes the API request to create the user.
	 * @param {CreateUserData} createUserData - The data for the user to create.
	 * @returns {Promise<User>} - A promise that resolves to the created user.
	 */
	async function _createUser(createUserData: CreateUserData): Promise<User> {
		const { data: userCreated } = await postRequest<User>(
			"/users",
			createUserData
		);

		return userCreated;
	}

	/**
	 * Makes the API request to load all the users.
	 * @param {string} [search] - Optional search query to filter users by username.
	 * @param {number} [page] - Optional page number for pagination.
	 * @param {number} [limit] - Optional limit of users per page.
	 * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
	 */
	async function _loadAllUsers(
		search?: string,
		page?: number,
		limit?: number
	): Promise<User[]> {
		// TODO: Make this a separate hook
		const urlSearchParams = new URLSearchParams();

		if (search) {
			urlSearchParams.append("search", search);
		}

		if (page) {
			urlSearchParams.append("page", String(page));
		}

		if (limit) {
			urlSearchParams.append("limit", String(limit));
		}

		let createUserApiUrl = "/users";

		if (urlSearchParams.size > 0) {
			createUserApiUrl += `?${urlSearchParams.toString()}`;
		}

		const { data: users } = await getRequest<User[]>(createUserApiUrl);

		return users;
	}
	//#endregion

	//#region Queries

	const userQuery = useQuery({
		//TODO: Cache by search & pagination too
		queryKey: ["users"],
		queryFn: () => _loadAllUsers(),
	});

	const createUserMutation = useMutation({
		mutationFn: _createUser,
		onError: (error) => {
			toast.error(error.message);

			if (onCreateError) {
				onCreateError(error);
			}
		},
		onSuccess: (userCreated) => {
			// Invalidate relevant queries to refetch data since we have updated it
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["stats"] });

			// Let the user know
			toast.success(
				`User @${userCreated.username} created (${userCreated.email})`
			);

			if (onCreateSuccess) {
				onCreateSuccess(userCreated);
			}
		},
	});

	//#endregion Queries

	return {
		// React query related
		userQuery,
		createUserMutation,
	};
}
