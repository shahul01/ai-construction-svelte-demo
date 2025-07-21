<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { Shield, Clock } from '@lucide/svelte';
	import { safetyAlerts, safetyAnalytics, resolveAlert } from '$lib/stores/safety';
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">AI Safety Monitoring</h2>
		<div class="flex space-x-2">
			<span class="text-sm text-gray-600">Real-time monitoring active</span>
			<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
		</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
		<MetricCard title="Total Alerts" value={$safetyAnalytics.totalAlerts}>
			<Shield class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Critical"
			value={$safetyAnalytics.criticalAlerts}
			className="border-red-200"
		>
			<Shield class="h-6 w-6" />
		</MetricCard>
		<MetricCard title="Resolved Today" value={$safetyAnalytics.resolvedToday}>
			<Shield class="h-6 w-6" />
		</MetricCard>
		<MetricCard title="Response Time" value="{$safetyAnalytics.averageResponseTime} min" trend={-15.3}>
			<Clock class="h-6 w-6" />
		</MetricCard>
	</div>

	<div class="rounded-lg bg-white shadow-md">
		<div class="border-b p-6">
			<h3 class="text-lg font-semibold">Safety Alerts</h3>
		</div>
		<div class="divide-y">
			{#each $safetyAlerts as alert}
				<div class="p-6">
					<div class="mb-3 flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-2 flex items-center space-x-3">
								<StatusBadge status={alert.severity} variant="safety" />
								<span class="text-sm font-medium text-gray-900"
									>{alert.type.toUpperCase()}</span
								>
								{#if alert.resolved}
									<span class="rounded bg-green-100 px-2 py-1 text-xs text-green-800"
										>Resolved</span
									>
								{/if}
							</div>
							<h4 class="mb-1 font-medium text-gray-900">{alert.description}</h4>
							<div class="text-sm text-gray-600">
								<div>📍 {alert.location}</div>
								<div>🕒 {new Date(alert.timestamp).toLocaleString()}</div>
							</div>
						</div>
						{#if !alert.resolved}
							<button
								onclick={() => resolveAlert(alert.id)}
								class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
							>
								Mark Resolved
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>