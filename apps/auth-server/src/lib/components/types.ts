export interface Column {
	key: string;
	label: string;
	sortable?: boolean;
	filterable?: boolean;
	operators?: Array<'eq' | 'neq' | 'li' | 'sw' | 'in' | 'nin' | 'lt' | 'lte' | 'gt' | 'gte'>;
	displayKey?: string;
	// Optional formatter: transforms the raw cell value before display.
	format?: (value: any, row: any) => string;
}

export interface FormField {
	key: string;
	label: string;
	type: 'text' | 'password' | 'email' | 'number' | 'select' | 'select-remote' | 'tags' | 'checkbox';
	required?: boolean;
	// Static options for type: 'select'
	options?: { value: string; label: string }[];
	// Dynamic options for type: 'select-remote'
	remoteOptions?: {
		url: string;        // e.g. '/api/admin/clients'
		valueKey: string;   // field to use as option value, e.g. 'id'
		labelKey: string;   // field to use as option label, e.g. 'name'
	};
}

export interface CrudActions {
	create?: boolean;
	edit?: boolean;
	delete?: boolean;
	detail?: boolean;
}

export const MASK_BITS = [
	{ bit: 1,  label: 'Read' },
	{ bit: 2,  label: 'Create' },
	{ bit: 4,  label: 'Update' },
	{ bit: 8,  label: 'Delete' },
	{ bit: 16, label: 'Admin' },
] as const;

export function maskToActions(mask: number): string[] {
	return MASK_BITS.filter(b => (mask & b.bit) !== 0).map(b => b.label);
}
