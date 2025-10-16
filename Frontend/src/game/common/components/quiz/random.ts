export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomFromArray(arr: Array<any>) {
  // Generate a random index within the array's bounds
  const randomIndex = Math.floor(Math.random() * arr.length);

  // Return the element at the random index
  return arr[randomIndex];
}
