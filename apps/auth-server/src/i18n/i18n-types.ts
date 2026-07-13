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
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			clients: string;
			roles: string;
			permissions: string;
			scopes: string;
			users: string;
			auth_codes: string;
			tokens: string;
		};
		logout: string;
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
	admin_panel: {
		title: () => LocalizedString;
		nav: {
			dashboard: () => LocalizedString;
			clients: () => LocalizedString;
			roles: () => LocalizedString;
			permissions: () => LocalizedString;
			scopes: () => LocalizedString;
			users: () => LocalizedString;
			auth_codes: () => LocalizedString;
			tokens: () => LocalizedString;
		};
		logout: () => LocalizedString;
	};
};

export type Formatters = Record<never, never>;
