<script lang="ts">
	let { data } = $props();
</script>

{#if data.error}
	<p>Authentication failed: {data.error}</p>
{/if}
