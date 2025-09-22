// Backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "backend-app", // Tên ứng dụng
      script: "build/Backend/src/app.js", // Đường dẫn file chạy sau khi build
      instances: "max", // Tự động scale theo số core CPU
      exec_mode: "cluster", // Chạy ở chế độ cluster
      autorestart: true, // Tự động khởi động lại khi có lỗi
      watch: false, // Không theo dõi file thay đổi trong production
      max_memory_restart: "1G", // Khởi động lại nếu dùng quá 1GB RAM
    },
  ],
};
