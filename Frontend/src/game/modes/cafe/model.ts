export interface Stock {
  id: string;
  name: string;
  quantity: number;
  priceSell?: number; // tiền cần có để mua trong shop
  priceReWard?: number; // tiền nhận được khi bán xong
  enabled: boolean;
  currentIndexLevel: number; // level hiện tại của món ăn -> dùng để map số tiền mua trong shop và tiền nhận đc sau khi bán xong
  sellPrices: number[]; // giá tiền để mua trong shop
  rewardPrices: number[]; // tiền nhận được sau khi bán;
  isDefaultSell?: boolean; // MÓn ăn mặc định có sẵn trong cửa hàng
}

export interface ShopItem {
  id: string;
  stockId: string;
  enabled: boolean; // true nếu có thể mua
}

export interface OrderItem {
  stockId: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  avatarId: number;
  orders: OrderItem[];
  originalOrders: OrderItem[];
  position: number;
  firstLoad: boolean;
}

export interface Ability {
  id: number;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  purchased: boolean;
  isActive: boolean;
}

export const STOCKS = [
  {
    id: "s1",
    name: "Bánh mỳ",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [0, 300, 5250, 42500, 130000, 600000],
    rewardPrices: [2, 53, 525, 1750, 3500, 10000],
    image: "blook-toast",
  },
  {
    id: "s2",
    name: "Ngũ cốc",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [5, 1500, 16250, 212500, 650000],
    rewardPrices: [18, 263, 2625, 8750, 17500],
    image: "blook-cereal",
  },
  {
    id: "s3",
    name: "Sữa chua",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [10, 4500, 78750, 637500, 1950000],
    rewardPrices: [53, 788, 7875, 26250, 52500],
    image: "blook-yogurt",
  },
  {
    id: "s4",
    name: "Suất ăn sáng",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [50, 9000, 157500, 1275000, 3900000],
    rewardPrices: [105, 1575, 15750, 52500, 105000],
    image: "blook-breakfast",
  },
  {
    id: "s5",
    name: "Nước cam",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [200, 15000, 262500, 2125000, 6500000],
    rewardPrices: [175, 2625, 26250, 87500, 175000],
    image: "blook-orange-carton",
  },
  {
    id: "s6",
    name: "Sữa tươi",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [500, 22500, 393750, 3187500, 9750000],
    rewardPrices: [263, 3938, 39375, 131250, 262500],
    image: "blook-milk-carton",
  },
  {
    id: "s7",
    name: "Bánh quế",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [2000, 31500, 551250, 4462500, 13650000],
    rewardPrices: [368, 5513, 55125, 183750, 367500],
    image: "blook-waffle",
  },
  {
    id: "s8",
    name: "Bánh kếp",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [5000, 420000, 735000, 5950000, 18200000],
    rewardPrices: [490, 7350, 245000, 490000],
    image: "blook-pancake",
  },
  {
    id: "s9",
    name: "Bánh mì kiểu Pháp",
    quantity: 0,
    enabled: false,
    currentIndexLevel: 0,
    sellPrices: [7500, 54000, 2945000, 7650000, 23400000],
    rewardPrices: [630, 9450, 94500, 315000, 630000],
    image: "blook-french-waffle",
  },
];

