import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	authenticate: {
		login: 'Login',
		signup: 'Register',
		email: 'Email',
		password: 'Password',
		error_title: 'Error',
		missing_params: 'Missing required parameters: client_id and redirect_url are required.',
		no_permission: 'You do not have permission to access this panel.',
		validation_failed: 'Invalid request: ',
		welcome_title: 'Welcome',
		welcome_desc: 'Please login or register to continue.'
	},
	admin_panel: {
		title: 'Lookup Admin',
		nav: {
			dashboard: 'Dashboard',
			lookup_types: 'Lookup Types'
		},
		logout: 'Logout'
	},
	crud_table: {
		create: '+ Create',
		filter: 'Filter',
		clear: 'Clear',
		and: 'AND',
		or: 'OR',
		loading: 'Loading...',
		no_data: 'No data',
		actions: 'Actions',
		view: 'View',
		edit: 'Edit',
		delete: 'Delete',
		prev: '← Prev',
		next: 'Next →',
		page_of: 'Page {page:number} / {total:number}',
		select_placeholder: '-- Select --',
		filter_value_placeholder: 'value',
		tags_placeholder: 'comma separated',
		cancel: 'Cancel',
		save: 'Save',
		detail_title: 'Detail',
		close: 'Close',
		edit_title: 'Edit {resource:string}',
		create_title: 'Create {resource:string}',
		delete_confirm: 'Are you sure?',
		yes: 'Yes',
		no: 'No'
	},
	confirm_modal: {
		default_message: 'Are you sure?',
		confirm: 'Confirm',
		cancel: 'Cancel'
	},
	dashboard: {
		title: 'Dashboard',
		badge: 'Lookup Admin',
		description: 'Manage lookup types, items, and translations for the platform.',
		quick_start: 'Quick Start',
		resources: {
			lookup_types: 'Lookup Types'
		},
		resource_desc: {
			lookup_types: 'Categories of reference data (e.g., currencies, countries, status enums)'
		}
	},
	lookup_types_page: {
		title: 'Lookup Types',
		col_code: 'Code',
		col_name: 'Name',
		col_description: 'Description',
		col_active: 'Active',
		col_tenant: 'Tenant',
		view_items: 'Items'
	},
	lookup_items_page: {
		title: 'Lookup Items',
		type_label: 'Type',
		col_code: 'Code',
		col_name: 'Name',
		col_active: 'Active',
		col_sort_order: 'Sort Order',
		col_is_default: 'Default',
		view_translations: 'Translations',
		back: '← Back to Types'
	},
	lookup_translations_page: {
		title: 'Item Translations',
		item_label: 'Item',
		col_locale: 'Locale',
		col_name: 'Name',
		back: '← Back to Items'
	}
};

export default en_US;
