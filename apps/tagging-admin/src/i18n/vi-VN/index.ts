import type { Translation } from '../i18n-types';

const vi_VN: Translation = {
	admin_panel: {
		title: 'Quản trị Gắn nhãn',
		nav: {
			dashboard: 'Bảng điều khiển',
			tag_groups: 'Nhóm nhãn',
			tags: 'Nhãn',
			entity_tags: 'Nhãn thực thể'
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
		badge: 'Quản trị Gắn nhãn',
		resources: {
			tag_groups: 'Nhóm nhãn',
			tags: 'Nhãn',
			entity_tags: 'Nhãn thực thể'
		},
		resource_desc: {
			tag_groups: 'Quản lý nhóm nhãn: phân cấp (nhóm → nhóm con) để tổ chức nhãn',
			tags: 'Quản lý nhãn: nhãn riêng lẻ với slug, màu sắc và liên kết nhóm',
			entity_tags: 'Quản lý liên kết nhãn thực thể: gắn nhãn cho bất kỳ loại thực thể nào'
		}
	},
	tag_groups_page: {
		title: 'Nhóm nhãn',
		col_id: 'ID',
		col_code: 'Mã',
		col_name: 'Tên',
		col_description: 'Mô tả',
		col_parent_group: 'Nhóm cha',
		col_sort_order: 'Thứ tự',
		col_tenant_id: 'ID Tenant',
		col_created_at: 'Ngày tạo',
		col_updated_at: 'Cập nhật lúc'
	},
	tags_page: {
		title: 'Nhãn',
		col_id: 'ID',
		col_tag_group: 'Nhóm nhãn',
		col_name: 'Tên',
		col_slug: 'Slug',
		col_color: 'Màu',
		col_description: 'Mô tả',
		col_sort_order: 'Thứ tự',
		col_is_active: 'Kích hoạt',
		col_alias_of: 'Bí danh của',
		col_usage_count: 'Lượt dùng',
		col_tenant_id: 'ID Tenant',
		col_created_at: 'Ngày tạo',
		col_updated_at: 'Cập nhật lúc'
	},
	entity_tags_page: {
		title: 'Nhãn thực thể',
		col_id: 'ID',
		col_tag: 'Nhãn',
		col_entity_type: 'Loại thực thể',
		col_entity: 'Thực thể',
		col_tenant_id: 'ID Tenant',
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
