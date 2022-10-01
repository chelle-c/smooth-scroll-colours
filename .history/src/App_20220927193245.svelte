<script>
	import '/images/';
	import { fade } from 'svelte/transition';

	let sections = [
		{ id: 1, image: 'red', alt: '', colour: '#00c1b5' },
		{ id: 2, image: 'blue', alt: '', colour: '#ff651a' },
		{ id: 3, image: 'yellow', alt: '', colour: '#ffbe00' },
		{ id: 4, image: 'orange', alt: '', colour: '#1d3fbb' },
		{ id: 5, image: 'turquoise', alt: '', colour: '#e30512' },
	];

	const colours = sections.map(section => section.colour);

	let y;
	let backgroundColour = '#00c1b5';
</script>

<svelte:window bind:scrollY={y} />

<main
	class="min-w-full min-h-screen flex flex-col scrollsnap-container scroll-smooth"
>
	<div
		class="min-w-full p-6 flex flex-row justify-between items-center absolute"
	>
		<div>
			<h1 class="font-sans font-bold text-5xl uppercase">
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold text-xl">Y Position: {y}</div>
	</div>

	{#each [...sections].reverse() as { id, image, alt, colour }}
		<section
			id="section{id}"
			class="flex flex-col justify-center items-center min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		>
			<div id="background" class="min-w-full min-h-screen z-0 absolute" />
			<div in:fade class="drop-shadow-2xl">
				<img
					class="w-96 rounded-lg"
					src="/images/image-{image}.jpg"
					{alt}
				/>
			</div>
			<h3 class="font-sans font-bold text-2xl p-6">Image #{id}</h3>
		</section>
	{/each}

	<div
		class="min-w-full p-6 flex flex-row justify-between items-end z-100 absolute bottom-0 left-0 pointer-events-none"
	>
		<div class="font-sans text-xl pointer-events-auto">Privacy Policy</div>
		<div class="font-sans font-semibold text-xl pointer-events-auto">
			<ul>
				<li><a href="#section5">Image #5</a></li>
				<li><a href="#section4">Image #4</a></li>
				<li><a href="#section3">Image #3</a></li>
				<li><a href="#section2">Image #2</a></li>
				<li><a href="#section1">Image #1</a></li>
			</ul>
		</div>
	</div>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	a,
	a:visited {
		color: inherit;
	}

	section {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		scroll-snap-align: start;
		position: relative;
		background: inherit;
		transition: background-color 1s linear;
	}

	.scrollsnap-container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
	}
</style>
