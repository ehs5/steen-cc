import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

type ExpectedProject = { name: string; kind: string; status: string; url: string };

const projects: ExpectedProject[] = [
	{ name: 'PlainKey', kind: 'Company', status: '', url: 'https://plainkey.io' },
	{ name: 'Coastty', kind: 'macOS app', status: 'Coming soon', url: '' },
	{ name: 'Orkester', kind: 'Platform', status: 'Under development', url: '' },
	{ name: 'Rigg', kind: 'CLI', status: '', url: 'https://www.npmjs.com/package/create-rigg' },
	{
		name: 'CRMScript Fetcher',
		kind: 'CLI + GUI',
		status: '',
		url: 'https://github.com/ehs5/crmscript_fetcher'
	}
];

const links = [
	{ label: 'GitHub', url: 'https://github.com/ehs5' },
	{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/espensteen' },
	{ label: 'SoundCloud', url: 'https://soundcloud.com/dj-shokk' },
	{ label: 'Spotify', url: 'https://open.spotify.com/artist/6rnlr6e1aZZPTEfZYFied8' }
];

/** Returns the About text paragraphs as plain text, with markdown links reduced to their label. */
function getAboutParagraphs(): string[] {
	const markdown: string = readFileSync('src/lib/about.md', 'utf8');
	const paragraphs: string[] = markdown.trim().split(/\n\s*\n/);
	return paragraphs.map((paragraph) => paragraph.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
}

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('shows the name, location and birth year', async ({ page }) => {
	await expect(page.getByRole('heading', { level: 1, name: 'Espen Steen' })).toBeVisible();
	await expect(page.getByText('Oslo · Born 1990')).toBeVisible();
	await expect(page.getByRole('img', { name: 'Espen Steen' })).toBeVisible();
});

test('shows every About text paragraph', async ({ page }) => {
	for (const paragraph of getAboutParagraphs()) {
		await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
	}
});

test('links inside the About text work', async ({ page }) => {
	const about = page.getByText('Outside of software', { exact: false });

	await expect(about.getByRole('link', { name: 'SoundCloud' })).toHaveAttribute(
		'href',
		'https://soundcloud.com/dj-shokk'
	);
	await expect(about.getByRole('link', { name: 'Spotify' })).toHaveAttribute(
		'href',
		'https://open.spotify.com/artist/6rnlr6e1aZZPTEfZYFied8'
	);
});

test('shows every Project with its Kind and Status', async ({ page }) => {
	const items = page.locator('#projects li');
	await expect(items).toHaveCount(projects.length);

	for (const [i, project] of projects.entries()) {
		const item = items.nth(i);
		await expect(item).toContainText(project.name);
		await expect(item).toContainText(project.kind);

		if (project.status) await expect(item).toContainText(project.status);
	}
});

test('links Projects that have a URL and only those', async ({ page }) => {
	const items = page.locator('#projects li');

	for (const [i, project] of projects.entries()) {
		const link = items.nth(i).getByRole('link', { name: project.name });

		// Projects without a URL must not render a dead link
		if (!project.url) {
			await expect(link).toHaveCount(0);
			continue;
		}

		await expect(link).toHaveAttribute('href', project.url);
	}
});

test('shows the email link and the four links', async ({ page }) => {
	await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute(
		'href',
		'mailto:privacy.sierra806@passmail.net'
	);

	const footer = page.locator('footer');
	for (const link of links) {
		await expect(footer.getByRole('link', { name: link.label })).toHaveAttribute('href', link.url);
	}

	await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
});

test('sets the tab title and meta description', async ({ page }) => {
	await expect(page).toHaveTitle('steen.cc');
	await expect(page.locator('meta[name="description"]')).toHaveAttribute(
		'content',
		"Hi, I'm Espen. I'm a developer from Oslo."
	);
});
