import React from "react";
import Meteors from "@/components/magicui/meteors";
import StatsContainer from "@/components/StatsContainer";
import ApiCard from "@/components/UsersCard";

const Home: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<Meteors number={10} />

			<header className="flex justify-between items-center mb-8">
				<img src="/doge-o-logo.png" height="72" alt="The Doge-o logo" />

				<nav>
					<a
						href="https://github.com/AllanJeremy/doge-labs-vr"
						className="mr-4"
					>
						Github
					</a>
				</nav>
			</header>

			<main>
				<section className="text-center mb-12">
					<h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/80 bg-clip-text text-6xl font-bold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
						Welcome to the Doge-o
					</h1>
					<p className="mt-4">
						Pronounced Dojo, this is a safe space to check out various stats &
						run simulations on the BigBallerz friend feature
					</p>
				</section>

				<StatsContainer />

				<section className="text-center mb-12">
					<h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/80 bg-clip-text text-6xl font-bold leading-none text-transparent dark:from-white dark:to-slate-900/10">
						Let's run some simulations
					</h1>
					<p className="mt-4">
						Test out API endpoints for the friend feature here
					</p>
				</section>

				<div>
					<ApiCard />
				</div>
			</main>
		</div>
	);
};

export default Home;
