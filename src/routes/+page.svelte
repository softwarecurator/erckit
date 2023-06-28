<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultConfig, isErckitSetup, configuredConnectors } from '$lib/stores/erckit';
	import { PUBLIC_WALLETCONNECT_PROJECTID, PUBLIC_ALCHEMY_KEY } from '$env/static/public';
	import { connect } from '@wagmi/core';

	onMount(async () => {
		const erckit = defaultConfig({
			alchemyId: PUBLIC_ALCHEMY_KEY,
			walletConnectProjectId: PUBLIC_WALLETCONNECT_PROJECTID,
			appName: 'ERCKit'
		});
		await erckit.init();
	});
</script>

{#if $isErckitSetup}
	{#each $configuredConnectors as connector}
		<button on:click={async () => await connect({ connector })}>{connector.id}</button>
	{/each}
{:else}
	<p>ERCKit is loading...</p>
{/if}
