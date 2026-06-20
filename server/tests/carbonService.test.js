const { calculateCO2, TRANSPORTATION_FACTORS, FOOD_FACTORS, ENERGY_FACTORS } = require('../src/services/carbonService');

describe('Carbon Calculator Service', () => {
  it('should calculate transport emissions correctly', () => {
    const expected = Number((TRANSPORTATION_FACTORS.car_petrol * 10).toFixed(2));
    expect(calculateCO2('transportation', 'car_petrol', 10)).toEqual(expected);
  });

  it('should calculate food emissions correctly', () => {
    const expected = Number((FOOD_FACTORS.beef * 2).toFixed(2));
    expect(calculateCO2('food', 'beef', 2)).toEqual(expected);
  });

  it('should calculate energy emissions correctly', () => {
    const expected = Number((ENERGY_FACTORS.electricity_kwh * 100).toFixed(2));
    expect(calculateCO2('energy', 'electricity_kwh', 100)).toEqual(expected);
  });

  it('should return 0 for zero or negative quantity', () => {
    expect(calculateCO2('transportation', 'car_petrol', 0)).toEqual(0);
    expect(calculateCO2('transportation', 'car_petrol', -10)).toEqual(0);
  });

  it('should return 0 for unknown category', () => {
    expect(calculateCO2('unknown', 'car_petrol', 10)).toEqual(0);
  });

  it('should return 0 for unknown subcategory', () => {
    expect(calculateCO2('transportation', 'rocket', 10)).toEqual(0);
  });

  it('should return 0 for walking and bicycle', () => {
    expect(calculateCO2('transportation', 'walking', 10)).toEqual(0);
    expect(calculateCO2('transportation', 'bicycle', 10)).toEqual(0);
  });
});
