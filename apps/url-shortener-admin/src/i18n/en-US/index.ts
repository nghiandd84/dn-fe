import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'URL Shortener Admin',
		nav: {
			dashboard: 'Dashboard',
			urls: 'Shortened URLs',
			api_keys: 'API Keys',
			url_clicks: 'Click Analytics'
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
		badge: 'URL Shortener Admin',
		resources: {
			urls: 'Shortened URLs',
			api_keys: 'API Keys',
			url_clicks: 'Click Analytics'
		},
		resource_desc: {
			urls: 'Create and manage shortened URLs with custom codes, expiry and active status',
			api_keys: 'Manage API keys for programmatic access to the URL shortener service',
			url_clicks: 'View click analytics: IP, user agent, referrer and country per redirect'
		}
	},
	urls_page: {
		title: 'Shortened URLs',
		col_id: 'ID',
		col_user_id: 'User ID',
		col_original_url: 'Original URL',
		col_short_code: 'Short Code',
		col_title: 'Title',
		col_is_active: 'Active',
		col_click_count: 'Clicks',
		col_expires_at: 'Expires At',
		col_created_at: 'Created At',
		col_updated_at: 'Updated At'
	},
	api_keys_page: {
		title: 'API Keys',
		col_id: 'ID',
		col_user_id: 'User ID',
		col_name: 'Name',
		col_is_active: 'Active',
		col_last_used_at: 'Last Used At',
		col_created_at: 'Created At',
		col_key: 'Key',
		key_note: 'The key is shown only once after creation.'
	},
	url_clicks_page: {
		title: 'Click Analytics',
		col_id: 'ID',
		col_url_id: 'URL ID',
		col_ip_address: 'IP Address',
		col_user_agent: 'User Agent',
		col_referrer: 'Referrer',
		col_country: 'Country',
		col_clicked_at: 'Clicked At'
	},
	crud_table: {
		filter: 'Filter',
		clear: 'Clear',
		loading: 'Loading...',
		no_data: 'No data',
		page_of: 'Page {page} / {total}',
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
		edit_title: 'Edit {resource}',
		create_title: 'Create {resource}',
		delete_confirm: 'Are you sure?',
		yes: 'Yes',
		no: 'No'
	}
};

export default en_US;
