import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	authenticate: {
		login: 'Đăng nhập',
		signup: 'Đăng ký',
		email: 'Email',
		password: 'Mật khẩu',
		error_title: 'Lỗi',
		missing_params: 'Thiếu tham số bắt buộc: client_id và redirect_url là bắt buộc.',
		no_permission: 'Bạn không có quyền truy cập trang này.',
		validation_failed: 'Tham số không hợp lệ: ',
		welcome_title: 'Chào mừng',
		welcome_desc: 'Vui lòng đăng nhập hoặc đăng ký để tiếp tục.'
	},
	admin_panel: {
		title: 'Quản trị Lookup',
		nav: {
			dashboard: 'Bảng điều khiển',
			lookup_types: 'Loại Lookup',
			lookup_items: 'Mục',
			lookup_item_translations: 'Bản dịch'
		},
		logout: 'Đăng xuất'
	},
	crud_table: {
		create: '+ Tạo mới',
		filter: 'Lọc',
		clear: 'Xóa bộ lọc',
		and: 'VÀ',
		or: 'HOẶC',
		loading: 'Đang tải...',
		no_data: 'Không có dữ liệu',
		actions: 'Hành động',
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
		delete_confirm: 'Bạn có chắc không?',
		yes: 'Có',
		no: 'Không'
	},
	confirm_modal: {
		default_message: 'Bạn có chắc không?',
		confirm: 'Xác nhận',
		cancel: 'Hủy'
	},
	dashboard: {
		title: 'Bảng điều khiển',
		badge: 'Quản trị Lookup',
		description: 'Quản lý các loại lookup, mục, và bản dịch cho nền tảng.',
		quick_start: 'Bắt đầu nhanh',
		resources: {
			lookup_types: 'Loại Lookup'
		},
		resource_desc: {
			lookup_types: 'Danh mục dữ liệu tham chiếu (ví dụ: tiền tệ, quốc gia, trạng thái)'
		}
	},
	lookup_types_page: {
		title: 'Loại Lookup',
		col_code: 'Mã',
		col_name: 'Tên',
		col_description: 'Mô tả',
		col_active: 'Kích hoạt',
		col_tenant: 'Tenant',
		view_items: 'Mục'
	},
	lookup_items_page: {
		title: 'Mục Lookup',
		type_label: 'Loại',
		col_code: 'Mã',
		col_name: 'Tên',
		col_active: 'Kích hoạt',
		col_sort_order: 'Thứ tự',
		col_is_default: 'Mặc định',
		view_translations: 'Bản dịch',
		back: '← Quay lại Loại'
	},
	lookup_translations_page: {
		title: 'Bản dịch Mục',
		item_label: 'Mục',
		col_locale: 'Ngôn ngữ',
		col_name: 'Tên',
		back: '← Quay lại Mục'
	}
};

export default vi_VN;
