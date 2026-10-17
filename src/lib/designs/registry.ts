import type { Component } from 'svelte';
import type { Content } from '#lib/content.ts';
import Klein from './Klein.svelte';
import Footnotes from './Footnotes.svelte';
import Pop from './Pop.svelte';

export type DesignProps = { content: Content; aboutHtml: string };

/** One Switcher position. `component` is null until the Design is built; its colours are then "". */
export type DesignSlot = {
	id: string;
	name: string;
	component: Component<DesignProps> | null;
	text: string;
	background: string;
};

export type BuiltDesign = DesignSlot & { component: Component<DesignProps> };

export const designSlots: DesignSlot[] = [
	{ id: 'klein', name: 'Klein', component: Klein, text: '#fff', background: '#1534b8' },
	{ id: 'pop', name: 'Neo-brutal Pop', component: Pop, text: '#1e1e1e', background: '#ece7de' },
	{
		id: 'footnotes',
		name: 'Footnotes',
		component: Footnotes,
		text: '#e8e1d4',
		background: '#141311'
	}
];

export const defaultDesignId = 'klein';

export const designStorageKey = 'design';

/** Returns the slots that have a component, in Switcher order. */
function getBuiltDesigns(): BuiltDesign[] {
	const built: BuiltDesign[] = [];
	for (const slot of designSlots) {
		// unbuilt slots can't be shown or selected
		if (!slot.component) continue;
		built.push({ ...slot, component: slot.component });
	}
	return built;
}

export const builtDesigns: BuiltDesign[] = getBuiltDesigns();

export const builtDesignIds: string[] = builtDesigns.map((design) => design.id);
