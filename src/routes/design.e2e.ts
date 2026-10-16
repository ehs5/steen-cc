import { expect, test, type Page } from '@playwright/test';

const kleinBackground = 'rgb(21, 52, 184)';
const white = 'rgb(255, 255, 255)';

/** Asserts that Klein is the Design on screen. */
async function expectKlein(page: Page) {
	await expect(page.getByRole('heading', { level: 1, name: 'Espen Steen' })).toBeVisible();
	await expect(page.locator('body')).toHaveCSS('background-color', kleinBackground);
}

/** Returns the path, query and hash currently in the address bar. */
function getAddress(page: Page): string {
	const url = new URL(page.url());
	return url.pathname + url.search + url.hash;
}

/** Stops the app's JavaScript from loading, so only what is in the HTML runs. */
async function blockAppScripts(page: Page) {
	await page.route('**/_app/**/*.js', (route) => route.abort());
}

test('plain / shows Klein with a clean URL', async ({ page }) => {
	await page.goto('/');

	await expectKlein(page);
	expect(getAddress(page)).toBe('/');
});

test('?design=klein is rewritten to /', async ({ page }) => {
	await page.goto('/?design=klein');

	await expectKlein(page);
	await expect.poll(() => getAddress(page)).toBe('/');
});

test('an unknown design parameter falls back to Klein and is removed', async ({ page }) => {
	await page.goto('/?design=nope&ref=x');

	await expectKlein(page);
	await expect.poll(() => getAddress(page)).toBe('/?ref=x');
});

test('a design parameter becomes the stored choice', async ({ page }) => {
	await page.goto('/?design=klein');

	const stored = await page.evaluate(() => localStorage.getItem('design'));
	expect(stored).toBe('klein');
});

test('a stored choice is shown again on return', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => localStorage.setItem('design', 'klein'));
	await page.reload();

	await expectKlein(page);
	expect(getAddress(page)).toBe('/');
});

test('blocked storage does not throw and shows Klein', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));

	await page.addInitScript(() => {
		Object.defineProperty(window, 'localStorage', {
			get() {
				throw new DOMException('Storage is blocked', 'SecurityError');
			}
		});
	});
	await page.goto('/?design=klein');

	await expectKlein(page);
	await expect.poll(() => getAddress(page)).toBe('/');
	expect(errors).toEqual([]);
});

test.describe('Switcher', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('shows three numbered segments named after their Designs', async ({ page }) => {
		const switcher = page.getByRole('group', { name: 'Designs' });
		const segments = switcher.getByRole('button');

		await expect(segments).toHaveCount(3);
		await expect(segments).toHaveText(['1', '2', '3']);
		await expect(segments.nth(0)).toHaveAccessibleName('Klein');
		await expect(segments.nth(1)).toHaveAccessibleName('Neo-brutal Pop');
		await expect(segments.nth(2)).toHaveAccessibleName('Pattern in type');
		await expect(segments.nth(0)).toHaveAttribute('title', 'Klein');
	});

	test('sits at a fixed size and position, coloured from the current Design', async ({ page }) => {
		const switcher = page.getByRole('group', { name: 'Designs' });

		await expect(switcher).toHaveCSS('position', 'fixed');
		await expect(switcher).toHaveCSS('background-color', kleinBackground);
		await expect(switcher).toHaveCSS('color', white);
		await expect(switcher.getByRole('button', { name: 'Klein' })).toHaveCSS(
			'background-color',
			white
		);

		for (const segment of await switcher.getByRole('button').all()) {
			await expect(segment).toHaveCSS('width', '40px');
			await expect(segment).toHaveCSS('height', '40px');
		}

		await page.setViewportSize({ width: 375, height: 812 });
		await expect(switcher).toBeInViewport({ ratio: 1 });
	});

	test('segment 1 keeps Klein selected with a clean URL', async ({ page }) => {
		const klein = page.getByRole('button', { name: 'Klein' });
		await klein.click();

		await expectKlein(page);
		await expect(klein).toHaveAttribute('aria-pressed', 'true');
		expect(getAddress(page)).toBe('/');
	});

	test('segments 2 and 3 are inert', async ({ page }) => {
		for (const name of ['Neo-brutal Pop', 'Pattern in type']) {
			const segment = page.getByRole('button', { name });
			await expect(segment).toHaveAttribute('aria-disabled', 'true');

			await segment.click({ force: true });
			await expectKlein(page);
			expect(getAddress(page)).toBe('/');
		}
	});
});

test.describe('no flash', () => {
	test.describe('with JavaScript disabled', () => {
		test.use({ javaScriptEnabled: false });

		test('shows Klein and the Switcher for the default case', async ({ page }) => {
			await page.goto('/');

			await expectKlein(page);
			await expect(page.getByRole('group', { name: 'Designs' })).toBeVisible();
		});
	});

	test('shows the stored choice before the app loads', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.setItem('design', 'klein'));

		await blockAppScripts(page);
		await page.reload();

		await expectKlein(page);
		await expect(page.locator('html')).toHaveAttribute('data-design', 'klein');
	});

	test('canonicalises a design parameter before the app loads', async ({ page }) => {
		await blockAppScripts(page);
		await page.goto('/?design=nope');

		await expectKlein(page);
		expect(getAddress(page)).toBe('/');
	});
});
