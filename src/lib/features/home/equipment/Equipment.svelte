<script lang="ts">
	import { TriangleAlert, Wrench, Shield, TrendingUp } from '@lucide/svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { equipment, equipmentAnalytics, predictMaintenanceNeeds } from '$lib/stores/equipment';
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Equipment Fleet Management</h2>
		<div class="text-sm text-gray-600">Predictive maintenance enabled</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
		<MetricCard title="Total Equipment" value={$equipmentAnalytics.totalEquipment}>
			<TriangleAlert class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Operational"
			value={$equipmentAnalytics.operational}
			className="border-green-200"
		>
			<Wrench class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="In Maintenance"
			value={$equipmentAnalytics.inMaintenance}
			className="border-yellow-200"
		>
			<Shield class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Avg Efficiency"
			value="{$equipmentAnalytics.avgEfficiency.toFixed(0)}%"
			trend={2.8}
		>
			<TrendingUp class="h-6 w-6" />
		</MetricCard>
	</div>

	<div class="grid gap-6">
		{#each $equipment as eq}
			{@const prediction = predictMaintenanceNeeds(eq)}
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="mb-4 flex items-start justify-between">
					<div>
						<h3 class="text-xl font-semibold">{eq.name}</h3>
						<p class="text-gray-600">ID: {eq.id}</p>
					</div>
					<StatusBadge status={eq.status} variant="equipment" />
				</div>

				<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<div class="mb-1 flex justify-between text-sm text-gray-600">
							<span>Health Score</span>
							<span>{eq.health}%</span>
						</div>
						<ProgressBar progress={eq.health} />
					</div>
					<div>
						<div class="mb-1 flex justify-between text-sm text-gray-600">
							<span>Efficiency</span>
							<span>{eq.efficiency}%</span>
						</div>
						<ProgressBar progress={eq.efficiency} />
					</div>
					<div class="text-sm">
						<div class="mb-1 text-gray-600">Next Maintenance</div>
						<div class="font-medium">{new Date(eq.nextMaintenance).toLocaleDateString()}</div>
					</div>
				</div>

				<div class="rounded-lg bg-purple-50 p-4">
					<h4 class="mb-2 font-medium text-purple-900">🤖 AI Maintenance Prediction</h4>
					<p class="text-sm text-purple-800">{prediction}</p>
					<div class="mt-2 text-xs text-purple-700">
						Last maintenance: {new Date(eq.lastMaintenance).toLocaleDateString()}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
