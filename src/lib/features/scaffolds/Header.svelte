<script lang="ts">
	import { Building } from '@lucide/svelte';

	const currentDate = new Date();
</script>

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