const adjectives = [
  'Lemon', 'Orange', 'Apple', 'Berry', 'Cherry', 'Grape', 'Peach', 'Plum', 'Mango', 'Pineapple',
  'Banana', 'Coconut', 'Kiwi', 'Melon', 'Papaya', 'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Cranberry',
  'Dragonfruit', 'Guava', 'Lychee', 'Passionfruit', 'Pomegranate', 'Tangerine', 'Watermelon', 'Apricot', 'Fig', 'Grapefruit'
];

const nouns = [
  'Juice', 'Stand', 'Shop', 'Market', 'Store', 'Cart', 'Stall', 'Bar', 'Corner', 'Spot',
  'Bistro', 'Cafe', 'Deli', 'Eatery', 'Grill', 'Joint', 'Lounge', 'Parlor', 'Place', 'Restaurant',
  'Tavern', 'Bakery', 'Buffet', 'Cantina', 'Diner', 'Inn', 'Kitchen', 'Pub', 'Ristorante', 'Saloon'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function generateRandomLegalName() {
  const adjective = getRandomElement(adjectives);
  const noun = getRandomElement(nouns);
  const uniqueNumber = Math.floor(Math.random() * 1000); // Add a unique number to ensure uniqueness
  return `${adjective} ${noun} ${uniqueNumber}`;
};

module.exports = { generateRandomLegalName };
