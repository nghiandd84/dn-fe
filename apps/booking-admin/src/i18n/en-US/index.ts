import type { BaseTranslation } from '../i18n-types';

const en_US: BaseTranslation = {
	admin_panel: {
		title: 'Booking Admin',
		nav: {
			dashboard: 'Dashboard',
			bookings: 'Bookings',
			booking_seats: 'Booking Seats',
			slots: 'Slots'
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
		badge: 'Booking Admin',
		resources: {
			bookings: 'Bookings',
			booking_seats: 'Booking Seats',
			slots: 'Slots'
		},
		resource_desc: {
			bookings: 'Manage bookings: event, user, amount, status, payment, and reference',
			booking_seats: 'Manage booking seats: booking, seat, and price details',
			slots: 'Manage available time slots'
		}
	},
	bookings_page: {
		title: 'Bookings',
		col_id: 'ID',
		col_event_id: 'Event ID',
		col_user_id: 'User ID',
		col_total_amount: 'Total Amount',
		col_status: 'Status',
		col_payment_id: 'Payment ID',
		col_payment_status: 'Payment Status',
		col_booking_reference: 'Reference',
		col_currency: 'Currency',
		col_confirmed_at: 'Confirmed At',
		col_created_at: 'Created At',
		col_updated_at: 'Updated At'
	},
	booking_seats_page: {
		title: 'Booking Seats',
		col_id: 'ID',
		col_booking_id: 'Booking ID',
		col_seat_id: 'Seat ID',
		col_price: 'Price',
		col_created_at: 'Created At'
	},
	slots_page: {
		title: 'Slots',
		col_id: 'ID'
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
