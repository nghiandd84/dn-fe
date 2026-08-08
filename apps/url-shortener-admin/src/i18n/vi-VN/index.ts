import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản Trị URL Rút Gọn',
		nav: {
			dashboard: 'Trang Chủ',
			urls: 'URL Rút Gọn',
			api_keys: 'API Keys',
			url_clicks: 'Thống Kê Clicks'
		},
		logout: 'Đăng Xuất'
	},
	authenticate: {
		error_title: 'Lỗi',
		missing_params: 'Thiếu tham số bắt buộc: client_id và redirect_url là bắt buộc.',
		welcome_title: 'Chào Mừng',
		welcome_desc: 'Vui lòng đăng nhập hoặc đăng ký để tiếp tục.',
		login: 'Đăng Nhập',
		signup: 'Đăng Ký',
		email: 'Email',
		password: 'Mật Khẩu',
		language_label: 'Ngôn Ngữ',
		no_account: 'Chưa có tài khoản?',
		switch_signup: 'Đăng ký tại đây',
		has_account: 'Đã có tài khoản?',
		switch_login: 'Đăng nhập tại đây',
		no_permission: 'Bạn không có quyền truy cập bảng điều khiển này.',
		validation_failed: 'Yêu cầu không hợp lệ: '
	},
	authenticate_result: {
		title_success: 'Xác Thực Thành Công',
		title_failed: 'Xác Thực Thất Bại',
		access_token: 'Access Token',
		refresh_token: 'Refresh Token',
		permissions: 'Quyền Hạn',
		col_resource: 'Tài Nguyên',
		col_mask: 'Mặt Nạ',
		col_description: 'Mô Tả'
	},
	dashboard: {
		title: 'Trang Chủ',
		badge: 'Quản Trị URL Rút Gọn',
		resources: {
			urls: 'URL Rút Gọn',
			api_keys: 'API Keys',
			url_clicks: 'Thống Kê Clicks'
		},
		resource_desc: {
			urls: 'Tạo và quản lý URL rút gọn với mã tùy chỉnh, thời gian hết hạn và trạng thái',
			api_keys: 'Quản lý API keys để truy cập dịch vụ rút gọn URL từ bên ngoài',
			url_clicks: 'Xem thống kê click: IP, trình duyệt, nguồn giới thiệu và quốc gia'
		}
	},
	urls_page: {
		title: 'URL Rút Gọn',
		col_id: 'ID',
		col_user_id: 'User ID',
		col_original_url: 'URL Gốc',
		col_short_code: 'Mã Ngắn',
		col_title: 'Tiêu Đề',
		col_is_active: 'Kích Hoạt',
		col_click_count: 'Số Clicks',
		col_expires_at: 'Hết Hạn',
		col_created_at: 'Ngày Tạo',
		col_updated_at: 'Ngày Cập Nhật'
	},
	api_keys_page: {
		title: 'API Keys',
		col_id: 'ID',
		col_user_id: 'User ID',
		col_name: 'Tên',
		col_is_active: 'Kích Hoạt',
		col_last_used_at: 'Lần Dùng Cuối',
		col_created_at: 'Ngày Tạo',
		col_key: 'Key',
		key_note: 'Key chỉ hiển thị một lần sau khi tạo.'
	},
	url_clicks_page: {
		title: 'Thống Kê Clicks',
		col_id: 'ID',
		col_url_id: 'URL ID',
		col_ip_address: 'Địa Chỉ IP',
		col_user_agent: 'Trình Duyệt',
		col_referrer: 'Nguồn',
		col_country: 'Quốc Gia',
		col_clicked_at: 'Thời Gian Click'
	},
	crud_table: {
		filter: 'Lọc',
		clear: 'Xóa',
		loading: 'Đang tải...',
		no_data: 'Không có dữ liệu',
		page_of: 'Trang {page} / {total}',
		prev: '← Trước',
		next: 'Tiếp →',
		actions: 'Thao Tác',
		save: 'Lưu',
		cancel: 'Hủy',
		create: '+ Tạo Mới',
		edit: 'Sửa',
		delete: 'Xóa',
		detail: 'Chi Tiết',
		confirm_delete: 'Bạn có chắc không?',
		and: 'VÀ',
		or: 'HOẶC',
		view: 'Xem',
		select_placeholder: '-- Chọn --',
		filter_value_placeholder: 'giá trị',
		tags_placeholder: 'cách nhau bằng dấu phẩy',
		detail_title: 'Chi Tiết',
		close: 'Đóng',
		edit_title: 'Sửa {resource}',
		create_title: 'Tạo {resource}',
		delete_confirm: 'Bạn có chắc không?',
		yes: 'Có',
		no: 'Không'
	}
};

export default vi_VN;
