<script lang="ts">
	import {
		TrendingUp,
		Users,
		Wrench,
		Shield,
		Camera,
		Brain
	} from '@lucide/svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { projects, predictProjectDelay, calculateBudgetOptimization } from '$lib/stores/projects';
	import { safetyAnalytics } from '$lib/stores/safety';
	import { qualityAnalytics } from '$lib/stores/quality';
	import { equipment, predictMaintenanceNeeds } from '$lib/stores/equipment';
	import { aiAnalytics, aiRecommendations } from '$lib/stores/analytics';
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">AI Analytics Dashboard</h2>
		<div class="text-sm text-gray-600">Advanced predictive modeling active</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Project Performance Analysis -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<TrendingUp class="mr-2 h-5 w-5 text-green-600" />
				Project Performance Insights
			</h3>
			<div class="space-y-4">
				{#each $projects as project}
					{@const delayRisk = predictProjectDelay(project)}
					{@const budgetOptimization = calculateBudgetOptimization(project)}
					<div class="rounded-lg border p-4">
						<div class="mb-2 flex items-center justify-between">
							<h4 class="font-medium">{project.name}</h4>
							<div
								class="rounded px-2 py-1 text-sm {delayRisk > 30
									? 'bg-red-100 text-red-800'
									: delayRisk > 15
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-green-100 text-green-800'}"
							>
								{delayRisk}% delay risk
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="text-gray-600">Completion Prediction:</span>
								<div class="font-medium">
									{new Date(
										new Date(project.endDate).getTime() +
											(delayRisk > 20 ? 30 * 24 * 60 * 60 * 1000 : 0)
									).toLocaleDateString()}
								</div>
							</div>
							<div>
								<span class="text-gray-600">Budget Optimization:</span>
								<div
									class="font-medium {budgetOptimization >= 0
										? 'text-green-600'
										: 'text-red-600'}"
								>
									{budgetOptimization >= 0 ? '+' : ''}${(budgetOptimization / 1000).toFixed(
										0
									)}K
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Resource Utilization -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<Users class="mr-2 h-5 w-5 text-blue-600" />
				Resource Utilization Analysis
			</h3>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-gray-600">Equipment Efficiency</span>
					<span class="text-2xl font-bold"
						>{$aiAnalytics.equipmentEfficiency.toFixed(1)}%</span
					>
				</div>
				<ProgressBar progress={$aiAnalytics.equipmentEfficiency} />

				<div class="flex items-center justify-between">
					<span class="text-gray-600">Budget Utilization</span>
					<span class="text-2xl font-bold"
						>{(($aiAnalytics.totalSpent / $aiAnalytics.totalBudget) * 100).toFixed(
							1
						)}%</span
					>
				</div>
				<ProgressBar
					progress={($aiAnalytics.totalSpent / $aiAnalytics.totalBudget) * 100}
				/>

				<div class="flex items-center justify-between">
					<span class="text-gray-600">Overall Progress</span>
					<span class="text-2xl font-bold">{$aiAnalytics.avgProgress.toFixed(1)}%</span>
				</div>
				<ProgressBar progress={$aiAnalytics.avgProgress} />
			</div>
		</div>

		<!-- Predictive Maintenance Schedule -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<Wrench class="mr-2 h-5 w-5 text-orange-600" />
				Predictive Maintenance Schedule
			</h3>
			<div class="space-y-3">
				{#each $equipment as eq}
					<div class="flex items-center justify-between rounded-lg border p-3">
						<div>
							<div class="font-medium">{eq.name}</div>
							<div class="text-sm text-gray-600">{predictMaintenanceNeeds(eq)}</div>
						</div>
						<div class="text-right">
							<div class="text-sm text-gray-600">Health</div>
							<div
								class="font-bold {eq.health > 85
									? 'text-green-600'
									: eq.health > 70
										? 'text-yellow-600'
										: 'text-red-600'}"
							>
								{eq.health}%
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Safety Risk Assessment -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<Shield class="mr-2 h-5 w-5 text-red-600" />
				Safety Risk Assessment
			</h3>
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-lg bg-red-50 p-4 text-center">
						<div class="text-2xl font-bold text-red-600">
							{$aiAnalytics.criticalAlerts}
						</div>
						<div class="text-sm text-red-800">Critical Alerts</div>
					</div>
					<div class="rounded-lg bg-yellow-50 p-4 text-center">
						<div class="text-2xl font-bold text-yellow-600">
							{$aiAnalytics.highAlerts}
						</div>
						<div class="text-sm text-yellow-800">High Priority</div>
					</div>
				</div>
				<div class="text-sm text-gray-600">
					<div class="mb-1 flex justify-between">
						<span>Safety Score</span>
						<span class="font-medium">{$aiAnalytics.safetyScore}%</span>
					</div>
					<ProgressBar progress={$aiAnalytics.safetyScore} />
				</div>
			</div>
		</div>

		<!-- Quality Control Metrics -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<Camera class="mr-2 h-5 w-5 text-purple-600" />
				Quality Control Metrics
			</h3>
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-lg bg-purple-50 p-4 text-center">
						<div class="text-2xl font-bold text-purple-600">
							{$aiAnalytics.criticalIssues}
						</div>
						<div class="text-sm text-purple-800">Critical Issues</div>
					</div>
					<div class="rounded-lg bg-green-50 p-4 text-center">
						<div class="text-2xl font-bold text-green-600">
							{$aiAnalytics.qualityScore.toFixed(0)}%
						</div>
						<div class="text-sm text-green-800">Quality Score</div>
					</div>
				</div>
				<div class="text-sm text-gray-600">
					<div class="mb-1 flex justify-between">
						<span>Compliance Score</span>
						<span class="font-medium">{$aiAnalytics.complianceScore.toFixed(0)}%</span>
					</div>
					<ProgressBar progress={$aiAnalytics.complianceScore} />
				</div>
			</div>
		</div>
	</div>

	<!-- AI Recommendations -->
	<div class="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-md">
		<h3 class="mb-4 flex items-center text-lg font-semibold">
			<Brain class="mr-2 h-5 w-5 text-purple-600" />
			AI Recommendations
		</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each $aiRecommendations as recommendation}
				<div class="rounded-lg bg-white p-4">
					<h4 class="mb-2 font-medium {recommendation.category === 'schedule'
						? 'text-blue-900'
						: recommendation.category === 'cost'
							? 'text-green-900'
							: recommendation.category === 'safety'
								? 'text-red-900'
								: recommendation.category === 'quality'
									? 'text-purple-900'
									: recommendation.category === 'equipment'
										? 'text-orange-900'
										: 'text-indigo-900'}"
					>
						{recommendation.title}
					</h4>
					<p class="text-sm text-gray-700">
						{recommendation.description}
					</p>
					{#if recommendation.impact}
						<div class="mt-2 text-xs text-gray-600">
							Impact: {recommendation.impact}
						</div>
					{/if}
					{#if recommendation.confidence}
						<div class="mt-1 text-xs text-gray-500">
							Confidence: {recommendation.confidence}%
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>