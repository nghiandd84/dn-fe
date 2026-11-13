import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản trị Sự kiện',
		nav: {
			dashboard: 'Bảng điều khiển',
			events: 'Sự kiện'
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
		badge: 'Quản trị Sự kiện',
		resources: {
			events: 'Sự kiện'
		},
		resource_desc: {
			events: 'Quản lý sự kiện: tên, ngày, địa điểm, số chỗ, trạng thái và thời gian mở bán'
		}
	},
	events_page: {
		title: 'Sự kiện',
		col_id: 'ID',
		col_event_name: 'Tên sự kiện',
		col_event_date: 'Ngày diễn ra',
		col_venue_name: 'Địa điểm',
		col_total_seats: 'Tổng số chỗ',
		col_status: 'Trạng thái',
		col_sale_start_time: 'Bắt đầu bán',
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
