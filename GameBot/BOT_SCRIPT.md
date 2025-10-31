# Kịch bản chạy Bot

Tài liệu này mô tả kịch bản và luồng chạy của bot game.

## Luồng hoạt động

Dựa vào mã nguồn trong thư mục `GameBot`, luồng hoạt động của bot có thể được tóm tắt như sau:

1. **Khởi chạy**: Người dùng thực thi file `main.js` bằng `bun` hoặc `node`.

   ```bash
   bun main.js
   ```
2. **Nhập thông tin**: Khi `main.js` được chạy, chương trình sẽ hỏi người dùng hai thông tin:

   - `Number of bots per host`: Số lượng bot sẽ được tạo cho mỗi host.
   - `Host IDs (comma separated)`: ID của các host game, cách nhau bởi dấu phẩy.
3. **Bắt đầu Bot**:

   - Dữ liệu người dùng nhập vào được xử lý.
   - Hàm `startBot` từ file `bot.js` được gọi với các tham số là số lượng bot và danh sách ID của host.
   - Hàm này có nhiệm vụ khởi tạo và quản lý vòng đời của các bot. Mỗi bot sẽ xác thực và tạo một kết nối Socket.IO đến máy chủ game.
4. **Mô phỏng hành vi người chơi (`simulatePlay`)**:

   - Sau khi bot kết nối thành công vào một phòng game, hàm `simulatePlay` sẽ được kích hoạt.
   - Hàm này sẽ định kỳ thực hiện các hành động sau để mô phỏng một người chơi thật:
     - Cứ mỗi 5 đến 20 giây, bot sẽ gọi hàm `updateScore`.
     - `updateScore`: Gửi một điểm số ngẫu nhiên lên cho host thông qua sự kiện `host:score-updated`.
     - Với 50% xác suất, bot sẽ gửi sự kiện `game:save` để lưu lại tiến trình game, kèm theo một dữ liệu khoảng 5KB.
   - Luồng hoạt động này giúp tạo ra tải giả lập trên máy chủ, kiểm tra khả năng xử lý của hệ thống trong điều kiện có nhiều người chơi cùng lúc.
5. **Hiển thị Giao diện**:

   - Song song với việc bot hoạt động, hàm `drawUI` từ file `ui.js` được gọi.
   - Hàm này sẽ vẽ một giao diện trên terminal để hiển thị thông tin và trạng thái của các bot đang chạy (số lượng bot kết nối, sự kiện, lỗi...).
6. **Ghi log**:

   - File `logger.js` cung cấp chức năng ghi log, giúp theo dõi hoạt động của bot và gỡ lỗi khi cần.

## Cài đặt và Chạy

### Yêu cầu

- Cài đặt Bun.

### Cài đặt

1. Mở terminal tại thư mục `GameBot`.
2. Chạy lệnh sau để cài đặt các gói phụ thuộc:
   ```bash
   bun install
   ```

### Chạy bot

1. Sau khi cài đặt xong, chạy lệnh sau:
   ```bash
   bun main.js
   ```
2. Nhập các thông tin theo yêu cầu của chương trình.
