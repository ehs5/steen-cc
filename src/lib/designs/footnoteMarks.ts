import type { Project } from '#lib/content.ts';

type Mention = { end: number; number: number };

const wordCharacter = /[\p{L}\p{N}_]/u;

/** Returns the element id of the note with the given number. */
export function getNoteId(number: number): string {
	return `footnote-${number}`;
}

/** Returns the superscript mark that links to the given note. */
function buildMark(number: number): string {
	return `<sup><a href="#${getNoteId(number)}">${number}</a></sup>`;
}

/** Returns where the first whole-word use of the name ends in the text, or -1 when it isn't there. */
function findNameEnd(text: string, name: string): number {
	let start: number = text.indexOf(name);

	while (start !== -1) {
		const end: number = start + name.length;
		const before: string = text.charAt(start - 1);
		const after: string = text.charAt(end);

		if (!wordCharacter.test(before) && !wordCharacter.test(after)) return end;
		start = text.indexOf(name, start + 1);
	}

	return -1;
}

/** Returns the first mention in the text of each Project not yet marked, in text order. */
function findMentions(
	text: string,
	projects: Pick<Project, 'name'>[],
	markedNumbers: Set<number>
): Mention[] {
	const mentions: Mention[] = [];

	for (const [i, project] of projects.entries()) {
		const number: number = i + 1;

		// only the first mention in the whole text gets a mark
		if (markedNumbers.has(number)) continue;

		const end: number = findNameEnd(text, project.name);
		if (end === -1) continue;

		mentions.push({ end, number });
	}

	return mentions.sort((a, b) => a.end - b.end);
}

/** Returns the text with each mention's mark placed right after the name. */
function insertMarks(text: string, mentions: Mention[]): string {
	let result = '';
	let copiedUpTo = 0;

	for (const mention of mentions) {
		result += text.slice(copiedUpTo, mention.end) + buildMark(mention.number);
		copiedUpTo = mention.end;
	}

	return result + text.slice(copiedUpTo);
}

/**
 * Returns the HTML with a superscript note number after the first mention of each Project name.
 * Numbers follow the Projects order. A name inside a link gets its mark after the link, so the link stays whole.
 */
export function addFootnoteMarks(html: string, projects: Pick<Project, 'name'>[]): string {
	const tokens: string[] = html.split(/(<[^>]*>)/);
	const markedNumbers = new Set<number>();
	let linkDepth = 0;
	let marksAfterLink = '';
	let result = '';

	for (const token of tokens) {
		// tags pass through untouched; only their nesting matters
		if (token.startsWith('<')) {
			result += token;

			if (/^<a[\s>]/i.test(token)) linkDepth++;
			if (!/^<\/a\s*>/i.test(token)) continue;

			linkDepth--;
			if (linkDepth > 0) continue;

			result += marksAfterLink;
			marksAfterLink = '';
			continue;
		}

		const mentions: Mention[] = findMentions(token, projects, markedNumbers);
		for (const mention of mentions) markedNumbers.add(mention.number);

		if (linkDepth > 0) {
			result += token;
			marksAfterLink += mentions.map((mention) => buildMark(mention.number)).join('');
		} else {
			result += insertMarks(token, mentions);
		}
	}

	return result;
}
