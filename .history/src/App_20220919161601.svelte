<script>
</script>

<main class="min-w-full min-h-screen fixed flex flex-col justify-between p-6">
	<div class="flex flex-row justify-between items-baseline">
		<div><h1 class='font-sans font-bold text-5xl uppercase'>Scroll & Colours</h1></div>
		<div class='font-sans font-bold text-xl'>Contact info</div>
	</div>
	<div class="flex flex-row justify-between items-end">
		<div class='font-sans text-xl'>Privacy Policy</div>
		<div class='font-sans text-xl'>
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

<section id='section5'>
	<div><img src='images/image-turquoise.jpg' alt='White building against turqoise sky'/></div>

</section>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	:global(body) {
		padding: 0;
	}

	#section5 {
		background: #00c1b5
	}
</style>
