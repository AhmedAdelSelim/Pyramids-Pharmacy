# Pyramids Pharmacy

A pharmacy management system built with Django REST Framework and React.

## Prerequisites

- Docker
- Docker Compose

## Project Structure

Pyramids-Pharmacy/
├── backend/         # Django REST API
│   ├── Dockerfile
│   ├── pyproject.toml  # Poetry dependencies
│   └── poetry.lock
├── frontend/        # React Application
│   └── Dockerfile
└── docker-compose.yml

## Quick Start

1. Clone the repository:

git clone <repository-url>
cd Pyramids-Pharmacy

2. Start the services:

docker-compose up --build

The services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

3. Create superuser:

docker-compose exec backend python manage.py createsuperuser

## Development

To run migrations:

docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

To create test data:

docker-compose exec backend python manage.py shell

# Then in the Python shell:
from medications.models import Medication

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
- Poetry
- Docker

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Docker

## Common Issues

1. Database Connection:
- Check if PostgreSQL container is running:
  docker-compose ps
- Check logs:
  docker-compose logs db

2. CORS Issues:
- Check CORS settings in backend/settings.py
- Verify API URL in frontend .env file

3. Container Issues:
- Rebuild containers:
  docker-compose up --build
- Check logs:
  docker-compose logs [service_name]

## Development Commands

### View logs
docker-compose logs -f [service_name]

### Restart services
docker-compose restart [service_name]

### Stop all services
docker-compose down

### Remove volumes



