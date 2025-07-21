<script lang="ts">
	import {
		Calendar1,
		TriangleAlert,
		DollarSign,
		Wrench,
		TrendingUp
	} from '@lucide/svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { dashboardMetrics } from '$lib/stores/dashboard';
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<MetricCard
			title="Total Budget"
			value="${($dashboardMetrics.totalBudget / 1_000_000).toFixed(1)}M"
			trend={$dashboardMetrics.budgetTrend}
		>
			<DollarSign class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Avg Progress"
			value="{$dashboardMetrics.avgProgress.toFixed(0)}%"
			trend={$dashboardMetrics.progressTrend}
		>
			<TrendingUp class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Critical Alerts"
			value={$dashboardMetrics.criticalAlerts}
			className={$dashboardMetrics.criticalAlerts > 0 ? 'border-red-200 bg-red-50' : ''}
			trend={$dashboardMetrics.alertsTrend}
		>
			<TriangleAlert class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Equipment Efficiency"
			value="{$dashboardMetrics.equipmentEfficiency.toFixed(0)}%"
			trend={$dashboardMetrics.efficiencyTrend}
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
				{#each $dashboardMetrics.activeProjects as project}
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
				{#each $dashboardMetrics.recentSafetyAlerts as alert}
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