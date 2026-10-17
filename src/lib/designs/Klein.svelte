<script lang="ts">
	import '@fontsource-variable/familjen-grotesk';
	import fontUrl from '@fontsource-variable/familjen-grotesk/files/familjen-grotesk-latin-wght-normal.woff2?url';
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
	<!-- Fetched alongside the CSS so the text is drawn in Familjen Grotesk from the first frame instead of swapping in. -->
	<link rel="preload" href={fontUrl} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class="klein">
	<div class="page">
		<header>
			<a class="site" href={resolve('/')} onclick={scrollToTop}>{content.site}</a>
			<nav>
				<a href="#projects">{content.labels.projects}</a>
				<a href="mailto:{content.email}" title={content.labels.emailHint}>{content.labels.email}</a>
			</nav>
		</header>

		<main>
			<section class="intro">
				<div class="title">
					<h1>{content.name}</h1>
					<p class="meta">
						{content.labels.location}: {content.location}<br />
						{content.labels.born}: {content.born}
					</p>
				</div>
				<img src={content.photo} alt={content.photoAlt} width="558" height="585" />
			</section>

			<section class="about">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered at build time from our own markdown file -->
				{@html aboutHtml}
			</section>

			<section id="projects">
				<h2>{content.labels.projects}</h2>
				<ul>
					{#each content.projects as project (project.name)}
						<li class:linked={project.url}>
							{#if project.url}
								<a class="name" href={project.url} target="_blank" rel="external noopener"
									>{project.name}</a
								>
								<span class="arrow" aria-hidden="true">↗</span>
							{:else}
								<span class="name">{project.name}</span>
							{/if}
							<span class="labels">
								{project.kind}{#if project.status}&nbsp;· <span class="status"
										>{project.status}</span
									>{/if}
							</span>
							<p>{project.description}</p>
						</li>
					{/each}
				</ul>
			</section>
		</main>

		<footer>
			<ul>
				{#each content.links as link (link.label)}
					<li><a href={link.url} target="_blank" rel="external noopener">{link.label}</a></li>
				{/each}
			</ul>
			<span>© {year} {content.name}</span>
		</footer>
	</div>
</div>

<style>
	:global(body:has(.klein)) {
		margin: 0;
		background: #1534b8;
	}

	.klein {
		--muted: rgb(255 255 255 / 0.88);
		--line: rgb(255 255 255 / 0.35);

		min-height: 100vh;
		padding: 0 clamp(16px, 4vw, 40px) 64px;
		background: #1534b8;
		color: #fff;
		font-family: 'Familjen Grotesk Variable', sans-serif;
		font-size: 18px;
		line-height: 1.5;
		overflow-wrap: break-word;
	}

	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding-top: 40px;
		display: flex;
		flex-direction: column;
		gap: 96px;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 96px;
	}

	a {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid currentColor;
	}

	a:hover {
		opacity: 0.65;
	}

	header {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		font-weight: 500;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
	}

	.intro {
		--title-size: clamp(60px, 10vw, 140px);

		display: flex;
		flex-wrap: wrap;
		gap: 40px;
		align-items: flex-start;
		justify-content: space-between;
	}

	.title {
		flex: 1 1 520px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h1 {
		/* Pulls the type in by the E's side bearing so it lines up with the text below. */
		margin: 0 0 0 -0.063em;
		font-size: var(--title-size);
		font-weight: 700;
		line-height: 0.9;
		letter-spacing: -0.04em;
	}

	.meta {
		margin: 0;
		font-size: 16px;
		line-height: 1.5;
		color: var(--muted);
	}

	/* Spans from the top of the capitals to the bottom of the meta lines (cap top sits 0.2em into the line box). */
	img {
		flex: 0 0 auto;
		height: calc(var(--title-size) * 0.7 + 24px + 48px);
		width: auto;
		margin-top: calc(var(--title-size) * 0.2);
		border-radius: 4px;
		filter: grayscale(1) contrast(1.1);
		mix-blend-mode: screen;
	}

	@media (max-width: 760px) {
		img {
			height: 180px;
			margin-top: 0;
		}
	}

	.about {
		max-width: 720px;
		font-size: 20px;
		line-height: 1.5;
	}

	.about :global(p) {
		margin: 0 0 1em;
	}

	.about :global(p:first-child) {
		font-size: 26px;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.about :global(a) {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid currentColor;
	}

	.about :global(a:hover) {
		opacity: 0.65;
	}

	.about :global(p:last-child) {
		margin-bottom: 0;
	}

	#projects {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h2 {
		margin: 0;
		font-size: 16px;
		font-weight: 500;
		color: var(--muted);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	#projects ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
		gap: 0 48px;
	}

	#projects li {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 24px 0;
		border-top: 1px solid var(--line);
	}

	/* On hover a white line draws over the faint top rule: solid for linked Projects, dashed for unlinked. */
	#projects li::before {
		content: '';
		position: absolute;
		top: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: #fff;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.35s ease;
	}

	#projects li:not(.linked)::before {
		background: repeating-linear-gradient(90deg, #fff 0 40px, transparent 40px 72px);
	}

	#projects li:hover::before {
		transform: scaleX(1);
	}

	.status {
		transition: color 0.2s ease;
	}

	#projects li:hover .status {
		color: #fff;
	}

	/* A linked Project is clickable as a whole card: the name's link stretches over it. */
	.linked .name {
		border-bottom: 0;
	}

	.linked .name:hover {
		opacity: 1;
	}

	.linked .name::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.linked .name:focus-visible {
		outline: none;
	}

	.linked .name:focus-visible::after {
		outline: 2px solid #fff;
		outline-offset: 4px;
	}

	.arrow {
		position: absolute;
		top: 28px;
		right: 0;
		font-size: 22px;
		line-height: 1;
		transition: transform 0.2s ease;
	}

	.linked:hover .arrow {
		transform: translate(3px, -3px);
	}

	.name {
		align-self: flex-start;
		font-size: 30px;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.labels {
		font-size: 15px;
		color: var(--muted);
	}

	#projects p {
		margin: 0;
		color: var(--muted);
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		justify-content: space-between;
		padding-top: 20px;
		border-top: 1px solid var(--line);
		font-size: 16px;
	}

	footer ul {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
	}

	.site {
		border-bottom: 0;
	}
</style>
