<script lang="ts">
	import '@fontsource-variable/eb-garamond';
	import '@fontsource-variable/eb-garamond/wght-italic.css';
	import garamondUrl from '@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2?url';
	import garamondItalicUrl from '@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2?url';
	import { onMount } from 'svelte';
	import type { Content } from '#lib/content.ts';
	import { addFootnoteMarks, getNoteId } from './footnoteMarks.ts';

	type Props = { content: Content; aboutHtml: string };

	let { content, aboutHtml }: Props = $props();

	const markedAboutHtml: string = $derived(addFootnoteMarks(aboutHtml, content.projects));

	// The page is prerendered, so refresh the year in the browser to keep it current between builds.
	let year = $state(new Date().getFullYear());

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
			<span>{content.site}</span> · <a href="#footnotes-projects">{content.labels.projects}</a>
		</header>

		<img src={content.photo} alt={content.photoAlt} width="558" height="585" />

		<div>
			<h1>{content.name}</h1>
			<p>
				{content.labels.location}: {content.location}<br />
				{content.labels.born}: {content.born}
			</p>
		</div>

		<div class="about">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered at build time from our own markdown file -->
			{@html markedAboutHtml}
		</div>

		<footer>
			<p class="links">
				<a href="mailto:{content.email}">{content.labels.email}</a>
				{#each content.links as link (link.label)}
					<span aria-hidden="true">·</span><a href={link.url} rel="external">{link.label}</a>
				{/each}
			</p>
			<p class="signature">{content.name}, {year}</p>
		</footer>

		<section id="footnotes-projects" aria-label={content.labels.projects}>
			<div class="rule"></div>
			<ol>
				{#each content.projects as project, i (project.name)}
					<li id={getNoteId(i + 1)}>
						<span class="number">{i + 1}</span>
						<span>
							<i>
								{#if project.url}
									<a href={project.url} target="_blank" rel="external noopener">{project.name}</a>.
								{:else}
									{project.name}.
								{/if}
							</i>
							<span class="sc">{project.kind}</span>.
							{#if project.status}<span class="sc">{project.status}</span>.{/if}
							{project.description}
						</span>
					</li>
				{/each}
			</ol>
		</section>
	</div>
</div>

<style>
	/* Every Design is in the page at once, so this follows the chosen Design rather than the markup. */
	:global(html[data-design='footnotes'] body) {
		margin: 0;
		background: #f4efe6;
	}

	.footnotes {
		min-height: 100vh;
		background: #f4efe6;
		color: #2a2620;
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
		text-decoration-color: #c9bfae;
		transition:
			color 0.2s ease,
			text-decoration-color 0.2s ease;
	}

	.footnotes :global(a:hover) {
		color: #8c2f39;
		text-decoration-color: #8c2f39;
	}

	p,
	h1 {
		margin: 0;
	}

	/* The site name and jump link sit quietly above the letter, at the notes' size and the signature's colour. */
	header {
		margin-bottom: 0.4em;
		font-size: 17px;
		line-height: 1.55;
		color: #7a7266;
	}

	img {
		width: 72px;
		height: 76px;
		object-fit: cover;
		border-radius: 2px;
		margin-bottom: 1em;
		filter: grayscale(0.3);
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

	.about :global(sup) {
		font-size: 0.62em;
		line-height: 0;
		margin-left: 1px;
	}

	.about :global(sup a) {
		text-decoration: none;
		color: #8c2f39;
	}

	footer {
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
		margin-top: 2em;
		color: #7a7266;
		font-style: italic;
	}

	section {
		margin-top: 3em;
		display: flex;
		flex-direction: column;
		gap: 1.1em;
	}

	.rule {
		width: 120px;
		border-top: 1px solid #c9bfae;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.6em;
		font-size: 17px;
		line-height: 1.55;
		color: #4a443b;
	}

	li {
		display: flex;
		gap: 12px;
	}

	.number {
		flex: 0 0 14px;
		color: #8c2f39;
	}

	.sc {
		font-variant: small-caps;
		letter-spacing: 0.04em;
	}
</style>
