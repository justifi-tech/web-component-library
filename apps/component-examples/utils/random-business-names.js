const firstNames = [
  'Lemon', 'Orange', 'Apple', 'Berry', 'Cherry', 'Grape', 'Peach', 'Plum', 'Mango', 'Pineapple',
  'Banana', 'Coconut', 'Kiwi', 'Melon', 'Papaya', 'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Cranberry',
  'Dragonfruit', 'Guava', 'Lychee', 'Passionfruit', 'Pomegranate', 'Tangerine', 'Watermelon', 'Apricot', 'Fig', 'Grapefruit'
];

const lastNames = [
  'Juice', 'Stand', 'Shop', 'Market', 'Store', 'Cart', 'Stall', 'Bar', 'Corner', 'Spot',
  'Bistro', 'Cafe', 'Deli', 'Eatery', 'Grill', 'Joint', 'Lounge', 'Parlor', 'Place', 'Restaurant',
  'Tavern', 'Bakery', 'Buffet', 'Cantina', 'Diner', 'Inn', 'Kitchen', 'Pub', 'Ristorante', 'Saloon'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function generateRandomLegalName() {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const uniqueNumber = Math.floor(Math.random() * 1000); // Add a unique number to ensure uniqueness
  return `${firstName} ${lastName} ${uniqueNumber}`;
};

module.exports = { generateRandomLegalName };
