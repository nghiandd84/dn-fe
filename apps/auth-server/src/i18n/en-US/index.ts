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
			field_permissions: 'Field Permissions',
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
	},
	field_permissions_page: {
		title: 'Field Permissions',
		col_role: 'Role',
		col_resource: 'Resource',
		col_action: 'Action',
		col_fields: 'Fields',
		no_fields: 'No fields',
		fields_placeholder: 'field name, Enter to add',
		created_at: 'Created',
		updated_at: 'Updated'
	},
	users_page: {
		title: 'Users',
		col_id: 'ID',
		col_email: 'Email',
		col_language: 'Language',
		col_roles: 'Roles',
		detail_title: 'User Details',
		roles_section: 'Roles',
		assigned: 'Assigned',
		available: 'Available',
		search_placeholder: 'Search…',
		none: 'None',
		loading: 'Loading…',
		unassign_confirm: 'Remove this role from the user?',
		assign_role_title: 'Assign Role',
		key_label: 'Key',
		key_optional: '(optional)',
		key_placeholder: 'e.g. admin, editor…',
		assign: 'Assign',
		cancel: 'Cancel'
	},
	dashboard: {
		title: 'Dashboard',
		badge: 'Auth Admin',
		quick_ref_title: 'Quick Reference',
		action_values_title: 'Action Values',
		field_action_values_title: 'Field Permission Actions',
		col_action: 'Action',
		col_bit: 'Bit',
		col_value: 'Value',
		col_description: 'Description',
		mask_note: 'Masks are bitmasks — combine by adding values. E.g. READ + UPDATE = {example:string}',
		resources: {
			users: 'Users',
			roles: 'Roles',
			permissions: 'Permissions',
			field_permissions: 'Field Permissions',
			clients: 'Clients',
			scopes: 'Scopes',
			tokens: 'Tokens',
			auth_codes: 'Auth Codes',
		},
		resource_desc: {
			users: 'registered accounts',
			roles: 'group permissions and assign to users',
			permissions: 'resource-level access masks (READ / CREATE / UPDATE / DELETE)',
			field_permissions: 'fine-grained field-level access per role and resource',
			clients: 'OAuth2 applications that use this auth server',
			scopes: 'OAuth2 scopes granted to clients',
			tokens: 'active access and refresh tokens',
			auth_codes: 'one-time authorization codes',
		},
		action_desc: {
			read: 'View records',
			create: 'Create new records',
			update: 'Modify existing records',
			delete: 'Remove records',
			admin: 'Full administrative access',
			field_read: 'Filter GET response fields',
			field_update: 'Restrict PATCH request fields',
		}
	}
};

export default en_US;
