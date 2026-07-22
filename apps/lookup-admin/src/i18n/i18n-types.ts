import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en-US';

export type Locales = 'en-US' | 'vi-VN';

export type Translation = {
	authenticate: {
		login: string;
		signup: string;
		email: string;
		password: string;
		error_title: string;
		missing_params: string;
		no_permission: string;
		validation_failed: string;
		welcome_title: string;
		welcome_desc: string;
	};
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			lookup_types: string;
		};
		logout: string;
	};
	crud_table: {
		create: string;
		filter: string;
		clear: string;
		and: string;
		or: string;
		loading: string;
		no_data: string;
		actions: string;
		view: string;
		edit: string;
		delete: string;
		prev: string;
		next: string;
		page_of: RequiredParams<'page' | 'total'>;
		select_placeholder: string;
		filter_value_placeholder: string;
		tags_placeholder: string;
		cancel: string;
		save: string;
		detail_title: string;
		close: string;
		edit_title: RequiredParams<'resource'>;
		create_title: RequiredParams<'resource'>;
		delete_confirm: string;
		yes: string;
		no: string;
	};
	confirm_modal: {
		default_message: string;
		confirm: string;
		cancel: string;
	};
	dashboard: {
		title: string;
		badge: string;
		description: string;
		quick_start: string;
		resources: {
			lookup_types: string;
		};
		resource_desc: {
			lookup_types: string;
		};
	};
	lookup_types_page: {
		title: string;
		col_code: string;
		col_name: string;
		col_description: string;
		col_active: string;
		col_tenant: string;
		view_items: string;
	};
	lookup_items_page: {
		title: string;
		type_label: string;
		col_code: string;
		col_name: string;
		col_active: string;
		col_sort_order: string;
		col_is_default: string;
		view_translations: string;
		back: string;
	};
	lookup_translations_page: {
		title: string;
		item_label: string;
		col_locale: string;
		col_name: string;
		back: string;
	};
};

export type TranslationFunctions = {
	authenticate: {
		login: () => LocalizedString;
		signup: () => LocalizedString;
		email: () => LocalizedString;
		password: () => LocalizedString;
		error_title: () => LocalizedString;
		missing_params: () => LocalizedString;
		no_permission: () => LocalizedString;
		validation_failed: () => LocalizedString;
		welcome_title: () => LocalizedString;
		welcome_desc: () => LocalizedString;
	};
	admin_panel: {
		title: () => LocalizedString;
		nav: {
			dashboard: () => LocalizedString;
			lookup_types: () => LocalizedString;
		};
		logout: () => LocalizedString;
	};
	crud_table: {
		create: () => LocalizedString;
		filter: () => LocalizedString;
		clear: () => LocalizedString;
		and: () => LocalizedString;
		or: () => LocalizedString;
		loading: () => LocalizedString;
		no_data: () => LocalizedString;
		actions: () => LocalizedString;
		view: () => LocalizedString;
		edit: () => LocalizedString;
		delete: () => LocalizedString;
		prev: () => LocalizedString;
		next: () => LocalizedString;
		page_of: (args: { page: number; total: number }) => LocalizedString;
		select_placeholder: () => LocalizedString;
		filter_value_placeholder: () => LocalizedString;
		tags_placeholder: () => LocalizedString;
		cancel: () => LocalizedString;
		save: () => LocalizedString;
		detail_title: () => LocalizedString;
		close: () => LocalizedString;
		edit_title: (args: { resource: string }) => LocalizedString;
		create_title: (args: { resource: string }) => LocalizedString;
		delete_confirm: () => LocalizedString;
		yes: () => LocalizedString;
		no: () => LocalizedString;
	};
	confirm_modal: {
		default_message: () => LocalizedString;
		confirm: () => LocalizedString;
		cancel: () => LocalizedString;
	};
	dashboard: {
		title: () => LocalizedString;
		badge: () => LocalizedString;
		description: () => LocalizedString;
		quick_start: () => LocalizedString;
		resources: {
			lookup_types: () => LocalizedString;
		};
		resource_desc: {
			lookup_types: () => LocalizedString;
		};
	};
	lookup_types_page: {
		title: () => LocalizedString;
		col_code: () => LocalizedString;
		col_name: () => LocalizedString;
		col_description: () => LocalizedString;
		col_active: () => LocalizedString;
		col_tenant: () => LocalizedString;
		view_items: () => LocalizedString;
	};
	lookup_items_page: {
		title: () => LocalizedString;
		type_label: () => LocalizedString;
		col_code: () => LocalizedString;
		col_name: () => LocalizedString;
		col_active: () => LocalizedString;
		col_sort_order: () => LocalizedString;
		col_is_default: () => LocalizedString;
		view_translations: () => LocalizedString;
		back: () => LocalizedString;
	};
	lookup_translations_page: {
		title: () => LocalizedString;
		item_label: () => LocalizedString;
		col_locale: () => LocalizedString;
		col_name: () => LocalizedString;
		back: () => LocalizedString;
	};
};

export type Formatters = Record<string, never>;
