# Pyramids Pharmacy

A pharmacy management system built with Django REST Framework and React.

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- pip (Python package manager)
- npm (Node package manager)

## Project Structure

Pyramids-Pharmacy/
├── backend/         # Django REST API
│   ├── pyproject.toml  # Poetry dependencies
│   └── poetry.lock
└── frontend/        # React Application

## Backend Setup

1. Install Poetry (if not already installed):

curl -sSL https://install.python-poetry.org | python3 -

2. Navigate to backend directory and install dependencies:

cd backend
poetry install

3. Configure PostgreSQL:

# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE medication_db;

4. Activate Poetry shell and apply migrations:

poetry shell
python manage.py makemigrations
python manage.py migrate

5. Create superuser:

python manage.py createsuperuser

6. Run development server:

python manage.py runserver

The backend will be available at http://localhost:8000

## Frontend Setup

1. Install dependencies:

cd frontend
npm install

2. Run development server:

npm run dev

The frontend will be available at http://localhost:5173

## API Endpoints

### Authentication
- POST /api/token/ - Get JWT tokens
- POST /api/token/refresh/ - Refresh JWT token

### Medications
- GET /api/medications/ - List all medications
- POST /api/medications/ - Create new medication
- GET /api/medications/<id>/ - Get medication details
- PUT /api/medications/<id>/ - Update medication
- DELETE /api/medications/<id>/ - Delete medication

### Refill Requests
- GET /api/refill-requests/ - List all refill requests
- POST /api/refill-requests/ - Create new refill request
- GET /api/refill-requests/<id>/ - Get refill request details
- PUT /api/refill-requests/<id>/ - Update refill request
- DELETE /api/refill-requests/<id>/ - Delete refill request

## Features

### Admin Features
- Manage medications (add, edit, delete)
- View and process refill requests
- Track medication inventory
- Manage user accounts

### User Features
- View available medications
- Request medication refills
- Track refill request status
- View refill history

## Models

### Medication
- name (CharField)
- description (TextField)
- dosage (CharField)
- available (BooleanField)
- quantity (IntegerField)
- created_at (DateTimeField)

### RefillRequest
- user (ForeignKey to User)
- medication (ForeignKey to Medication)
- amount (IntegerField)
- status (CharField: PENDING/APPROVED/DENIED)
- created_at (DateTimeField)
- updated_at (DateTimeField)
- notes (TextField)

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

## Development

1. Access Django Admin:

http://localhost:8000/admin

2. Create test data:

# In Django shell (python manage.py shell)
from medications.models import Medication
from django.contrib.auth.models import User

# Create test medications
medications = [
    {
        'name': 'Aspirin',
        'description': 'Pain reliever',
        'dosage': '325mg',
        'quantity': 100
    },
    {
        'name': 'Ibuprofen',
        'description': 'Anti-inflammatory',
        'dosage': '200mg',
        'quantity': 50
    }
]

for med in medications:
    Medication.objects.get_or_create(**med)

## Common Issues

1. Database Connection:
- Ensure PostgreSQL is running
- Check database credentials in settings.py

2. CORS Issues:
- Check CORS settings in backend/settings.py
- Verify API URL in frontend

3. Authentication:
- Ensure JWT tokens are properly configured
- Check token expiration settings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details