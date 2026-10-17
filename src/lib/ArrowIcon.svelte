<script lang="ts">
	type Props = { size?: string; strokeWidth?: number };

	let { size = '1em', strokeWidth = 1.5 }: Props = $props();
</script>

<!-- Drawn as SVG rather than the ↗ character, which iOS Safari renders as a colour emoji. -->
<svg
	class="arrow-icon"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="square"
	aria-hidden="true"
>
	<path d="M4 20 20 4M9 4h11v11" />
</svg>

<style>
	.arrow-icon {
		display: block;
		flex: 0 0 auto;
	}
</style>
