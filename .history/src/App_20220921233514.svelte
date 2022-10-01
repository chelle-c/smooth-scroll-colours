<script>
	import '/images/';
</script>

<main
	class="min-w-full min-h-screen flex flex-col scrollsnap-container scroll-smooth"
>
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

	<section
		class="flex min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		id="section5"
	>
		<div class="flex flex-col justify-center items-center drop-shadow-2xl">
			<img
				class="w-96 rounded-lg mix-blend-luminosity"
				src="/images/image-turquoise.jpg"
				alt="White building against turquoise sky"
			/>
			<h3 class="font-sans font-bold text-2xl p-6">Image #5</h3>
		</div>
	</section>

	<section
		class="flex min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		id="section4"
	>
		<div class="flex flex-col justify-center items-center drop-shadow-2xl">
			<img
				class="w-96 rounded-lg"
				src="/images/image-orange.jpg"
				alt="White building against turquoise sky"
			/>
			<h3 class="font-sans font-bold text-2xl p-6">Image #4</h3>
		</div>
	</section>

	<section
		class="flex min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		id="section3"
	>
		<div class="flex flex-col justify-center items-center drop-shadow-2xl">
			<img
				class="w-96 rounded-lg"
				src="/images/image-yellow.jpg"
				alt="White building against turquoise sky"
			/>
			<h3 class="font-sans font-bold text-2xl p-6">Image #3</h3>
		</div>
	</section>

	<section
		class="flex min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		id="section2"
	>
		<div class="flex flex-col justify-center items-center drop-shadow-2xl">
			<img
				class="w-96 rounded-lg"
				src="/images/image-blue.jpg"
				alt="White building against turquoise sky"
			/>
			<h3 class="font-sans font-bold text-2xl p-6">Image #2</h3>
		</div>
	</section>

	<section
		class="flex min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		id="section1"
	>
		<div class="flex flex-col justify-center items-center drop-shadow-2xl">
			<img
				class="w-96 rounded-lg"
				src="/images/image-red.jpg"
				alt="White building against turquoise sky"
			/>
			<h3 class="font-sans font-bold text-2xl p-6">Image #1</h3>
		</div>
	</section>
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
