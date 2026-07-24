import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'Profile Admin',
		nav: {
			dashboard: 'Dashboard',
			profiles: 'Profiles',
			social_links: 'Social Links',
			user_preferences: 'User Preferences'
		},
		logout: 'Logout'
	},
	authenticate: {
		error_title: 'Error',
		missing_params: 'Missing required parameters: client_id and redirect_url are required.',
		welcome_title: 'Welcome',
		welcome_desc: 'Please login or register to continue.',
		login: 'Login',
		signup: 'Register',
		email: 'Email',
		password: 'Password',
		language_label: 'Language',
		no_account: "Don't have an account?",
		switch_signup: 'Sign up here',
		has_account: 'Already have an account?',
		switch_login: 'Sign in here',
		no_permission: 'You do not have permission to access this panel.',
		validation_failed: 'Invalid request: '
	},
	authenticate_result: {
		title_success: 'Authentication Successful',
		title_failed: 'Authentication Failed',
		access_token: 'Access Token',
		refresh_token: 'Refresh Token',
		permissions: 'Permissions',
		col_resource: 'Resource',
		col_mask: 'Mask',
		col_description: 'Description'
	},
	dashboard: {
		title: 'Dashboard',
		badge: 'Profile Admin',
		card_profiles: 'Profiles',
		card_social_links: 'Social Links',
		card_user_preferences: 'User Preferences',
		desc_profiles: 'Manage user profiles and personal information',
		desc_social_links: 'Manage social media links and connections',
		desc_user_preferences: 'Configure user settings and preferences'
	},
	profiles_page: {
		title: 'Profiles',
		col_id: 'ID',
		col_user_id: 'User ID',
		col_first_name: 'First Name',
		col_last_name: 'Last Name',
		col_bio: 'Bio',
		col_avatar_url: 'Avatar URL',
		col_location: 'Location'
	},
	social_links_page: {
		title: 'Social Links',
		col_id: 'ID',
		col_profile_id: 'Profile ID',
		col_platform: 'Platform',
		col_url: 'URL'
	},
	user_preferences_page: {
		title: 'User Preferences',
		col_id: 'ID',
		col_profile_id: 'Profile ID',
		col_language: 'Language',
		col_theme: 'Theme',
		col_notifications: 'Notifications',
		col_notifications_enabled: 'Notifications'
	},
	crud_table: {
		filter: 'Filter',
		clear: 'Clear',
		loading: 'Loading...',
		no_data: 'No data',
		page_of: 'Page {page:number} / {total:number}',
		prev: '← Prev',
		next: 'Next →',
		actions: 'Actions',
		save: 'Save',
		cancel: 'Cancel',
		create: '+ Create',
		edit: 'Edit',
		delete: 'Delete',
		detail: 'Detail',
		confirm_delete: 'Are you sure?',
		and: 'AND',
		or: 'OR',
		view: 'View',
		select_placeholder: '-- Select --',
		filter_value_placeholder: 'value',
		tags_placeholder: 'comma separated',
		detail_title: 'Detail',
		close: 'Close',
		edit_title: 'Edit {resource:string}',
		create_title: 'Create {resource:string}',
		delete_confirm: 'Are you sure?',
		yes: 'Yes',
		no: 'No'
	}
};

export default en_US;
