<script>
	import 'images/';

	let sections = [
		{
			id: 1,
			image: 'red',
			alt: 'Exterior of a red tiled building with a window in the center covered with white blinds.',
			colour: '#00c1b5',
		},
		{
			id: 2,
			image: 'blue',
			alt: 'Exterior of a blue building.',
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
			alt: 'A window with a balcony railing on a house with an orange exterior. The railing holds three orange planting pots containing different succulents.',
			colour: '#1d3fbb',
		},
		{
			id: 5,
			image: 'turquoise',
			alt: 'A white building against a clear, light teal sky.',
			colour: '#e30512',
		},
	];

	let box;
	let yTop = 0;
	let yBottom = 0;
	let innerHeight = 0;
	let lastTop = 0;
	let lastBottom = 0;
	let isScrolling = false;
	let sectionIndex = 0;

	const colours = sections.map(section => section.colour);
	let bgColour = '#00c1b5';

	let changeBGColour = () => {
		if (yTop >= 0 && yTop >= lastTop) {
			// Scrolling down
			for (let index = 1; index < colours.length; index++) {
				if (yTop <= innerHeight * index) {
					bgColour = colours[index];
					sectionIndex = index;
					break;
				}
			}
		} else if (yTop <= lastTop) {
			// Scrolling up
			for (let index = 0; index < colours.length - 1; index++) {
				if (yTop < (innerHeight) * (index + 1)) {
					bgColour = colours[index];
					sectionIndex = index;
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
	};

	let whiteText = () => {
		let content = document.getElementById('content');
		sectionIndex >= 3
			? content.classList.add('text-white')
			: content.classList.remove('text-white');
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
	class="absolute z-0 min-w-full min-h-full bgDisplay"
	style="transition: background-color 1s; background-color: {bgColour}"
/>

<main
	id="content"
	class="min-w-full min-h-full scrollsnap-container scroll-smooth"
	bind:this={box}
	on:scroll={() => {
		if (!isScrolling) {
			isScrolling = true;
			parseScroll();
			setTimeout(() => {
				changeBGColour();
				whiteText();
			}, 100);
		}
	}}
>
	<div
		class="absolute z-10 flex flex-row items-center justify-between min-w-full p-1 md:p-3"
	>
		<div>
			<h1
				class="font-sans text-3xl font-bold uppercase content-text md:text-5xl"
			>
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold content-text">
			Made with Svelte and Tailwind CSS
		</div>
	</div>

	{#each [...sections].reverse() as { id, image, alt }}
		<section id="section{id}">
			<div class="drop-shadow-2xl mix-blend-hard-light">
				<img
					class="rounded-lg w-96 image"
					src="images/image-{image}.jpg"
					{alt}
				/>
			</div>
			<h3 class="p-1 font-sans text-xl font-bold md:p-3">
				Section #{id}
			</h3>
		</section>
	{/each}

	<div
		class="absolute bottom-0 left-0 flex flex-row items-end justify-between min-w-full p-1 pointer-events-none md:p-3 z-100"
	>
		<div
			class="font-sans font-semibold text-center underline pointer-events-auto content-text hover:font-bold"
		>
			<a href="https://www.frontendpractice.com/projects/backstage-talks"
				>Project Idea</a
			>
		</div>
		<div
			class="font-sans font-semibold text-center pointer-events-auto content-text"
		>
			<ul>
				<li class="md:w-28">
					<a href="#section5" class="hover:font-bold">Section #5</a>
				</li>
				<li class="md:w-28">
					<a href="#section4" class="hover:font-bold">Section #4</a>
				</li>
				<li class="md:w-28">
					<a href="#section3" class="hover:font-bold">Section #3</a>
				</li>
				<li class="md:w-28">
					<a href="#section2" class="hover:font-bold">Section #2</a>
				</li>
				<li class="md:w-28">
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
