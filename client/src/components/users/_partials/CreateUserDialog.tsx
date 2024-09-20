import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import CreateUserForm from "./CreateUserForm";

type CreateUserDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

function CreateUserDialog({ open, setOpen }: CreateUserDialogProps) {
	//? TODO: Consider using shadcn/ui <Form /> with Zod validation for this if the opportunity arises for stronger validations
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New User</DialogTitle>
					<DialogDescription>
						Fill in the details below to create a new user. All fields are
						required.
					</DialogDescription>
				</DialogHeader>

				<CreateUserForm
					onSuccess={() => setOpen(false)}
					onCancel={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

export default CreateUserDialog;
