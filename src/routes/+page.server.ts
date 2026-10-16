import { marked } from 'marked';
import about from '#lib/about.md?raw';
import type { PageServerLoad } from './$types';

/** Renders the About text to HTML at build time, so no markdown parser ships to the browser. */
export const load: PageServerLoad = () => {
	const aboutHtml: string = marked.parse(about, { async: false });
	return { aboutHtml };
};
