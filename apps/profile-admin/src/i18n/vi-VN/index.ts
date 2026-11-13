import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản trị Hồ sơ',
		nav: {
			dashboard: 'Bảng điều khiển',
			profiles: 'Hồ sơ',
			social_links: 'Liên kết Mạng xã hội',
			user_preferences: 'Tùy chọn Người dùng'
		},
		logout: 'Đăng xuất'
	},
	authenticate: {
		error_title: 'Lỗi',
		missing_params: 'Thiếu tham số bắt buộc: client_id và redirect_url là bắt buộc.',
		welcome_title: 'Chào mừng',
		welcome_desc: 'Vui lòng đăng nhập hoặc đăng ký để tiếp tục.',
		login: 'Đăng nhập',
		signup: 'Đăng ký',
		email: 'Email',
		password: 'Mật khẩu',
		language_label: 'Ngôn ngữ',
		no_account: 'Chưa có tài khoản?',
		switch_signup: 'Đăng ký tại đây',
		has_account: 'Đã có tài khoản?',
		switch_login: 'Đăng nhập tại đây',
		no_permission: 'Bạn không có quyền truy cập trang này.',
		validation_failed: 'Tham số không hợp lệ: '
	},
	authenticate_result: {
		title_success: 'Xác thực Thành công',
		title_failed: 'Xác thực Thất bại',
		access_token: 'Token Truy cập',
		refresh_token: 'Token Làm mới',
		permissions: 'Quyền hạn',
		col_resource: 'Tài nguyên',
		col_mask: 'Mặt nạ',
		col_description: 'Mô tả'
	},
	dashboard: {
		title: 'Bảng điều khiển',
		badge: 'Quản trị Hồ sơ',
		card_profiles: 'Hồ sơ',
		card_social_links: 'Liên kết Mạng xã hội',
		card_user_preferences: 'Tùy chọn Người dùng',
		desc_profiles: 'Quản lý hồ sơ người dùng và thông tin cá nhân',
		desc_social_links: 'Quản lý liên kết mạng xã hội và kết nối',
		desc_user_preferences: 'Cấu hình cài đặt và tùy chọn người dùng'
	},
	profiles_page: {
		title: 'Hồ sơ',
		col_id: 'ID',
		col_user_id: 'ID Người dùng',
		col_first_name: 'Tên',
		col_last_name: 'Họ',
		col_bio: 'Tiểu sử',
		col_avatar_url: 'URL Avatar',
		col_location: 'Địa điểm'
	},
	social_links_page: {
		title: 'Liên kết Mạng xã hội',
		col_id: 'ID',
		col_profile_id: 'ID Hồ sơ',
		col_platform: 'Nền tảng',
		col_url: 'URL'
	},
	user_preferences_page: {
		title: 'Tùy chọn Người dùng',
		col_id: 'ID',
		col_profile_id: 'ID Hồ sơ',
		col_language: 'Ngôn ngữ',
		col_theme: 'Chủ đề',
		col_notifications: 'Thông báo',
		col_notifications_enabled: 'Thông báo'
	},
	crud_table: {
		filter: 'Lọc',
		clear: 'Xóa bộ lọc',
		loading: 'Đang tải...',
		no_data: 'Không có dữ liệu',
		page_of: 'Trang {page:number} / {total:number}',
		prev: '← Trước',
		next: 'Tiếp →',
		actions: 'Hành động',
		save: 'Lưu',
		cancel: 'Hủy',
		create: '+ Tạo mới',
		edit: 'Sửa',
		delete: 'Xóa',
		detail: 'Chi tiết',
		confirm_delete: 'Bạn có chắc không?',
		and: 'VÀ',
		or: 'HOẶC',
		view: 'Xem',
		select_placeholder: '-- Chọn --',
		filter_value_placeholder: 'giá trị',
		tags_placeholder: 'phân cách bằng dấu phẩy',
		detail_title: 'Chi tiết',
		close: 'Đóng',
		edit_title: 'Sửa {resource:string}',
		create_title: 'Tạo {resource:string}',
		delete_confirm: 'Bạn có chắc không?',
		yes: 'Có',
		no: 'Không'
	}
};

export default vi_VN;
