import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Define the props type
type TableLoadingSkeletonProps = {
	rows?: number;
	columns?: number;
};

const _DEFAULT_ROW_COUNT = 10;
const _DEFAULT_COLUMN_COUNT = 5;

function TableLoadingSkeleton(
	{ rows, columns }: TableLoadingSkeletonProps = {
		rows: _DEFAULT_ROW_COUNT,
		columns: _DEFAULT_COLUMN_COUNT,
	}
) {
	const rowCount = rows ?? _DEFAULT_ROW_COUNT;
	const columnCount = columns ?? _DEFAULT_COLUMN_COUNT;

	return (
		<div className="rounded-md border">
			<Table className="px-8">
				<TableHeader>
					<TableRow>
						{Array.from({ length: columnCount }).map((_, colIndex) => (
							<TableHead key={colIndex}>
								<Skeleton className="h-4 w-full" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rowCount }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{Array.from({ length: columnCount }).map((_, colIndex) => (
								<TableCell key={colIndex}>
									<Skeleton className="h-4 w-full" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default TableLoadingSkeleton;
