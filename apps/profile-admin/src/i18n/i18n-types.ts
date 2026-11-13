import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en-US';

export type Locales = 'en-US' | 'vi-VN';

export type Translation = {
	admin_panel: {
		title: string;
		nav: {
			dashboard: string;
			profiles: string;
			social_links: string;
			user_preferences: string;
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
		card_profiles: string;
		card_social_links: string;
		card_user_preferences: string;
		desc_profiles: string;
		desc_social_links: string;
		desc_user_preferences: string;
	};
	profiles_page: {
		title: string;
		col_id: string;
		col_user_id: string;
		col_first_name: string;
		col_last_name: string;
		col_bio: string;
		col_avatar_url: string;
		col_location: string;
	};
	social_links_page: {
		title: string;
		col_id: string;
		col_profile_id: string;
		col_platform: string;
		col_url: string;
	};
	user_preferences_page: {
		title: string;
		col_id: string;
		col_profile_id: string;
		col_language: string;
		col_theme: string;
		col_notifications: string;
		col_notifications_enabled: string;
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
			profiles: () => LocalizedString;
			social_links: () => LocalizedString;
			user_preferences: () => LocalizedString;
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
		card_profiles: () => LocalizedString;
		card_social_links: () => LocalizedString;
		card_user_preferences: () => LocalizedString;
		desc_profiles: () => LocalizedString;
		desc_social_links: () => LocalizedString;
		desc_user_preferences: () => LocalizedString;
	};
	profiles_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_user_id: () => LocalizedString;
		col_first_name: () => LocalizedString;
		col_last_name: () => LocalizedString;
		col_bio: () => LocalizedString;
		col_avatar_url: () => LocalizedString;
		col_location: () => LocalizedString;
	};
	social_links_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_profile_id: () => LocalizedString;
		col_platform: () => LocalizedString;
		col_url: () => LocalizedString;
	};
	user_preferences_page: {
		title: () => LocalizedString;
		col_id: () => LocalizedString;
		col_profile_id: () => LocalizedString;
		col_language: () => LocalizedString;
		col_theme: () => LocalizedString;
		col_notifications: () => LocalizedString;
		col_notifications_enabled: () => LocalizedString;
	};
	crud_table: {
		filter: () => LocalizedString;
		clear: () => LocalizedString;
		loading: () => LocalizedString;
		no_data: () => LocalizedString;
		page_of: (args: { page: number; total: number }) => LocalizedString;
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
		edit_title: (args: { resource: string }) => LocalizedString;
		create_title: (args: { resource: string }) => LocalizedString;
		delete_confirm: () => LocalizedString;
		yes: () => LocalizedString;
		no: () => LocalizedString;
	};
};

export type Formatters = Record<string, never>;
