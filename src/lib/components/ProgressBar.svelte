<script lang="ts">
	interface Props {
		progress: number;
		className?: string;
	}

	let { progress, className = '' }: Props = $props();
</script>

<div class="w-full bg-gray-200 rounded-full h-2 {className}">
	<div
		class="bg-blue-600 h-2 rounded-full transition-all duration-300"
		style="width: {Math.min(progress, 100)}%"
	></div>
</div>