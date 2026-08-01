import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản trị Đặt chỗ',
		nav: {
			dashboard: 'Bảng điều khiển',
			bookings: 'Đặt chỗ',
			booking_seats: 'Ghế đặt',
			slots: 'Khung giờ'
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
		badge: 'Quản trị Đặt chỗ',
		resources: {
			bookings: 'Đặt chỗ',
			booking_seats: 'Ghế đặt',
			slots: 'Khung giờ'
		},
		resource_desc: {
			bookings: 'Quản lý đặt chỗ: sự kiện, người dùng, số tiền, trạng thái, thanh toán và mã tham chiếu',
			booking_seats: 'Quản lý ghế đặt: thông tin đặt chỗ, ghế và giá',
			slots: 'Quản lý các khung giờ còn trống'
		}
	},
	bookings_page: {
		title: 'Đặt chỗ',
		col_id: 'ID',
		col_event_id: 'ID Sự kiện',
		col_user_id: 'ID Người dùng',
		col_total_amount: 'Tổng tiền',
		col_status: 'Trạng thái',
		col_payment_id: 'ID Thanh toán',
		col_payment_status: 'Trạng thái TT',
		col_booking_reference: 'Mã tham chiếu',
		col_currency: 'Tiền tệ',
		col_confirmed_at: 'Xác nhận lúc',
		col_created_at: 'Ngày tạo',
		col_updated_at: 'Cập nhật lúc'
	},
	booking_seats_page: {
		title: 'Ghế đặt',
		col_id: 'ID',
		col_booking_id: 'ID Đặt chỗ',
		col_seat_id: 'ID Ghế',
		col_price: 'Giá',
		col_created_at: 'Ngày tạo'
	},
	slots_page: {
		title: 'Khung giờ',
		col_id: 'ID'
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
