import { marked } from 'marked';
import about from '#lib/about.md?raw';
import { buildDesignHead } from '#lib/designs/designHead.ts';
import type { PageServerLoad } from './$types';

/** Renders the About text and the Design head markup at build time, so neither is built in the browser. */
export const load: PageServerLoad = () => {
	const aboutHtml: string = marked.parse(about, { async: false });
	const designHead: string = buildDesignHead();
	return { aboutHtml, designHead };
};
