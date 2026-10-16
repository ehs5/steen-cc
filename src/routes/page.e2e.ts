import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

type BuiltDesign = { id: string; path: string };

type ExpectedProject = { name: string; kind: string; status: string; url: string };

// Every built Design must pass the same content checks; add a Design here once it is built.
const designs: BuiltDesign[] = [
	{ id: 'klein', path: '/' },
	{ id: 'pop', path: '/?design=pop' }
];

const projects: ExpectedProject[] = [
	{ name: 'PlainKey', kind: 'Company', status: '', url: 'https://plainkey.io' },
	{ name: 'Coastty', kind: 'macOS app', status: 'Coming soon', url: '' },
	{ name: 'Orkester', kind: 'Platform', status: 'Under development', url: '' },
	{ name: 'Rigg', kind: 'CLI', status: '', url: 'https://github.com/ehs5/rigg' },
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

/** Returns the items of the Projects list that the Projects jump link points to. */
async function getProjectItems(page: Page): Promise<Locator> {
	const jumpLink: Locator = page.getByRole('link', { name: 'Projects', exact: true });
	const target: string = (await jumpLink.getAttribute('href')) ?? '';
	expect(target).toMatch(/^#.+/);

	return page.locator(`${target} li`);
}

for (const design of designs) {
	test.describe(design.id, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(design.path);
		});

		test('shows the name, location and birth year', async ({ page }) => {
			await expect(page.getByRole('heading', { level: 1, name: 'Espen Steen' })).toBeVisible();
			await expect(page.getByText('Location: Oslo').filter({ visible: true })).toBeVisible();
			await expect(page.getByText('Born: 1990').filter({ visible: true })).toBeVisible();
			await expect(page.getByRole('img', { name: 'Espen Steen' })).toBeVisible();
		});

		test('shows every About text paragraph', async ({ page }) => {
			for (const paragraph of getAboutParagraphs()) {
				await expect(
					page.getByText(paragraph, { exact: true }).filter({ visible: true })
				).toBeVisible();
			}
		});

		test('links inside the About text work', async ({ page }) => {
			const about = page
				.getByText('Outside of software', { exact: false })
				.filter({ visible: true });

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
			const items: Locator = await getProjectItems(page);
			await expect(items).toHaveCount(projects.length);

			for (const [i, project] of projects.entries()) {
				const item = items.nth(i);
				await expect(item).toContainText(project.name);
				await expect(item).toContainText(project.kind);

				if (project.status) await expect(item).toContainText(project.status);
			}
		});

		test('links Projects that have a URL and only those', async ({ page }) => {
			const items: Locator = await getProjectItems(page);

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

			const footer = page.locator('footer').filter({ visible: true });
			for (const link of links) {
				await expect(footer.getByRole('link', { name: link.label })).toHaveAttribute(
					'href',
					link.url
				);
			}

			await expect(footer).toContainText(String(new Date().getFullYear()));
			await expect(footer).toContainText('Espen Steen');
		});

		test('sets the tab title and meta description', async ({ page }) => {
			await expect(page).toHaveTitle('steen.cc');
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				'content',
				"Hi, I'm Espen. I'm a developer from Oslo."
			);
		});

		test('has no horizontal overflow at 375px width', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 812 });

			const scrollWidth: number = await page.evaluate(() => document.documentElement.scrollWidth);
			expect(scrollWidth).toBeLessThanOrEqual(375);
		});

		test('serves fonts from the site itself', async ({ page }) => {
			const fontUrls: string[] = [];
			page.on('request', (request) => {
				if (request.resourceType() === 'font') fontUrls.push(request.url());
			});

			await page.reload();
			await page.evaluate(() => document.fonts.ready);

			const siteOrigin: string = new URL(page.url()).origin;

			expect(fontUrls.length).toBeGreaterThan(0);
			for (const url of fontUrls) {
				expect(new URL(url).origin).toBe(siteOrigin);
			}
		});
	});
}
