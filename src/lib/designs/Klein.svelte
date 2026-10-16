<script lang="ts">
	import '@fontsource-variable/familjen-grotesk';
	import { onMount } from 'svelte';
	import type { Content } from '#lib/content.ts';

	type Props = { content: Content; aboutHtml: string };

	let { content, aboutHtml }: Props = $props();

	// The page is prerendered, so refresh the year in the browser to keep it current between builds.
	let year = $state(new Date().getFullYear());

	onMount(() => {
		year = new Date().getFullYear();
	});
</script>

<div class="klein">
	<header>
		<span class="site">{content.site}</span>
		<nav>
			<a href="#projects">{content.labels.projects}</a>
			<a href="mailto:{content.email}">{content.labels.email}</a>
		</nav>
	</header>

	<main>
		<section class="intro">
			<div>
				<h1>{content.name}</h1>
				<p class="meta">{content.location} · Born {content.born}</p>
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
					<li>
						<div class="project-heading">
							{#if project.url}
								<a class="project-name" href={project.url} rel="external">{project.name}</a>
							{:else}
								<span class="project-name">{project.name}</span>
							{/if}
							<span class="labels">
								<span>{project.kind}</span>
								{#if project.status}
									<span>· {project.status}</span>
								{/if}
							</span>
						</div>
						<p>{project.description}</p>
					</li>
				{/each}
			</ul>
		</section>
	</main>

	<footer>
		<ul>
			{#each content.links as link (link.label)}
				<li><a href={link.url} rel="external">{link.label}</a></li>
			{/each}
		</ul>
		<p>© {year}</p>
	</footer>
</div>

<style>
	:global(body:has(.klein)) {
		margin: 0;
		background: #1534b8;
	}

	.klein {
		--rule: 1px solid rgb(255 255 255 / 0.5);

		box-sizing: border-box;
		min-height: 100vh;
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 clamp(1rem, 5vw, 3rem);
		background: #1534b8;
		color: #fff;
		font-family: 'Familjen Grotesk Variable', system-ui, sans-serif;
		font-size: 1.125rem;
		line-height: 1.55;
		overflow-wrap: break-word;
	}

	a {
		color: inherit;
		text-decoration: none;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
	}

	a:hover {
		text-decoration: underline;
	}

	header {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		justify-content: space-between;
		padding: 1.5rem 0;
		border-bottom: var(--rule);
	}

	.site {
		font-weight: 600;
	}

	nav {
		display: flex;
		gap: 1.5rem;
	}

	.intro {
		display: grid;
		gap: 2rem;
		align-items: end;
		padding: clamp(3rem, 10vw, 7rem) 0 clamp(2.5rem, 6vw, 4rem);
		border-bottom: var(--rule);
	}

	@media (min-width: 48rem) {
		.intro {
			grid-template-columns: 1fr auto;
		}
	}

	h1 {
		margin: 0;
		font-size: clamp(3.25rem, 13vw, 8.5rem);
		font-weight: 600;
		line-height: 0.92;
		letter-spacing: -0.035em;
	}

	.meta {
		margin: 1.25rem 0 0;
		font-size: 1.25rem;
	}

	img {
		display: block;
		width: 14rem;
		max-width: 100%;
		height: auto;
	}

	.about {
		max-width: 40rem;
		padding: clamp(2.5rem, 6vw, 4rem) 0;
		border-bottom: var(--rule);
	}

	.about :global(p) {
		margin: 0 0 1.25em;
	}

	.about :global(p:first-child) {
		font-size: 1.5rem;
		line-height: 1.35;
	}

	.about :global(p:last-child) {
		margin-bottom: 0;
	}

	.about :global(a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
	}

	.about :global(a:hover) {
		opacity: 0.7;
	}

	#projects {
		padding: clamp(2.5rem, 6vw, 4rem) 0;
	}

	h2 {
		margin: 0 0 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	#projects li {
		padding: 1.5rem 0;
		border-top: var(--rule);
	}

	#projects li:last-child {
		border-bottom: var(--rule);
	}

	.project-heading {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		align-items: baseline;
		justify-content: space-between;
	}

	.project-name {
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.labels {
		font-size: 0.95rem;
		opacity: 0.8;
	}

	#projects p {
		max-width: 40rem;
		margin: 0.5rem 0 0;
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		align-items: center;
		justify-content: space-between;
		padding: 2rem 0 2.5rem;
	}

	footer ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
	}

	footer p {
		margin: 0;
	}
</style>
