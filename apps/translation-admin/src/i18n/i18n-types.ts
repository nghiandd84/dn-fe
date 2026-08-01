import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en-US';

export type Locales = 'en-US' | 'vi-VN';

export type Translation = {
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			projects: string;
			tags: string;
			translation_keys: string;
			translation_versions: string;
		};
		logout: string;
	};
	authenticate: {
		error_title: string;
		missing_params: string;
		welcome_title: string;
		welcome_desc: string;
		login: string;
		signup: string;
		email: string;
		password: string;
		language_label: string;
		no_account: string;
		switch_signup: string;
		has_account: string;
		switch_login: string;
		no_permission: string;
		validation_failed: string;
	};
	authenticate_result: {
		title_success: string;
		title_failed: string;
		access_token: string;
		refresh_token: string;
		permissions: string;
		col_resource: string;
		col_mask: string;
		col_description: string;
	};
	dashboard: {
		title: string;
		badge: string;
		resources: {
			projects: string;
			tags: string;
			translation_keys: string;
			translation_versions: string;
		};
		resource_desc: {
			projects: string;
			tags: string;
			translation_keys: string;
			translation_versions: string;
		};
	};
	project_detail_layout: {
		back: string;
		not_found: string;
		tab_translation_keys: string;
	};
	projects_page: {
		title: string;
		col_id: string;
		col_name: string;
		col_api_key: string;
		col_default_locale: string;
		col_created_at: string;
	};
	tags_page: {
		title: string;
		col_id: string;
		col_name: string;
	};
	translation_keys_page: {
		title: string;
		col_id: string;
		col_key_name: string;
		col_description: string;
		col_project_id: string;
	};
	translation_versions_page: {
		title: string;
		col_id: string;
		col_key_id: string;
		col_locale: string;
		col_content: string;
		col_version_number: string;
		col_status: string;
		col_created_by: string;
		col_created_at: string;
	};
	crud_table: {
		filter: string;
		clear: string;
		loading: string;
		no_data: string;
		page_of: RequiredParams<'page' | 'total'>;
		prev: string;
		next: string;
		actions: string;
		save: string;
		cancel: string;
		create: string;
		edit: string;
		delete: string;
		detail: string;
		confirm_delete: string;
		and: string;
		or: string;
		view: string;
		select_placeholder: string;
		filter_value_placeholder: string;
		tags_placeholder: string;
		detail_title: string;
		close: string;
		edit_title: RequiredParams<'resource'>;
		create_title: RequiredParams<'resource'>;
		delete_confirm: string;
		yes: string;
		no: string;
	};
};

export type TranslationFunctions = {
	admin_panel: {
		title: () => LocalizedString;
		nav: {
			dashboard: () => LocalizedString;
			projects: () => LocalizedString;
			tags: () => LocalizedString;
			translation_keys: () => LocalizedString;
			translation_versions: () => LocalizedString;
		};
		logout: () => LocalizedString;
	};
	authenticate: {
		error_title: () => LocalizedString;
		missing_params: () => LocalizedString;
		welcome_title: () => LocalizedString;
		welcome_desc: () => LocalizedString;
		login: () => LocalizedString;
		signup: () => LocalizedString;
		email: () => LocalizedString;
		password: () => LocalizedString;
		language_label: () => LocalizedString;
		no_account: () => LocalizedString;
		switch_signup: () => LocalizedString;
		has_account: () => LocalizedString;
		switch_login: () => LocalizedString;
		no_permission: () => LocalizedString;
		validation_failed: () => LocalizedString;
	};
	authenticate_result: {
		title_success: () => LocalizedString;
		title_failed: () => LocalizedString;
		access_token: () => LocalizedString;
		refresh_token: () => LocalizedString;
		permissions: () => LocalizedString;
		col_resource: () => LocalizedString;
		col_mask: () => LocalizedString;
		col_description: () => LocalizedString;
	};
	dashboard: {
		title: () => LocalizedString;
		badge: () => LocalizedString;
		resources: {
			projects: () => LocalizedString;
			tags: () => LocalizedString;
			translation_keys: () => LocalizedString;
			translation_versions: () => LocalizedString;
		};
		resource_desc: {
			projects: () => LocalizedString;
			tags: () => LocalizedString;
			translation_keys: () => LocalizedString;
			translation_versions: () => LocalizedString;
		};
	};
	project_detail_layout: {
		back: () => LocalizedString;
		not_found: () => LocalizedString;
		tab_translation_keys: () => LocalizedString;
	};
	projects_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_name: () => LocalizedString;
		col_api_key: () => LocalizedString;
		col_default_locale: () => LocalizedString;
		col_created_at: () => LocalizedString;
	};
	tags_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_name: () => LocalizedString;
	};
	translation_keys_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_key_name: () => LocalizedString;
		col_description: () => LocalizedString;
		col_project_id: () => LocalizedString;
	};
	translation_versions_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_key_id: () => LocalizedString;
		col_locale: () => LocalizedString;
		col_content: () => LocalizedString;
		col_version_number: () => LocalizedString;
		col_status: () => LocalizedString;
		col_created_by: () => LocalizedString;
		col_created_at: () => LocalizedString;
	};
	crud_table: {
		filter: () => LocalizedString;
		clear: () => LocalizedString;
		loading: () => LocalizedString;
		no_data: () => LocalizedString;
		page_of: (arg: { page: number; total: number }) => LocalizedString;
		prev: () => LocalizedString;
		next: () => LocalizedString;
		actions: () => LocalizedString;
		save: () => LocalizedString;
		cancel: () => LocalizedString;
		create: () => LocalizedString;
		edit: () => LocalizedString;
		delete: () => LocalizedString;
		detail: () => LocalizedString;
		confirm_delete: () => LocalizedString;
		and: () => LocalizedString;
		or: () => LocalizedString;
		view: () => LocalizedString;
		select_placeholder: () => LocalizedString;
		filter_value_placeholder: () => LocalizedString;
		tags_placeholder: () => LocalizedString;
		detail_title: () => LocalizedString;
		close: () => LocalizedString;
		edit_title: (arg: { resource: string }) => LocalizedString;
		create_title: (arg: { resource: string }) => LocalizedString;
		delete_confirm: () => LocalizedString;
		yes: () => LocalizedString;
		no: () => LocalizedString;
	};
};

export type Formatters = Record<string, never>;
