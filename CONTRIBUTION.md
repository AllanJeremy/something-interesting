## Friend Request System: Initiator and Receiver

In our friend request system, we use the concepts of **initiator** and **receiver** to manage the friendship process. This approach helps maintain clarity and control over the friend request lifecycle.

### Initiator

- The **initiator** is the user who sends the friend request.
- Represented by the `userId` field in the `userFriends` table.
- Has the ability to cancel the friend request before it's accepted.

### Receiver

- The **receiver** is the user who receives the friend request.
- Represented by the `friendUserId` field in the `userFriends` table.
- Has the power to accept or reject the friend request.

### Logical Flow

1. **Sending a request**:

   - Initiator sends a request → Creates a new entry in `userFriends` table
   - `isConfirmed` is set to `false`

2. **Accepting a request**:

   - Receiver accepts → Updates `isConfirmed` to `true`
   - Both users are now friends

3. **Rejecting/Cancelling a request**:

   - Receiver can reject or Initiator can cancel → Deletes the entry from `userFriends` table

4. **Removing a friend**:
   - Either user can remove the friendship → Deletes the entry from `userFriends` table

This system ensures that:

- Friend requests have a clear direction
- Only the receiver can confirm a request
- Both users have control over their friendships

Remember these concepts when working with the friend request functionality in the codebase!

## Naming Conventions

When working on this project, please adhere to the following naming conventions:

### Underscore Prefix (\_)

- In classes: Names that start with an underscore (\_) indicate private methods.
- In non-class files: Names starting with an underscore (\_) represent non-exported members of the file's context.

## Error Handling

When handling errors in this project, we prefer using the custom error classes defined in `src/backend/utils/error.utils.ts`. These error classes provide consistent error handling and messaging across the application.

### Using Custom Error Classes

- Always use the appropriate error class from `error.utils.ts` when throwing errors.
- Available error classes include:
  - `BadRequestError`
  - `UnauthorizedError`
  - `ForbiddenError`
  - `NotFoundError`
  - `ConflictError`
  - `InternalServerError`
- If you're unsure which specific error class to use, you can throw an `ApiError`, which is the base class for all custom errors.

Example usage:

```ts
import { BadRequestError } from "./utils/error.utils.ts";

// Whenever you need to throw an error
//... rest of code
if (infoIsIncomplete) {
	// this is an example condition that might lead to an error
	const errorMessage = "The following fields are missing: A, B, C";

	throw new BadRequestError(errorMessage);
}
```

### Lastly 😅

This doc is incomplete and may be missing some details on architecture and patterns.

![Retreating Doge](_memes/retreating-doge.gif)

Thanks for checking out this page though 😁!
