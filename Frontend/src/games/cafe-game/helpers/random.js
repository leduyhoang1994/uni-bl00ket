"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomFloat = getRandomFloat;
exports.randomFromArray = randomFromArray;
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function randomFromArray(arr) {
  // Generate a random index within the array's bounds
  var randomIndex = Math.floor(Math.random() * arr.length);
  // Return the element at the random index
  return arr[randomIndex];
}
