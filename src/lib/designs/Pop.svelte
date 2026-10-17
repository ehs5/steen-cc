<script lang="ts">
	import '@fontsource/archivo-black';
	import '@fontsource-variable/space-grotesk';
	import archivoUrl from '@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2?url';
	import spaceGroteskUrl from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import ArrowIcon from '#lib/ArrowIcon.svelte';
	import type { Content } from '#lib/content.ts';

	type Props = { content: Content; aboutHtml: string };

	let { content, aboutHtml }: Props = $props();

	// The Draft sets the last name apart in the highlighted block.
	const firstName: string = $derived(content.name.split(' ')[0]);
	const lastName: string = $derived(content.name.slice(firstName.length).trim());

	// The first About paragraph takes the Draft's tagline spot in the hero; the rest go in the card below.
	const firstParagraphEnd: number = $derived(aboutHtml.indexOf('</p>') + '</p>'.length);
	const leadHtml: string = $derived(aboutHtml.slice(0, firstParagraphEnd));
	const restHtml: string = $derived(aboutHtml.slice(firstParagraphEnd).trim());

	// The page is prerendered, so refresh the year in the browser to keep it current between builds.
	let year = $state(new Date().getFullYear());

	/** Takes the logo back to the top of this same page, leaving the chosen Design and address as they are. */
	function scrollToTop(event: MouseEvent) {
		event.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		year = new Date().getFullYear();
	});
</script>

