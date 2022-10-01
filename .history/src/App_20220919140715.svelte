<script>
</script>

<main class="min-w-full min-h-screen fixed flex flex-col justify-between p-6">
	<div class="flex flex-row justify-between items-baseline">
		<div><h1 class='font-sans font-bold text-3xl uppercase'>Scrolling Behaviour</h1></div>
		<div>Contact info</div>
	</div>
	<div class="flex flex-row justify-between items-end">
		<div class='font-sans text-xl'>Privacy Policy</div>
		<div>
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
		padding: 0;
	}
</style>
