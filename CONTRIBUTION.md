### Nothing to see here at the moment 😅

New contributors could get up to speed on how to contribute through here in future.

![Retreating Doge](memes/retreating-doge.gif)

Thanks for checking out this page though 😁!

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
