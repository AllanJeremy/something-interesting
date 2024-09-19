import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

type ApiEndpointCardProps = {
	className?: string;
	title: string;
	description?: string;
	method: string;
	endpoint: string;
};

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
				<div className="relative mt-2 p-2 bg-gray-100 rounded-md border border-gray-300">
					<pre className="m-0">
						<code className="text-blue-600">
							{method} {apiUrl}
							{endpoint}
						</code>
					</pre>
				</div>
			</AlertDescription>
		</Alert>
	);
}

export default ApiEndpointCard;
