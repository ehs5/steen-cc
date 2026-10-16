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
</style>
