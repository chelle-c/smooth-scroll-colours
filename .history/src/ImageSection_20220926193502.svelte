<script>
	import { fade } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	let isInView;
	export let id = 0
	export let image = '';
	export let alt = '';
</script>

<section
	id="section{id}"
	use:inview={{ unobserveOnEnter: true, rootMargin: '-20%' }}
	on:change={({ detail }) => {
		isInView = detail.inView;
	}}
>
	{#if isInView}
		<div
			class="flex flex-col justify-center items-center min-w-full min-h-screen justify-center items-center transition-colors snap-always snap-center"
		>
			<div in:fade class="drop-shadow-2xl">
				<img
					class="w-96 rounded-lg"
					src="/images/image-{image}.jpg"
					alt={alt}
				/>
			</div>
			<h3 class="font-sans font-bold text-2xl p-6">
				Image #{id}
			</h3>
		</div>
	{/if}
</section>
