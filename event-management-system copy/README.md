# Event Management System

A full-stack application for managing events, attendees, and registrations.

## Project Structure

- `/app` - Modular FastAPI backend application
  - `/api` - API endpoints and routes
  - `/core` - Core functionality like security
  - `/db` - Database configuration
  - `/models` - SQLAlchemy ORM models
  - `/schemas` - Pydantic schemas for validation
- `/frontend` - React frontend application
- `event_management.db` - SQLite database file
- `run.py` - Script to start the backend server
- `run_migrations.py` - Script to initialize the database
- `seed_data.py` - Script to populate the database with sample data

## Getting Started

### Prerequisites
- Python 3.7+ installed (Python 3.13 supported with latest package versions)
- Node.js and npm installed (for the frontend)
- Git (optional, for cloning the repository)

### Quick Setup
To quickly get started, follow these commands:

```bash
# 1. Clone the repository (if you haven't already)
# git clone <repository-url>

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Initialize database
python run_migrations.py

# 5. Seed the database with sample data
python seed_data.py

# 6. Start the backend server
python run.py  # In a separate terminal window or as a background process

# 7. Set up and start the frontend
cd frontend
npm install
npm run dev
```

After these steps:
- Backend API: http://localhost:8000
- API documentation: http://localhost:8000/docs
- Frontend: http://localhost:5173

### Step-by-Step Setup

#### Step 1: Set Up the Backend

1. Make sure you have Python 3.7+ installed
2. Create a virtual environment and activate it:
   ```
   python3 -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
   
   **Note for Python 3.13 users:** If you encounter compatibility issues, try removing the version constraints in requirements.txt:
   ```
   # Edit requirements.txt to remove version numbers
   fastapi
   uvicorn
   sqlalchemy
   # etc.
   ```
   
4. Initialize the database:
   ```
   python3 run_migrations.py
   ```
5. (Optional) Seed the database with sample data:
   ```
   python3 seed_data.py
   ```
6. Run the backend server:
   ```
   python3 run.py
   ```
7. The API will be available at `http://localhost:8000`
8. Access the API documentation at `http://localhost:8000/docs`

#### Step 2: Set Up the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173`

### Sample Data

When you run the `seed_data.py` script, the following sample data is created:

#### Users
- **Admin User**: 
  - Email: admin@example.com
  - Password: admin123
- **Regular Users**:
  - Email: user1@example.com / Password: password123
  - Email: user2@example.com / Password: password123

#### Categories
- Conference
- Workshop
- Seminar
- Networking
- Party

#### Events
- Annual Tech Conference (organized by admin)
- Python Workshop (organized by admin)
- AI and Machine Learning Seminar (organized by user1)

You can use these credentials to log in and explore the application.

### Troubleshooting
- If you encounter database issues, you may need to run `python run_migrations.py` again.
- If you get a "No module named" error, ensure you have activated your virtual environment and installed all dependencies.
- Make sure both the backend (port 8000) and frontend (port 5173) servers are running simultaneously.
- If you have CORS issues, ensure the frontend URL is properly configured in the backend.
- If using Python 3.13, make sure to use the latest package versions without pinning specific versions in requirements.txt.

## Features

- User authentication with JWT tokens
- Event management (create, read, update, delete)
- Category management 
- Registration for events and ticket generation
- Admin dashboard with stats
- User profiles and ticket management

## API Endpoints

The main API endpoints are:

- `/api/auth/register` - Register a new user
- `/api/auth/login` - Login and get JWT token
- `/api/users/me` - Get current user profile
- `/api/events` - List, filter, and create events
- `/api/categories` - List and manage categories
- `/api/events/{event_id}/register` - Register for an event
- `/api/tickets` - Manage user tickets
- `/api/admin/stats` - Get system statistics

## Modular vs Monolithic Application

The project contains a modular backend application with better separation of concerns.

The modular structure provides:

- Better maintainability
- Cleaner code organization
- Easier testing
- Better reusability of components
- Easier to extend with new features 