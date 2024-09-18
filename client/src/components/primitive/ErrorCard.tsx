import { CircleX } from "lucide-react";

function ErrorCard({ error }: { error: Error }) {
	return (
		<div className="bg-red-100 text-red-500 p-4 rounded-lg flex ">
			<CircleX className="mr-2" />
			{error.message}
		</div>
	);
}

export default ErrorCard;
