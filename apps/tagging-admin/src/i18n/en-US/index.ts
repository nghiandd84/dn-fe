import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'Tagging Admin',
		nav: {
			dashboard: 'Dashboard',
			tag_groups: 'Tag Groups',
			tags: 'Tags',
			entity_tags: 'Entity Tags'
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
		badge: 'Tagging Admin',
		resources: {
			tag_groups: 'Tag Groups',
			tags: 'Tags',
			entity_tags: 'Entity Tags'
		},
		resource_desc: {
			tag_groups: 'Manage tag groups: hierarchical categories (group → sub-group) for organizing tags',
			tags: 'Manage tags: individual labels with slugs, colors, and group associations',
			entity_tags: 'Manage entity tag associations: link tags to any entity type (event, merchant, etc.)'
		}
	},
	tag_groups_page: {
		title: 'Tag Groups',
		col_id: 'ID',
		col_code: 'Code',
		col_name: 'Name',
		col_description: 'Description',
		col_parent_group: 'Parent Group',
		col_sort_order: 'Sort Order',
		col_tenant_id: 'Tenant ID',
		col_created_at: 'Created At',
		col_updated_at: 'Updated At'
	},
	tags_page: {
		title: 'Tags',
		col_id: 'ID',
		col_tag_group: 'Tag Group',
		col_name: 'Name',
		col_slug: 'Slug',
		col_color: 'Color',
		col_description: 'Description',
		col_sort_order: 'Sort Order',
		col_is_active: 'Active',
		col_alias_of: 'Alias Of',
		col_usage_count: 'Usage Count',
		col_tenant_id: 'Tenant ID',
		col_created_at: 'Created At',
		col_updated_at: 'Updated At'
	},
	entity_tags_page: {
		title: 'Entity Tags',
		col_id: 'ID',
		col_tag: 'Tag',
		col_entity_type: 'Entity Type',
		col_entity: 'Entity',
		col_tenant_id: 'Tenant ID',
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
