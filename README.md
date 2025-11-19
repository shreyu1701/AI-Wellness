# WellnessAI - AI-Powered Mood Tracking & Wellness Platform

A comprehensive wellness application that helps users track their moods, gain AI-powered insights, and maintain their mental health journey. Built with Next.js, MongoDB, and OpenAI integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [User Flows](#user-flows)
- [Features Details](#features-details)
- [Deployment](#deployment)

## 🎯 Overview

WellnessAI is a full-stack web application designed to help users:

- Track daily moods with detailed notes
- Visualize mood patterns and trends
- Receive AI-powered personalized wellness recommendations
- Monitor wellness statistics and streaks
- Manage account settings and preferences

## ✨ Features

### 1. **User Authentication**

- Secure user registration with email validation
- Password hashing using bcryptjs
- Session management via localStorage
- Protected routes with authentication checks

### 2. **Mood Tracking**

- Quick mood entry (Happy, Neutral, Sad)
- Detailed mood logging with:
  - Date and time selection
  - Energy level (1-10 scale)
  - Stress level (1-10 scale)
  - Notes/reflections
- Multiple mood entries per day support
- Mood history with chronological sorting

### 3. **Dashboard**

- Real-time statistics:
  - Current streak (consecutive days with mood entries)
  - Average mood score
  - AI insights count
  - Weekly mood log progress
- Interactive charts:
  - Mood trend line chart (last 7 days)
  - Mood distribution pie chart
- Quick mood entry modal
- AI recommendations preview

### 4. **Mood Tracker Page**

- Comprehensive mood entry form
- Weekly statistics display:
  - Average mood
  - Best day
  - Worst day
  - Current streak
- Visual charts:
  - Mood trend chart
  - Energy & Stress levels bar chart
- Recent mood entries list with full details
- Date and time display for each entry

### 5. **AI Insights**

- AI-powered recommendations based on mood notes
- Personalized actionable tasks
- Priority-based categorization (High, Medium, Low)
- Category filtering (Mindfulness, Activity, Sleep, Nutrition, Social, Other)
- Fallback insights when AI is unavailable
- Refresh functionality

### 6. **Settings**

- **Profile Management:**
  - Update name, email, and bio
  - Real-time sidebar updates
  - Profile persistence in database
- **Password Management:**
  - Secure password change
  - Current password verification
  - Password strength validation
  - Show/hide password toggle
- **Notifications:**
  - Email notifications toggle
  - Push notifications toggle
  - Weekly summary toggle
- **Data Management:**
  - Export all wellness data as JSON
  - Account deletion with confirmation

### 7. **UI/UX Features**

- Glass morphism design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states and skeletons
- Success/Error notification popups

## 🛠 Technology Stack

### Frontend

- **Framework:** Next.js 16.0.2 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Lucide React (Icons)
- **Charts:** Recharts 3.2.1
- **HTTP Client:** Axios 1.12.2
- **Animations:** Framer Motion 12.23.24

### Backend

- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** MongoDB (via Mongoose 8.19.3)
- **Authentication:** bcryptjs 3.0.3
- **AI Integration:** OpenAI SDK 6.8.1

### Development Tools

- **Package Manager:** npm
- **Linting:** ESLint 9
- **Type Checking:** TypeScript

## 📁 Project Structure

```
project-codecatalysts/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                    # API Routes
│   │   │   │   ├── auth/              # Authentication endpoints
│   │   │   │   │   ├── signup/       # User registration
│   │   │   │   │   ├── signin/       # User login
│   │   │   │   │   └── me/           # Get user info
│   │   │   │   ├── moods/            # Mood CRUD operations
│   │   │   │   │   └── stats/        # Mood statistics
│   │   │   │   ├── ai-insights/      # AI recommendations
│   │   │   │   └── user/             # User management
│   │   │   │       ├── update/       # Update profile
│   │   │   │       └── change-password/ # Change password
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   │   ├── page.tsx          # Main dashboard
│   │   │   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   │   │   ├── mood-tracker/     # Mood tracking page
│   │   │   │   ├── ai-insights/      # AI insights page
│   │   │   │   └── settings/         # Settings page
│   │   │   ├── signin/               # Sign in page
│   │   │   ├── signup/               # Sign up page
│   │   │   └── page.tsx              # Landing page
│   │   ├── models/                   # Mongoose models
│   │   │   ├── User.ts               # User schema
│   │   │   └── Mood.ts               # Mood schema
│   │   └── lib/                      # Utilities
│   │       └── db.ts                 # Database connection
│   ├── package.json
│   └── README.md
└── README.md                          # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- OpenAI API key (optional, for AI insights)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd project-codecatalysts
```

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellnessai?retryWrites=true&w=majority

# OpenAI API Key (Optional - for AI insights)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 5: Build for Production

```bash
npm run build
npm start
```

## ⚙️ Configuration

### MongoDB Setup

1. Create a MongoDB Atlas account or use local MongoDB
2. Create a new database cluster
3. Get your connection string
4. Add it to `.env` as `MONGODB_URI`
5. Ensure your IP is whitelisted (for Atlas)

### OpenAI Setup (Optional)

1. Create an OpenAI account
2. Generate an API key
3. Add it to `.env` as `OPENAI_API_KEY`
4. Without this key, AI insights will show fallback recommendations

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/signin`

Authenticate user and return user data.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Signed in successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/auth/me`

Get user information.

**Query Parameters:**

- `userId` (required): User ID

**Response:**

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "User bio"
  }
}
```

### Mood Endpoints

#### GET `/api/moods`

Fetch mood entries for a user.

**Query Parameters:**

- `userId` (required): User ID
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**

```json
{
  "moods": [
    {
      "_id": "mood_id",
      "userId": "user_id",
      "date": "2024-01-15T10:30:00.000Z",
      "moodType": "happy",
      "moodValue": 5,
      "energy": 8,
      "stress": 2,
      "notes": "Feeling great today!",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### POST `/api/moods`

Create a new mood entry.

**Request Body:**

```json
{
  "userId": "user_id",
  "date": "2024-01-15T10:30:00.000Z",
  "moodType": "happy",
  "moodValue": 5,
  "energy": 8,
  "stress": 2,
  "notes": "Feeling great today!"
}
```

**Response:**

```json
{
  "message": "Mood saved successfully",
  "mood": {
    "_id": "mood_id",
    "userId": "user_id",
    "date": "2024-01-15T10:30:00.000Z",
    "moodType": "happy",
    "moodValue": 5,
    "energy": 8,
    "stress": 2,
    "notes": "Feeling great today!"
  }
}
```

#### GET `/api/moods/stats`

Get mood statistics for a user.

**Query Parameters:**

- `userId` (required): User ID
- `days` (optional): Number of days (default: 7)

**Response:**

```json
{
  "averageMood": 4.2,
  "bestDay": "Monday",
  "worstDay": "Wednesday",
  "streak": 5,
  "totalEntries": 12
}
```

### AI Insights Endpoint

#### GET `/api/ai-insights`

Generate AI-powered wellness recommendations.

**Query Parameters:**

- `userId` (required): User ID

**Response:**

```json
{
  "insights": [
    {
      "id": 1,
      "title": "Morning Meditation",
      "description": "Based on your stress patterns, try 10 minutes of guided meditation each morning.",
      "category": "mindfulness",
      "priority": "high",
      "actionable": true,
      "date": "2 hours ago"
    }
  ]
}
```

### User Management Endpoints

#### PUT `/api/user/update`

Update user profile.

**Request Body:**

```json
{
  "userId": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Wellness enthusiast"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Wellness enthusiast"
  }
}
```

#### PUT `/api/user/change-password`

Change user password.

**Request Body:**

```json
{
  "userId": "user_id",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

## 🗄️ Database Schema

### User Model

```typescript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase, validated),
  password: String (required, min 6 characters, hashed),
  bio: String (optional, max 500 characters),
  createdAt: Date,
  updatedAt: Date
}
```

### Mood Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId (required, indexed, references User),
  date: Date (required, indexed, includes time),
  moodType: String (required, enum: ["happy", "neutral", "sad"]),
  moodValue: Number (required, min: 1, max: 5),
  energy: Number (optional, min: 1, max: 10),
  stress: Number (optional, min: 1, max: 10),
  notes: String (optional, max: 500 characters),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `{ userId: 1, date: -1 }` - For efficient querying and sorting

## 🔄 User Flows

### 1. Registration Flow

1. User visits signup page
2. Enters name, email, and password
3. System validates input
4. Password is hashed
5. User is created in database
6. User data is stored in localStorage
7. User is redirected to dashboard

### 2. Login Flow

1. User visits signin page
2. Enters email and password
3. System validates credentials
4. User data is stored in localStorage
5. User is redirected to dashboard

### 3. Mood Entry Flow

1. User selects mood (Happy/Neutral/Sad)
2. Modal opens with form fields
3. User fills in:
   - Date (defaults to today)
   - Energy level (slider)
   - Stress level (slider)
   - Notes
4. On save:
   - Current time is added to date
   - Entry is saved to database
   - Dashboard stats refresh
   - Success notification appears

### 4. Dashboard View Flow

1. User lands on dashboard
2. System fetches:
   - User data from localStorage
   - Mood statistics (last 7 days)
   - Mood entries for charts
   - AI recommendations
3. Data is displayed in:
   - Stats cards
   - Charts
   - Recommendations section

### 5. AI Insights Flow

1. User navigates to AI Insights page
2. System fetches recent mood entries with notes (last 30 days)
3. If OpenAI API key exists:
   - Notes are sent to OpenAI GPT Model
   - AI generates personalized recommendations
   - Recommendations are displayed
4. If no API key or error:
   - Fallback recommendations are shown
   - User-friendly message is displayed

### 6. Profile Update Flow

1. User navigates to Settings
2. User updates profile fields
3. On save:
   - Profile is updated in database
   - localStorage is updated
   - `userUpdated` event is dispatched
   - Sidebar refreshes with new name
   - Success notification appears

### 7. Password Change Flow

1. User clicks "Change Password" in Settings
2. Modal opens with password fields
3. User enters:
   - Current password
   - New password
   - Confirm password
4. System validates:
   - Current password is correct
   - New passwords match
   - New password meets requirements
5. Password is hashed and updated
6. Success notification appears

## 📊 Features Details

### Mood Tracking System

#### Multiple Entries Per Day

- Users can log multiple moods per day
- Each entry includes timestamp (date + time)
- Entries are sorted by most recent first
- Charts group entries by day and calculate daily averages

#### Streak Calculation

- Calculates consecutive days with mood entries
- Checks last 365 days for accurate streaks
- Groups entries by unique days
- Starts from today and counts backwards
- Handles gaps in entries correctly

#### Statistics Calculation

- **Average Mood:** Calculated from daily averages (prevents bias from multiple entries)
- **Best/Worst Day:** Based on daily average mood values
- **Streak:** Consecutive days with at least one entry

### AI Insights System

#### Recommendation Generation

- Analyzes mood notes from last 30 days
- Uses OpenAI GPT Models for analysis
- Generates 3-5 actionable recommendations
- Each recommendation includes:
  - Title
  - Description
  - Category
  - Priority level
  - Actionable flag

#### Fallback System

- Works without OpenAI API key
- Provides generic wellness recommendations
- Handles API errors gracefully
- Shows user-friendly error messages

### Data Visualization

#### Charts

- **Line Chart:** Shows mood trends over time (last 7 days)
- **Pie Chart:** Displays mood distribution percentages
- **Bar Chart:** Shows energy and stress levels

#### Data Processing

- Groups multiple entries per day
- Calculates daily averages
- Sorts chronologically
- Handles empty states gracefully

### Security Features

#### Authentication

- Password hashing with bcryptjs (10 rounds)
- Email validation
- Unique email constraint
- Protected routes with authentication checks

#### Password Management

- Current password verification
- Password strength validation (min 6 characters)
- Secure password hashing on update

### User Experience

#### Real-time Updates

- Sidebar updates when profile changes
- Dashboard refreshes after mood entry
- Event-driven updates across components

#### Notifications

- Success/Error popup notifications
- Auto-dismiss after 3 seconds
- Manual close option
- Visual distinction (green for success, red for error)

#### Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Adaptive layouts

## 🚢 Deployment

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
OPENAI_API_KEY=your-production-openai-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Commands

```bash
npm run build
npm start
```

### Deployment Platforms

- **Vercel:** Recommended for Next.js (automatic deployments)
- **Netlify:** Supports Next.js with configuration
- **AWS/DigitalOcean:** Requires Node.js server setup

## 📝 Notes

### Current Limitations

- No email verification system
- No password reset functionality
- No social authentication
- No data backup/restore beyond export

### Future Enhancements

- Email verification
- Password reset via email
- Social login (Google, GitHub)
- Push notifications
- Data backup/restore
- Advanced analytics
- Mood patterns detection
- Journaling features
- Community features
- Goals features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of an academic course project.

## 👥 Authors

- Project developed for Web Framework - 2 Course
- Semester 4, Humber College

---

**Last Updated:** 18 November, 2025
**Version:** 1.0.0
