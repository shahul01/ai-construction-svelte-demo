import { derived } from 'svelte/store';
import { projectAnalytics } from './projects';
import { safetyAnalytics } from './safety';
import { qualityAnalytics } from './quality';
import { equipmentAnalytics } from './equipment';

// Comprehensive analytics interface
export interface AIAnalyticsData {
	// Project metrics
	totalBudget: number;
	totalSpent: number;
	avgProgress: number;
	budgetVariance: number;

	// Safety metrics
	criticalAlerts: number;
	highAlerts: number;
	safetyScore: number;

	// Quality metrics
	criticalIssues: number;
	qualityScore: number;
	complianceScore: number;
	avgConfidence: number;

	// Equipment metrics
	equipmentEfficiency: number;
	totalEquipment: number;
	operational: number;
	inMaintenance: number;
	down: number;
	avgHealth: number;
}

// AI Recommendations interface
export interface AIRecommendation {
	id: string;
	category: 'schedule' | 'cost' | 'safety' | 'quality' | 'equipment' | 'performance';
	priority: 'low' | 'medium' | 'high' | 'critical';
	title: string;
	description: string;
	impact?: string;
	confidence?: number;
}

// Generate AI recommendations based on current data
export const generateAIRecommendations = (analytics: AIAnalyticsData): AIRecommendation[] => [
	{
		id: 'schedule-1',
		category: 'schedule',
		priority: 'medium',
		title: '💡 Schedule Optimization',
		description:
			'Consider reallocating resources from Highway Bridge Extension to Residential Tower A to reduce delay risk by 15%.',
		impact: '15% delay reduction',
		confidence: 87
	},
	{
		id: 'cost-1',
		category: 'cost',
		priority: 'high',
		title: '💰 Cost Savings',
		description:
			'Implement predictive maintenance on Excavator CAT-320 to avoid potential $45K in downtime costs.',
		impact: '$45K savings',
		confidence: 92
	},
	{
		id: 'safety-1',
		category: 'safety',
		priority: analytics.criticalAlerts > 0 ? 'critical' : 'low',
		title: '⚠️ Safety Priority',
		description:
			analytics.criticalAlerts > 0
				? 'Address critical scaffolding issue immediately. Predicted incident probability: 78% within 24 hours.'
				: 'Safety systems operating normally. Continue regular monitoring protocols.',
		impact: analytics.criticalAlerts > 0 ? 'Prevent incident' : 'Maintain safety',
		confidence: 89
	},
	{
		id: 'quality-1',
		category: 'quality',
		priority: analytics.criticalIssues > 0 ? 'high' : 'medium',
		title: '🔍 Quality Focus',
		description: `Review structural issues in Column C-12. AI confidence: ${analytics.avgConfidence.toFixed(0)}%. Immediate inspection recommended.`,
		impact: 'Quality assurance',
		confidence: analytics.avgConfidence
	},
	{
		id: 'equipment-1',
		category: 'equipment',
		priority: analytics.equipmentEfficiency < 80 ? 'high' : 'medium',
		title: '🔧 Equipment Alert',
		description: `Equipment efficiency at ${analytics.equipmentEfficiency.toFixed(0)}%. Schedule maintenance for optimal performance.`,
		impact: `${(90 - analytics.equipmentEfficiency).toFixed(0)}% efficiency gain potential`,
		confidence: 85
	},
	{
		id: 'performance-1',
		category: 'performance',
		priority: 'medium',
		title: '📊 Performance Insight',
		description: `Overall project progress: ${analytics.avgProgress.toFixed(0)}%. Quality compliance at ${analytics.complianceScore.toFixed(0)}%.`,
		impact: 'Performance optimization',
		confidence: 91
	}
];

// Main analytics store that combines all metrics
export const aiAnalytics = derived(
	[projectAnalytics, safetyAnalytics, qualityAnalytics, equipmentAnalytics],
	([$projectAnalytics, $safetyAnalytics, $qualityAnalytics, $equipmentAnalytics]) => {
		const analytics: AIAnalyticsData = {
			// Project metrics
			totalBudget: $projectAnalytics?.totalBudget || 0,
			totalSpent: $projectAnalytics?.totalSpent || 0,
			avgProgress: $projectAnalytics?.avgProgress || 0,
			budgetVariance: $projectAnalytics?.budgetVariance || 0,

			// Safety metrics
			criticalAlerts: $safetyAnalytics?.criticalAlerts || 0,
			highAlerts: $safetyAnalytics?.highAlerts || 0,
			safetyScore: $safetyAnalytics?.safetyScore || 0,

			// Quality metrics
			criticalIssues: $qualityAnalytics?.criticalIssues || 0,
			qualityScore: $qualityAnalytics?.qualityScore || 0,
			complianceScore: $qualityAnalytics?.complianceScore || 0,
			avgConfidence: $qualityAnalytics?.avgConfidence || 0,

			// Equipment metrics
			equipmentEfficiency: $equipmentAnalytics?.avgEfficiency || 0,
			totalEquipment: $equipmentAnalytics?.totalEquipment || 0,
			operational: $equipmentAnalytics?.operational || 0,
			inMaintenance: $equipmentAnalytics?.inMaintenance || 0,
			down: $equipmentAnalytics?.down || 0,
			avgHealth: $equipmentAnalytics?.avgHealth || 0
		};

		return analytics;
	}
);

// Derived recommendations based on analytics
export const aiRecommendations = derived(aiAnalytics, ($aiAnalytics) => {
	return generateAIRecommendations($aiAnalytics);
});
