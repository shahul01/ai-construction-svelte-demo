<script lang="ts">
	import { TrendingUp } from '@lucide/svelte';

	interface Props {
		title: string;
		value: string | number;
		trend?: number;
		className?: string;
	}

	let { title, value, trend, className = '' }: Props = $props();
</script>

<div class="bg-white p-6 rounded-lg shadow-md border {className}">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-medium text-gray-600">{title}</p>
			<p class="text-2xl font-bold text-gray-900">{value}</p>
			{#if trend !== undefined}
				<div class="flex items-center mt-1 {trend >= 0 ? 'text-green-600' : 'text-red-600'}">
					<TrendingUp class="w-4 h-4 mr-1" />
					<span class="text-sm">
						{trend >= 0 ? '+' : ''}{trend}%
					</span>
				</div>
			{/if}
		</div>
		<div class="text-blue-600">
			<slot class="w-6 h-6" />
		</div>
	</div>
</div>