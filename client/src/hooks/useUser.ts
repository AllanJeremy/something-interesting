import { getRequest, postRequest } from "@/utils/api";
import { CreateUserData, User } from "@server/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUser = (
	onCreateSuccess?: (userCreated: User) => void,
	onCreateError?: (error: Error) => void
) => {
	//#region API requests
	/** Makes the API request to create the user */
	async function _createUser(createUserData: CreateUserData): Promise<User> {
		const { data: userCreated } = await postRequest<User>(
			"/users",
			createUserData
		);

		return userCreated;
	}

	/** Makes the API request to load all the users */
	// TODO: Add search, pagination
	async function _loadAllUsers(
		search?: string,
		page?: number,
		limit?: number
	): Promise<User[]> {
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
			toast.success(
				`User @${userCreated.username} created (${userCreated.email})`
			);

			if (onCreateSuccess) {
				onCreateSuccess(userCreated);
			}
		},
	});

	//#endregion Queries

	//#region Exposed functions

	/** Calls the create user mutation */
	function handleCreateUser(createUserData: CreateUserData) {
		createUserMutation.mutate(createUserData);
	}
	//#endregion Exposed functions

	return {
		// React query related
		userQuery,
		createUserMutation,

		// Exposed functions
		handleCreateUser,
	};
};
