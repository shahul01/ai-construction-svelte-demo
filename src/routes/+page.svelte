<script lang="ts">
	import {
		Calendar1,
		TriangleAlert,
		DollarSign,
		Wrench,
		FileText,
		Camera,
		Brain,
		TrendingUp,
		Users,
		Shield,
		Building,
		Clock
	} from '@lucide/svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';

	// Types
	interface Project {
		id: string;
		name: string;
		status: 'planning' | 'active' | 'delayed' | 'completed';
		progress: number;
		budget: number;
		spent: number;
		startDate: string;
		endDate: string;
		riskLevel: 'low' | 'medium' | 'high';
	}

	interface Equipment {
		id: string;
		name: string;
		status: 'operational' | 'maintenance' | 'down';
		health: number;
		lastMaintenance: string;
		nextMaintenance: string;
		efficiency: number;
	}

	interface SafetyAlert {
		id: string;
		type: 'ppe' | 'hazard' | 'equipment' | 'behavior';
		severity: 'low' | 'medium' | 'high' | 'critical';
		location: string;
		timestamp: string;
		description: string;
		resolved: boolean;
	}

	interface QualityIssue {
		id: string;
		type: 'structural' | 'material' | 'alignment' | 'surface';
		severity: 'minor' | 'major' | 'critical';
		location: string;
		detected: string;
		confidence: number;
		status: 'open' | 'reviewing' | 'fixed';
	}

	// State using Svelte runes
	let activeTab = $state<string>('dashboard');
	let projects = $state<Project[]>([]);
	let equipment = $state<Equipment[]>([]);
	let safetyAlerts = $state<SafetyAlert[]>([]);
	let qualityIssues = $state<QualityIssue[]>([]);

	// Mock data generators
	const generateMockProjects = (): Project[] => [
		{
			id: '1',
			name: 'Downtown Office Complex',
			status: 'active',
			progress: 67,
			budget: 12_500_000,
			spent: 8_375_000,
			startDate: '2024-01-15',
			endDate: '2025-08-30',
			riskLevel: 'medium'
		},
		{
			id: '2',
			name: 'Residential Tower A',
			status: 'delayed',
			progress: 45,
			budget: 8_200_000,
			spent: 4_100_000,
			startDate: '2024-03-01',
			endDate: '2025-12-15',
			riskLevel: 'high'
		},
		{
			id: '3',
			name: 'Highway Bridge Extension',
			status: 'active',
			progress: 89,
			budget: 5_600_000,
			spent: 4_984_000,
			startDate: '2023-09-01',
			endDate: '2025-03-15',
			riskLevel: 'low'
		}
	];

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

	const generateMockSafetyAlerts = (): SafetyAlert[] => [
		{
			id: 'SA001',
			type: 'ppe',
			severity: 'high',
			location: 'Floor 15, Zone A',
			timestamp: '2025-06-27T08:30:00Z',
			description: 'Worker without hard hat detected',
			resolved: false
		},
		{
			id: 'SA002',
			type: 'hazard',
			severity: 'critical',
			location: 'Ground Level, East Side',
			timestamp: '2025-06-27T10:15:00Z',
			description: 'Unstable scaffolding detected',
			resolved: false
		},
		{
			id: 'SA003',
			type: 'equipment',
			severity: 'medium',
			location: 'Crane Operation Zone',
			timestamp: '2025-06-27T07:45:00Z',
			description: 'Equipment operating outside safe parameters',
			resolved: true
		}
	];

	const generateMockQualityIssues = (): QualityIssue[] => [
		{
			id: 'QI001',
			type: 'structural',
			severity: 'major',
			location: 'Column C-12, Floor 8',
			detected: '2025-06-27T09:20:00Z',
			confidence: 94,
			status: 'open'
		},
		{
			id: 'QI002',
			type: 'alignment',
			severity: 'minor',
			location: 'Wall Section W-45',
			detected: '2025-06-27T11:30:00Z',
			confidence: 87,
			status: 'reviewing'
		},
		{
			id: 'QI003',
			type: 'material',
			severity: 'critical',
			location: 'Foundation Block F-8',
			detected: '2025-06-26T16:45:00Z',
			confidence: 98,
			status: 'fixed'
		}
	];

	// AI Simulation Functions
	const predictProjectDelay = (project: Project): number => {
		const factors = [
			project.riskLevel === 'high' ? 0.3 : project.riskLevel === 'medium' ? 0.15 : 0.05,
			project.progress < 50 ? 0.2 : 0.1,
			project.spent / project.budget > 0.8 ? 0.25 : 0.1
		];
		return Math.round(factors.reduce((a, b) => a + b, 0) * 100);
	};

	const calculateBudgetOptimization = (project: Project): number => {
		const efficiency = project.progress / (project.spent / project.budget);
		return Math.round((efficiency - 1) * project.budget);
	};

	const predictMaintenanceNeeds = (eq: Equipment): string => {
		if (eq.health < 70) return 'Immediate maintenance required';
		if (eq.health < 85) return 'Schedule maintenance within 1 week';
		return 'Equipment running optimally';
	};

	// Derived state using Svelte runes
	const aiAnalytics = $derived(() => {
		const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
		const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
		const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0;
		const criticalAlerts = safetyAlerts.filter(
			(a) => a.severity === 'critical' && !a.resolved
		).length;
		const equipmentEfficiency =
			equipment.reduce((sum, e) => sum + e.efficiency, 0) / equipment.length || 0;

		return {
			totalBudget,
			totalSpent,
			avgProgress,
			criticalAlerts,
			equipmentEfficiency,
			budgetVariance: totalBudget > 0 ? (totalSpent / totalBudget - 1) * 100 : 0
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

	// Functions
	const resolveAlert = (alertId: string) => {
		safetyAlerts = safetyAlerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a));
	};

	const reviewQualityIssue = (issueId: string) => {
		qualityIssues = qualityIssues.map((q) =>
			q.id === issueId ? { ...q, status: 'reviewing' } : q
		);
	};

	// Initialize data
	$effect(() => {
		projects = generateMockProjects();
		equipment = generateMockEquipment();
		safetyAlerts = generateMockSafetyAlerts();
		qualityIssues = generateMockQualityIssues();
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
			<div class="flex overflow-x-auto scrollbar-hide sm:space-x-8">
				{#each navigationTabs as tab}
					<button
						onclick={() => (activeTab = tab.id)}
						class="cursor-pointer flex items-center border-b-2 px-2 py-4 text-xs font-medium transition-colors whitespace-nowrap sm:px-3 sm:text-sm {activeTab ===
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
						<DollarSign class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Avg Progress"
						value="{aiAnalytics().avgProgress.toFixed(0)}%"
						trend={aiAnalytics().avgProgress > 60 ? 5.2 : -2.1}
					>
						<TrendingUp class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Critical Alerts"
						value={aiAnalytics().criticalAlerts}
						className={aiAnalytics().criticalAlerts > 0 ? 'border-red-200 bg-red-50' : ''}
					>
						<TrendingUp class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Equipment Efficiency"
						value="{aiAnalytics().equipmentEfficiency.toFixed(0)}%"
						trend={aiAnalytics().equipmentEfficiency > 85 ? 3.1 : -1.5}
					>
						<Wrench class="w-6 h-6" />
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
							{#each projects.filter((p) => p.status === 'active' || p.status === 'delayed') as project}
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
							<TriangleAlert class="w-5 h-5 mr-2 text-red-600" />
							Recent Safety Alerts
						</h3>
						<div class="space-y-3">
							{#each safetyAlerts.slice(0, 5) as alert}
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
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">AI Project Management</h2>
					<div class="text-sm text-gray-600">Predictive analytics enabled</div>
				</div>

				<div class="grid gap-6">
					{#each projects as project}
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
		{:else if activeTab === 'safety'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">AI Safety Monitoring</h2>
					<div class="flex space-x-2">
						<span class="text-sm text-gray-600">Real-time monitoring active</span>
						<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
					</div>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
					<MetricCard title="Total Alerts" value={safetyAlerts.length}>
						<Shield class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Critical"
						value={safetyAlerts.filter((a) => a.severity === 'critical').length}
						className="border-red-200"
					>
						<Shield class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Resolved Today"
						value={safetyAlerts.filter((a) => a.resolved).length}
					>
						<Shield class="w-6 h-6" />
					</MetricCard>
					<MetricCard title="Response Time" value="4.2 min" trend={-15.3}>
						<Clock class="w-6 h-6" />
					</MetricCard>
				</div>

				<div class="rounded-lg bg-white shadow-md">
					<div class="border-b p-6">
						<h3 class="text-lg font-semibold">Safety Alerts</h3>
					</div>
					<div class="divide-y">
						{#each safetyAlerts as alert}
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
		{:else if activeTab === 'quality'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">AI Quality Control</h2>
					<div class="text-sm text-gray-600">Computer vision analysis active</div>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
					<MetricCard title="Issues Detected" value={qualityIssues.length}>
						<TriangleAlert class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Critical Issues"
						value={qualityIssues.filter((q) => q.severity === 'critical').length}
						className="border-red-200"
					>
						<Shield class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Avg Confidence"
						value="{(
							qualityIssues.reduce((sum, q) => sum + q.confidence, 0) / qualityIssues.length
						).toFixed(0)}%"
					>
						<Brain class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Fixed Issues"
						value={qualityIssues.filter((q) => q.status === 'fixed').length}
					>
						<FileText class="w-6 h-6" />
					</MetricCard>
				</div>

				<div class="rounded-lg bg-white shadow-md">
					<div class="border-b p-6">
						<h3 class="text-lg font-semibold">Quality Issues</h3>
					</div>
					<div class="divide-y">
						{#each qualityIssues as issue}
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
			</div>
		{:else if activeTab === 'equipment'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Equipment Fleet Management</h2>
					<div class="text-sm text-gray-600">Predictive maintenance enabled</div>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
					<MetricCard title="Total Equipment" value={equipment.length}>
						<TriangleAlert class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Operational"
						value={equipment.filter((e) => e.status === 'operational').length}
						className="border-green-200"
					>
						<Wrench class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="In Maintenance"
						value={equipment.filter((e) => e.status === 'maintenance').length}
						className="border-yellow-200"
					>
						<Shield class="w-6 h-6" />
					</MetricCard>
					<MetricCard
						title="Avg Efficiency"
						value="{aiAnalytics().equipmentEfficiency.toFixed(0)}%"
						trend={2.8}
					>
						<TrendingUp class="w-6 h-6" />
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
							{#each projects as project}
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
										{safetyAlerts.filter((a) => a.severity === 'critical' && !a.resolved).length}
									</div>
									<div class="text-sm text-red-800">Critical Alerts</div>
								</div>
								<div class="rounded-lg bg-yellow-50 p-4 text-center">
									<div class="text-2xl font-bold text-yellow-600">
										{safetyAlerts.filter((a) => a.severity === 'high' && !a.resolved).length}
									</div>
									<div class="text-sm text-yellow-800">High Priority</div>
								</div>
							</div>
							{#if true}
								{@const safetyScore = Math.max(
									0,
									100 - safetyAlerts.filter((a) => !a.resolved).length * 15
								)}
								<div class="text-sm text-gray-600">
									<div class="mb-1 flex justify-between">
										<span>Safety Score</span>
										<span class="font-medium">{safetyScore}%</span>
									</div>
									<ProgressBar progress={safetyScore} />
								</div>
							{/if}
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
