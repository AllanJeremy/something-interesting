import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

type ApiEndpointCardProps = {
	className?: string;
	title: string;
	description?: string;
	method: string;
	endpoint: string;
};

function _copyApiEndpoint(title: string, path: string) {
	const fullApiUrl = `${apiUrl}${path}`;

	navigator.clipboard.writeText(fullApiUrl);
	toast.success(`Copied "${title}" endpoint URL: ${fullApiUrl}`, {
		position: "bottom-center",
	});
}

function ApiEndpointCard({
	className,
	title,
	description,
	method,
	endpoint,
}: ApiEndpointCardProps) {
	return (
		<Alert className={className}>
			<AlertTitle>{title}</AlertTitle>
			{description && <AlertDescription>{description}</AlertDescription>}
			<AlertDescription className="pt-sm">
				<div className="relative mt-2 p-2 bg-gray-100 rounded-md border border-gray-300 overflow-auto">
					<div className="flex justify-between items-center">
						<code className="text-blue-600 text-xs break-all w-4/5">
							{method} {apiUrl}
							{endpoint}
						</code>
						<Button
							className="ml-2 "
							variant={"outline"}
							onClick={() => _copyApiEndpoint(title, endpoint)}
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</AlertDescription>
		</Alert>
	);
}

export default ApiEndpointCard;
