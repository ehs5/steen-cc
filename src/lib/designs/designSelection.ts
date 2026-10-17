export type DesignSelection = {
	designId: string;
	store: boolean;
	canonicalUrl: string;
};

/**
 * Decides which Design to show from the URL's design parameter and the stored choice.
 * Must stay self-contained (no imports, no module-level references): its source is also inlined into the page head so it runs before first paint.
 */
export function selectDesign(
	url: string,
	storedId: string,
	builtIds: string[],
	defaultId: string
): DesignSelection {
	const parsed = new URL(url);
	const urlId: string = parsed.searchParams.get('design') ?? '';

	let designId: string = defaultId;
	let store = false;

	if (builtIds.includes(urlId)) {
		designId = urlId;
		store = true;
	} else if (builtIds.includes(storedId)) {
		designId = storedId;
	}

	// The Default design is shown without a parameter, so plain links stay clean
	if (designId === defaultId) {
		parsed.searchParams.delete('design');
	} else {
		parsed.searchParams.set('design', designId);
	}

	return { designId, store, canonicalUrl: parsed.pathname + parsed.search + parsed.hash };
}
