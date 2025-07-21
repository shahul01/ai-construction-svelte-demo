<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { projects, predictProjectDelay, calculateBudgetOptimization } from '$lib/stores/projects';
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">AI Project Management</h2>
		<div class="text-sm text-gray-600">Predictive analytics enabled</div>
	</div>

	<div class="grid gap-6">
		{#each $projects as project}
			{@const delayProbability = predictProjectDelay(project)}
			{@const budgetOptimization = calculateBudgetOptimization(project)}
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="mb-4 flex items-start justify-between">
					<div>
						<h3 class="text-xl font-semibold">{project.name}</h3>
						<p class="text-gray-600">
							{new Date(project.startDate).toLocaleDateString()} - {new Date(
								project.endDate
							).toLocaleDateString()}
						</p>
					</div>
					<div class="flex space-x-2">
						<StatusBadge status={project.status} />
						<StatusBadge status={project.riskLevel} variant="safety" />
					</div>
				</div>

				<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<div class="mb-1 flex justify-between text-sm text-gray-600">
							<span>Progress</span>
							<span>{project.progress}%</span>
						</div>
						<ProgressBar progress={project.progress} />
					</div>
					<div>
						<div class="mb-1 flex justify-between text-sm text-gray-600">
							<span>Budget Usage</span>
							<span>{((project.spent / project.budget) * 100).toFixed(1)}%</span>
						</div>
						<ProgressBar progress={(project.spent / project.budget) * 100} />
					</div>
					<div>
						<div class="mb-1 flex justify-between text-sm text-gray-600">
							<span>Delay Risk</span>
							<span>{delayProbability}%</span>
						</div>
						<ProgressBar progress={delayProbability} />
					</div>
				</div>

				<div class="rounded-lg bg-blue-50 p-4">
					<h4 class="mb-2 font-medium text-blue-900">🤖 AI Predictions</h4>
					<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
						<div>
							<span class="font-medium text-blue-800">Delay Probability:</span>
							<span class="ml-2 {delayProbability > 20 ? 'text-red-600' : 'text-green-600'}">
								{delayProbability}% chance of delay
							</span>
						</div>
						<div>
							<span class="font-medium text-blue-800">Budget Optimization:</span>
							<span class="ml-2 {budgetOptimization < 0 ? 'text-red-600' : 'text-green-600'}">
								{budgetOptimization >= 0 ? '+' : ''}${(budgetOptimization / 1000).toFixed(0)}K
								potential savings
							</span>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>