import { writable, derived } from 'svelte/store';

export interface Project {
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

// Mock data generator
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

// AI Simulation Functions
export const predictProjectDelay = (project: Project): number => {
	const factors = [
		project.riskLevel === 'high' ? 0.3 : project.riskLevel === 'medium' ? 0.15 : 0.05,
		project.progress < 50 ? 0.2 : 0.1,
		project.spent / project.budget > 0.8 ? 0.25 : 0.1
	];
	return Math.round(factors.reduce((a, b) => a + b, 0) * 100);
};

export const calculateBudgetOptimization = (project: Project): number => {
	const efficiency = project.progress / (project.spent / project.budget);
	return Math.round((efficiency - 1) * project.budget);
};

// Projects store
export const projects = writable<Project[]>(generateMockProjects());

// Derived analytics from projects
export const projectAnalytics = derived(projects, ($projects) => {
	const totalBudget = $projects.reduce((sum, p) => sum + p.budget, 0);
	const totalSpent = $projects.reduce((sum, p) => sum + p.spent, 0);
	const avgProgress = $projects.reduce((sum, p) => sum + p.progress, 0) / $projects.length || 0;

	return {
		totalBudget,
		totalSpent,
		avgProgress,
		budgetVariance: totalBudget > 0 ? (totalSpent / totalBudget - 1) * 100 : 0
	};
});