<svelte:head>
	<!-- Fetched alongside the CSS so the text is drawn in the Draft's fonts from the first frame instead of swapping in. -->
	<link rel="preload" href={archivoUrl} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={spaceGroteskUrl} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class="pop">
	<div class="page">
		<header>
			<a class="site" href={resolve('/')} onclick={scrollToTop}>{content.site}</a>
			<nav>
				<a class="button" href="#pop-projects">{content.labels.projects}</a>
				<a class="button email" href="mailto:{content.email}" title={content.labels.emailHint}
					>{content.labels.email}</a
				>
			</nav>
		</header>

		<main>
			<section class="hero">
				<div class="title">
					<h1>{firstName}<br /> <span class="highlight">{lastName}</span></h1>
					<p class="meta">
						{content.labels.location}: {content.location}<br />
						{content.labels.born}: {content.born}
					</p>
					<div class="lead">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered at build time from our own markdown file -->
						{@html leadHtml}
					</div>
				</div>
				<div class="photo">
					<div class="frame">
						<img src={content.photo} alt={content.photoAlt} width="558" height="585" />
					</div>
				</div>
			</section>

			{#if restHtml}
				<section class="about">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered at build time from our own markdown file -->
					{@html restHtml}
				</section>
			{/if}

			<section id="pop-projects" class="projects">
				<h2>{content.labels.projects}</h2>
				<ul>
					{#each content.projects as project (project.name)}
						<li>
							{#if project.url}
								<a class="card" href={project.url} target="_blank" rel="external noopener">
									<span class="name"
										>{project.name}<ArrowIcon size="30px" strokeWidth={1.75} /></span
									>
									<span class="labels">
										<span class="kind">{project.kind}</span>
										{#if project.status}<span class="status">{project.status}</span>{/if}
									</span>
									<span>{project.description}</span>
								</a>
							{:else}
								<div class="card">
									<span class="name">{project.name}</span>
									<span class="labels">
										<span class="kind">{project.kind}</span>
										{#if project.status}<span class="status">{project.status}</span>{/if}
									</span>
									<span>{project.description}</span>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		</main>

		<footer>
			<nav>
				{#each content.links as link (link.label)}
					<a href={link.url} target="_blank" rel="external noopener">{link.label}</a>
				{/each}
			</nav>
			<span>© {year} {content.name}</span>
		</footer>
	</div>
</div>

<style>
	/* Every Design is in the page at once, so this follows the chosen Design rather than the markup. */
	:global(html[data-design='pop'] body) {
		margin: 0;
		background: #ece7de;
		background-image: radial-gradient(rgb(30 30 30 / 0.13) 1.2px, transparent 1.2px);
		background-size: 22px 22px;
	}

	.pop {
		min-height: 100vh;
		padding: 0 clamp(16px, 4vw, 40px) 64px;
		background: #ece7de;
		background-image: radial-gradient(rgb(30 30 30 / 0.13) 1.2px, transparent 1.2px);
		background-size: 22px 22px;
		color: #1e1e1e;
		font-family: 'Space Grotesk Variable', sans-serif;
		font-size: 18px;
		line-height: 1.5;
	}

	.page {
		max-width: 1160px;
		margin: 0 auto;
		padding-top: 32px;
		display: flex;
		flex-direction: column;
		gap: 56px;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 56px;
	}

	a {
		color: inherit;
	}

	a:hover {
		opacity: 0.8;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	.site {
		text-decoration: none;
		font-family: 'Archivo Black', sans-serif;
		font-size: 22px;
		background: #1e1e1e;
		color: #ece7de;
		padding: 6px 14px;
		border-radius: 10px;
	}

	header nav {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		font-weight: 700;
	}

	.button {
		text-decoration: none;
		padding: 8px 16px;
		background: #fbf8f2;
		border: 3px solid #1e1e1e;
		border-radius: 10px;
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	/* Lifts off the page with a hard shadow, like the cards, and presses back down on click. */
	.button:hover {
		opacity: 1;
		transform: translate(-3px, -3px);
		box-shadow: 4px 4px 0 #1e1e1e;
	}

	.button:active {
		transform: translate(0, 0);
		box-shadow: 0 0 0 #1e1e1e;
	}

	.email {
		background: #e8774f;
		color: #1e1e1e;
	}

	.hero {
		display: flex;
		flex-wrap: wrap;
		gap: 48px;
		align-items: center;
	}

	.title {
		flex: 1 1 300px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h1 {
		margin: 0;
		font-family: 'Archivo Black', sans-serif;
		font-weight: 400;
		font-size: clamp(64px, 10vw, 136px);
		line-height: 0.88;
		letter-spacing: -0.035em;
		text-transform: uppercase;
	}

	.highlight {
		background: #e8774f;
		color: #1e1e1e;
		padding: 0 12px;
		border: 4px solid #1e1e1e;
		border-radius: 16px;
		box-shadow: 8px 8px 0 #1e1e1e;
		display: inline-block;
		margin-top: 12px;
	}

	.meta {
		margin: 0;
	}

	.lead {
		max-width: 560px;
		font-size: 22px;
		font-weight: 500;
	}

	.lead :global(p) {
		margin: 0;
	}

	.photo {
		flex: 0 0 auto;
		position: relative;
		padding: 16px;
	}

	.frame {
		width: min(280px, calc(100vw - 72px));
		aspect-ratio: 280 / 296;
		background: #a9c8ec;
		border: 4px solid #1e1e1e;
		border-radius: 24px;
		box-shadow: 10px 10px 0 #1e1e1e;
		overflow: hidden;
		transform: rotate(3deg);
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.15);
		mix-blend-mode: multiply;
	}

	/* The About text continues from the tagline as a paper card in the Draft's border and shadow. */
	.about {
		max-width: 760px;
		background: #fbf8f2;
		border: 4px solid #1e1e1e;
		border-radius: 20px;
		box-shadow: 6px 6px 0 #1e1e1e;
		padding: 40px;
	}

	.about :global(p) {
		margin: 0 0 1em;
	}

	.about :global(a) {
		color: inherit;
	}

	.about :global(a:hover) {
		opacity: 0.8;
	}

	.about :global(p:last-child) {
		margin-bottom: 0;
	}

	@media (max-width: 600px) {
		.about {
			padding: 24px;
		}
	}

	.projects {
		margin-top: 24px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h2 {
		margin: 0;
		font-family: 'Archivo Black', sans-serif;
		font-weight: 400;
		font-size: 40px;
		text-transform: uppercase;
		letter-spacing: -0.02em;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
		gap: 24px;
	}

	li {
		display: flex;
	}

	.card {
		flex: 1;
		text-decoration: none;
		background: #fbf8f2;
		border: 4px solid #1e1e1e;
		border-radius: 20px;
		box-shadow: 6px 6px 0 #1e1e1e;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-height: 200px;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.card:hover {
		transform: translate(-4px, -4px);
		box-shadow: 10px 10px 0 currentColor;
	}

	li:nth-child(5n + 1) .card {
		background: #f2d88a;
	}

	li:nth-child(5n + 2) .card {
		background: #a8d5ba;
	}

	li:nth-child(5n + 3) .card {
		background: #f4b6a6;
	}

	li:nth-child(5n + 4) .card {
		background: #a9c8ec;
	}

	.name {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-family: 'Archivo Black', sans-serif;
		font-size: 28px;
		overflow-wrap: break-word;
		min-width: 0;
	}

	/* Kind and Status reuse the Draft's pill shape, in its ink and paper colours. */
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		font-size: 15px;
		font-weight: 700;
	}

	.kind,
	.status {
		padding: 2px 12px;
		border: 2px solid #1e1e1e;
		border-radius: 999px;
	}

	.kind {
		background: #1e1e1e;
		color: #ece7de;
	}

	.status {
		background: #fbf8f2;
	}

	footer {
		margin-top: 64px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
		font-weight: 700;
	}

	footer nav {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
	}
</style>
