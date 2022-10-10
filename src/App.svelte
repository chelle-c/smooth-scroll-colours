<script>
	import 'images/';

	let sections = [
		{
			id: 1,
			image: 'red',
			alt: 'A white building against a clear, light teal sky.',
			colour: '#00c1b5',
		},
		{
			id: 2,
			image: 'blue',
			alt: 'A window with a balcony railing on a house with an orange exterior. The railing holds three orange planting pots containing different succulents.',
			colour: '#ff651a',
		},
		{
			id: 3,
			image: 'yellow',
			alt: 'An upward view to a skylight within a triangular building.',
			colour: '#ffbe00',
		},
		{
			id: 4,
			image: 'orange',
			alt: 'Exterior of a blue building.',
			colour: '#1d3fbb',
		},
		{
			id: 5,
			image: 'turquoise',
			alt: 'Exterior of a red tiled building with a window in the center covered with white blinds.',
			colour: '#e30512',
		},
	];

	let box;
	let yTop = 0;
	let yBottom = 0;
	let yHeight = 0;
	let innerHeight = 0;
	let lastTop = 0;
	let lastBottom = 0;
	let isScrolling = false;

	const colours = sections.map(section => section.colour);
	let bgColour = '#00c1b5';

	let changeBGColour = () => {
		isScrolling = true;
		if (yTop >= 0 && yTop > lastTop) {
			// Scrolling down
			for (let index = 1; index < colours.length; index++) {
				if (yTop <= (innerHeight + 1) * index) {
					bgColour = colours[index];
					index >= 3
						? document
								.getElementById('content')
								.classList.add('text-white')
						: document
								.getElementById('content')
								.classList.remove('text-white');
					break;
				}
			}
		} else if (yTop < lastTop) {
			// Scrolling up
			for (let index = 0; index < colours.length - 1; index++) {
				if (lastTop < innerHeight * (index + 1)) {
					bgColour = colours[index];
					index >= 3
						? document
								.getElementById('content')
								.classList.add('text-white')
						: document
								.getElementById('content')
								.classList.remove('text-white');
					break;
				}
			}
		}
		lastTop = yTop;
		lastBottom = yBottom;
		isScrolling = false;
	};

	let parseScroll = () => {
		yTop = Math.floor(box.scrollTop);
		yBottom = Math.floor(yTop + innerHeight);
		yHeight = Math.floor(box.scrollHeight);
		changeBGColour();
		appHeight();
	};

	const appHeight = () => {
		document.documentElement.style.setProperty(
			'--app-height',
			`${window.innerHeight}px`
		);
	};
	window.addEventListener('resize', appHeight);
	appHeight();
</script>

<svelte:window bind:innerHeight />

<div
	id="background"
	class="bgDisplay min-w-full min-h-full z-0 absolute"
	style="transition: background-color 1.5s; background-color: {bgColour}"
/>

<main
	id="content"
	class="scrollsnap-container min-w-full min-h-full scroll-smooth"
	bind:this={box}
	on:scroll={!isScrolling ? parseScroll : null}
>
	<div
		class="min-w-full p-6 flex flex-row justify-between items-center z-10 absolute"
	>
		<div>
			<h1 class="font-sans font-bold md:text-5xl text-3xl uppercase">
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold text-xl">
			Made with Svelte and Tailwind CSS
		</div>
	</div>

	{#each [...sections].reverse() as { id, image, alt }}
		<section
			id="section{id}"
			class="[&:nth-child(5)]:text-white [&:nth-child(6)]:text-white"
		>
			<div class="drop-shadow-2xl mix-blend-hard-light">
				<img
					class="w-96 rounded-lg"
					src="images/image-{image}.jpg"
					{alt}
				/>
			</div>
			<h3 class="font-sans font-bold text-2xl p-6">Section #{id}</h3>
		</section>
	{/each}

	<div
		class="min-w-full p-6 flex flex-row justify-between items-end z-100 absolute bottom-0 left-0 pointer-events-none"
	>
		<div
			class="font-sans font-semibold text-xl text-center underline pointer-events-auto hover:font-bold"
		>
			<a href="https://www.frontendpractice.com/projects/backstage-talks"
				>Project Idea</a
			>
		</div>
		<div
			class="font-sans font-semibold text-xl text-center pointer-events-auto"
		>
			<ul>
				<li class="w-28">
					<a href="#section5" class="hover:font-bold">Section #5</a>
				</li>
				<li class="w-28">
					<a href="#section4" class="hover:font-bold">Section #4</a>
				</li>
				<li class="w-28">
					<a href="#section3" class="hover:font-bold">Section #3</a>
				</li>
				<li class="w-28">
					<a href="#section2" class="hover:font-bold">Section #2</a>
				</li>
				<li class="w-28">
					<a href="#section1" class="hover:font-bold">Section #1</a>
				</li>
			</ul>
		</div>
	</div>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