export const QUESTIONS = [
  {
    id: "q1",
    text: "Phụ huynh gặp khó khăn gì khi cho con học tiếng Anh tại trung tâm truyền thống?",
    answers: [
      {
        id: "[1]",
        text: "Lớp học ít giáo viên bản xứ",
      },
      {
        id: "[2]",
        text: "Chi phí cao và mất thời gian đưa đón",
      },
      {
        id: "[3]",
        text: "Thiếu tài liệu học tập",
      },
      {
        id: "[4]",
        text: "Con không thích học",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q2",
    text: "Vì sao nhiều phụ huynh không chọn cho con học tự học qua App hoặc Youtube?",
    answers: [
      {
        id: "[1]",
        text: "Vì con học quá nhanh",
      },
      {
        id: "[2]",
        text: "Vì thiếu người hướng dẫn và khó đánh giá hiệu quả",
      },
      {
        id: "[3]",
        text: "Vì học quá vui",
      },
      {
        id: "[4]",
        text: "Vì tốn nhiều tiền",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q3",
    text: "Khi học online thông thường, trẻ dễ gặp vấn đề gì?",
    answers: [
      {
        id: "[1]",
        text: "Không có tương tác và dễ mất tập trung",
      },
      {
        id: "[2]",
        text: "Quá nhiều bài tập",
      },
      {
        id: "[3]",
        text: "Không có giáo viên Việt",
      },
      {
        id: "[4]",
        text: "Lớp học quá đông",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q4",
    text: "Babilala Class ra đời nhằm giải quyết điều gì?",
    answers: [
      {
        id: "[1]",
        text: "Nâng cấp giao diện App Babilala",
      },
      {
        id: "[2]",
        text: "Giúp trẻ học hiệu quả qua sự kết hợp giữa lớp học bản xứ và App tự học",
      },
      {
        id: "[3]",
        text: "Tăng giá trị thương hiệu",
      },
      {
        id: "[4]",
        text: "Tăng số lượng học sinh",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q5",
    text: "Lợi ích lớn nhất của việc kết hợp “Class + App + AI” trong Babilala Class là gì?",
    answers: [
      {
        id: "[1]",
        text: "Giúp con vừa học vừa chơi, được kèm cặp và luyện phát âm chuẩn",
      },
      {
        id: "[2]",
        text: "Giảm tải công việc cho phụ huynh",
      },
      {
        id: "[3]",
        text: "Tăng doanh thu sản phẩm",
      },
      {
        id: "[4]",
        text: "Học nhanh hơn bạn bè",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q6",
    text: "Babilala Class giúp phụ huynh giải quyết vấn đề nào về chi phí học tiếng Anh?",
    answers: [
      {
        id: "[1]",
        text: "Miễn phí hoàn toàn",
      },
      {
        id: "[2]",
        text: "Giảm 85% chi phí so với trung tâm",
      },
      {
        id: "[3]",
        text: "Tăng gấp đôi chi phí nhưng hiệu quả hơn",
      },
      {
        id: "[4]",
        text: "Không thay đổi chi phí",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q7",
    text: "Với Babilala Class, phụ huynh không cần lo lắng điều gì?",
    answers: [
      {
        id: "[1]",
        text: "Con không được nói tiếng Anh",
      },
      {
        id: "[2]",
        text: "Con mất tập trung khi học",
      },
      {
        id: "[3]",
        text: "Con không được sửa lỗi phát âm",
      },
      {
        id: "[4]",
        text: "Tất cả các đáp án trên",
      },
    ],
    correctAnswerId: "[4]",
  },
  {
    id: "q8",
    text: "Vì sao Babilala Class phù hợp với các gia đình bận rộn?",
    answers: [
      {
        id: "[1]",
        text: "Có thể học tại nhà, chọn lịch linh hoạt, không tốn thời gian đưa đón",
      },
      {
        id: "[2]",
        text: "Có nhiều giáo viên dạy thay nhau",
      },
      {
        id: "[3]",
        text: "Học ít hơn",
      },
      {
        id: "[4]",
        text: "Không cần học phụ đạo",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q9",
    text: "Điểm khác biệt trong mô hình của Babilala Class giúp phụ huynh an tâm là gì?",
    answers: [
      {
        id: "[1]",
        text: "Có camera giám sát, trợ giảng người Việt theo dõi, và báo cáo học tập chi tiết",
      },
      {
        id: "[2]",
        text: "Lớp học tự động, không cần giáo viên",
      },
      {
        id: "[3]",
        text: "Con được thi đua nhận quà",
      },
      {
        id: "[4]",
        text: "Học ít bài hơn",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q10",
    text: "Tại sao nói Babilala Class là giải pháp toàn diện cho phụ huynh?",
    answers: [
      {
        id: "[1]",
        text: "Vì đáp ứng đủ học – luyện – kèm – phản hồi, giúp con tiến bộ toàn diện",
      },
      {
        id: "[2]",
        text: "Vì có nhiều game",
      },
      {
        id: "[3]",
        text: "Vì học ít bài hơn",
      },
      {
        id: "[4]",
        text: "Vì học offline",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q11",
    text: "Babilala Class được cấu thành từ mấy phần chính?",
    answers: [
      {
        id: "[1]",
        text: "2 phần",
      },
      {
        id: "[2]",
        text: "3 phần",
      },
      {
        id: "[3]",
        text: "4 phần",
      },
      {
        id: "[4]",
        text: "5 phần",
      },
    ],
    correctAnswerId: "[3]",
  },
  {
    id: "q12",
    text: "4 phần chính trong mô hình Babilala Class bao gồm:",
    answers: [
      {
        id: "[1]",
        text: "Babi App – Babi Class – Babi AI Speak – Babi Global",
      },
      {
        id: "[2]",
        text: "App học, Website học, Trung tâm học, Sách học",
      },
      {
        id: "[3]",
        text: "Học tại nhà, Học nhóm, Học tự do, Học cùng bố mẹ",
      },
      {
        id: "[4]",
        text: "Game, Video, Chatbot, Class",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q13",
    text: "Trong Babi Class, trẻ học với ai?",
    answers: [
      {
        id: "[1]",
        text: "Giáo viên Việt Nam",
      },
      {
        id: "[2]",
        text: "Giáo viên bản xứ và trợ giảng người Việt",
      },
      {
        id: "[3]",
        text: "AI Speak",
      },
      {
        id: "[4]",
        text: "Phụ huynh",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q14",
    text: "Một buổi Babi Class diễn ra trong bao lâu?",
    answers: [
      {
        id: "[1]",
        text: "30 phút",
      },
      {
        id: "[2]",
        text: "45 phút",
      },
      {
        id: "[3]",
        text: "60 phút",
      },
      {
        id: "[4]",
        text: "90 phút",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q15",
    text: "Babi App giúp trẻ phát triển kỹ năng nào?",
    answers: [
      {
        id: "[1]",
        text: "Nghe – Nói – Đọc – Viết theo chuẩn CEFR",
      },
      {
        id: "[2]",
        text: "Chỉ học từ vựng",
      },
      {
        id: "[3]",
        text: "Chỉ luyện nói",
      },
      {
        id: "[4]",
        text: "Học văn hóa quốc tế",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q16",
    text: "Công nghệ nào trong Babi App giúp trẻ luyện phát âm chuẩn như người bản xứ?",
    answers: [
      {
        id: "[1]",
        text: "AI Listen",
      },
      {
        id: "[2]",
        text: "AI Speak",
      },
      {
        id: "[3]",
        text: "AI Talk",
      },
      {
        id: "[4]",
        text: "AI Pronounce",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q17",
    text: "Babi AI Free Talk giúp trẻ luyện gì?",
    answers: [
      {
        id: "[1]",
        text: "Phản xạ hội thoại theo ngữ cảnh thực tế",
      },
      {
        id: "[2]",
        text: "Gõ từ vựng nhanh",
      },
      {
        id: "[3]",
        text: "Viết câu đúng ngữ pháp",
      },
      {
        id: "[4]",
        text: "Học nghe thụ động",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q18",
    text: "Babi Global mang lại giá trị gì cho trẻ?",
    answers: [
      {
        id: "[1]",
        text: "Học qua trò chơi quốc tế",
      },
      {
        id: "[2]",
        text: "Hoạt động ngoại khóa, rèn sự tự tin và kỹ năng công dân toàn cầu",
      },
      {
        id: "[3]",
        text: "Luyện viết bài thi Cambridge",
      },
      {
        id: "[4]",
        text: "Thi đấu tiếng Anh online",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q19",
    text: "Trong buổi học Babilala Class, hệ thống AI có vai trò gì?",
    answers: [
      {
        id: "[1]",
        text: "Theo dõi phát âm, đánh giá phản xạ và cảnh báo khi trẻ mất tập trung",
      },
      {
        id: "[2]",
        text: "Chấm điểm ngữ pháp",
      },
      {
        id: "[3]",
        text: "Đọc truyện cho trẻ",
      },
      {
        id: "[4]",
        text: "Kiểm tra từ vựng",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q20",
    text: "Lộ trình học của Babi App được thiết kế theo tiêu chuẩn nào?",
    answers: [
      {
        id: "[1]",
        text: "Chuẩn Việt Nam",
      },
      {
        id: "[2]",
        text: "CEFR Châu Âu",
      },
      {
        id: "[3]",
        text: "Cambridge Advanced",
      },
      {
        id: "[4]",
        text: "TOEFL Junior",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q21",
    text: "Babilala Class mang lại lợi ích gì nổi bật cho học sinh trong việc học tiếng Anh?",
    answers: [
      {
        id: "[1]",
        text: "Được học phát âm với công nghệ AI-Speak và giáo viên bản xứ",
      },
      {
        id: "[2]",
        text: "Học offline tại trung tâm",
      },
      {
        id: "[3]",
        text: "Học nhanh trong 2 tuần",
      },
      {
        id: "[4]",
        text: "Học qua phim hoạt hình",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q22",
    text: "Điểm đặc biệt giúp trẻ hứng thú khi học Babilala Class là gì?",
    answers: [
      {
        id: "[1]",
        text: "Bài học được thiết kế như trò chơi, có điểm số và thi đua trong lớp",
      },
      {
        id: "[2]",
        text: "Lớp học nghiêm túc như ở trường",
      },
      {
        id: "[3]",
        text: "Không cần tương tác",
      },
      {
        id: "[4]",
        text: "Học qua sách giấy",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q23",
    text: "Phụ huynh được hưởng lợi gì khi cho con học Babilala Class?",
    answers: [
      {
        id: "[1]",
        text: "Không cần theo dõi tiến độ",
      },
      {
        id: "[2]",
        text: "Tiết kiệm chi phí và có báo cáo chi tiết về quá trình học của con",
      },
      {
        id: "[3]",
        text: "Phải ngồi cùng con trong mỗi buổi học",
      },
      {
        id: "[4]",
        text: "Không được xem kết quả học",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q24",
    text: "Babilala Class giúp trẻ hình thành kỹ năng gì quan trọng cho tương lai?",
    answers: [
      {
        id: "[1]",
        text: "Tư duy logic",
      },
      {
        id: "[2]",
        text: "Phản xạ giao tiếp, phát âm chuẩn và sự tự tin khi nói tiếng Anh",
      },
      {
        id: "[3]",
        text: "Kỹ năng viết học thuật",
      },
      {
        id: "[4]",
        text: "Học thuộc từ vựng nhanh",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q25",
    text: "Vì sao nói Babilala Class tạo môi trường học an toàn cho trẻ?",
    answers: [
      {
        id: "[1]",
        text: "Trẻ học một mình",
      },
      {
        id: "[2]",
        text: "Trẻ được học và nói trong môi trường không áp lực, luôn được khen và khuyến khích",
      },
      {
        id: "[3]",
        text: "Không có giáo viên giám sát",
      },
      {
        id: "[4]",
        text: "Không có chấm điểm",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q26",
    text: "Nếu trong buổi học con không hiểu câu hỏi của giáo viên bản xứ, con nên làm gì?",
    answers: [
      {
        id: "[1]",
        text: "Giữ im lặng chờ qua bài khác",
      },
      {
        id: "[2]",
        text: "Thoát khỏi lớp học",
      },
      {
        id: "[3]",
        text: "Chat hoặc nói để hỏi lại, trợ giảng người Việt sẽ hỗ trợ",
      },
      {
        id: "[4]",
        text: "Báo với phụ huynh ngay lập tức",
      },
    ],
    correctAnswerId: "[3]",
  },
  {
    id: "q27",
    text: "Khi con bị mất tập trung trong buổi học online, ai sẽ theo dõi và nhắc nhở kịp thời?",
    answers: [
      {
        id: "[1]",
        text: "Giáo viên bản xứ",
      },
      {
        id: "[2]",
        text: "AI Speak",
      },
      {
        id: "[3]",
        text: "Trợ giảng người Việt và hệ thống giám sát",
      },
      {
        id: "[4]",
        text: "Phụ huynh",
      },
    ],
    correctAnswerId: "[3]",
  },
  {
    id: "q28",
    text: "Nếu phụ huynh muốn linh hoạt thời gian học, Babilala Class đáp ứng thế nào?",
    answers: [
      {
        id: "[1]",
        text: "Không thay đổi được lịch học",
      },
      {
        id: "[2]",
        text: "Có thể đổi giáo viên tùy ý",
      },
      {
        id: "[3]",
        text: "Có nhiều khung lịch học từ thứ Hai đến thứ Bảy để chọn phù hợp",
      },
      {
        id: "[4]",
        text: "Học bất cứ lúc nào, không cần đăng ký lịch",
      },
    ],
    correctAnswerId: "[3]",
  },
  {
    id: "q29",
    text: "Vì sao trẻ cảm thấy hứng thú khi học Babilala Class?",
    answers: [
      {
        id: "[1]",
        text: "Vì bài học giống trò chơi, có điểm thưởng và lời khen từ giáo viên",
      },
      {
        id: "[2]",
        text: "Vì học ít bài hơn các lớp khác",
      },
      {
        id: "[3]",
        text: "Vì học không cần nghe giảng",
      },
      {
        id: "[4]",
        text: "Vì học qua phim hoạt hình",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q30",
    text: "Yếu tố nào trong buổi học giúp trẻ duy trì sự tập trung suốt 45 phút?",
    answers: [
      {
        id: "[1]",
        text: "Có âm nhạc nhẹ nhàng",
      },
      {
        id: "[2]",
        text: "Có trợ giảng giám sát và AI nhắc nhở khi trẻ mất tập trung",
      },
      {
        id: "[3]",
        text: "Có phần thưởng cuối buổi",
      },
      {
        id: "[4]",
        text: "Có bố mẹ ngồi cạnh",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q31",
    text: "Khi trả lời đúng câu hỏi trong lớp, trẻ nhận được gì?",
    answers: [
      {
        id: "[1]",
        text: "Một món quà thật",
      },
      {
        id: "[2]",
        text: "Điểm số hoặc biểu tượng cúp hiển thị ngay trên màn hình",
      },
      {
        id: "[3]",
        text: "Học lại từ đầu",
      },
      {
        id: "[4]",
        text: "Một bài kiểm tra mới",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q32",
    text: "Phản hồi của giáo viên trong buổi học có tác dụng gì?",
    answers: [
      {
        id: "[1]",
        text: "Giúp trẻ biết mình sai ở đâu và được khích lệ tiến bộ",
      },
      {
        id: "[2]",
        text: "Khiến trẻ sợ mắc lỗi",
      },
      {
        id: "[3]",
        text: "Làm trẻ mất thời gian",
      },
      {
        id: "[4]",
        text: "Không có tác dụng gì",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q33",
    text: "Vì sao nói mỗi giờ học Babilala Class là “vừa học vừa chơi”?",
    answers: [
      {
        id: "[1]",
        text: "Vì học sinh có thể chơi game xen kẽ trong tiết học",
      },
      {
        id: "[2]",
        text: "Vì các hoạt động tương tác liên tục khiến trẻ tham gia chủ động",
      },
      {
        id: "[3]",
        text: "Vì không có bài tập về nhà",
      },
      {
        id: "[4]",
        text: "Vì học sinh có thể nghỉ giữa giờ",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q34",
    text: "Trẻ được khen ngợi trong Babilala Class bằng cách nào?",
    answers: [
      {
        id: "[1]",
        text: "Qua bảng xếp hạng và lời khen trực tiếp từ giáo viên",
      },
      {
        id: "[2]",
        text: "Qua phần thưởng vật chất",
      },
      {
        id: "[3]",
        text: "Qua điểm thi giữa kỳ",
      },
      {
        id: "[4]",
        text: "Qua tin nhắn gửi về cho bố mẹ",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q35",
    text: "Điều gì giúp trẻ tự tin hơn khi giao tiếp tiếng Anh sau một thời gian học Babilala Class?",
    answers: [
      {
        id: "[1]",
        text: "Chơi nhiều game hơn",
      },
      {
        id: "[2]",
        text: "Thường xuyên thực hành phát âm và hội thoại với giáo viên, AI",
      },
      {
        id: "[3]",
        text: "Làm bài tập nhiều hơn",
      },
      {
        id: "[4]",
        text: "Học thuộc câu trả lời mẫu",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q36",
    text: "Khi hoàn thành nhiệm vụ tuần trong Babi Global, trẻ nhận được gì?",
    answers: [
      {
        id: "[1]",
        text: "Phần thưởng từ hệ thống",
      },
      {
        id: "[2]",
        text: "Sự ghi nhận, điểm cộng và cơ hội chia sẻ video của mình",
      },
      {
        id: "[3]",
        text: "Một trò chơi mới",
      },
      {
        id: "[4]",
        text: "Thời gian nghỉ thêm",
      },
    ],
    correctAnswerId: "[4]",
  },
  {
    id: "q37",
    text: "Cảm xúc phổ biến nhất của trẻ sau khi tham gia Babilala Class là gì?",
    answers: [
      {
        id: "[1]",
        text: "Áp lực",
      },
      {
        id: "[2]",
        text: "Mệt mỏi",
      },
      {
        id: "[3]",
        text: "Thích thú và mong chờ buổi học tiếp theo",
      },
      {
        id: "[4]",
        text: "Lo lắng",
      },
    ],
    correctAnswerId: "[3]",
  },
  {
    id: "q38",
    text: "Động lực học tập của trẻ trong Babilala Class đến từ đâu?",
    answers: [
      {
        id: "[1]",
        text: "Từ sự giám sát của phụ huynh",
      },
      {
        id: "[2]",
        text: "Từ cách thiết kế học tập gamified, thi đua và phản hồi tích cực",
      },
      {
        id: "[3]",
        text: "Từ điểm số môn khác",
      },
      {
        id: "[4]",
        text: "Từ việc làm bài kiểm tra thường xuyên",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q39",
    text: "Điều gì khiến Babilala Class trở nên đặc biệt hơn các sản phẩm tiếng Anh khác?",
    answers: [
      {
        id: "[1]",
        text: "Có nhiều video hơn",
      },
      {
        id: "[2]",
        text: "Kết hợp lớp học bản xứ – App – AI – Giáo viên Việt đồng hành",
      },
      {
        id: "[3]",
        text: "Dạy ít hơn nhưng hiệu quả hơn",
      },
      {
        id: "[4]",
        text: "Có học phí cao",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q40",
    text: "Khi kể với phụ huynh về sản phẩm, cảm xúc nào là đúng nhất mà nhân viên nên truyền tải?",
    answers: [
      {
        id: "[1]",
        text: "Hào hứng, tin tưởng và tự hào về giá trị dành cho trẻ",
      },
      {
        id: "[2]",
        text: "Lo lắng vì sản phẩm mới",
      },
      {
        id: "[3]",
        text: "Trung lập, không cảm xúc",
      },
      {
        id: "[4]",
        text: "Chỉ nói ngắn gọn",
      },
    ],
    correctAnswerId: "[1]",
  },
  {
    id: "q41",
    text: "Khi thấy học sinh tự tin nói tiếng Anh sau khóa học, nhân viên Babilala nên cảm nhận như thế nào?",
    answers: [
      {
        id: "[1]",
        text: "Bình thường",
      },
      {
        id: "[2]",
        text: "Tự hào vì góp phần vào hành trình học của trẻ",
      },
      {
        id: "[3]",
        text: "Chỉ ghi nhận như KPI",
      },
      {
        id: "[4]",
        text: "Không quan tâm",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q42",
    text: "Nếu được mô tả Babilala Class bằng một cụm từ, đâu là lựa chọn phù hợp nhất?",
    answers: [
      {
        id: "[1]",
        text: "Học cho có",
      },
      {
        id: "[2]",
        text: "Học vui – nói chuẩn – tự tin toàn cầu",
      },
      {
        id: "[3]",
        text: "Lớp học nghiêm khắc",
      },
      {
        id: "[4]",
        text: "Ứng dụng tạm thời",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q43",
    text: "Giá trị cốt lõi mà Babilala Class hướng đến là gì?",
    answers: [
      {
        id: "[1]",
        text: "Dạy ngữ pháp chuẩn Cambridge",
      },
      {
        id: "[2]",
        text: "Giúp trẻ tự tin giao tiếp và yêu tiếng Anh",
      },
      {
        id: "[3]",
        text: "Dạy viết học thuật",
      },
      {
        id: "[4]",
        text: "Chuẩn bị thi chứng chỉ quốc tế",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q44",
    text: "Vì sao nhân viên Babilala nên tự hào khi giới thiệu sản phẩm này?",
    answers: [
      {
        id: "[1]",
        text: "Vì đây là sản phẩm đắt nhất thị trường",
      },
      {
        id: "[2]",
        text: "Vì mang lại cơ hội học tiếng Anh chất lượng cho mọi gia đình với chi phí hợp lý",
      },
      {
        id: "[3]",
        text: "Vì chỉ dành cho trẻ giỏi",
      },
      {
        id: "[4]",
        text: "Vì dễ bán",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q45",
    text: "Theo bạn, điều gì là “trái tim” của Babilala Class?",
    answers: [
      {
        id: "[1]",
        text: "Giáo án tiếng Anh Cambridge",
      },
      {
        id: "[2]",
        text: "Trải nghiệm học đầy cảm xúc, nơi trẻ được khích lệ và công nhận",
      },
      {
        id: "[3]",
        text: "Trò chơi trong lớp",
      },
      {
        id: "[4]",
        text: "App có nhiều chủ đề",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q46",
    text: "Điều khiến trẻ nhớ nhất sau mỗi buổi học Babilala Class là gì?",
    answers: [
      {
        id: "[1]",
        text: "Sự nghiêm khắc của giáo viên",
      },
      {
        id: "[2]",
        text: "Lời khen, điểm số và cảm giác được công nhận",
      },
      {
        id: "[3]",
        text: "Học phí rẻ",
      },
      {
        id: "[4]",
        text: "Thời gian ngắn",
      },
    ],
    correctAnswerId: "[2]",
  },
  {
    id: "q47",
    text: "Nhân viên Babilala Class có thể tự hào nói điều gì với phụ huynh?",
    answers: [
      {
        id: "[1]",
        text: "“Chúng tôi đang giúp con bạn học ít hơn nhưng hiệu quả hơn”",
      },
      {
        id: "[2]",
        text: "“Babilala & Babiclass mang lại môi trường học vui, an toàn và hiệu quả giúp trẻ yêu tiếng Anh mỗi ngày”",
      },
      {
        id: "[3]",
        text: "“Sản phẩm chúng tôi rẻ nhất thị trường”",
      },
      {
        id: "[4]",
        text: "“Chúng tôi chỉ dạy qua app”",
      },
    ],
    correctAnswerId: "[2]",
  },
];

export enum ABILITY_ID {
  PAYCHECK_BONUS = 1,
  SUPPLY_CRATE = 2,
  HAPPY_CUSTOMER = 3,
  TRASH_THE_FOOD = 4,
  TAXES = 5,
  HEALTH_INSPECTION = 6,
  RUN_IT_BACK = 7,
}

export const REQUIRE_PLAYER_ABILITES = [
  ABILITY_ID.PAYCHECK_BONUS,
  ABILITY_ID.TRASH_THE_FOOD,
  ABILITY_ID.TAXES,
  ABILITY_ID.HEALTH_INSPECTION,
];

export const ABILITIES = [
  {
    id: ABILITY_ID.PAYCHECK_BONUS,
    name: "Tiền thưởng",
    description: "Tặng một người chơi +25% số dư của họ.",
    price: 500,
    enabled: false,
    purchased: false,
    isActive: false,
    image: "abilities-paycheck",
    descriptionEnemy: "just increase your balance by 25%",
  },
  {
    id: ABILITY_ID.SUPPLY_CRATE,
    name: "Thùng tiếp tế",
    description: "Thêm 7 đơn vị cho tất cả các loại đồ ăn của bạn.",
    price: 1000,
    enabled: false,
    purchased: false,
    isActive: true,
    image: "abilites-supply",
  },
  {
    id: ABILITY_ID.HAPPY_CUSTOMER,
    name: "Vị Khách Vui Vẻ",
    description: "5 vị khách tiếp theo của bạn sẽ trả gấp đôi.",
    price: 2500,
    enabled: false,
    purchased: false,
    isActive: true,
    image: "abilities-happy",
  },
  {
    id: ABILITY_ID.TRASH_THE_FOOD,
    name: "Phá Hoại Đồ Ăn",
    description: "Giảm 3 đơn vị mỗi loại đồ ăn của một người chơi.",
    price: 5000,
    enabled: false,
    purchased: false,
    isActive: false,
    image: "abilites-trash",
    descriptionEnemy: "just decreased your food stocks by 3",
  },
  {
    id: ABILITY_ID.TAXES,
    name: "THUẾ!",
    description: "Giảm 25% số dư của một người chơi.",
    price: 7500,
    enabled: false,
    purchased: false,
    isActive: false,
    image: "abilites-taxes",
    descriptionEnemy: "just decreased your balance by 25%",
  },
  {
    id: ABILITY_ID.HEALTH_INSPECTION,
    name: "Kiểm Tra Đồ Ăn",
    description: "Buộc một người chơi phải chờ 12 giây.",
    price: 10000,
    enabled: false,
    purchased: false,
    isActive: false,
    image: "abilites-health",
  },
  {
    id: ABILITY_ID.RUN_IT_BACK,
    name: "Mua Lại Toàn Bộ",
    description: "Có thể mua lại tất cả các kỹ năng của bạn một lần nữa.",
    price: 150000,
    enabled: false,
    purchased: false,
    isActive: true,
    image: "abilities-run",
  },
];

export const AVATARS_CUSTOMER = [
  "chick",
  "chicken",
  "cow",
  "goat",
  "horse",
  "pig",
  "sheep",
  "duck",
  "alpaca",
  "dog",
  "cat",
  "rabbit",
  "goldfish",
  "hamster",
  "turtle",
  "kitten",
  "puppy",
  "bear",
  "moose",
  "fox",
  "raccoon",
  "squirrel",
  "owl",
  "hedgehog",
  "deer",
  "wolf",
  "beaver",
  "tiger",
  "orangutan",
  "cockatoo",
  "parrot",
  "anaconda",
  "jaguar",
  "macaw",
  "toucan",
  "panther",
  "capuchinmonkey",
  "gorilla",
  "hippo",
  "rhino",
  "giraffe",
  "snowyowl",
  "polarbear",
  "arcticfox",
  "babypenguin",
  "penguin",
  "arctichare",
  "seal",
  "walrus",
  "witch",
  "wizard",
  "elf",
  "fairy",
  "slimemonster",
  "jester",
  "dragon",
  "queen",
  "unicorn",
  "king",
  "twoofspades",
  "eat",
  "drink",
  "alice",
  "queenofhearts",
  "dormouse",
  "whiterabbit",
  "cheshirecat",
  "caterpillar",
  "madhatter",
  "kingofhearts",
  "toast",
  "cereal",
  "yogurt",
  "breakfastcombo",
  "orangejuice",
  "milk",
  "waffle",
  "pancakes",
  "frenchtoast",
  "pizza",
  "earth",
  "meteor",
  "stars",
  "alien",
  "planet",
  "ufo",
  "spaceship",
  "astronaut",
  "lilbot",
  "lovelybot",
  "angrybot",
  "happybot",
  "watson",
  "buddybot",
  "brainybot",
  "megabot",
  "oldboot",
  "jellyfish",
  "clownfish",
  "frog",
  "crab",
  "pufferfish",
  "blobfish",
  "octopus",
  "narwhal",
  "dolphin",
  "babyshark",
  "megalodon",
  "panda",
  "sloth",
  "tenrec",
  "flamingo",
  "zebra",
  "elephant",
  "lemur",
  "peacock",
  "chameleon",
  "lion",
  "amber",
  "dinoegg",
  "dinofossil",
  "stegosaurus",
  "velociraptor",
  "brontosaurus",
  "triceratops",
  "tyrannosaurusrex",
  "icebat",
  "icebug",
  "iceelemental",
  "rockmonster",
  "dink",
  "donk",
  "bushmonster",
  "yeti",
  "dingo",
  "echidna",
  "koala",
  "kookaburra",
  "platypus",
  "joey",
  "kangaroo",
  "crocodile",
  "sugarglider",
  "deckhand",
  "buccaneer",
  "swashbuckler",
  "treasuremap",
  "seagull",
  "jollypirate",
  "pirateship",
  "kraken",
  "captainblackbeard",
  "ant",
  "rhinobeetle",
  "ladybug",
  "fly",
  "worm",
  "bee",
  "mantis",
  "butterfly",
  "bananas",
  "watermelon",
  "cheese",
  "doughnut",
  "taco",
  "bao",
  "sushi",
  "cheeseburger",
  "sandwich",
  "pumpkin",
  "swampmonster",
  "frankenstein",
  "vampire",
  "zombie",
  "mummy",
  "caramelapple2",
  "candycorn",
  "crow",
  "werewolf",
  "ghost",
  "blackbear",
  "pumpkinpie",
  "chipmunk",
  "cornucopia",
  "autumncat",
  "pumpkinpuppy",
  "autumncrow",
  "turkey",
  "snowglobe",
  "holidaygift",
  "hotchocolate",
  "holidaywreath",
  "stocking",
  "gingerbreadman",
  "gingerbreadhouse",
  "reindeer",
  "snowman",
  "santaclaus",
];
