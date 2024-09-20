import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatsLoadingSkeletonProps = {
	className?: string;
};

function StatsLoadingSkeleton({ className }: StatsLoadingSkeletonProps) {
	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-3", className)}>
			{[...Array(3)].map((_, i) => (
				<Skeleton
					key={`stat-skeleton-${i}`}
					className={cn("rounded-xl", className)}
				/>
			))}
		</div>
	);
}

export default StatsLoadingSkeleton;
