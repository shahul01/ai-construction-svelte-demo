<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { TriangleAlert, Shield, Brain, FileText } from '@lucide/svelte';
	import { qualityIssues, qualityAnalytics, reviewQualityIssue } from '$lib/stores/quality';
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">AI Quality Control</h2>
		<div class="text-sm text-gray-600">Computer vision analysis active</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
		<MetricCard title="Issues Detected" value={$qualityAnalytics.totalIssues}>
			<TriangleAlert class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Critical Issues"
			value={$qualityAnalytics.criticalIssues}
			className="border-red-200"
		>
			<Shield class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Avg Confidence"
			value="{$qualityAnalytics.avgConfidence.toFixed(0)}%"
		>
			<Brain class="h-6 w-6" />
		</MetricCard>
		<MetricCard
			title="Fixed Issues"
			value={$qualityAnalytics.fixedIssues}
		>
			<FileText class="h-6 w-6" />
		</MetricCard>
	</div>

	<div class="rounded-lg bg-white shadow-md">
		<div class="border-b p-6">
			<h3 class="text-lg font-semibold">Quality Issues</h3>
		</div>
		<div class="divide-y">
			{#each $qualityIssues as issue}
				<div class="p-6">
					<div class="mb-3 flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-2 flex items-center space-x-3">
								<StatusBadge status={issue.severity} variant="quality" />
								<span class="text-sm font-medium text-gray-900"
									>{issue.type.toUpperCase()}</span
								>
								<span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
									>{issue.confidence}% confidence</span
								>
							</div>
							<h4 class="mb-1 font-medium text-gray-900">{issue.type} issue detected</h4>
							<div class="text-sm text-gray-600">
								<div>📍 {issue.location}</div>
								<div>🕒 {new Date(issue.detected).toLocaleString()}</div>
							</div>
						</div>
						<div class="flex flex-col space-y-2">
							<StatusBadge status={issue.status} />
							{#if issue.status === 'open'}
								<button
									onclick={() => reviewQualityIssue(issue.id)}
									class="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
								>
									Review
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- AI Quality Insights -->
	<div class="rounded-lg bg-green-50 p-6 shadow-md">
		<h3 class="mb-4 flex items-center text-lg font-semibold">
			<Brain class="mr-2 h-5 w-5 text-green-600" />
			🤖 AI Quality Insights
		</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-white p-4">
				<div class="text-sm text-gray-600">Quality Score</div>
				<div class="text-2xl font-bold {$qualityAnalytics.qualityScore > 80 ? 'text-green-600' : $qualityAnalytics.qualityScore > 60 ? 'text-yellow-600' : 'text-red-600'}">
					{$qualityAnalytics.qualityScore.toFixed(0)}%
				</div>
			</div>
			<div class="rounded-lg bg-white p-4">
				<div class="text-sm text-gray-600">Compliance Score</div>
				<div class="text-2xl font-bold {$qualityAnalytics.complianceScore > 90 ? 'text-green-600' : $qualityAnalytics.complianceScore > 70 ? 'text-yellow-600' : 'text-red-600'}">
					{$qualityAnalytics.complianceScore.toFixed(0)}%
				</div>
			</div>
			<div class="rounded-lg bg-white p-4">
				<div class="text-sm text-gray-600">Quality Risk</div>
				<div class="text-2xl font-bold {$qualityAnalytics.qualityRisk < 20 ? 'text-green-600' : $qualityAnalytics.qualityRisk < 50 ? 'text-yellow-600' : 'text-red-600'}">
					{$qualityAnalytics.qualityRisk.toFixed(0)}%
				</div>
			</div>
		</div>
	</div>
</div>