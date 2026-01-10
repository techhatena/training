export const VALIDATION_PRESETS = {
    email: {
        label: 'Email hợp lệ',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: 'Vui lòng nhập địa chỉ email hợp lệ'
    },
    phone: {
        label: 'Số điện thoại Việt Nam',
        pattern: '^(\\+84|0)(3[2-9]|5[689]|7[0678]|8[1-6]|9[0-9])[0-9]{7}$',
        message: 'Vui lòng nhập số điện thoại hợp lệ'
    },
    password_strong: {
        label: 'Mật khẩu mạnh (8+ ký tự, chữ hoa, chữ thường, số)',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    },
    password_medium: {
        label: 'Mật khẩu trung bình (6+ ký tự)',
        pattern: '^.{6,}$',
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
    },
    name: {
        label: 'Tên người (chỉ chữ cái, 2-50 ký tự)',
        pattern: '^[a-zA-ZÀ-ỹĂ-ắÂ-ậĐđĨ-ịÔ-ộƠ-ờÚ-ứỲỹ\\s]{2,50}$',
        message: 'Tên phải từ 2-50 ký tự và chỉ chứa chữ cái'
    },
    number_only: {
        label: 'Chỉ số',
        pattern: '^[0-9]+$',
        message: 'Chỉ được nhập số'
    },
    number_decimal: {
        label: 'Số thập phân (2 chữ số sau dấu phẩy)',
        pattern: '^\\d*(?:\\.\\d{0,2})?$',
        message: 'Chỉ được nhập số và tối đa 2 chữ số sau dấu phẩy'
    },
    postal_code: {
        label: 'Mã bưu điện',
        pattern: '^[A-Za-z0-9\\s\\-]{3,10}$',
        message: 'Mã bưu điện không hợp lệ'
    },
    url: {
        label: 'Đường dẫn URL',
        pattern: '^(https?:\\/\\/)?(([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?)(\\?[^\\s]*)?$',
        message: 'Vui lòng nhập URL hợp lệ'
    },
    vietnamese_phone: {
        label: 'SĐT Việt Nam (đầy đủ)',
        pattern: '^(\\+84|0)(1\\d{9}|[3-9]\\d{8})$',
        message: 'Số điện thoại không đúng định dạng Việt Nam'
    },
    no_special_chars: {
        label: 'Không ký tự đặc biệt',
        pattern: '^[a-zA-Z0-9\\s]+$',
        message: 'Không được chứa ký tự đặc biệt'
    }
};

export const getValidationPresetsByType = (componentType: string) => {
    switch (componentType) {
        case 'email':
            return ['email', 'no_special_chars'];
        case 'password':
            return ['password_strong', 'password_medium'];
        case 'phone':
            return ['phone', 'vietnamese_phone', 'number_only'];
        case 'name_field':
            return ['name', 'no_special_chars'];
        case 'text':
        case 'textarea':
            return ['name', 'no_special_chars', 'number_only', 'number_decimal', 'url'];
        case 'postal':
            return ['postal_code', 'number_only'];
        default:
            return [];
    }
};