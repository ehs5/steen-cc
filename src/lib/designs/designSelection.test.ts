import { describe, expect, test } from 'vitest';
import { selectDesign } from './designSelection.ts';

const builtIds: string[] = ['klein', 'pop'];
const defaultId = 'klein';
const site = 'https://steen.cc';

describe('selectDesign', () => {
	test('shows the Default design with a clean URL when nothing is chosen', () => {
		expect(selectDesign(`${site}/`, '', builtIds, defaultId)).toEqual({
			designId: 'klein',
			store: false,
			canonicalUrl: '/'
		});
	});

	test('a valid URL parameter wins over the stored choice and becomes the stored choice', () => {
		expect(selectDesign(`${site}/?design=pop`, 'klein', builtIds, defaultId)).toEqual({
			designId: 'pop',
			store: true,
			canonicalUrl: '/?design=pop'
		});
	});

	test('a URL parameter for the Default design is stored and removed from the URL', () => {
		expect(selectDesign(`${site}/?design=klein`, 'pop', builtIds, defaultId)).toEqual({
			designId: 'klein',
			store: true,
			canonicalUrl: '/'
		});
	});

	test('a valid stored choice is shown when the URL has no parameter', () => {
		expect(selectDesign(`${site}/`, 'pop', builtIds, defaultId)).toEqual({
			designId: 'pop',
			store: false,
			canonicalUrl: '/?design=pop'
		});
	});

	test('an unknown URL parameter is ignored and removed', () => {
		expect(selectDesign(`${site}/?design=nope`, '', builtIds, defaultId)).toEqual({
			designId: 'klein',
			store: false,
			canonicalUrl: '/'
		});
	});

	test('an unknown URL parameter falls back to a valid stored choice', () => {
		expect(selectDesign(`${site}/?design=nope`, 'pop', builtIds, defaultId)).toEqual({
			designId: 'pop',
			store: false,
			canonicalUrl: '/?design=pop'
		});
	});

	test('an unbuilt id is ignored in the URL and in storage', () => {
		expect(selectDesign(`${site}/?design=pattern`, 'pattern', builtIds, defaultId)).toEqual({
			designId: 'klein',
			store: false,
			canonicalUrl: '/'
		});
	});

	test('an empty URL parameter is ignored', () => {
		expect(selectDesign(`${site}/?design=`, '', builtIds, defaultId)).toEqual({
			designId: 'klein',
			store: false,
			canonicalUrl: '/'
		});
	});

	test('keeps the path, other parameters and the hash in the canonical URL', () => {
		const selection = selectDesign(
			`${site}/?ref=gh&design=nope#projects`,
			'pop',
			builtIds,
			defaultId
		);
		expect(selection.canonicalUrl).toBe('/?ref=gh&design=pop#projects');
	});
});
