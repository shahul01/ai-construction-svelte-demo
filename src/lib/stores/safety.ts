import { writable, derived } from 'svelte/store';

export interface SafetyAlert {
	id: string;
	type: 'ppe' | 'hazard' | 'equipment' | 'behavior';
	severity: 'low' | 'medium' | 'high' | 'critical';
	location: string;
	timestamp: string;
	description: string;
	resolved: boolean;
}

// Mock data generator
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

// Safety alerts store
export const safetyAlerts = writable<SafetyAlert[]>(generateMockSafetyAlerts());

// Safety functions
export const resolveAlert = (alertId: string) => {
	safetyAlerts.update((alerts) =>
		alerts.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert))
	);
};

// AI Safety Analysis Functions
export const calculateSafetyScore = (alerts: SafetyAlert[]): number => {
	const unresolvedAlerts = alerts.filter((a) => !a.resolved);
	return Math.max(0, 100 - unresolvedAlerts.length * 15);
};

export const predictIncidentRisk = (alerts: SafetyAlert[]): number => {
	const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;
	const highAlerts = alerts.filter((a) => a.severity === 'high' && !a.resolved).length;

	return Math.min(100, criticalAlerts * 40 + highAlerts * 20);
};

// Derived analytics from safety alerts
export const safetyAnalytics = derived(safetyAlerts, ($alerts) => {
	const totalAlerts = $alerts.length;
	const criticalAlerts = $alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;
	const highAlerts = $alerts.filter((a) => a.severity === 'high' && !a.resolved).length;
	const resolvedToday = $alerts.filter((a) => a.resolved).length;
	const safetyScore = calculateSafetyScore($alerts);
	const incidentRisk = predictIncidentRisk($alerts);

	return {
		totalAlerts,
		criticalAlerts,
		highAlerts,
		resolvedToday,
		safetyScore,
		incidentRisk,
		averageResponseTime: 4.2 // Mock value
	};
});
