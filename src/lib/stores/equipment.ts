import { writable, derived } from 'svelte/store';

export interface Equipment {
	id: string;
	name: string;
	status: 'operational' | 'maintenance' | 'down';
	health: number;
	lastMaintenance: string;
	nextMaintenance: string;
	efficiency: number;
}

// Mock data generator
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
export const predictMaintenanceNeeds = (eq: Equipment): string => {
	if (eq.health < 70) return 'Immediate maintenance required';
	if (eq.health < 85) return 'Schedule maintenance within 1 week';
	return 'Equipment running optimally';
};

// Equipment store
export const equipment = writable<Equipment[]>(generateMockEquipment());

// Derived analytics from equipment
export const equipmentAnalytics = derived(equipment, ($equipment) => {
	const totalEquipment = $equipment.length;
	const operational = $equipment.filter((e) => e.status === 'operational').length;
	const inMaintenance = $equipment.filter((e) => e.status === 'maintenance').length;
	const down = $equipment.filter((e) => e.status === 'down').length;
	const avgEfficiency = $equipment.reduce((sum, e) => sum + e.efficiency, 0) / totalEquipment || 0;
	const avgHealth = $equipment.reduce((sum, e) => sum + e.health, 0) / totalEquipment || 0;

	return {
		totalEquipment,
		operational,
		inMaintenance,
		down,
		avgEfficiency,
		avgHealth
	};
});
