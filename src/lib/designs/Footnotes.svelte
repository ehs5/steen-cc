<script lang="ts">
	import '@fontsource-variable/eb-garamond';
	import '@fontsource-variable/eb-garamond/wght-italic.css';
	import garamondUrl from '@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2?url';
	import garamondItalicUrl from '@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2?url';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { Content } from '#lib/content.ts';

	type Props = { content: Content; aboutHtml: string };

	let { content, aboutHtml }: Props = $props();

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
	<!-- Fetched alongside the CSS so the text is drawn in EB Garamond from the first frame instead of swapping in. -->
	<link rel="preload" href={garamondUrl} as="font" type="font/woff2" crossorigin="anonymous" />
	<link
		rel="preload"
		href={garamondItalicUrl}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="footnotes">
	<div class="column">
		<header>
			<a class="site" href={resolve('/')} onclick={scrollToTop}>{content.site}</a>
			<nav>
				<a href="#footnotes-projects">{content.labels.projects}</a>
				<a href="mailto:{content.email}" title={content.labels.emailHint}>{content.labels.email}</a>
			</nav>
		</header>

		<div class="identity">
			<img src={content.photo} alt={content.photoAlt} width="558" height="585" />
			<div>
				<h1>{content.name}</h1>
				<p>
					{content.labels.location}: {content.location}<br />
					{content.labels.born}: {content.born}
				</p>
			</div>
		</div>

		<div class="about">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered at build time from our own markdown file -->
			{@html aboutHtml}
		</div>

		<section id="footnotes-projects">
			<h2>{content.labels.projects}</h2>
			<ul>
				{#each content.projects as project (project.name)}
					<li>
						<span class="project-heading">
							<i>
								{#if project.url}
									<a href={project.url} target="_blank" rel="external noopener">{project.name}</a>
								{:else}
									{project.name}
								{/if}
							</i>
							<span class="sc"
								>{project.kind}{#if project.status}&nbsp;· {project.status}{/if}</span
							>
						</span>
						<span>{project.description}</span>
					</li>
				{/each}
			</ul>
		</section>

		<footer>
			<p class="links">
				{#each content.links as link, i (link.label)}
					{#if i > 0}<span aria-hidden="true">·</span>{/if}<a
						href={link.url}
						target="_blank"
						rel="external noopener">{link.label}</a
					>
				{/each}
			</p>
			<p class="signature">{content.name}, {year}</p>
		</footer>
	</div>
</div>

<style>
	/* Every Design is in the page at once, so this follows the chosen Design rather than the markup. */
	:global(html[data-design='footnotes'] body) {
		margin: 0;
		background: #141311;
	}

	.footnotes {
		min-height: 100vh;
		background: #141311;
		color: #e8e1d4;
		font-family: 'EB Garamond Variable', serif;
		font-size: 21px;
		line-height: 1.6;
		padding: 0 16px 80px;
	}

	.column {
		max-width: 580px;
		margin: 0 auto;
		padding-top: 40px;
		display: flex;
		flex-direction: column;
		gap: 1.1em;
	}

	/* Covers the About text's own links too, since that HTML isn't part of this component's markup. */
	.footnotes :global(a) {
		color: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		text-decoration-color: #4a443c;
		transition:
			color 0.2s ease,
			text-decoration-color 0.2s ease;
	}

	.footnotes :global(a:hover) {
		color: #e0727c;
		text-decoration-color: #e0727c;
	}

	p,
	h1 {
		margin: 0;
	}

	/* The site name and jump link sit quietly above the letter, at the notes' size and the signature's colour. */
	header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5em 1.5em;
		margin-bottom: 0.4em;
		font-size: 17px;
		line-height: 1.55;
		color: #9a9183;
	}

	header nav {
		display: flex;
		gap: 1.2em;
	}

	/* The photo sits beside the name, exactly as tall as its three lines. */
	.identity {
		display: flex;
		align-items: flex-start;
		gap: 20px;
		margin: 1em 0 0.4em;
	}

	img {
		flex: 0 0 auto;
		height: calc(3 * 1.6em);
		width: auto;
		object-fit: cover;
		border-radius: 2px;
		filter: grayscale(1) contrast(1.05);
	}

	/* On phones the photo has room to be larger, with the name lines centred beside it. */
	@media (max-width: 600px) {
		.identity {
			align-items: center;
		}

		img {
			height: 150px;
		}
	}

	/* The name opens the letter like any other line, not as a title. */
	h1 {
		font-size: inherit;
		font-weight: 500;
		line-height: inherit;
	}

	/* The paragraphs join the column, so they share its spacing as in the Draft. */
	.about {
		display: contents;
	}

	.about :global(p) {
		margin: 0;
	}

	footer {
		margin-top: 2em;
		display: flex;
		flex-direction: column;
		gap: 1.1em;
	}

	/* A flex line, so the separators get the same space on both sides whatever the markup's whitespace. */
	.links {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.25em;
	}

	.signature {
		color: #9a9183;
		font-style: italic;
	}

	section {
		margin-top: 2em;
		display: flex;
		flex-direction: column;
		gap: 0.8em;
	}

	h2 {
		margin: 0;
		font-size: 17px;
		font-weight: 400;
		font-variant: small-caps;
		letter-spacing: 0.06em;
		color: #9a9183;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1em;
		font-size: 17px;
		line-height: 1.55;
		color: #bdb4a6;
	}

	/* Name and labels on the first line, the description below, so each Project reads as its own entry. */
	li {
		display: flex;
		flex-direction: column;
	}

	.project-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.6em;
		color: #e8e1d4;
	}

	.project-heading i {
		font-size: 19px;
	}

	.sc {
		font-variant: small-caps;
		letter-spacing: 0.04em;
	}

	.footnotes .site {
		text-decoration: none;
	}
</style>
