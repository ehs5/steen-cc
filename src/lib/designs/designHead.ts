import { selectDesign } from './designSelection.ts';
import type { DesignSelection } from './designSelection.ts';
import { builtDesigns, builtDesignIds, defaultDesignId, designStorageKey } from './registry.ts';

/**
 * Picks the Design, marks <html> with it, stores it and canonicalises the address bar.
 * Runs as a blocking inline script before first paint, so it must stay self-contained and never throw.
 */
function applyDesignSelection(
	select: typeof selectDesign,
	builtIds: string[],
	defaultId: string,
	storageKey: string
): void {
	let storedId = '';
	try {
		storedId = localStorage.getItem(storageKey) ?? '';
	} catch {
		// blocked storage behaves like an empty one
	}

	const selection: DesignSelection = select(location.href, storedId, builtIds, defaultId);
	document.documentElement.dataset.design = selection.designId;

	if (selection.store) {
		try {
			localStorage.setItem(storageKey, selection.designId);
		} catch {
			// the choice still applies to this visit
		}
	}

	const currentUrl: string = location.pathname + location.search + location.hash;
	if (selection.canonicalUrl !== currentUrl) {
		history.replaceState(history.state, '', selection.canonicalUrl);
	}
}

/** Returns the selectors matching <html> when the given Design is the one on screen. */
function getActiveSelectors(designId: string): string[] {
	const selectors: string[] = [`html[data-design="${designId}"]`];

	// Without JavaScript nothing marks <html>, so the Default design shows
	if (designId === defaultDesignId) selectors.push('html:not([data-design])');

	return selectors;
}

/** Builds the CSS that shows only the chosen Design and colours the Switcher from it. */
function buildDesignCss(): string {
	const rules: string[] = ['[data-design-view]{display:none}'];

	for (const design of builtDesigns) {
		const active: string[] = getActiveSelectors(design.id);
		const view: string = active.map((html) => `${html} [data-design-view="${design.id}"]`).join();
		const segment: string = active
			.map((html) => `${html} [data-switcher-segment="${design.id}"]`)
			.join();

		rules.push(
			`${active.join()}{--design-text:${design.text};--design-background:${design.background}}`
		);
		rules.push(`${view}{display:contents}`);
		rules.push(`${segment}{color:var(--design-background);background:var(--design-text)}`);
	}

	return rules.join('\n');
}

/** Returns the head markup that makes the chosen Design visible from the first painted frame. */
export function buildDesignHead(): string {
	const args: string = [
		selectDesign.toString(),
		JSON.stringify(builtDesignIds),
		JSON.stringify(defaultDesignId),
		JSON.stringify(designStorageKey)
	].join();

	const script = `try{(${applyDesignSelection.toString()})(${args})}catch(e){}`;
	return `<style>${buildDesignCss()}</style><script>${script}</script>`;
}
