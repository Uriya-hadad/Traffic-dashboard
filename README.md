# Traffic Dashboard

An interactive fullstack web app to track and visualize daily, weekly, or monthly user traffic using **React**, **Firebase Firestore**, **Cloud Functions**, and **Firebase Authentication (Google)**.

## Features

* Secure Google Sign-In
* Visualize traffic in a chart and table
* Switch between daily / weekly / monthly aggregation views
* Filter by date range
* Sort by date or number of visits
* Add, Edit, Delete entries (only when authenticated)
* Paginated table view
* Firestore is read/write protected — all access goes through Cloud Functions

## Tech Stack

* Frontend: React + MUI (Material UI) + Recharts + React Router
* Backend: Firebase Cloud Functions + Firestore
* Auth: Firebase Authentication (Google Sign-In)

## Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/uriya-hadad/traffic-dashboard.git
cd traffic-dashboard
npm install
```
### 2. Start the frontend

```bash
npm run dev
```
