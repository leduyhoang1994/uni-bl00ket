import { Stock } from "@/model/model";
import CafeController from "./cafe.controller";

const game = new CafeController();
const getAvailStocks = () => {
  const stocks = game.getStocks();

  return stocks.reduce((acc, item) => {
    if (item.enabled) {
      acc.push(item);
    }
    return acc;
  }, [] as any[]).map((item: Stock) => `${item.name} - Level: ${item.currentIndexLevel} - Price: ${item.rewardPrices[item.currentIndexLevel]} - (${item.quantity} in stock)`).join(", ");
};

console.log("Balance hiện tại:", game.getBalance());
console.log("Food stock hiên tại", getAvailStocks());

for (let i = 0; i < 10; i++) {
  const nextQuestion = game.getQuestion();
  game.answerQuestion(nextQuestion.correctAnswerId);
}

console.log("Balance sau khi trả lời đúng 10 câu hỏi:", game.getBalance());
console.log("Food stock sau khi trả lời đúng 10 câu hỏi", getAvailStocks());

for (let i = 0; i < 10; i++) {
  const customer = game.getNextCustomer();
  game.serve(customer.id);
}

console.log("Balance sau khi phục vụ 3 khách hàng:", game.getBalance());
