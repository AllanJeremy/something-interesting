import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/icons";
import { githubUrl } from "@/config/site.config";

function Navbar() {
	return (
		<nav>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button
							className="transition-transform duration-200 hover:scale-110"
							variant="link"
							asChild
						>
							<a href={githubUrl} target="_blank" aria-label="Github">
								<GitHubIcon className="size-7 " />
							</a>
						</Button>
					</TooltipTrigger>
					<TooltipContent>Project Github</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</nav>
	);
}

export default Navbar;
