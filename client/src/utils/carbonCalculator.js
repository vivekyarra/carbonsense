/**
 * @file Client-side carbon emission calculations.
 */

export const TRANSPORTATION_FACTORS = {
  car_petrol: 0.192,
  car_diesel: 0.171,
  car_electric: 0.053,
  bus: 0.089,
  train: 0.041,
  flight_domestic: 0.255,
  flight_international: 0.195,
  motorcycle: 0.114,
  bicycle: 0.0,
  walking: 0.0
};

export const FOOD_FACTORS = {
  beef: 6.61,
  lamb: 5.84,
  pork: 2.15,
  chicken: 1.02,
  fish: 1.34,
  vegetarian: 0.63,
  vegan: 0.39,
  dairy_heavy: 1.20
};

export const ENERGY_FACTORS = {
  electricity_kwh: 0.233,
  natural_gas_kwh: 0.203,
  heating_oil_liter: 2.52,
  lpg_kg: 1.51
};

/**
 * Calculates CO2 emissions based on category, subcategory and quantity.
 * @param {string} category 
 * @param {string} subcategory 
 * @param {number} quantity 
 * @returns {number} The calculated CO2 estimate in kg.
 */
export function calculateCO2(category, subcategory, quantity) {
  if (quantity < 0) return 0;

  let factor;
  
  switch (category) {
    case 'transportation':
      factor = TRANSPORTATION_FACTORS[subcategory];
      break;
    case 'food':
      factor = FOOD_FACTORS[subcategory];
      break;
    case 'energy':
      factor = ENERGY_FACTORS[subcategory];
      break;
    default:
      return 0;
  }

  if (factor === undefined) return 0;

  return Number((factor * quantity).toFixed(2));
}
