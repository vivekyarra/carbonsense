/**
 * @file Seeds the database with demo user, activities, and tips.
 */

const bcrypt = require('bcryptjs');
const db = require('../models/db');
const { calculateCO2 } = require('../services/carbonService');
const logger = require('./logger');

const demoEmail = 'demo@carbonsense.com';

/**
 * Seeds the database with a demo user, sample activities, and carbon-reduction tips.
 * Uses a database transaction for atomicity and performance.
 * @returns {Promise<void>}
 */
async function seed() {
  try {
    logger.info('Starting database seed...');

    // 1. Create demo user
    const SALT_ROUNDS = 12;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const password_hash = await bcrypt.hash('Demo1234!', salt);

    let user = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail);
    let userId;

    if (!user) {
      const stmt = db.prepare('INSERT INTO users (email, password_hash, name, daily_target_kg) VALUES (?, ?, ?, ?)');
      const info = stmt.run(demoEmail, password_hash, 'Demo User', 10.0);
      userId = info.lastInsertRowid;
      logger.info('Demo user created.');
    } else {
      userId = user.id;
      // Clear existing activities for this user
      db.prepare('DELETE FROM activities WHERE user_id = ?').run(userId);
      logger.info('Demo user exists, cleared existing activities.');
    }

    // 2. Generate 30 days of activities
    const insertActivity = db.prepare(`
      INSERT INTO activities (user_id, category, subcategory, quantity, unit, co2_kg, activity_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const today = new Date();
    
    // Some sample data generation
    const transportOptions = [
      { sub: 'car_petrol', unit: 'km', min: 5, max: 30 },
      { sub: 'bus', unit: 'km', min: 10, max: 20 },
      { sub: 'car_electric', unit: 'km', min: 5, max: 30 },
      { sub: 'walking', unit: 'km', min: 1, max: 5 }
    ];
    
    const foodOptions = [
      { sub: 'beef', unit: 'meal' },
      { sub: 'chicken', unit: 'meal' },
      { sub: 'vegetarian', unit: 'meal' },
      { sub: 'vegan', unit: 'meal' }
    ];

    const energyOptions = [
      { sub: 'electricity_kwh', unit: 'kwh', min: 5, max: 15 },
      { sub: 'natural_gas_kwh', unit: 'kwh', min: 2, max: 8 }
    ];

    let activityCount = 0;

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Transport (1-2 per day)
      const numTransport = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numTransport; j++) {
        const opt = transportOptions[Math.floor(Math.random() * transportOptions.length)];
        const qty = Math.floor(Math.random() * (opt.max - opt.min + 1)) + opt.min;
        const co2 = calculateCO2('transportation', opt.sub, qty);
        insertActivity.run(userId, 'transportation', opt.sub, qty, opt.unit, co2, dateStr);
        activityCount++;
      }

      // Food (3 meals)
      for (let j = 0; j < 3; j++) {
        const opt = foodOptions[Math.floor(Math.random() * foodOptions.length)];
        const co2 = calculateCO2('food', opt.sub, 1);
        insertActivity.run(userId, 'food', opt.sub, 1, opt.unit, co2, dateStr);
        activityCount++;
      }

      // Energy (1 reading)
      const opt = energyOptions[Math.floor(Math.random() * energyOptions.length)];
      const qty = Math.floor(Math.random() * (opt.max - opt.min + 1)) + opt.min;
      const co2 = calculateCO2('energy', opt.sub, qty);
      insertActivity.run(userId, 'energy', opt.sub, qty, opt.unit, co2, dateStr);
      activityCount++;
    }
    
    logger.info(`Inserted ${activityCount} activities.`);

    // 3. Populate 20 tips
    const tipsCount = db.prepare('SELECT COUNT(*) as count FROM tips').get().count;
    if (tipsCount === 0) {
      const tipsData = [
        ['transportation', 'Switch to Public Transit', 'Taking the bus or train instead of driving can significantly reduce your daily emissions.', 3.2, 'medium'],
        ['transportation', 'Carpool to Work', 'Share the ride with colleagues to cut your commute emissions in half.', 2.5, 'medium'],
        ['transportation', 'Walk or Bike for Short Trips', 'For trips under 2km, walking or biking produces zero emissions.', 1.5, 'easy'],
        ['transportation', 'Maintain Tire Pressure', 'Properly inflated tires improve gas mileage and reduce emissions.', 0.5, 'easy'],
        ['transportation', 'Work from Home', 'Working from home one day a week eliminates your commute emissions.', 4.0, 'medium'],
        ['transportation', 'Switch to an EV', 'Electric vehicles produce zero tailpipe emissions and are much cleaner over their lifetime.', 8.0, 'hard'],
        ['transportation', 'Fly Less', 'Avoid one short-haul flight per year to save a massive amount of CO2.', 250.0, 'hard'],
        ['food', 'Meatless Mondays', 'Skipping meat one day a week saves significant emissions.', 2.0, 'easy'],
        ['food', 'Switch from Beef to Chicken', 'Chicken has a much lower carbon footprint than beef or lamb.', 3.5, 'medium'],
        ['food', 'Eat Local Produce', 'Locally grown food requires less transportation.', 0.5, 'easy'],
        ['food', 'Reduce Food Waste', 'Plan meals to avoid throwing away food, which also wastes the energy used to produce it.', 1.0, 'medium'],
        ['food', 'Compost Scraps', 'Composting reduces methane emissions from landfills.', 0.8, 'medium'],
        ['food', 'Try Plant-Based Milk', 'Oat or almond milk has a lower footprint than dairy milk.', 0.6, 'easy'],
        ['food', 'Go Vegan for a Week', 'A fully plant-based diet is the most effective way to reduce food emissions.', 15.0, 'hard'],
        ['energy', 'Switch to LED Bulbs', 'LEDs use up to 90% less energy than incandescent bulbs.', 1.5, 'easy'],
        ['energy', 'Unplug Vampire Electronics', 'Unplug devices when not in use to prevent phantom energy draw.', 0.5, 'easy'],
        ['energy', 'Wash Clothes in Cold Water', 'Heating water accounts for 90% of the energy used by washing machines.', 1.2, 'easy'],
        ['energy', 'Line Dry Clothes', 'Air drying clothes instead of using a dryer saves a lot of energy.', 2.0, 'medium'],
        ['energy', 'Install a Smart Thermostat', 'Optimize your heating and cooling to reduce wasted energy.', 3.0, 'medium'],
        ['energy', 'Switch to Renewable Energy', 'Opt-in to a green energy plan from your utility provider.', 10.0, 'hard']
      ];

      const insertTip = db.prepare('INSERT INTO tips (category, title, description, potential_saving_kg, difficulty) VALUES (?, ?, ?, ?, ?)');
      for (const t of tipsData) {
        insertTip.run(t[0], t[1], t[2], t[3], t[4]);
      }
      logger.info(`Inserted ${tipsData.length} tips.`);
    } else {
      logger.info('Tips already exist, skipping tips seed.');
    }

    logger.info('Database seed complete!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
