import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";

const StatCard = ({
	className,
	title,
	value,
	imgUrl,
	onClick,
}: {
	className?: string;
	title: string;
	value: number;
	imgUrl: string;
	onClick?: () => void;
}) => {
	return (
		<Card
			className={cn(
				className,
				"shadow-none text-center flex flex-col justify-center relative",
				"hover:cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-100 hover:orange-500/10"
			)}
			onClick={onClick}
		>
			{/* Background */}
			<div>
				<img
					src={imgUrl}
					alt="Background"
					className="absolute top-0 left-0 w-full h-full object-cover rounded-xl object-center"
				/>
				<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60  rounded-xl"></div>
			</div>

			<CardHeader className="relative p-2">
				<CardTitle className="text-7xl font-bold text-white">
					<NumberTicker className="text-white" value={value} />
				</CardTitle>
			</CardHeader>
			<CardContent className="relative">
				<p className="text-white uppercase text-sm">{title}</p>
			</CardContent>
		</Card>
	);
};

export default StatCard;
