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

	let box;
	let yTop = 0;
	let yBottom = 0;
	let yHeight = 0;
	let innerHeight;
	let lastScroll = 0;
	let isScrolling = false;

	const colours = sections.map(section => section.colour);
	let initialBG = '#00c1b5';

	let setColour = () => {
		isScrolling = true;
		let colour;
		for (let index = 0; index < sections.length; index++) {
			if (yTop >= 0 && yTop > lastScroll) {
				if (lastScroll <= innerHeight * index) {
					isScrolling = true;
					colour = colours[index];
					break;
				}
			} else if (yTop < lastScroll) {
				if (lastScroll < innerHeight * (index + 1)) {
					colour = colours[index];
					break;
				}
			}
		}

		initialBG = colour;
		document.getElementById('background').style.backgroundColor = initialBG;
		setTimeout(() => {
			lastScroll = yTop;
			isScrolling = false;
		}, 1500);
	};

	let parseScroll = () => {
		yTop = box.scrollTop;
		yBottom = yTop + innerHeight;
		yHeight = box.scrollHeight;
		setColour();
	};
</script>

<svelte:window bind:innerHeight />

<div
	id="background"
	class="bgDisplay min-w-full min-h-screen z-0 absolute"
	style="transition: background-color 1.5s;"
/>

<main
	class="scrollsnap-container min-w-full min-h-screen flex flex-col scroll-smooth"
	bind:this={box}
	on:scroll={!isScrolling ? parseScroll : null}
	on:mousemove={!isScrolling ? parseScroll : null}
>
	<div
		class="min-w-full p-6 flex flex-row justify-between items-center z-10 absolute"
	>
		<div>
			<h1 class="font-sans font-bold text-5xl uppercase">
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold text-xl">
			Y Top Position: {yTop}, Y Bottom Position: {yBottom}, Total Height: {yHeight}
		</div>
	</div>

	{#each [...sections].reverse() as { id, image, alt }}
		<section
			id="section{id}"
			class="flex flex-col justify-center items-center min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		>
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
		<div
			class="font-sans font-semibold text-xl underline pointer-events-auto hover:font-bold"
		>
			<a href="https://www.frontendpractice.com/projects/backstage-talks"
				>Project Idea</a
			>
		</div>
		<div class="font-sans font-semibold text-xl pointer-events-auto">
			<ul class="min-w-max">
				<li>
					<a href="#section5" class="hover:font-bold">Image #5</a>
				</li>
				<li>
					<a href="#section4" class="hover:font-bold">Image #4</a>
				</li>
				<li>
					<a href="#section3" class="hover:font-bold">Image #3</a>
				</li>
				<li>
					<a href="#section2" class="hover:font-bold">Image #2</a>
				</li>
				<li>
					<a href="#section1" class="hover:font-bold">Image #1</a>
				</li>
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

	.bgDisplay {
		background-color: #00c1b5;
	}

	.scrollsnap-container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		scroll-snap-type: mandatory; /* for older browsers */
		scroll-snap-points-y: repeat(100vh); /* for older browsers */
		scrollbar-width: none;
		background: transparent;
	}
</style>
