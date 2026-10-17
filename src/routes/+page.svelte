<script lang="ts">
	import { content } from '#lib/content.ts';
	import { builtDesigns } from '#lib/designs/registry.ts';
	import Switcher from '#lib/Switcher.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- built from our own registry at prerender time -->
	{@html data.designHead}
</svelte:head>

<!-- Every Design is prerendered so switching is instant; CSS shows only the chosen one. -->
{#each builtDesigns as design (design.id)}
	<div data-design-view={design.id}>
		<design.component {content} aboutHtml={data.aboutHtml} />
	</div>
{/each}

<Switcher />
