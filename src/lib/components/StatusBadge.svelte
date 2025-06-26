<script lang="ts">
	interface Props {
		status: string;
		variant?: 'project' | 'equipment' | 'safety' | 'quality';
	}

	let { status, variant = 'project' }: Props = $props();

	const getStatusColor = () => {
		switch (variant) {
			case 'project':
				return status === 'active'
					? 'bg-green-100 text-green-800'
					: status === 'delayed'
					? 'bg-red-100 text-red-800'
					: status === 'completed'
					? 'bg-blue-100 text-blue-800'
					: 'bg-gray-100 text-gray-800';
			case 'equipment':
				return status === 'operational'
					? 'bg-green-100 text-green-800'
					: status === 'maintenance'
					? 'bg-yellow-100 text-yellow-800'
					: 'bg-red-100 text-red-800';
			case 'safety':
				return status === 'low'
					? 'bg-green-100 text-green-800'
					: status === 'medium'
					? 'bg-yellow-100 text-yellow-800'
					: status === 'high'
					? 'bg-orange-100 text-orange-800'
					: 'bg-red-100 text-red-800';
			case 'quality':
				return status === 'minor'
					? 'bg-yellow-100 text-yellow-800'
					: status === 'major'
					? 'bg-orange-100 text-orange-800'
					: 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};
</script>

<span class="px-2 py-1 rounded-full text-xs font-medium {getStatusColor()}">
	{status.charAt(0).toUpperCase() + status.slice(1)}
</span>