import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'Event Admin',
		nav: {
			dashboard: 'Dashboard',
			events: 'Events'
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
		badge: 'Event Admin',
		resources: {
			events: 'Events'
		},
		resource_desc: {
			events: 'Manage events: name, date, venue, seats, status, and sale start time'
		}
	},
	events_page: {
		title: 'Events',
		col_id: 'ID',
		col_event_name: 'Event Name',
		col_event_date: 'Event Date',
		col_venue_name: 'Venue',
		col_total_seats: 'Total Seats',
		col_status: 'Status',
		col_sale_start_time: 'Sale Start',
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
