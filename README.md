# CarbonSense - Carbon Footprint Awareness Platform

## Chosen Vertical
We have chosen to build a **Sustainability & Environment** application, specifically a **Carbon Footprint Awareness Platform**. This addresses the challenge of making users aware of how their daily choices contribute to carbon emissions, giving them actionable ways to track and reduce their footprint.

## Approach and Logic
Our core logic rests on providing an intuitive and seamless experience for users to log their activities across three primary categories: Transportation, Food, and Energy.
1. **Data Collection**: Users input their daily activities, specifying the subcategory and quantity.
2. **Standardized Factors**: We use standardized emission factors to convert distances, consumption, and quantities into kg of CO2 equivalent (CO2e).
3. **Data Visualization**: We aggregate these entries over time and display them back to the user in the form of charts, weekly trends, and carbon scores.
4. **Community Comparison & Tips**: To motivate behavioral change, we show users how they compare to an average community baseline and present tailored tips on how they can improve their habits.

## How the solution works
The solution is a full-stack application built using the following stack:
* **Frontend**: React 19 (via Vite), React Router for navigation, Recharts for data visualization, and Tailwind CSS for styling.
* **Backend**: Node.js + Express, handling secure RESTful APIs.
* **Database**: SQLite, used for ephemeral but fast tracking of users and activities.
* **Security & Auth**: Short-lived access tokens are stored only in browser memory. Rotating refresh tokens are restricted to secure, `httpOnly` cookies, and cookie-authenticated endpoints validate the browser origin.
* **Deployment**: Dockerized and deployed via Google Cloud Run (Frontend and Backend separately).

**Flow**:
1. A user creates an account and authenticates. The server returns a short-lived access token and sets a secure refresh-token cookie.
2. The user navigates to the "Log Activity" page to record daily actions (e.g. driving 15 km, eating beef).
3. The server processes the entry, calculates the CO2 equivalent using our `carbonService` module, and securely persists it into the SQLite database.
4. The dashboard queries the backend to fetch current statistics, breaking down emissions by category via an interactive donut chart, and showing the weekly trend via a bar chart.

## Architecture and quality gates

The client and API are independently deployable. Runtime configuration,
authentication policy, dashboard caching, and request middleware each have a
single owner instead of being duplicated across controllers.

Run the complete local quality gate from the repository root:

```powershell
npm run install:all
npm run check
```

The gate enforces linting, unit/integration tests with coverage thresholds,
production builds, and dependency audits. GitHub Actions runs the same gate on
every pull request and push to `master`.

For local development, copy `server/.env.example` to `server/.env`, replace both
JWT secrets, then run the API and client in separate terminals:

```powershell
npm run dev --prefix server
$env:VITE_API_URL='http://localhost:5000/api'
npm run dev --prefix client
```

The API exposes `GET /health` for deployment probes.

## Assumptions Made
1. **Ephemeral Data Storage**: SQLite is created at runtime and is not committed or baked into container images. In Cloud Run the database remains ephemeral; production persistence requires a managed database or mounted durable storage.
2. **Emission Factors**: The CO2e factors used are approximations meant for educational and awareness purposes. Real-world emissions can vary wildly based on location, exact modes of transport, or how food is sourced.
3. **Regional Baseline**: The "community average" is hardcoded to a generalized global average baseline rather than calculating real-time aggregates across the user base.
4. **Timezones**: We assume the local timezone of the client when grouping daily entries (e.g., using `YYYY-MM-DD` strings).
