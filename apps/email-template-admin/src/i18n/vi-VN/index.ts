import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản trị Mẫu Email',
		nav: {
			dashboard: 'Bảng điều khiển',
			email_templates: 'Mẫu Email',
			template_placeholders: 'Biến mẫu',
			template_translations: 'Bản dịch'
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
		badge: 'Quản trị Mẫu Email',
		resources: {
			email_templates: 'Mẫu Email',
			template_placeholders: 'Biến mẫu',
			template_translations: 'Bản dịch'
		},
		resource_desc: {
			email_templates: 'Quản lý các mẫu email giao dịch và marketing',
			template_placeholders: 'Định nghĩa các biến động được sử dụng trong mẫu email',
			template_translations: 'Quản lý bản dịch đa ngôn ngữ cho mẫu email'
		}
	},
	email_templates_page: {
		title: 'Mẫu Email',
		col_id: 'ID',
		col_name: 'Tên',
		col_key: 'Khóa',
		col_description: 'Mô tả',
		col_is_active: 'Kích hoạt',
		col_user_id: 'ID Người dùng'
	},
	template_placeholders_page: {
		title: 'Biến mẫu',
		col_id: 'ID',
		col_template_id: 'Tên mẫu',
		col_placeholder_key: 'Khóa biến',
		col_description: 'Mô tả',
		col_example_value: 'Giá trị ví dụ',
		col_is_required: 'Bắt buộc',
		col_created_at: 'Ngày tạo',
		col_updated_at: 'Ngày cập nhật'
	},
	template_translations_page: {
		title: 'Bản dịch mẫu',
		col_id: 'ID',
		col_template_id: 'Tên mẫu',
		col_language_code: 'Ngôn ngữ',
		col_subject: 'Tiêu đề',
		col_body: 'Nội dung',
		col_version_name: 'Phiên bản',
		col_created_at: 'Ngày tạo',
		col_updated_at: 'Ngày cập nhật'
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
