import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { writable } from 'svelte/store';

export const fingerprint = writable<string>('');

export async function initFingerprint() {
	const fp = await FingerprintJS.load();
	const result = await fp.get();
	fingerprint.set(result.visitorId);
}
