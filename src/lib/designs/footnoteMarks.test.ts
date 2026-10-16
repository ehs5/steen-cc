import { describe, expect, test } from 'vitest';
import { addFootnoteMarks, getNoteId } from './footnoteMarks.ts';

/** Returns the superscript mark that links to the given note number. */
function mark(number: number): string {
	return `<sup><a href="#${getNoteId(number)}">${number}</a></sup>`;
}

describe('addFootnoteMarks', () => {
	test('numbers marks in the Projects order, not the order they are mentioned', () => {
		const html = '<p>I made Rigg and PlainKey.</p>';
		const projects = [{ name: 'PlainKey' }, { name: 'Rigg' }];

		expect(addFootnoteMarks(html, projects)).toBe(
			`<p>I made Rigg${mark(2)} and PlainKey${mark(1)}.</p>`
		);
	});

	test('leaves an unmentioned Project without a mark and keeps the other numbers', () => {
		const html = '<p>I made Rigg.</p>';
		const projects = [{ name: 'PlainKey' }, { name: 'Rigg' }];

		expect(addFootnoteMarks(html, projects)).toBe(`<p>I made Rigg${mark(2)}.</p>`);
	});

	test('marks only the first mention of a name', () => {
		const html = '<p>PlainKey is new.</p>\n<p>PlainKey is small.</p>';
		const projects = [{ name: 'PlainKey' }];

		expect(addFootnoteMarks(html, projects)).toBe(
			`<p>PlainKey${mark(1)} is new.</p>\n<p>PlainKey is small.</p>`
		);
	});

	test('puts the mark after a link that contains the name', () => {
		const html = '<p>See <a href="https://plainkey.io">PlainKey</a> now.</p>';
		const projects = [{ name: 'PlainKey' }];

		expect(addFootnoteMarks(html, projects)).toBe(
			`<p>See <a href="https://plainkey.io">PlainKey</a>${mark(1)} now.</p>`
		);
	});

	test('does not touch names in tag attributes', () => {
		const html = '<p><a href="https://example.com/Rigg" title="Rigg">docs</a> for Rigg.</p>';
		const projects = [{ name: 'Rigg' }];

		expect(addFootnoteMarks(html, projects)).toBe(
			`<p><a href="https://example.com/Rigg" title="Rigg">docs</a> for Rigg${mark(1)}.</p>`
		);
	});

	test('matches the exact name only', () => {
		const html = '<p>Plainkey AS and Rigging, then PlainKey.</p>';
		const projects = [{ name: 'PlainKey' }, { name: 'Rigg' }];

		expect(addFootnoteMarks(html, projects)).toBe(
			`<p>Plainkey AS and Rigging, then PlainKey${mark(1)}.</p>`
		);
	});

	test('marks several names in the same sentence', () => {
		const html = '<p>Like Coastty and Orkester, and Rigg.</p>';
		const projects = [{ name: 'Coastty' }, { name: 'Orkester' }, { name: 'Rigg' }];

		expect(addFootnoteMarks(html, projects)).toBe(
			`<p>Like Coastty${mark(1)} and Orkester${mark(2)}, and Rigg${mark(3)}.</p>`
		);
	});
});
