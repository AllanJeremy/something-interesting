import React from "react";
import Meteors from "@/components/magicui/meteors";
import StatsContainer from "@/components/stats/StatsContainer";
import UsersContainer from "@/components/users/UsersContainer";
import Navbar from "@/components/primitive/Navbar";

const Home: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<Meteors number={10} />

			<header className="flex justify-between items-center mb-8">
				<img src="/doge-o-logo.png" height="72" alt="The Doge-o logo" />

				<Navbar />
			</header>

			<main>
				<section className="text-center mb-12">
					<h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/80 bg-clip-text text-6xl font-bold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
						Welcome to the Doge-o
					</h1>
					<p className="mt-4 text-lg font-light text-gray-700">
						Pronounced "Dojo", this is a safe space to check out various stats &
						run simulations on the friend feature
					</p>
				</section>

				<StatsContainer />

				<section className="text-center mb-12">
					<h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/80 bg-clip-text text-6xl font-bold leading-none text-transparent dark:from-white dark:to-slate-900/10">
						Let's run some simulations
					</h1>
					<p className="mt-4 text-lg font-light text-gray-700">
						Test out API endpoints for the friend feature here. Please scroll :)
					</p>
				</section>

				<div>
					<UsersContainer />
				</div>
			</main>
		</div>
	);
};

export default Home;
