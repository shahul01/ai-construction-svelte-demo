import { derived } from 'svelte/store';
import { projects, type Project } from './projects';
import { safetyAlerts, type SafetyAlert } from './safety';
import { aiAnalytics, type AIAnalyticsData } from './analytics';

// Dashboard-specific interface for UI metrics
export interface DashboardMetrics {
	totalBudget: number;
	avgProgress: number;
	criticalAlerts: number;
	equipmentEfficiency: number;
	activeProjects: Project[];
	recentSafetyAlerts: SafetyAlert[];
	budgetTrend: number;
	progressTrend: number;
	alertsTrend: number;
	efficiencyTrend: number;
}

// Dashboard utility functions
export const calculateBudgetTrend = (analytics: AIAnalyticsData): number => {
	// Mock calculation - in real app this would use historical data
	return analytics.budgetVariance > 0 ? -2.1 : 2.5;
};

export const calculateProgressTrend = (projects: Project[]): number => {
	const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
	return avgProgress > 60 ? 5.2 : -2.1;
};

export const calculateAlertsTrend = (alerts: SafetyAlert[]): number => {
	const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;
	return criticalCount > 0 ? -8.5 : 3.2;
};

export const calculateEfficiencyTrend = (efficiency: number): number => {
	return efficiency > 85 ? 3.1 : -1.5;
};

// Main dashboard store that aggregates data for the dashboard view
export const dashboardMetrics = derived(
	[projects, safetyAlerts, aiAnalytics],
	([$projects, $safetyAlerts, $aiAnalytics]) => {
		const activeProjects = $projects.filter((p) => p.status === 'active' || p.status === 'delayed');
		const recentSafetyAlerts = $safetyAlerts.slice(0, 5);

		const metrics: DashboardMetrics = {
			totalBudget: $aiAnalytics.totalBudget,
			avgProgress: $aiAnalytics.avgProgress,
			criticalAlerts: $aiAnalytics.criticalAlerts,
			equipmentEfficiency: $aiAnalytics.equipmentEfficiency,
			activeProjects,
			recentSafetyAlerts,
			budgetTrend: calculateBudgetTrend($aiAnalytics),
			progressTrend: calculateProgressTrend($projects),
			alertsTrend: calculateAlertsTrend($safetyAlerts),
			efficiencyTrend: calculateEfficiencyTrend($aiAnalytics.equipmentEfficiency)
		};

		return metrics;
	}
);
