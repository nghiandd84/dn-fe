import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'Email Template Admin',
		nav: {
			dashboard: 'Dashboard',
			email_templates: 'Email Templates',
			template_placeholders: 'Placeholders',
			template_translations: 'Translations'
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
		badge: 'Email Template Admin',
		resources: {
			email_templates: 'Email Templates',
			template_placeholders: 'Placeholders',
			template_translations: 'Translations'
		},
		resource_desc: {
			email_templates: 'Manage email templates for transactional and marketing emails',
			template_placeholders: 'Define dynamic placeholders used in email templates',
			template_translations: 'Manage multilingual translations for email templates'
		}
	},
	email_templates_page: {
		title: 'Email Templates',
		col_id: 'ID',
		col_name: 'Name',
		col_key: 'Key',
		col_description: 'Description',
		col_is_active: 'Active',
		col_user_id: 'User ID',
		manage: 'Manage'
	},
	email_template_detail_layout: {
		tab_placeholders: 'Placeholders',
		tab_translations: 'Translations',
		back: '← Back to Templates',
		not_found: 'Template not found'
	},
	template_placeholders_page: {
		title: 'Template Placeholders',
		col_id: 'ID',
		col_template_id: 'Template Name',
		col_placeholder_key: 'Placeholder Key',
		col_description: 'Description',
		col_example_value: 'Example Value',
		col_is_required: 'Required',
		col_created_at: 'Created At',
		col_updated_at: 'Updated At'
	},
	template_translations_page: {
		title: 'Template Translations',
		col_id: 'ID',
		col_template_id: 'Template Name',
		col_language_code: 'Language',
		col_subject: 'Subject',
		col_body: 'Body',
		col_version_name: 'Version',
		col_created_at: 'Created At',
		col_updated_at: 'Updated At'
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
