import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
	duration: number; // ms, 0 = sticky
}

let _id = 0;

const { subscribe, update } = writable<Toast[]>([]);

function add(message: string, type: ToastType = 'info', duration = 4000): number {
	const id = ++_id;
	update((toasts) => [...toasts, { id, type, message, duration }]);
	if (duration > 0) {
		setTimeout(() => remove(id), duration);
	}
	return id;
}

function remove(id: number) {
	update((toasts) => toasts.filter((t) => t.id !== id));
}

export const toasts = { subscribe };

export const toast = {
	success: (message: string, duration?: number) => add(message, 'success', duration),
	error: (message: string, duration?: number) => add(message, 'error', duration ?? 6000),
	info: (message: string, duration?: number) => add(message, 'info', duration),
	warning: (message: string, duration?: number) => add(message, 'warning', duration),
	remove
};
