function Is_valid_password(password) {
    // Kiểm tra độ dài mật khẩu có tối thiểu 8 ký tự
    if (password.length < 8) {
      return false;
    }
  
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
  
    // Kiểm tra từng ký tự trong mật khẩu
    for (let i = 0; i < password.length; i++) {
      const char = password.charAt(i);
  
      // Nếu ký tự là chữ cái hoa
      if (char >= 'A' && char <= 'Z') {
        hasUpperCase = true;
      }
      // Nếu ký tự là chữ cái thường
      else if (char >= 'a' && char <= 'z') {
        hasLowerCase = true;
      }
      // Nếu ký tự là số
      else if (char >= '0' && char <= '9') {
        hasNumber = true;
      }
    }
  
    // Kiểm tra xem mật khẩu có chứa ít nhất một chữ cái hoa, một chữ cái thường và một chữ số không
    if (hasUpperCase && hasLowerCase && hasNumber) {
      return true;
    } else {
      return false;
    }
  }
  export default Is_valid_password