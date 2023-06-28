<script lang="ts">
	import Modal from '$lib/components/global/modal/Modal.svelte';

	let popup = false;
	let modal: Modal;

	const close = () => {
		if (modal) modal.close();
	};
</script>

<Modal bind:this={modal} bind:active={popup} on:close>
	<div
		class="fixed inset-x-0 bottom-0 md:relative w-full md:w-9/12 dark:bg-[#101010] md:border border-[#616161] bg-[#f3f4f8] shadow rounded-lg px-10 pt-5 pb-4 flex flex-col justify-between"
	>
		<div class="flex flex-col items-center">
			<p
				class="text-lg md:text-2xl font-bold md:leading-6 mt-6 text-gray-800 text-center dark:text-gray-100"
			>
				Welcome to erc.trade
			</p>
			<div class="flex items-start justify-center gap-2 flex-col mt-4">
				<p class="text-sm leading-5 text-gray-600 dark:text-gray-300">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat debitis hic
					exercitationem totam quam voluptas minus veritatis necessitatibus corrupti libero nostrum
					voluptatum tenetur asperiores dignissimos in, cupiditate fugiat. Sequi, id.
				</p>
				<button
					on:click={close}
					class="bg-primary text-dark py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
				>
					Connect
				</button>
			</div>
		</div>
	</div>
</Modal>

{#if !popup}
	<button on:click={() => (popup = true)}>Connect</button>
{/if}
