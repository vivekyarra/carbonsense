const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Go to deployed frontend
  const appUrl = 'https://carbonsense-frontend-806649223406.us-central1.run.app';
  console.log(`Navigating to ${appUrl}`);
  
  await page.goto(appUrl, { waitUntil: 'networkidle0' });
  
  // Take screenshot of login page
  const loginScreenshotPath = path.join(__dirname, 'login_page.png');
  await page.screenshot({ path: loginScreenshotPath, fullPage: true });
  console.log(`Login page screenshot saved to ${loginScreenshotPath}`);
  
  // Click Register link
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const registerLink = links.find(l => l.textContent.includes('Sign up') || l.textContent.includes('Register') || l.href.includes('register'));
    if (registerLink) registerLink.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Fill register form
  const email = `testuser_${Date.now()}@example.com`;
  
  await page.type('input[type="text"]', 'Test User').catch(e => {}); // name
  await page.type('input[type="email"]', email);
  await page.type('input[type="password"]', 'Password123!');
  
  // Click submit
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.textContent.includes('Register') || b.textContent.includes('Sign up'));
    if (submitBtn) submitBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 3000)); // Wait for API response and redirect
  
  // Take screenshot of dashboard
  const dashboardScreenshotPath = path.join(__dirname, 'dashboard_inside.png');
  await page.screenshot({ path: dashboardScreenshotPath, fullPage: true });
  console.log(`Dashboard screenshot saved to ${dashboardScreenshotPath}`);
  
  await browser.close();
}

run().catch(console.error);
