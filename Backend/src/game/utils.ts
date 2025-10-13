import xlsx from "xlsx";

export function xlsx2json(data: any) {
  try {
    // 1. Đọc file Excel
    const workbook = xlsx.read(data);
    const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
    const worksheet = workbook.Sheets[sheetName];

    // 2. Chuyển đổi sheet thành một mảng các đối tượng JSON (dạng thô)
    const rawData = xlsx.utils.sheet_to_json(worksheet);

    // 3. Chuyển đổi dữ liệu thô sang định dạng mong muốn
    const formattedData = rawData.map((row: any, index) => {
      // Tạo cấu trúc câu trả lời
      const answers = [];
      // Lặp qua 4 câu trả lời (có thể thay đổi nếu bạn có nhiều hơn)
      for (let i = 1; i <= 4; i++) {
        const answerId = `[${i}]`;
        const answerText = row[`answer_${i}`];

        // Chỉ thêm vào mảng nếu cả ID và Text đều tồn tại
        if (answerId && answerText) {
          answers.push({
            id: String(answerId), // Đảm bảo ID là chuỗi
            text: String(answerText),
          });
        }
      }

      // Trả về đối tượng câu hỏi đã được định dạng
      return {
        id: "q" + String(index + 1),
        text: String(row.question_text),
        answers: answers,
        correctAnswerId: String(row.correct_answer),
      };
    });

    return formattedData;
  } catch (error) {
    return null;
  }
}
