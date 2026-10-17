import photo from '#lib/assets/photo.jpeg';

export type Project = {
	name: string;
	kind: string;
	description: string;
	url?: string;
	status?: string;
};

export type Link = {
	label: string;
	url: string;
};

export type Content = {
	name: string;
	site: string;
	photo: string;
	photoAlt: string;
	location: string;
	born: number;
	email: string;
	links: Link[];
	projects: Project[];
	labels: {
		projects: string;
		email: string;
		emailHint: string;
		location: string;
		born: string;
	};
};

export const content: Content = {
	name: 'Espen Steen',
	site: 'steen.cc',
	photo,
	photoAlt: 'Espen Steen',
	location: 'Oslo',
	born: 1990,
	email: 'privacy.sierra806@passmail.net',
	links: [
		{ label: 'GitHub', url: 'https://github.com/ehs5' },
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/espensteen' },
		{ label: 'SoundCloud', url: 'https://soundcloud.com/dj-shokk' },
		{ label: 'Spotify', url: 'https://open.spotify.com/artist/6rnlr6e1aZZPTEfZYFied8' }
	],
	projects: [
		{
			name: 'PlainKey',
			url: 'https://plainkey.io',
			kind: 'Company',
			description: 'Passkey authentication for the web. Based in Europe.'
		},
		{
			name: 'Coastty',
			kind: 'macOS app',
			status: 'Coming soon',
			description:
				'A macOS terminal for coding agents, built on Ghostty. Shows what every agent is doing and keeps sessions running after you quit.'
		},
		{
			name: 'Orkester',
			kind: 'Platform',
			status: 'Under development',
			description: 'A trigger-based agent workflow platform.'
		},
		{
			name: 'Rigg',
			url: 'https://github.com/ehs5/rigg',
			kind: 'CLI',
			description: 'Scaffolds Node.js TypeScript projects using a modern toolchain.'
		},
		{
			name: 'CRMScript Fetcher',
			url: 'https://github.com/ehs5/crmscript_fetcher',
			kind: 'CLI + GUI',
			description:
				'Fetches CRMScripts and other customizations from SuperOffice and saves them as files and folders.'
		}
	],
	labels: {
		projects: 'Projects',
		email: 'Email me',
		emailHint: 'Privacy email address that will be forwarded to me',
		location: 'Location',
		born: 'Born'
	}
};
