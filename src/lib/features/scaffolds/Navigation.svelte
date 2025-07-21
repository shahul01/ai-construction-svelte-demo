<script lang="ts">
	import type { Tab } from '$lib/stores/navigation';
	import { Calendar1, Wrench, Camera, Brain, Shield, Building } from '@lucide/svelte';

	interface NavigationProps {
		activeTab: Tab;
		onTabChange: (tabId: Tab) => void;
	}

	let { activeTab, onTabChange }: NavigationProps = $props();

	const navigationTabs = [
		{ id: 'dashboard', label: 'Dashboard', icon: Building },
		{ id: 'projects', label: 'Project Management', icon: Calendar1 },
		{ id: 'safety', label: 'Safety Monitoring', icon: Shield },
		{ id: 'quality', label: 'Quality Control', icon: Camera },
		{ id: 'equipment', label: 'Equipment', icon: Wrench },
		{ id: 'analytics', label: 'AI Analytics', icon: Brain }
	];
</script>

<!-- Navigation -->
<nav class="bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="scrollbar-hide flex overflow-x-auto sm:space-x-8">
			{#each navigationTabs as tab}
				<button
					onclick={() => onTabChange(tab.id as Tab)}
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
