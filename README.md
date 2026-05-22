# 🟢 NEON FIT — Full-Stack Fitness Tracking App

> **Flutter (Mobile) + Node.js + MongoDB**  
> Dark gym aesthetic · Push/Pull/Legs split · Indian food support · JWT auth

---

## 📁 Project Structure

```
neonfit/
├── neonfit-backend/          # Node.js + Express + MongoDB API
│   ├── server.js             # Entry point
│   ├── models/index.js       # User, WorkoutLog, MealLog, ProgressLog
│   ├── routes/
│   │   ├── auth.js           # Register, Login, JWT
│   │   ├── workouts.js       # Log & fetch workouts
│   │   ├── diet.js           # Meal logging + Indian food DB
│   │   ├── progress.js       # Weight & body tracking
│   │   └── plans.js          # Weekly PPL split data
│   ├── middleware/auth.js     # JWT verification
│   ├── package.json
│   └── .env.example
│
└── neonfit-flutter/          # Flutter mobile application
    ├── pubspec.yaml
    └── lib/
        ├── main.dart                    # App entry + dark theme
        ├── services/api_service.dart    # HTTP client + models + food DB
        ├── providers/
        │   ├── auth_provider.dart       # Auth state
        │   ├── workout_provider.dart    # Workout state
        │   ├── diet_provider.dart       # Diet/protein state
        │   └── progress_provider.dart   # Progress state
        └── screens/
            ├── splash_screen.dart
            ├── main_navigation.dart
            ├── dashboard_screen.dart    # Home with stats
            ├── auth/login_screen.dart   # Login + Register tabs
            ├── workout/
            │   └── workout_screen.dart  # Exercise tracker + rest timer
            ├── diet/
            │   └── diet_screen.dart     # Meal logger + protein ring
            ├── progress/
            │   └── progress_screen.dart # Weight chart + history
            └── plan/
                └── plan_screen.dart     # Weekly PPL plan viewer
```

---

## 🚀 Quick Start

### Backend Setup

```bash
cd neonfit-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev        # with nodemon (auto-reload)
npm start          # production
```

**Required environment variables (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neonfit
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000
```

### Flutter Setup

```bash
cd neonfit-flutter

# Install dependencies
flutter pub get

# Update API base URL in lib/services/api_service.dart
# Change: static const String baseUrl = 'http://localhost:5000/api';
# To your backend URL (e.g., http://10.0.2.2:5000/api for Android emulator)

# Run on device/emulator
flutter run

# Build for release
flutter build apk --release      # Android
flutter build ios --release       # iOS
```

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Dashboard** | Today's workout type, protein progress, quick stats, meal preview |
| **Workout** | Day-specific exercises, set/rep logging, built-in rest timer |
| **Diet** | Meal logger with Indian food database, protein ring, calorie tracking |
| **Progress** | Weight trend chart (fl_chart), body metrics, photo log |
| **Plan** | Full weekly PPL split viewer with expandable exercise cards |

---

## 🍽️ Indian Food Database

20 foods pre-loaded (per 100g macros):

| Food | Protein | Calories |
|------|---------|----------|
| Eggs | 13g | 155 kcal |
| Egg Whites | 10.9g | 52 kcal |
| Paneer | 18g | 265 kcal |
| Soy Chunks | 52g | 336 kcal |
| Chana | 19g | 364 kcal |
| Dal | 9g | 116 kcal |
| Moong Dal | 24g | 347 kcal |
| Chicken Breast | 31g | 165 kcal |
| Whey Protein | 80g | 350 kcal |
| Oats | 17g | 389 kcal |
| + 10 more... | | |

---

## 🏋️ Weekly Split

```
Monday    → Push  (Chest, Shoulders, Triceps)
Tuesday   → Pull  (Back, Biceps, Rear Delts)
Wednesday → Legs  (Quads, Hamstrings, Calves)
Thursday  → Push  (Variation)
Friday    → Pull  (Variation)
Saturday  → Legs  (Variation)
Sunday    → REST  💤
```

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register    # Create account
POST   /api/auth/login       # Login → JWT
GET    /api/auth/me          # Get profile
PATCH  /api/auth/me          # Update profile
```

### Workouts
```
POST   /api/workouts         # Log workout
GET    /api/workouts         # Get history
GET    /api/workouts/today   # Today's log
PATCH  /api/workouts/:id     # Update workout
GET    /api/workouts/summary/weekly
```

### Diet
```
POST   /api/diet             # Log meal (auto-calculates macros)
GET    /api/diet             # Get meal history
GET    /api/diet/today       # Today's meals + totals
DELETE /api/diet/:id         # Delete meal
GET    /api/diet/foods       # Search food database
GET    /api/diet/foods?q=egg # Filter foods
```

### Progress
```
POST   /api/progress         # Log weight/measurements
GET    /api/progress         # Get history
GET    /api/progress/weekly  # Last 7 days
```

### Plans
```
GET    /api/plans            # Full weekly plan
GET    /api/plans/:day       # Single day plan
```

---

## 🛡️ Security Features

- JWT authentication (30-day expiry)
- bcrypt password hashing (12 rounds)
- Helmet.js HTTP headers
- Rate limiting (100 req/15min)
- CORS configuration
- Input validation

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.1.5",
  "dotenv": "^16.3.1"
}
```

### Flutter
```yaml
provider: ^6.1.1           # State management
http: ^1.1.2               # API calls
google_fonts: ^6.1.0       # Rajdhani + Inter typography
fl_chart: ^0.66.0          # Weight progress chart
percent_indicator: ^4.2.3  # Protein progress ring/bar
flutter_secure_storage: ^9.0.0  # JWT storage
intl: ^0.19.0              # Date formatting
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0A0A0A` |
| Card | `#111111` |
| Surface | `#1A1A1A` |
| Neon Green | `#39FF14` |
| Neon Orange | `#FF6B35` |
| Neon Blue | `#00D4FF` |
| Primary Font | Rajdhani (headings) |
| Body Font | Inter |

---

## 🔧 Production Checklist

- [ ] Set strong `JWT_SECRET` in production env
- [ ] Use MongoDB Atlas (cloud) instead of local
- [ ] Enable HTTPS/SSL
- [ ] Set `CLIENT_URL` to your actual domain
- [ ] Update `baseUrl` in `api_service.dart` to production URL
- [ ] Build Flutter release APK/IPA
- [ ] Add error monitoring (Sentry)
- [ ] Set up MongoDB indexes for performance

---

## 📈 Scaling Considerations

- Add Redis for session caching
- Implement pagination for workout/meal history
- Add push notifications (FCM) for workout reminders
- Implement offline-first with Hive local DB
- Add social features (friend leaderboard)
- Photo storage via AWS S3 or Cloudinary

---

*Built with 🟢 NEON FIT — Train Hard, Track Smart.*
