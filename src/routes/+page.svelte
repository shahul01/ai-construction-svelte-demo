<script lang="ts">
	import {
		Calendar1,
		TriangleAlert,
		DollarSign,
		Wrench,
		Camera,
		Brain,
		TrendingUp,
		Shield,
		Building
	} from '@lucide/svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import Projects from '$lib/features/home/projects/Projects.svelte';
	import Safety from '$lib/features/home/safety/Safety.svelte';
	import Quality from '$lib/features/home/quality/Quality.svelte';
	import Equipment from '$lib/features/home/equipment/Equipment.svelte';
	import AIAnalytics from '$lib/features/home/analytics/AIAnalytics.svelte';
	import {
		projects,
		projectAnalytics,
		predictProjectDelay,
		calculateBudgetOptimization
	} from '$lib/stores/projects';
	import { safetyAlerts, safetyAnalytics } from '$lib/stores/safety';
	import { qualityAnalytics } from '$lib/stores/quality';

	import { aiAnalytics } from '$lib/stores/analytics';


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
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<MetricCard
						title="Total Budget"
						value="${($aiAnalytics.totalBudget / 1_000_000).toFixed(1)}M"
						trend={2.5}
					>
						<DollarSign class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Avg Progress"
						value="{$aiAnalytics.avgProgress.toFixed(0)}%"
						trend={$aiAnalytics.avgProgress > 60 ? 5.2 : -2.1}
					>
						<TrendingUp class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Critical Alerts"
						value={$aiAnalytics.criticalAlerts}
						className={$aiAnalytics.criticalAlerts > 0 ? 'border-red-200 bg-red-50' : ''}
					>
						<TrendingUp class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Equipment Efficiency"
						value="{$aiAnalytics.equipmentEfficiency.toFixed(0)}%"
						trend={$aiAnalytics.equipmentEfficiency > 85 ? 3.1 : -1.5}
					>
						<Wrench class="h-6 w-6" />
					</MetricCard>
				</div>

				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<!-- Active Projects -->
					<div class="rounded-lg bg-white p-6 shadow-md">
						<h3 class="mb-4 flex items-center text-lg font-semibold">
							<Calendar1 class="mr-2 h-5 w-5 text-blue-600" />
							Active Projects
						</h3>
						<div class="space-y-4">
							{#each $projects.filter((p) => p.status === 'active' || p.status === 'delayed') as project}
								<div class="rounded-lg border p-4">
									<div class="mb-2 flex items-start justify-between">
										<h4 class="font-medium">{project.name}</h4>
										<StatusBadge status={project.status} />
									</div>
									<div class="space-y-2">
										<div class="flex justify-between text-sm text-gray-600">
											<span>Progress</span>
											<span>{project.progress}%</span>
										</div>
										<ProgressBar progress={project.progress} />
										<div class="flex justify-between text-sm">
											<span class="text-gray-600">Budget Usage</span>
											<span
												class="font-medium {project.spent / project.budget > 0.9
													? 'text-red-600'
													: 'text-green-600'}"
											>
												${(project.spent / 1_000_000).toFixed(1)}M / ${(
													project.budget / 1_000_000
												).toFixed(1)}M
											</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Recent Safety Alerts -->
					<div class="rounded-lg bg-white p-6 shadow-md">
						<h3 class="mb-4 flex items-center text-lg font-semibold">
							<TriangleAlert class="mr-2 h-5 w-5 text-red-600" />
							Recent Safety Alerts
						</h3>
						<div class="space-y-3">
							{#each $safetyAlerts.slice(0, 5) as alert}
								<div class="rounded-lg border p-3">
									<div class="mb-1 flex items-start justify-between">
										<span class="text-sm font-medium">{alert.description}</span>
										<StatusBadge status={alert.severity} variant="safety" />
									</div>
									<div class="text-xs text-gray-600">
										<div>{alert.location}</div>
										<div>{new Date(alert.timestamp).toLocaleString()}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
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
