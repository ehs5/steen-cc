<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '#lib/content.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// The page is prerendered, so refresh the year in the browser to keep it current between builds.
	let year = $state(new Date().getFullYear());

	onMount(() => {
		year = new Date().getFullYear();
	});
</script>

<div class="page">
	<header>
		<span>{content.site}</span>
		<nav>
			<a href="#projects">{content.labels.projects}</a>
			<a href="mailto:{content.email}">{content.labels.email}</a>
		</nav>
	</header>

	<main>
		<h1>{content.name}</h1>
		<p>{content.location} · Born {content.born}</p>
		<img src={content.photo} alt={content.photoAlt} />

		<section class="about">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered at build time from our own markdown file -->
			{@html data.aboutHtml}
		</section>

		<section id="projects">
			<h2>{content.labels.projects}</h2>
			<ul>
				{#each content.projects as project (project.name)}
					<li>
						{#if project.url}
							<a href={project.url} rel="external">{project.name}</a>
						{:else}
							<span>{project.name}</span>
						{/if}
						<span>{project.kind}</span>
						{#if project.status}
							<span>{project.status}</span>
						{/if}
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
	.page {
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem;
		font-family: system-ui, sans-serif;
		line-height: 1.5;
	}

	header,
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: space-between;
	}

	img {
		max-width: 100%;
		height: auto;
	}

	ul {
		padding: 0;
		list-style: none;
	}

	li {
		margin-bottom: 1rem;
	}

	li p {
		margin: 0;
	}

	footer ul {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
</style>
