<script>
	import { onMount } from 'svelte';
	import '/images/';

	let box;
	let yTop = 0;
	let yScroll = 0;
	let yHeight = 0;

	let parseScroll = () => {
		yTop = box.scrollTop;
		yHeight = box.clientHeight;
		yScroll = box.scrollHeight;
	}

	onMount(() => parseScroll());
</script>

<main
	class="min-w-full min-h-screen flex flex-col scrollsnap-container"
	bind:this={box}
>
	<div class="flex flex-row justify-between items-baseline z-10 fixed">
		<div>
			<h1 class="font-sans font-bold text-5xl uppercase">
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold text-xl">Contact info</div>
	</div>
	<section class="flex min-w-full min-h-screen justify-center items-center" id="section5">
		<div>
			<img
				class="w-96"
				src="/images/image-turquoise.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section class="flex min-w-full min-h-screen justify-center items-center" id="section4">
		<div>
			<img
				class="w-96"
				src="/images/image-orange.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section class="flex min-w-full min-h-screen justify-center items-center" id="section3">
		<div>
			<img
				class="w-96"
				src="/images/image-yellow.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section class="flex min-w-full min-h-screen justify-center items-center" id="section2">
		<div>
			<img
				class="w-96"
				src="/images/image-blue.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section class="flex min-w-full min-h-screen justify-center items-center" id="section1">
		<div>
			<img
				class="w-96"
				src="/images/image-red.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>
	<div class="flex flex-row justify-between items-end z-10 fixed">
		<div class="font-sans text-xl">Privacy Policy</div>
		<div class="font-sans text-xl">
			<ul>
				<li><a href="#section5">Link #5</a></li>
				<li><a href="#section4">Link #4</a></li>
				<li><a href="#section3">Link #3</a></li>
				<li><a href="#section2">Link #2</a></li>
				<li><a href="#section1">Link #1</a></li>
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
	}

	/* #section5 {
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
	} */
</style>
