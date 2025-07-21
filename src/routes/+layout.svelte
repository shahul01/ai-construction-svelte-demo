<script lang="ts">
	import '../app.css';
	import Header from '$lib/features/scaffolds/Header.svelte';
	import Navigation from '$lib/features/scaffolds/Navigation.svelte';
	import Footer from '$lib/features/scaffolds/Footer.svelte';
	import { activeTab, type Tab } from '$lib/stores/navigation';

	let { children } = $props();

	const handleTabChange = (tabId: Tab) => {
		activeTab.set(tabId);
	};
</script>

<svelte:head>
	<title>AI Construction Manager</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Header />
	<Navigation activeTab={$activeTab} onTabChange={handleTabChange} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>

	<Footer />
</div>
