<script lang="ts">
	import { portal, Navigators } from '$lib/utils';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let active = true;
	export const close = () => (active = false);
	let t: typeof slide | typeof fade;

	if (Navigators.isMobile()) {
		t = slide;
	} else {
		t = fade;
	}

	let transitionProps: any = Navigators.isMobile()
		? { duration: 200, easing: quintOut, axis: 'y' }
		: { duration: 200 };
</script>

{#if active}
	<modal use:portal>
		<button
			transition:fade={{ duration: 200 }}
			on:keyup
			class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 bg-black/60 cursor-default backdrop-blur-md transition-all ease-in-out delay-150"
			on:click={close}
		/>
		<div
			transition:t={transitionProps}
			class="z-[51] flex items-center justify-center mx-auto top-50 max-w-2xl w-full max-h-max fixed top-[40%] right-0 left-0 bottom-0"
		>
			<slot />
		</div>
	</modal>
{/if}
