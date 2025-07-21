<script lang="ts">
	import {
		Calendar1,
		TriangleAlert,
		DollarSign,
		Wrench,
		Camera,
		Brain,
		TrendingUp,
		Users,
		Shield,
		Building
	} from '@lucide/svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import Projects from '$lib/features/home/projects/Projects.svelte';
	import Safety from '$lib/features/home/safety/Safety.svelte';
	import Quality from '$lib/features/home/quality/Quality.svelte';
	import {
		projects,
		projectAnalytics,
		predictProjectDelay,
		calculateBudgetOptimization
	} from '$lib/stores/projects';
	import { safetyAlerts, safetyAnalytics } from '$lib/stores/safety';
	import { qualityAnalytics } from '$lib/stores/quality';

	// Types (SafetyAlert and QualityIssue interfaces are now in their respective stores)
	interface Equipment {
		id: string;
		name: string;
		status: 'operational' | 'maintenance' | 'down';
		health: number;
		lastMaintenance: string;
		nextMaintenance: string;
		efficiency: number;
	}

	// State using Svelte runes
	let activeTab = $state<string>('dashboard');
	let equipment = $state<Equipment[]>([]);

	// Mock data generators (Safety and Quality generators are now in their respective stores)
	const generateMockEquipment = (): Equipment[] => [
		{
			id: 'EQ001',
			name: 'Tower Crane TC-1',
			status: 'operational',
			health: 87,
			lastMaintenance: '2025-06-15',
			nextMaintenance: '2025-07-15',
			efficiency: 92
		},
		{
			id: 'EQ002',
			name: 'Excavator CAT-320',
			status: 'maintenance',
			health: 65,
			lastMaintenance: '2025-06-20',
			nextMaintenance: '2025-06-28',
			efficiency: 78
		},
		{
			id: 'EQ003',
			name: 'Concrete Mixer CM-500',
			status: 'operational',
			health: 94,
			lastMaintenance: '2025-06-10',
			nextMaintenance: '2025-07-10',
			efficiency: 96
		}
	];

	// AI Simulation Functions
	const predictMaintenanceNeeds = (eq: Equipment): string => {
		if (eq.health < 70) return 'Immediate maintenance required';
		if (eq.health < 85) return 'Schedule maintenance within 1 week';
		return 'Equipment running optimally';
	};

	// Derived state using Svelte runes
	const aiAnalytics = $derived(() => {
		const equipmentEfficiency =
			equipment.reduce((sum, e) => sum + e.efficiency, 0) / equipment.length || 0;

		return {
			...($projectAnalytics || {
				totalBudget: 0,
				totalSpent: 0,
				avgProgress: 0,
				budgetVariance: 0
			}),
			criticalAlerts: $safetyAnalytics.criticalAlerts,
			equipmentEfficiency
		};
	});

	const navigationTabs = [
		{ id: 'dashboard', label: 'Dashboard', icon: Building },
		{ id: 'projects', label: 'Project Management', icon: Calendar1 },
		{ id: 'safety', label: 'Safety Monitoring', icon: Shield },
		{ id: 'quality', label: 'Quality Control', icon: Camera },
		{ id: 'equipment', label: 'Equipment', icon: Wrench },
		{ id: 'analytics', label: 'AI Analytics', icon: Brain }
	];

	// Initialize data (Safety and Quality data are now handled by their respective stores)
	$effect(() => {
		equipment = generateMockEquipment();
	});

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
						value="${(aiAnalytics().totalBudget / 1_000_000).toFixed(1)}M"
						trend={2.5}
					>
						<DollarSign class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Avg Progress"
						value="{aiAnalytics().avgProgress.toFixed(0)}%"
						trend={aiAnalytics().avgProgress > 60 ? 5.2 : -2.1}
					>
						<TrendingUp class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Critical Alerts"
						value={aiAnalytics().criticalAlerts}
						className={aiAnalytics().criticalAlerts > 0 ? 'border-red-200 bg-red-50' : ''}
					>
						<TrendingUp class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Equipment Efficiency"
						value="{aiAnalytics().equipmentEfficiency.toFixed(0)}%"
						trend={aiAnalytics().equipmentEfficiency > 85 ? 3.1 : -1.5}
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
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Equipment Fleet Management</h2>
					<div class="text-sm text-gray-600">Predictive maintenance enabled</div>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
					<MetricCard title="Total Equipment" value={equipment.length}>
						<TriangleAlert class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Operational"
						value={equipment.filter((e) => e.status === 'operational').length}
						className="border-green-200"
					>
						<Wrench class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="In Maintenance"
						value={equipment.filter((e) => e.status === 'maintenance').length}
						className="border-yellow-200"
					>
						<Shield class="h-6 w-6" />
					</MetricCard>
					<MetricCard
						title="Avg Efficiency"
						value="{aiAnalytics().equipmentEfficiency.toFixed(0)}%"
						trend={2.8}
					>
						<TrendingUp class="h-6 w-6" />
					</MetricCard>
				</div>

				<div class="grid gap-6">
					{#each equipment as eq}
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
		{:else if activeTab === 'analytics'}
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
									>{aiAnalytics().equipmentEfficiency.toFixed(1)}%</span
								>
							</div>
							<ProgressBar progress={aiAnalytics().equipmentEfficiency} />

							<div class="flex items-center justify-between">
								<span class="text-gray-600">Budget Utilization</span>
								<span class="text-2xl font-bold"
									>{((aiAnalytics().totalSpent / aiAnalytics().totalBudget) * 100).toFixed(
										1
									)}%</span
								>
							</div>
							<ProgressBar
								progress={(aiAnalytics().totalSpent / aiAnalytics().totalBudget) * 100}
							/>

							<div class="flex items-center justify-between">
								<span class="text-gray-600">Overall Progress</span>
								<span class="text-2xl font-bold">{aiAnalytics().avgProgress.toFixed(1)}%</span>
							</div>
							<ProgressBar progress={aiAnalytics().avgProgress} />
						</div>
					</div>

					<!-- Predictive Maintenance Schedule -->
					<div class="rounded-lg bg-white p-6 shadow-md">
						<h3 class="mb-4 flex items-center text-lg font-semibold">
							<Wrench class="mr-2 h-5 w-5 text-orange-600" />
							Predictive Maintenance Schedule
						</h3>
						<div class="space-y-3">
							{#each equipment as eq}
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
										{$safetyAnalytics.criticalAlerts}
									</div>
									<div class="text-sm text-red-800">Critical Alerts</div>
								</div>
								<div class="rounded-lg bg-yellow-50 p-4 text-center">
									<div class="text-2xl font-bold text-yellow-600">
										{$safetyAnalytics.highAlerts}
									</div>
									<div class="text-sm text-yellow-800">High Priority</div>
								</div>
							</div>
							<div class="text-sm text-gray-600">
								<div class="mb-1 flex justify-between">
									<span>Safety Score</span>
									<span class="font-medium">{$safetyAnalytics.safetyScore}%</span>
								</div>
								<ProgressBar progress={$safetyAnalytics.safetyScore} />
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
										{$qualityAnalytics.criticalIssues}
									</div>
									<div class="text-sm text-purple-800">Critical Issues</div>
								</div>
								<div class="rounded-lg bg-green-50 p-4 text-center">
									<div class="text-2xl font-bold text-green-600">
										{$qualityAnalytics.qualityScore.toFixed(0)}%
									</div>
									<div class="text-sm text-green-800">Quality Score</div>
								</div>
							</div>
							<div class="text-sm text-gray-600">
								<div class="mb-1 flex justify-between">
									<span>Compliance Score</span>
									<span class="font-medium">{$qualityAnalytics.complianceScore.toFixed(0)}%</span>
								</div>
								<ProgressBar progress={$qualityAnalytics.complianceScore} />
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
						<div class="rounded-lg bg-white p-4">
							<h4 class="mb-2 font-medium text-blue-900">💡 Schedule Optimization</h4>
							<p class="text-sm text-gray-700">
								Consider reallocating resources from Highway Bridge Extension to Residential Tower A
								to reduce delay risk by 15%.
							</p>
						</div>
						<div class="rounded-lg bg-white p-4">
							<h4 class="mb-2 font-medium text-green-900">💰 Cost Savings</h4>
							<p class="text-sm text-gray-700">
								Implement predictive maintenance on Excavator CAT-320 to avoid potential $45K in
								downtime costs.
							</p>
						</div>
						<div class="rounded-lg bg-white p-4">
							<h4 class="mb-2 font-medium text-red-900">⚠️ Safety Priority</h4>
							<p class="text-sm text-gray-700">
								Address critical scaffolding issue immediately. Predicted incident probability: 78%
								within 24 hours.
							</p>
						</div>
						<div class="rounded-lg bg-white p-4">
							<h4 class="mb-2 font-medium text-purple-900">🔍 Quality Focus</h4>
							<p class="text-sm text-gray-700">
								Review structural issues in Column C-12. AI confidence: {$qualityAnalytics.avgConfidence.toFixed(
									0
								)}%. Immediate inspection recommended.
							</p>
						</div>
						<div class="rounded-lg bg-white p-4">
							<h4 class="mb-2 font-medium text-orange-900">🔧 Equipment Alert</h4>
							<p class="text-sm text-gray-700">
								Equipment efficiency at {aiAnalytics().equipmentEfficiency.toFixed(0)}%. Schedule
								maintenance for optimal performance.
							</p>
						</div>
						<div class="rounded-lg bg-white p-4">
							<h4 class="mb-2 font-medium text-indigo-900">📊 Performance Insight</h4>
							<p class="text-sm text-gray-700">
								Overall project progress: {aiAnalytics().avgProgress.toFixed(0)}%. Quality
								compliance at {$qualityAnalytics.complianceScore.toFixed(0)}%.
							</p>
						</div>
					</div>
				</div>
			</div>
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
