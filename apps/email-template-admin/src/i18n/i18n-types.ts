import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en-US';

export type Locales = 'en-US' | 'vi-VN';

export type Translation = {
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			email_templates: string;
			template_placeholders: string;
			template_translations: string;
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
			email_templates: string;
			template_placeholders: string;
			template_translations: string;
		};
		resource_desc: {
			email_templates: string;
			template_placeholders: string;
			template_translations: string;
		};
	};
	email_templates_page: {
		title: string;
		col_id: string;
		col_name: string;
		col_key: string;
		col_description: string;
		col_is_active: string;
		col_user_id: string;
	};
	template_placeholders_page: {
		title: string;
		col_id: string;
		col_template_id: string;
		col_placeholder_key: string;
		col_description: string;
		col_example_value: string;
		col_is_required: string;
		col_created_at: string;
		col_updated_at: string;
	};
	template_translations_page: {
		title: string;
		col_id: string;
		col_template_id: string;
		col_language_code: string;
		col_subject: string;
		col_body: string;
		col_version_name: string;
		col_created_at: string;
		col_updated_at: string;
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
			email_templates: () => LocalizedString;
			template_placeholders: () => LocalizedString;
			template_translations: () => LocalizedString;
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
			email_templates: () => LocalizedString;
			template_placeholders: () => LocalizedString;
			template_translations: () => LocalizedString;
		};
		resource_desc: {
			email_templates: () => LocalizedString;
			template_placeholders: () => LocalizedString;
			template_translations: () => LocalizedString;
		};
	};
	email_templates_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_name: () => LocalizedString;
		col_key: () => LocalizedString;
		col_description: () => LocalizedString;
		col_is_active: () => LocalizedString;
		col_user_id: () => LocalizedString;
	};
	template_placeholders_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_template_id: () => LocalizedString;
		col_placeholder_key: () => LocalizedString;
		col_description: () => LocalizedString;
		col_example_value: () => LocalizedString;
		col_is_required: () => LocalizedString;
		col_created_at: () => LocalizedString;
		col_updated_at: () => LocalizedString;
	};
	template_translations_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_template_id: () => LocalizedString;
		col_language_code: () => LocalizedString;
		col_subject: () => LocalizedString;
		col_body: () => LocalizedString;
		col_version_name: () => LocalizedString;
		col_created_at: () => LocalizedString;
		col_updated_at: () => LocalizedString;
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
