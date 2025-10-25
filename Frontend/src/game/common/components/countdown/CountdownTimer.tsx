import React, { useState, useEffect, useCallback } from "react";
import "./style.scss";

// Định nghĩa interface cho props
interface CountdownTimerProps {
  /**
   * Mốc thời gian tương lai (Unix timestamp UTC, tính bằng giây)
   */
  targetTimestamp: number;
}

// Định nghĩa cấu trúc thời gian còn lại
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Hàm tiện ích để thêm số 0 vào trước (ví dụ: 7 -> "07")
const padZero = (num: number): string => num.toString().padStart(2, "0");

/**
 * Component đếm ngược thời gian
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTimestamp,
}) => {
  /**
   * Hàm tính toán thời gian còn lại.
   * Sử dụng useCallback để tối ưu, chỉ tạo lại hàm khi targetTimestamp thay đổi.
   */
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    // Chuyển timestamp (giây) sang mili-giây
    const targetDate = targetTimestamp * 1000;
    const difference = targetDate - Date.now();

    // Nếu đã hết giờ
    if (difference <= 0 || difference > 30000) {
      return null;
    }

    // Tính toán ngày, giờ, phút, giây
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  }, [targetTimestamp]);

  // State lưu trữ thời gian còn lại
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft()
  );

  // Effect để cập nhật đồng hồ mỗi giây
  useEffect(() => {
    // Cập nhật thời gian ngay lập tức khi component mount
    setTimeLeft(calculateTimeLeft());

    // Đặt một interval để cập nhật mỗi giây
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Nếu hết giờ, xóa interval
      if (!newTimeLeft) {
        clearInterval(timer);
      }
    }, 1000); // 1 giây

    // Cleanup: Xóa interval khi component unmount
    return () => clearInterval(timer);
  }, [calculateTimeLeft]); // Phụ thuộc vào hàm calculateTimeLeft

  // --- Render ---

  // Trường hợp đã hết giờ
  if (!timeLeft) {
    return null;
  }

  const { days, hours, minutes, seconds } = timeLeft;
  
  // Trường hợp đang đếm ngược
  return (
    <div className="coiny-text countdown-timer">
      <span>{padZero(seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
