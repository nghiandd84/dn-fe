<script lang="ts">
	import type { EventData } from '$lib/types';

	let { data } = $props();
	const events = $derived(data.events as EventData[]);

	function formatDate(iso: string | null): string {
		if (!iso) return 'Date TBA';
		const d = new Date(iso);
		if (isNaN(d.getTime())) return 'Date TBA';
		return d.toLocaleString(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}
</script>

<svelte:head>
	<title>Browse events — Event Booking</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Upcoming events</h1>

	{#if !data.ok}
		<div class="alert alert-error" role="alert">Could not load events. Please try again later.</div>
	{:else if events.length === 0}
		<p class="muted">No events are available right now. Check back soon.</p>
	{:else}
		<ul class="event-grid" data-testid="event-list">
			{#each events as event (event.id)}
				<li>
					<a class="card event-card" href={`/events/${event.id}`} data-testid="event-card">
						<span class="event-name">{event.event_name ?? 'Untitled event'}</span>
						<span class="event-meta">📅 {formatDate(event.event_date)}</span>
						{#if event.venue_name}
							<span class="event-meta">📍 {event.venue_name}</span>
						{/if}
						{#if event.status}
							<span class={`status-badge status-${event.status.toUpperCase()}`}>{event.status}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.event-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.25rem;
	}
	.event-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		color: var(--text);
		height: 100%;
	}
	.event-card:hover {
		text-decoration: none;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
	}
	.event-name {
		font-size: 1.1rem;
		font-weight: 600;
	}
	.event-meta {
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.status-badge {
		align-self: flex-start;
	}
</style>
