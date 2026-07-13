import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	auth: {
		login_success: 'Đăng nhập thành công',
		login_failed: 'Email hoặc mật khẩu không hợp lệ',
		register_success: 'Đăng ký thành công',
		register_conflict: 'Người dùng đã tồn tại',
		logout_success: 'Đã đăng xuất',
		unauthorized: 'Yêu cầu xác thực',
		forbidden: 'Truy cập bị từ chối'
	},
	validation: {
		required_field: '{field:string} là bắt buộc',
		invalid_format: '{field:string} không đúng định dạng'
	},
	admin: {
		not_found: 'Không tìm thấy {resource:string}',
		created: '{resource:string} đã được tạo',
		updated: '{resource:string} đã được cập nhật',
		deleted: '{resource:string} đã được xóa'
	},
	authenticate: {
		login: 'Đăng nhập',
		signup: 'Đăng ký',
		email: 'Email',
		password: 'Mật khẩu',
		language_label: 'Ngôn ngữ',
		no_account: 'Chưa có tài khoản?',
		has_account: 'Đã có tài khoản?',
		switch_signup: 'Đăng ký',
		switch_login: 'Đăng nhập',
		error_title: 'Lỗi',
		missing_params: 'Thiếu tham số bắt buộc: client_id, scope, redirect_url và screen là bắt buộc.',
		no_permission: 'Bạn không có quyền truy cập trang quản trị.',
		validation_failed: 'Tham số không hợp lệ: '
	},
	activate: {
		title: 'Kích hoạt tài khoản',
		description: 'Nhập mã kích hoạt đã được gửi đến email của bạn.',
		code_label: 'Mã kích hoạt',
		submit: 'Kích hoạt',
		success: 'Tài khoản đã được kích hoạt. Bạn có thể đăng nhập ngay.',
		invalid_user: 'ID người dùng không hợp lệ hoặc bị thiếu.',
		failed: 'Kích hoạt thất bại. Vui lòng kiểm tra mã và thử lại.'
	},
	login_verify: {
		title: 'Kiểm tra email của bạn',
		description: 'Nhập mã đăng nhập đã được gửi đến email của bạn.',
		invalid_user: 'Người dùng không hợp lệ hoặc bị thiếu.',
		code_label: 'Mã đăng nhập',
		submit: 'Xác minh'
	},
	authenticate_result: {
		title_success: 'Xác thực thành công',
		title_failed: 'Xác thực thất bại',
		access_token: 'Access Token',
		refresh_token: 'Refresh Token',
		permissions: 'Quyền',
		col_resource: 'Tài nguyên',
		col_mask: 'Mặt nạ',
		col_description: 'Mô tả'
	},
	admin_panel: {
		title: 'Quản trị Auth',
		nav: {
			dashboard: 'Tổng quan',
			clients: 'Clients',
			roles: 'Vai trò',
			permissions: 'Quyền hạn',
			scopes: 'Phạm vi',
			users: 'Người dùng',
			auth_codes: 'Mã xác thực',
			tokens: 'Tokens'
		},
		logout: 'Đăng xuất'
	},
	crud_table: {
		create: '+ Tạo mới',
		filter: 'Lọc',
		clear: 'Xóa lọc',
		and: 'VÀ',
		or: 'HOẶC',
		loading: 'Đang tải...',
		no_data: 'Không có dữ liệu',
		actions: 'Thao tác',
		view: 'Xem',
		edit: 'Sửa',
		delete: 'Xóa',
		prev: '← Trước',
		next: 'Tiếp →',
		page_of: 'Trang {page:number} / {total:number}',
		select_placeholder: '-- Chọn --',
		filter_value_placeholder: 'giá trị',
		tags_placeholder: 'phân cách bằng dấu phẩy',
		cancel: 'Hủy',
		save: 'Lưu',
		detail_title: 'Chi tiết',
		close: 'Đóng',
		edit_title: 'Sửa {resource:string}',
		create_title: 'Tạo {resource:string}',
		delete_confirm: 'Bạn có chắc chắn không?',
		yes: 'Có',
		no: 'Không'
	},
	confirm_modal: {
		default_message: 'Bạn có chắc chắn không?',
		confirm: 'Xác nhận',
		cancel: 'Hủy'
	},
	roles_page: {
		title: 'Vai trò',
		permissions_section: 'Quyền hạn',
		loading_permissions: 'Đang tải quyền hạn…',
		assigned: 'Đã gán',
		available: 'Có sẵn',
		none: 'Không có',
		loading: 'Đang tải…',
		search_placeholder: 'Tìm kiếm…',
		search_api_placeholder: 'Tìm kiếm từ API…',
		unassign_confirm: 'Xóa quyền hạn này khỏi vai trò?',
		new_permission_resource: 'Tài nguyên *',
		new_permission_description: 'Mô tả'
	},
	permissions_page: {
		title: 'Quyền hạn',
		mask_label: 'Mặt nạ',
		mask_value: 'mặt nạ = {value:number}'
	}
};

export default vi_VN;
