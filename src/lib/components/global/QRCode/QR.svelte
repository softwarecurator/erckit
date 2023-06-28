<script lang="ts">
	import QRCode from './qrcode.svelte';

	export let value: string;
	export let image: any;
</script>

<div class="qrcode-container">
	<div class="qrcode-content">
		{#if value}
			<div>
				<QRCode uri={value} {image} size={288} ecl="M" />
			</div>
		{/if}
	</div>
</div>

<style>
	.qrcode-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.qrcode-content {
		position: relative;
		width: 288px;
		height: 288px;
		border-radius: 10px;
		background: #000;
	}
</style>
