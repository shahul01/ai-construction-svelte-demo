import { writable, derived } from 'svelte/store';

export interface QualityIssue {
	id: string;
	type: 'structural' | 'material' | 'alignment' | 'surface';
	severity: 'minor' | 'major' | 'critical';
	location: string;
	detected: string;
	confidence: number;
	status: 'open' | 'reviewing' | 'fixed';
}

// Mock data generator
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

// Quality issues store
export const qualityIssues = writable<QualityIssue[]>(generateMockQualityIssues());

// Quality functions
export const reviewQualityIssue = (issueId: string) => {
	qualityIssues.update((issues) =>
		issues.map((issue) => (issue.id === issueId ? { ...issue, status: 'reviewing' } : issue))
	);
};

export const fixQualityIssue = (issueId: string) => {
	qualityIssues.update((issues) =>
		issues.map((issue) => (issue.id === issueId ? { ...issue, status: 'fixed' } : issue))
	);
};

// AI Quality Analysis Functions
export const calculateQualityScore = (issues: QualityIssue[]): number => {
	const openIssues = issues.filter((i) => i.status === 'open');
	const criticalIssues = openIssues.filter((i) => i.severity === 'critical').length;
	const majorIssues = openIssues.filter((i) => i.severity === 'major').length;

	return Math.max(0, 100 - criticalIssues * 25 - majorIssues * 10);
};

export const predictQualityRisk = (issues: QualityIssue[]): number => {
	const openIssues = issues.filter((i) => i.status === 'open');
	const avgConfidence =
		openIssues.reduce((sum, i) => sum + i.confidence, 0) / openIssues.length || 0;
	const riskFactor = openIssues.length * (avgConfidence / 100);

	return Math.min(100, riskFactor * 20);
};

export const calculateComplianceScore = (issues: QualityIssue[]): number => {
	const totalIssues = issues.length;
	const fixedIssues = issues.filter((i) => i.status === 'fixed').length;

	return totalIssues > 0 ? (fixedIssues / totalIssues) * 100 : 100;
};

// Derived analytics from quality issues
export const qualityAnalytics = derived(qualityIssues, ($issues) => {
	const totalIssues = $issues.length;
	const criticalIssues = $issues.filter(
		(i) => i.severity === 'critical' && i.status !== 'fixed'
	).length;
	const majorIssues = $issues.filter((i) => i.severity === 'major' && i.status !== 'fixed').length;
	const fixedIssues = $issues.filter((i) => i.status === 'fixed').length;
	const openIssues = $issues.filter((i) => i.status === 'open').length;
	const avgConfidence =
		$issues.length > 0 ? $issues.reduce((sum, i) => sum + i.confidence, 0) / $issues.length : 0;

	const qualityScore = calculateQualityScore($issues);
	const qualityRisk = predictQualityRisk($issues);
	const complianceScore = calculateComplianceScore($issues);

	return {
		totalIssues,
		criticalIssues,
		majorIssues,
		fixedIssues,
		openIssues,
		avgConfidence,
		qualityScore,
		qualityRisk,
		complianceScore
	};
});
