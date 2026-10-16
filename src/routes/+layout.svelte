<script lang="ts">
	import favicon from '#lib/assets/favicon.png';
	import { content } from '#lib/content.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>{content.site}</title>
	<meta name="description" content="Hi, I'm Espen. I'm a developer from Oslo." />
	<link rel="icon" type="image/png" href={favicon} />
</svelte:head>

{@render children()}
