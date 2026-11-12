import { shuffle, pick } from './rng.js';

export const NAMES = [
  'Sarah', 'Mike', 'Aisha', 'Carlos', 'Priya', 'Yuki', 'Emma', 'Liam', 'Sofia', 'Noah', 'John',
  'Chloe', 'Ravi', 'Diego', 'Fatima', 'Amara', 'Lucas', 'Mei', 'Omar', 'Hana', 'Kofi', 'Ingrid', 'Mateo'
];

export const WORLD_CITIES = [
  'Cairo', 'Mumbai', 'Berlin', 'Sydney', 'Rio de Janeiro', 'Tokyo', 'Paris', 'New York', 'Cape Town', 'Reykjavik'
];

export const CONTEXTS = {
  rides:     { item: 'festival rides', singular: 'ride', fee: 'admission entry pass', money: 'tokens' },
  tickets:   { item: 'concert tickets', singular: 'ticket', fee: 'service booking fee', money: 'tokens' },
  notebooks: { item: 'geometry grid notebooks', singular: 'notebook', fee: 'delivery voucher', money: 'tokens' },
  recipe:    { item: 'festival party punch', unit: 'cups of juice', noun: 'guests' },
  models:    { item: 'architectural tower blueprints', unit: 'cm on blueprint', noun: 'meters in reality' },
  crafts:    { item: 'origami display packs', singular: 'pack', money: 'tokens' },
  museum:    { item: 'historical museum tokens', singular: 'exhibit', fee: 'audio headset rental', money: 'tokens' }
};

export function makeContext(rng) {
  const [n1, n2] = shuffle(rng, NAMES);
  const themeKey = pick(rng, Object.keys(CONTEXTS));
  return {
    name: n1,
    other: n2,
    theme: CONTEXTS[themeKey],
    themeKey
  };
}

