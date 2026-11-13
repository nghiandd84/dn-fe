export interface Column {
	key: string;
	label: string;
	sortable?: boolean;
	filterable?: boolean;
	operators?: Array<'eq' | 'neq' | 'li' | 'sw' | 'in' | 'nin' | 'lt' | 'lte' | 'gt' | 'gte'>;
	displayKey?: string;
	/** Optional formatter: transforms the raw cell value before display. */
	format?: (value: any, row: any) => string;
	/** When true, the column is shown in the detail view but hidden from the table. */
	hideInTable?: boolean;
	/** When provided, the filter renders a <select> instead of a text input. */
	filterOptions?: { value: string; label: string }[];
}

export interface FormField {
	key: string;
	label: string;
	type: 'text' | 'password' | 'email' | 'number' | 'select' | 'select-remote' | 'tags' | 'checkbox';
	required?: boolean;
	/** Static options for type: 'select' */
	options?: { value: string; label: string }[];
	/** Dynamic options for type: 'select-remote' */
	remoteOptions?: {
		url: string;
		valueKey: string;
		labelKey: string;
	};
	/**
	 * When true, the field is shown but disabled while editing an existing record
	 * (useful for create-only fields the update endpoint does not accept).
	 */
	readonlyOnEdit?: boolean;
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

/**
 * Converts a permission mask integer into a CrudActions object.
 * Permissions are cumulative — each level implies all lower levels:
 *
 *   Read   (1)  → detail
 *   Create (2)  → detail + create
 *   Update (4)  → detail + create + edit
 *   Delete (8)  → detail + create + edit + delete
 *   Admin  (16) → detail + create + edit + delete
 */
export function maskToCrudActions(mask: number): CrudActions {
	const canRead   = (mask & 1)  !== 0;
	const canCreate = (mask & 2)  !== 0;
	const canUpdate = (mask & 4)  !== 0;
	const canDelete = (mask & 8)  !== 0;
	const isAdmin   = (mask & 16) !== 0;

	// Each level cascades upward: having Create implies Read, etc.
	const hasDelete = canDelete || isAdmin;
	const hasUpdate = canUpdate || hasDelete;
	const hasCreate = canCreate || hasUpdate;
	const hasRead   = canRead   || hasCreate;

	return {
		detail: hasRead,
		create: hasCreate,
		edit:   hasUpdate,
		delete: hasDelete,
	};
}
