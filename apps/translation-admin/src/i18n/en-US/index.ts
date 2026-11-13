import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'Translation Admin',
		nav: {
			dashboard: 'Dashboard',
			projects: 'Projects',
			tags: 'Tags',
			translation_keys: 'Translation Keys',
			translation_versions: 'Translation Versions'
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
		badge: 'Translation Admin',
		resources: {
			projects: 'Projects',
			tags: 'Tags',
			translation_keys: 'Translation Keys',
			translation_versions: 'Translation Versions'
		},
		resource_desc: {
			projects: 'Manage translation projects and their API keys',
			tags: 'Organize translation keys using reusable tags',
			translation_keys: 'Manage translation key names and descriptions per project',
			translation_versions: 'Manage localized content versions for each translation key'
		}
	},
	project_detail_layout: {
		back: '← Back to Projects',
		not_found: 'Project not found',
		tab_translation_keys: 'Translation Keys'
	},
	projects_page: {
		title: 'Projects',
		col_id: 'ID',
		col_name: 'Name',
		col_api_key: 'API Key',
		col_default_locale: 'Default Locale',
		col_created_at: 'Created At'
	},
	tags_page: {
		title: 'Tags',
		col_id: 'ID',
		col_name: 'Name'
	},
	translation_keys_page: {
		title: 'Translation Keys',
		col_id: 'ID',
		col_key_name: 'Key Name',
		col_description: 'Description',
		col_project_id: 'Project ID'
	},
	translation_versions_page: {
		title: 'Translation Versions',
		col_id: 'ID',
		col_key_id: 'Key ID',
		col_locale: 'Locale',
		col_content: 'Content',
		col_version_number: 'Version',
		col_status: 'Status',
		col_created_by: 'Created By',
		col_created_at: 'Created At'
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
