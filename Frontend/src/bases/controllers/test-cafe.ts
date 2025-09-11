import CafeController from "./cafe.controller";

const game = new CafeController();

// console.log('Balance hiện tại:', game.getBalance());
// console.log('Food stock hiên tại', game.getStocks());
// console.log('Food stock hiên tại', game.getShop());
const cust1 = game.getNextCustomer();
const cust2 = game.getNextCustomer();
const cust3 = game.getNextCustomer();
const cust3sds = game.getNextCustomer();
const custsd3 = game.getNextCustomer();
const cust4sd3 = game.getNextCustomer();
// const cu
// st2 = game.getNextCustomer();
// const cust3 = game.getNextCustomer();

// console.log('CUSTOMERS 1', cust1);

// ===================== TEST QUESTION =====================
// const q = game.getQuestion();
console.log('Cus', game.getCustomers().map(c=> c.avatarId));
// console.log('Food stock sau khi trả lời đúng:', game.getStocks());

// MUA cho khách 1
// game.serve(cust1.id);
// console.log('Balance sau khi mua khach 1:', game.cus());
// console.log('Food stock sau khi mua khach 1', game.getStocks());
// console.log('Shop sau khi mua khach 1', game.getShop());
// const customer4 = game.getNextCustomer();
// console.log('CUSTOMERS 4', customer4);

// const q2 = game.getQuestion();

// console.log('Abilities sau khi mua khach 1', game.getAbilities());
// game.buyShopItem('s2');
// console.log('Balance sau khi mua item', game.getBalance());
// console.log('Food stock sau khi mua item', game.getStocks());

// MUA cho khách 2
// const q2 = game.getQuestion();
// console.log(
//     'Trả lời đúng q2:',
//     game.answerQuestion(q2.correctAnswerId),
// );
// console.log('Food stock sau khi trả lời đúng:', game.getStocks());
// game.serve(cust2.id);
// console.log('Balance sau khi mua khach 2:', game.getBalance());
// console.log('Food stock sau khi mua khach 2', game.getStocks());
// console.log('Shop sau khi mua khach 2', game.getShop());
// // console.log('Abilities sau khi mua khach 2', game.getAbilities());
//
// // game.buyShopItem('s1');
// console.log('Balance sau khi mua s1:', game.getBalance());
// console.log('Food stock sau khi mua s1', game.getStocks());
// console.log('Shop sau khi mua s1', game.getShop());
// // game.buyShopItem('s2');
// console.log('Balance sau khi mua s2:', game.getBalance());
// console.log('Food stock sau khi mua s2', game.getStocks());
// console.log('Shop sau khi mua s2', game.getShop());

// ===================== TEST SHOP =====================
// console.log('\n--- Test Shop ---');
// console.log('Shop:', game.getShop());
// console.log('Mua coffee:', game.buyShopItem('s1'));
// console.log('Food stock sau khi mua coffee:', game.getStocks());
// console.log('Balance sau khi mua coffee:', game.getBalance());
//
// // ===================== TEST ABILITIES =====================
// console.log('\n--- Test Abilities ---');
// console.log('Abilities:', game.getAbilities());
// game.buyAbilityItem('2')
// game.buyAbilityItem('3')
// console.log('Abilities trc khi mua :', game.getAbilities());
// game.buyAbilityItem(2)

// console.log('Abilities sau khi mua 1 :', game.getAbilities());
// game.buyAbilityItem(3)
// console.log('Abilities sau khi mua 3:', game.getAbilities());

//
// console.log('Mua Supply Crate:', game.buyAbilityItem('1'));
// console.log('Food stock sau Supply Crate:', game.getStocks());
// console.log('Balance sau Supply Crate:', game.getBalance());
//
// console.log('Mua Happy Customer:', game.buyAbilityItem('2'));
// console.log('Abilities sau Happy Customer:', game.getAbilities());
// console.log('Balance sau Happy Customer:', game.getBalance());
//
// // ===================== RESET ABILITIES =====================
// console.log('\n--- Test Run it back ---');
// console.log('Mua Run it back:', game.buyAbilityItem('3'));
// console.log('Abilities sau Run it back:', game.getAbilities());
// console.log('Balance sau Run it back:', game.getBalance());

// ===================== FINAL =====================
// console.log('\n============================');
// console.log('Balance cuối cùng:', game.getBalance());
// console.log('Food stock cuối cùng:', game.getStocks());
// console.log('Abilities cuối cùng:', game.getAbilities());