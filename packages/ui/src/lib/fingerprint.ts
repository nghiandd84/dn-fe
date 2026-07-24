import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'dn_fp';

// Restore cached fingerprint synchronously so it's available before initFingerprint resolves
const cached = typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) ?? '') : '';
export const fingerprint = writable<string>(cached);

export async function initFingerprint() {
	const fp = await FingerprintJS.load();
	const result = await fp.get();
	const visitorId = result.visitorId;
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, visitorId);
	}
	fingerprint.set(visitorId);
}
