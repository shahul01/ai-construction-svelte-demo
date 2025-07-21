<script lang="ts">
	import {
		Calendar1,
		Wrench,
		Camera,
		Brain,
		Shield,
		Building
	} from '@lucide/svelte';
	import Projects from '$lib/features/home/projects/Projects.svelte';
	import Safety from '$lib/features/home/safety/Safety.svelte';
	import Quality from '$lib/features/home/quality/Quality.svelte';
	import Equipment from '$lib/features/home/equipment/Equipment.svelte';
	import AIAnalytics from '$lib/features/home/analytics/AIAnalytics.svelte';
	import Dashboard from '$lib/features/home/dashboard/Dashboard.svelte';

	// State using Svelte runes
	let activeTab = $state<string>('dashboard');

	const navigationTabs = [
		{ id: 'dashboard', label: 'Dashboard', icon: Building },
		{ id: 'projects', label: 'Project Management', icon: Calendar1 },
		{ id: 'safety', label: 'Safety Monitoring', icon: Shield },
		{ id: 'quality', label: 'Quality Control', icon: Camera },
		{ id: 'equipment', label: 'Equipment', icon: Wrench },
		{ id: 'analytics', label: 'AI Analytics', icon: Brain }
	];

	const currentDate = new Date();
</script>

<svelte:head>
	<title>AI Construction Manager</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-4">
				<div class="flex items-center">
					<Building class="mr-3 h-8 w-8 text-blue-600" />
					<h1 class="text-2xl font-bold text-gray-900">AI Construction Manager</h1>
				</div>
				<div class="flex items-center space-x-4">
					<div class="flex items-center text-sm text-gray-600">
						<div class="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
						AI Systems Active
					</div>
					<div class="text-sm text-gray-600">
						{currentDate.toLocaleDateString()} | {currentDate.toLocaleTimeString()}
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Navigation -->
	<nav class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="scrollbar-hide flex overflow-x-auto sm:space-x-8">
				{#each navigationTabs as tab}
					<button
						onclick={() => (activeTab = tab.id)}
						class="flex cursor-pointer items-center border-b-2 px-2 py-4 text-xs font-medium whitespace-nowrap transition-colors sm:px-3 sm:text-sm {activeTab ===
						tab.id
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					>
						<tab.icon class="h-4 w-4 flex-shrink-0" />
						<span class="ml-1 sm:ml-2">{tab.label}</span>
					</button>
				{/each}
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if activeTab === 'dashboard'}
			<Dashboard />
		{:else if activeTab === 'projects'}
			<Projects />
		{:else if activeTab === 'safety'}
			<Safety />
		{:else if activeTab === 'quality'}
			<Quality />
		{:else if activeTab === 'equipment'}
			<Equipment />
		{:else if activeTab === 'analytics'}
			<AIAnalytics />
		{/if}
	</main>

	<!-- Footer -->
	<footer class="mt-12 border-t bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="text-sm text-gray-600">
					© 2025 AI Construction Manager. Powered by advanced machine learning algorithms.
				</div>
				<div class="flex items-center space-x-4 text-sm text-gray-600">
					<span>🤖 AI Accuracy: 94.2%</span>
					<span>📊 Data Points: 12,847</span>
					<span>⚡ Response Time: 0.3s</span>
				</div>
			</div>
		</div>
	</footer>
</div>
