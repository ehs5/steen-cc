import { Marked } from 'marked';
import about from '#lib/about.md?raw';
import { buildDesignHead } from '#lib/designs/designHead.ts';
import type { PageServerLoad } from './$types';

// Every link in the About text leads off the site, so it opens in a new tab like the other outside links.
const markdown = new Marked({
	renderer: {
		link({ href, title, tokens }) {
			const text: string = this.parser.parseInline(tokens);
			const titleAttribute: string = title ? ` title="${title}"` : '';
			return `<a href="${href}"${titleAttribute} target="_blank" rel="external noopener">${text}</a>`;
		}
	}
});

/** Renders the About text and the Design head markup at build time, so neither is built in the browser. */
export const load: PageServerLoad = () => {
	const aboutHtml: string = markdown.parse(about, { async: false });
	const designHead: string = buildDesignHead();
	return { aboutHtml, designHead };
};
