/**
 * @file App constants.
 */

export const CATEGORIES = [
  { id: 'transportation', label: 'Transportation', color: '#3b82f6' }, // blue-500
  { id: 'food', label: 'Food & Diet', color: '#f59e0b' }, // amber-500
  { id: 'energy', label: 'Home Energy', color: '#10b981' } // emerald-500
];

export const SUBCATEGORIES = {
  transportation: [
    { id: 'car_petrol', label: 'Car (Petrol)', unit: 'km' },
    { id: 'car_diesel', label: 'Car (Diesel)', unit: 'km' },
    { id: 'car_electric', label: 'Car (Electric)', unit: 'km' },
    { id: 'bus', label: 'Bus', unit: 'km' },
    { id: 'train', label: 'Train', unit: 'km' },
    { id: 'flight_domestic', label: 'Flight (Domestic)', unit: 'km' },
    { id: 'flight_international', label: 'Flight (International)', unit: 'km' },
    { id: 'motorcycle', label: 'Motorcycle', unit: 'km' },
    { id: 'bicycle', label: 'Bicycle', unit: 'km' },
    { id: 'walking', label: 'Walking', unit: 'km' }
  ],
  food: [
    { id: 'beef', label: 'Beef', unit: 'meal' },
    { id: 'lamb', label: 'Lamb', unit: 'meal' },
    { id: 'pork', label: 'Pork', unit: 'meal' },
    { id: 'chicken', label: 'Chicken', unit: 'meal' },
    { id: 'fish', label: 'Fish', unit: 'meal' },
    { id: 'vegetarian', label: 'Vegetarian', unit: 'meal' },
    { id: 'vegan', label: 'Vegan', unit: 'meal' },
    { id: 'dairy_heavy', label: 'Heavy Dairy', unit: 'meal' }
  ],
  energy: [
    { id: 'electricity_kwh', label: 'Electricity', unit: 'kWh' },
    { id: 'natural_gas_kwh', label: 'Natural Gas', unit: 'kWh' },
    { id: 'heating_oil_liter', label: 'Heating Oil', unit: 'liter' },
    { id: 'lpg_kg', label: 'LPG', unit: 'kg' }
  ]
};
