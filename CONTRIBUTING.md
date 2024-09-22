![Doge-o logo banner](_memes/doge-o-logo-banner.png)

> _Came up with the name while on a walk and it stuck 😅. So I made a quick logo with Dalle and Figma 🖌️._

## Welcome

Glad you're interested in contributing. This document should help you get up to speed. This document is a work in progress.

## Folder structure

```
.
├── client/          # Contains the ReactJS frontend code
│   ├── public/      # Public assets like images and icons
│   ├── src/         # Source code for the frontend application
│   │   ├── assets/  # Static assets like images and fonts
│   │   ├── components/  # Reusable React components
│   │   ├── hooks/   # Custom React hooks
│   │   ├── pages/   # Page components for different routes
│   │   ├── styles/  # Global and component-specific styles
│   │   ├── utils/   # Utility functions and helpers
│   │   ├── App.tsx  # Main application component
│   │   ├── index.tsx  # Entry point for the React application
│   │   └── ...      # Other source files
│   ├── .gitignore   # Git ignore file for the client
│   ├── package.json # NPM package configuration for the client
│   └── ...          # Other configuration files
├── server/          # Contains the backend code
│   ├── src/         # Source code for the backend application
│   │   ├── db/      # Database migrations and seed files
│   │   ├── routes/  # API route handlers
│   │   ├── utils/   # Utility functions and helpers
│   │   ├── index.ts # Entry point for the backend application
│   │   └── ...      # Other source files
│   ├── .gitignore   # Git ignore file for the server
│   ├── package.json # NPM package configuration for the server
│   └── ...          # Other configuration files
├── .github/         # GitHub-specific files like workflows
│   ├── workflows/   # GitHub Actions workflows for CI/CD
│   └── ...          # Other GitHub-specific files
├── .gitignore       # Git ignore file for the entire project
├── CONTRIBUTING.md  # Guidelines for contributing to the project
├── README.md        # Project overview and setup instructions
└── ...              # Other project files
```

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

When handling errors in this project, we prefer using the custom error classes defined in `src/utils/error.utils.ts`. These error classes provide consistent error handling and messaging across the application.

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
