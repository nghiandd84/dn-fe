import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en-US';

export type Locales = 'en-US' | 'vi-VN';

export type Translation = {
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			urls: string;
			api_keys: string;
			url_clicks: string;
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
			urls: string;
			api_keys: string;
			url_clicks: string;
		};
		resource_desc: {
			urls: string;
			api_keys: string;
			url_clicks: string;
		};
	};
	urls_page: {
		title: string;
		col_id: string;
		col_user_id: string;
		col_original_url: string;
		col_short_code: string;
		col_title: string;
		col_is_active: string;
		col_click_count: string;
		col_expires_at: string;
		col_created_at: string;
		col_updated_at: string;
	};
	api_keys_page: {
		title: string;
		col_id: string;
		col_user_id: string;
		col_name: string;
		col_is_active: string;
		col_last_used_at: string;
		col_created_at: string;
		col_key: string;
		key_note: string;
	};
	url_clicks_page: {
		title: string;
		col_id: string;
		col_url_id: string;
		col_ip_address: string;
		col_user_agent: string;
		col_referrer: string;
		col_country: string;
		col_clicked_at: string;
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
			urls: () => LocalizedString;
			api_keys: () => LocalizedString;
			url_clicks: () => LocalizedString;
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
			urls: () => LocalizedString;
			api_keys: () => LocalizedString;
			url_clicks: () => LocalizedString;
		};
		resource_desc: {
			urls: () => LocalizedString;
			api_keys: () => LocalizedString;
			url_clicks: () => LocalizedString;
		};
	};
	urls_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_user_id: () => LocalizedString;
		col_original_url: () => LocalizedString;
		col_short_code: () => LocalizedString;
		col_title: () => LocalizedString;
		col_is_active: () => LocalizedString;
		col_click_count: () => LocalizedString;
		col_expires_at: () => LocalizedString;
		col_created_at: () => LocalizedString;
		col_updated_at: () => LocalizedString;
	};
	api_keys_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_user_id: () => LocalizedString;
		col_name: () => LocalizedString;
		col_is_active: () => LocalizedString;
		col_last_used_at: () => LocalizedString;
		col_created_at: () => LocalizedString;
		col_key: () => LocalizedString;
		key_note: () => LocalizedString;
	};
	url_clicks_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_url_id: () => LocalizedString;
		col_ip_address: () => LocalizedString;
		col_user_agent: () => LocalizedString;
		col_referrer: () => LocalizedString;
		col_country: () => LocalizedString;
		col_clicked_at: () => LocalizedString;
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
