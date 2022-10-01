<script>
	import '/images/';
	export let screenHeight = window.innerHeight;
</script>

<!-- <main
	class="min-w-full min-h-screen fixed flex flex-col justify-between p-6 z-10"
>
	<div class="flex flex-row justify-between items-baseline">
		<div>
			<h1 class="font-sans font-bold text-5xl uppercase">
				Scroll & Colours
			</h1>
		</div>
		<div class="font-sans font-bold text-xl">Contact info</div>
	</div>
	<div class="flex flex-row justify-between items-end">
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
</main> -->
<div class="scrollsnap-container">
	<section id="section5">
		<div>
			<img
				class="w-96"
				src="/images/image-turquoise.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section id="section4">
		<div>
			<img
				class="w-96"
				src="/images/image-orange.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section id="section3">
		<div>
			<img
				class="w-96"
				src="/images/image-yellow.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section id="section2">
		<div>
			<img
				class="w-96"
				src="/images/image-blue.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>

	<section id="section1">
		<div>
			<img
				class="w-96"
				src="/images/image-red.jpg"
				alt="White building against turqoise sky"
			/>
		</div>
	</section>
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	:global(body) {
		margin: 0;
		padding: 0;
	}

	.scrollsnap-container {
		max-height: 100vh;
		overflow-y: scroll;
		scroll-snap-type: mandatory; /* for older browsers */
		scroll-snap-points-y: repeat(100vh); /* for older browsers */
		scroll-snap-type: y mandatory;
	}

	section {
		height: 100vh;
		scroll-snap-align: start;
		position: relative;
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
