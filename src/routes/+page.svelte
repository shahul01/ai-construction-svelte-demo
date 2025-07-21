<script lang="ts">
	import Projects from '$lib/features/home/projects/Projects.svelte';
	import Safety from '$lib/features/home/safety/Safety.svelte';
	import Quality from '$lib/features/home/quality/Quality.svelte';
	import Equipment from '$lib/features/home/equipment/Equipment.svelte';
	import AIAnalytics from '$lib/features/home/analytics/AIAnalytics.svelte';
	import Dashboard from '$lib/features/home/dashboard/Dashboard.svelte';
	import { activeTab } from '$lib/stores/navigation';
</script>

<main>
	{#if $activeTab === 'dashboard'}
		<Dashboard />
	{:else if $activeTab === 'projects'}
		<Projects />
	{:else if $activeTab === 'safety'}
		<Safety />
	{:else if $activeTab === 'quality'}
		<Quality />
	{:else if $activeTab === 'equipment'}
		<Equipment />
	{:else if $activeTab === 'analytics'}
		<AIAnalytics />
	{/if}
</main>
