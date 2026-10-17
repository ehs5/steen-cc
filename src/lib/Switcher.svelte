<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { selectDesign } from '#lib/designs/designSelection.ts';
	import {
		builtDesignIds,
		defaultDesignId,
		designSlots,
		designStorageKey
	} from '#lib/designs/registry.ts';

	// The head script picks the Design before hydration, so read its choice once mounted.
	let currentId = $state(defaultDesignId);

	onMount(() => {
		currentId = document.documentElement.dataset.design ?? defaultDesignId;
	});

	/** Shows the given Design, remembers it and puts it in the address bar. */
	function chooseDesign(designId: string) {
		const url = new URL(location.href);
		url.searchParams.set('design', designId);

		const { canonicalUrl } = selectDesign(url.href, '', builtDesignIds, defaultDesignId);
		document.documentElement.dataset.design = designId;
		currentId = designId;

		try {
			localStorage.setItem(designStorageKey, designId);
		} catch {
			// the choice still applies to this visit
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve -- built from the current location, so it already carries the base path
		replaceState(canonicalUrl, {});
	}
</script>

<div class="switcher" role="group" aria-label="Designs">
	{#each designSlots as slot, i (slot.id)}
		{#if slot.component}
			<button
				type="button"
				data-switcher-segment={slot.id}
				aria-label={slot.name}
				aria-pressed={slot.id === currentId}
				title={slot.name}
				onclick={() => chooseDesign(slot.id)}>{i + 1}</button
			>
		{:else}
			<button
				type="button"
				data-switcher-segment={slot.id}
				aria-label={slot.name}
				aria-disabled="true"
				title={slot.name}>{i + 1}</button
			>
		{/if}
	{/each}
</div>

<style>
	/* Keeps the end of every Design clear of the fixed Switcher. */
	:global(body) {
		padding-bottom: 4.5rem;
	}

	.switcher {
		position: fixed;
		right: max(1rem, env(safe-area-inset-right));
		bottom: max(1rem, env(safe-area-inset-bottom));
		z-index: 10;
		display: flex;
		border: 1px solid var(--design-text);
		background: var(--design-background);
		color: var(--design-text);
	}

	button {
		width: 2.5rem;
		height: 2.5rem;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font:
			600 1rem / 1 system-ui,
			sans-serif;
		cursor: pointer;
	}

	button + button {
		border-left: 1px solid var(--design-text);
	}

	button[aria-disabled='true'] {
		cursor: default;
	}

	button:focus-visible {
		outline: 2px solid var(--design-text);
		outline-offset: 2px;
	}
	/*
	 * Every Design gets the same footprint (three 2.5rem segments in the same corner) but its own look.
	 * Nothing here changes the size: Neo-brutal Pop thickens its edge with an outline, Footnotes uses hairlines in its rule colour.
	 */
	:global(html[data-design='pop']) .switcher {
		border-radius: 10px;
		outline: 2px solid #1e1e1e;
		box-shadow: 6px 6px 0 #1e1e1e;
		background: #fbf8f2;
		overflow: hidden;
	}

	:global(html[data-design='pop']) button {
		font:
			700 1rem / 1 'Space Grotesk Variable',
			sans-serif;
	}

	:global(html[data-design='pop']) .switcher [data-switcher-segment='pop'] {
		background: #e8774f;
		color: #1e1e1e;
	}

	:global(html[data-design='footnotes']) .switcher {
		border-color: #4a443c;
		border-radius: 2px;
	}

	:global(html[data-design='footnotes']) button {
		border-color: #4a443c;
		color: #9a9183;
		font:
			400 1.1rem / 1 'EB Garamond Variable',
			serif;
	}

	:global(html[data-design='footnotes']) .switcher [data-switcher-segment='footnotes'] {
		background: none;
		color: #e8e1d4;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}

	:global(html[data-design='footnotes']) button:not([aria-disabled='true']):hover {
		color: #e0727c;
	}
</style>
