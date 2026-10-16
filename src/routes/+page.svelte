<script lang="ts">
	import { content } from '#lib/content.ts';
	import Klein from '#lib/designs/Klein.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Klein {content} aboutHtml={data.aboutHtml} />
