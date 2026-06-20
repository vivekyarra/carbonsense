import { describe, it, expect } from 'vitest';
import { calculateCO2 } from '../../utils/carbonCalculator';
import { formatDate, formatNumber } from '../../utils/formatters';

describe('carbonCalculator', () => {
  it('calculates transportation CO2 correctly', () => {
    expect(calculateCO2('transportation', 'car_petrol', 100)).toBe(19.2);
    expect(calculateCO2('transportation', 'bicycle', 50)).toBe(0);
  });

  it('returns 0 for unknown category', () => {
    expect(calculateCO2('unknown', 'item', 10)).toBe(0);
  });
});

describe('formatters', () => {
  it('formats dates', () => {
    expect(formatDate('2024-01-01')).toContain('Jan 1, 2024');
    expect(formatDate(null)).toBe('');
  });

  it('formats numbers', () => {
    expect(formatNumber(5)).toBe('5.0');
    expect(formatNumber(10.15)).toBe('10.2');
    expect(formatNumber(null)).toBe('0.0');
  });
});
