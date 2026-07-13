import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	auth: {
		login_success: 'Login successful',
		login_failed: 'Invalid email or password',
		register_success: 'Registration successful',
		register_conflict: 'User already exists',
		logout_success: 'Logged out',
		unauthorized: 'Authentication required',
		forbidden: 'Access denied'
	},
	validation: {
		required_field: '{field:string} is required',
		invalid_format: 'Invalid {field:string} format'
	},
	admin: {
		not_found: '{resource:string} not found',
		created: '{resource:string} created',
		updated: '{resource:string} updated',
		deleted: '{resource:string} deleted'
	},
	authenticate: {
		login: 'Login',
		signup: 'Sign Up',
		email: 'Email',
		password: 'Password',
		language_label: 'Language',
		no_account: "Don't have an account?",
		has_account: 'Already have an account?',
		switch_signup: 'Sign Up',
		switch_login: 'Login',
		error_title: 'Error',
		missing_params: 'Missing required parameters: client_id, scope, redirect_url, and screen are required.',
		no_permission: 'You do not have permission to access the admin panel.',
		validation_failed: 'Invalid request parameters: '
	},
	activate: {
		title: 'Activate Account',
		description: 'Enter the activation code sent to your email.',
		code_label: 'Activation Code',
		submit: 'Activate',
		success: 'Account activated. You can now log in.',
		invalid_user: 'Invalid or missing user ID.',
		failed: 'Activation failed. Please check your code and try again.'
	},
	login_verify: {
		title: 'Check your email',
		description: 'Enter the login code sent to your email.',
		invalid_user: 'Invalid or missing user.',
		code_label: 'Login Code',
		submit: 'Verify'
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
	admin_panel: {
		title: 'Auth Admin',
		nav: {
			dashboard: 'Dashboard',
			clients: 'Clients',
			roles: 'Roles',
			permissions: 'Permissions',
			scopes: 'Scopes',
			users: 'Users',
			auth_codes: 'Auth Codes',
			tokens: 'Tokens'
		},
		logout: 'Logout'
	},
	crud_table: {
		create: '+ Create',
		filter: 'Filter',
		clear: 'Clear',
		and: 'AND',
		or: 'OR',
		loading: 'Loading...',
		no_data: 'No data',
		actions: 'Actions',
		view: 'View',
		edit: 'Edit',
		delete: 'Delete',
		prev: '← Prev',
		next: 'Next →',
		page_of: 'Page {page:number} / {total:number}',
		select_placeholder: '-- Select --',
		filter_value_placeholder: 'value',
		tags_placeholder: 'comma separated',
		cancel: 'Cancel',
		save: 'Save',
		detail_title: 'Detail',
		close: 'Close',
		edit_title: 'Edit {resource:string}',
		create_title: 'Create {resource:string}',
		delete_confirm: 'Are you sure?',
		yes: 'Yes',
		no: 'No'
	},
	confirm_modal: {
		default_message: 'Are you sure?',
		confirm: 'Confirm',
		cancel: 'Cancel'
	},
	roles_page: {
		title: 'Roles',
		permissions_section: 'Permissions',
		loading_permissions: 'Loading permissions…',
		assigned: 'Assigned',
		available: 'Available',
		none: 'None',
		loading: 'Loading…',
		search_placeholder: 'Search…',
		search_api_placeholder: 'Search API…',
		unassign_confirm: 'Remove this permission from the role?',
		new_permission_resource: 'Resource *',
		new_permission_description: 'Description'
	},
	permissions_page: {
		title: 'Permissions',
		mask_label: 'Mask',
		mask_value: 'mask = {value:number}'
	}
};

export default en_US;
