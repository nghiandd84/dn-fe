import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản trị Bản dịch',
		nav: {
			dashboard: 'Bảng điều khiển',
			projects: 'Dự án',
			tags: 'Thẻ',
			translation_keys: 'Khóa dịch',
			translation_versions: 'Phiên bản dịch'
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
		badge: 'Quản trị Bản dịch',
		resources: {
			projects: 'Dự án',
			tags: 'Thẻ',
			translation_keys: 'Khóa dịch',
			translation_versions: 'Phiên bản dịch'
		},
		resource_desc: {
			projects: 'Quản lý các dự án dịch thuật và khóa API của chúng',
			tags: 'Tổ chức các khóa dịch bằng thẻ có thể tái sử dụng',
			translation_keys: 'Quản lý tên khóa và mô tả theo dự án',
			translation_versions: 'Quản lý phiên bản nội dung đã bản địa hóa cho mỗi khóa dịch'
		}
	},
	project_detail_layout: {
		back: '← Quay lại Dự án',
		not_found: 'Không tìm thấy dự án',
		tab_translation_keys: 'Khóa dịch'
	},
	projects_page: {
		title: 'Dự án',
		col_id: 'ID',
		col_name: 'Tên',
		col_api_key: 'Khóa API',
		col_default_locale: 'Ngôn ngữ mặc định',
		col_created_at: 'Ngày tạo'
	},
	tags_page: {
		title: 'Thẻ',
		col_id: 'ID',
		col_name: 'Tên'
	},
	translation_keys_page: {
		title: 'Khóa dịch',
		col_id: 'ID',
		col_key_name: 'Tên khóa',
		col_description: 'Mô tả',
		col_project_id: 'ID Dự án'
	},
	translation_versions_page: {
		title: 'Phiên bản dịch',
		col_id: 'ID',
		col_key_id: 'ID Khóa',
		col_locale: 'Ngôn ngữ',
		col_content: 'Nội dung',
		col_version_number: 'Phiên bản',
		col_status: 'Trạng thái',
		col_created_by: 'Người tạo',
		col_created_at: 'Ngày tạo'
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
