import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatsLoadingSkeleton({ gapClass }: { gapClass?: string }) {
	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-3 ", gapClass)}>
			{[...Array(3)].map((_, i) => (
				<Skeleton
					key={`stat-skeleton-${i}`}
					className={`${gapClass} rounded-xl`}
				/>
			))}
		</div>
	);
}

export default StatsLoadingSkeleton;
