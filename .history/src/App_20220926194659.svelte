<script>
	import '/images/';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	let isInView;
	let scrollDirection;
	const options = {
		rootMargin: '-50px',
		unobserveOnEnter: true,
	};

	const handleChange = ({ detail }) => {
		isInView = detail.inView;
		scrollDirection = detail.scrollDirection.vertical;
	};

	let sections = [
		{ id: 1, image: 'red', alt: '', colour: '#00c1b5' },
		{ id: 2, image: 'blue', alt: '', colour: '#ff651a' },
		{ id: 3, image: 'yellow', alt: '', colour: '#ffbe00' },
		{ id: 4, image: 'orange', alt: '', colour: '#1d3fbb' },
		{ id: 5, image: 'turquoise', alt: '', colour: '#e30512' },
	].reverse();

	let y;

	let backgroundColour;
</script>

<svelte:window bind:scrollY={y} />

<main
	class="min-w-full min-h-screen flex flex-col scrollsnap-container scroll-smooth"
>
	<div
		class:animate={isInView}
		id="background"
		transition:fade={{ delay: 25, duration: 500 }}
		class="min-w-full min-h-screen z-0 fixed"
		style="background-color: {backgroundColour}"
	/>

	<div
		class="min-w-full p-6 flex flex-row justify-between items-center z-10 fixed"
	>
		<div>
			<h1 class="font-sans font-bold text-5xl uppercase">
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold text-xl">Contact info</div>
	</div>

	{#each [...sections] as { id, image, alt, colour }}
		<section
			use:inview={{ unobserveOnEnter: true, rootMargin: '-20%' }}
			on:change={({ detail }) => {
				isInView = detail.inView;
				backgroundColour = colour;
			}}
		>
			{#if isInView}
				<div in:fade class="drop-shadow-2xl">
					<img
						class="w-96 rounded-lg"
						src="/images/image-{image}.jpg"
						{alt}
					/>
				</div>
				<h3 class="font-sans font-bold text-2xl p-6">Image #{id}</h3>
			{/if}
		</section>
	{/each}

	<div
		class="min-w-full p-6 flex flex-row justify-between items-end z-10 fixed bottom-0 left-0 pointer-events-none"
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

	.scrollsnap-container {
		max-height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		scroll-snap-type: mandatory; /* for older browsers */
		scroll-snap-points-y: repeat(100vh); /* for older browsers */
		scroll-snap-type: y mandatory;
		background: transparent;
		scrollbar-width: none;
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

	#section5 {
		background: #00c1b5;
	}

	#section4 {
		background: #ff651a;
	}

	#section3 {
		background: #ffbe00;
	}

	#section2 {
		background: #1d3fbb;
	}

	#section1 {
		background: #e30512;
	}
</style>
