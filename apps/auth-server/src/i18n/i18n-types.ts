import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en-US';

export type Locales = 'en-US' | 'vi-VN';

export type Translation = {
	auth: {
		login_success: string;
		login_failed: string;
		register_success: string;
		register_conflict: string;
		logout_success: string;
		unauthorized: string;
		forbidden: string;
	};
	validation: {
		required_field: RequiredParams<'field'>;
		invalid_format: RequiredParams<'field'>;
	};
	admin: {
		not_found: RequiredParams<'resource'>;
		created: RequiredParams<'resource'>;
		updated: RequiredParams<'resource'>;
		deleted: RequiredParams<'resource'>;
	};
	authenticate: {
		login: string;
		signup: string;
		email: string;
		password: string;
		language_label: string;
		no_account: string;
		has_account: string;
		switch_signup: string;
		switch_login: string;
		error_title: string;
		missing_params: string;
		no_permission: string;
		validation_failed: string;
	};
	activate: {
		title: string;
		description: string;
		code_label: string;
		submit: string;
		success: string;
		invalid_user: string;
		failed: string;
	};
	login_verify: {
		title: string;
		description: string;
		invalid_user: string;
		code_label: string;
		submit: string;
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
	users_page: {
		title: string;
		col_id: string;
		col_email: string;
		col_language: string;
		col_roles: string;
		detail_title: string;
		roles_section: string;
		assigned: string;
		available: string;
		search_placeholder: string;
		none: string;
		loading: string;
		unassign_confirm: string;
		assign_role_title: string;
		key_label: string;
		key_optional: string;
		key_placeholder: string;
		assign: string;
		cancel: string;
	};
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			clients: string;
			roles: string;
			permissions: string;
			field_permissions: string;
			scopes: string;
			users: string;
			auth_codes: string;
			tokens: string;
		};
		logout: string;
	};
	dashboard: {
		title: string;
		badge: string;
		quick_ref_title: string;
		action_values_title: string;
		field_action_values_title: string;
		col_action: string;
		col_bit: string;
		col_value: string;
		col_description: string;
		mask_note: RequiredParams<'example'>;
		resources: {
			users: string;
			roles: string;
			permissions: string;
			field_permissions: string;
			clients: string;
			scopes: string;
			tokens: string;
			auth_codes: string;
		};
		resource_desc: {
			users: string;
			roles: string;
			permissions: string;
			field_permissions: string;
			clients: string;
			scopes: string;
			tokens: string;
			auth_codes: string;
		};
		action_desc: {
			read: string;
			create: string;
			update: string;
			delete: string;
			admin: string;
			field_read: string;
			field_update: string;
		};
	};
};

export type TranslationFunctions = {
	auth: {
		login_success: () => LocalizedString;
		login_failed: () => LocalizedString;
		register_success: () => LocalizedString;
		register_conflict: () => LocalizedString;
		logout_success: () => LocalizedString;
		unauthorized: () => LocalizedString;
		forbidden: () => LocalizedString;
	};
	validation: {
		required_field: (arg: { field: string }) => LocalizedString;
		invalid_format: (arg: { field: string }) => LocalizedString;
	};
	admin: {
		not_found: (arg: { resource: string }) => LocalizedString;
		created: (arg: { resource: string }) => LocalizedString;
		updated: (arg: { resource: string }) => LocalizedString;
		deleted: (arg: { resource: string }) => LocalizedString;
	};
	authenticate: {
		login: () => LocalizedString;
		signup: () => LocalizedString;
		email: () => LocalizedString;
		password: () => LocalizedString;
		language_label: () => LocalizedString;
		no_account: () => LocalizedString;
		has_account: () => LocalizedString;
		switch_signup: () => LocalizedString;
		switch_login: () => LocalizedString;
		error_title: () => LocalizedString;
		missing_params: () => LocalizedString;
		no_permission: () => LocalizedString;
		validation_failed: () => LocalizedString;
	};
	activate: {
		title: () => LocalizedString;
		description: () => LocalizedString;
		code_label: () => LocalizedString;
		submit: () => LocalizedString;
		success: () => LocalizedString;
		invalid_user: () => LocalizedString;
		failed: () => LocalizedString;
	};
	login_verify: {
		title: () => LocalizedString;
		description: () => LocalizedString;
		invalid_user: () => LocalizedString;
		code_label: () => LocalizedString;
		submit: () => LocalizedString;
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
	users_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_email: () => LocalizedString;
		col_language: () => LocalizedString;
		col_roles: () => LocalizedString;
		detail_title: () => LocalizedString;
		roles_section: () => LocalizedString;
		assigned: () => LocalizedString;
		available: () => LocalizedString;
		search_placeholder: () => LocalizedString;
		none: () => LocalizedString;
		loading: () => LocalizedString;
		unassign_confirm: () => LocalizedString;
		assign_role_title: () => LocalizedString;
		key_label: () => LocalizedString;
		key_optional: () => LocalizedString;
		key_placeholder: () => LocalizedString;
		assign: () => LocalizedString;
		cancel: () => LocalizedString;
	};
	admin_panel: {
		title: () => LocalizedString;
		nav: {
			dashboard: () => LocalizedString;
			clients: () => LocalizedString;
			roles: () => LocalizedString;
			permissions: () => LocalizedString;
			field_permissions: () => LocalizedString;
			scopes: () => LocalizedString;
			users: () => LocalizedString;
			auth_codes: () => LocalizedString;
			tokens: () => LocalizedString;
		};
		logout: () => LocalizedString;
	};
	dashboard: {
		title: () => LocalizedString;
		badge: () => LocalizedString;
		quick_ref_title: () => LocalizedString;
		action_values_title: () => LocalizedString;
		field_action_values_title: () => LocalizedString;
		col_action: () => LocalizedString;
		col_bit: () => LocalizedString;
		col_value: () => LocalizedString;
		col_description: () => LocalizedString;
		mask_note: (arg: { example: string }) => LocalizedString;
		resources: {
			users: () => LocalizedString;
			roles: () => LocalizedString;
			permissions: () => LocalizedString;
			field_permissions: () => LocalizedString;
			clients: () => LocalizedString;
			scopes: () => LocalizedString;
			tokens: () => LocalizedString;
			auth_codes: () => LocalizedString;
		};
		resource_desc: {
			users: () => LocalizedString;
			roles: () => LocalizedString;
			permissions: () => LocalizedString;
			field_permissions: () => LocalizedString;
			clients: () => LocalizedString;
			scopes: () => LocalizedString;
			tokens: () => LocalizedString;
			auth_codes: () => LocalizedString;
		};
		action_desc: {
			read: () => LocalizedString;
			create: () => LocalizedString;
			update: () => LocalizedString;
			delete: () => LocalizedString;
			admin: () => LocalizedString;
			field_read: () => LocalizedString;
			field_update: () => LocalizedString;
		};
	};
};

export type Formatters = Record<never, never>;
