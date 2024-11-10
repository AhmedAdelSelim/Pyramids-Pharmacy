#!/bin/bash
set -e

# Wait for database
/scripts/wait-for-it.sh db:5432 -t 60

# Install dependencies using Poetry
echo "Installing dependencies..."
poetry install --no-interaction --no-ansi

# Apply database migrations
echo "Making migrations..."
poetry run python manage.py makemigrations admin
poetry run python manage.py makemigrations auth
poetry run python manage.py makemigrations contenttypes
poetry run python manage.py makemigrations sessions
poetry run python manage.py makemigrations medications

echo "Applying migrations..."
poetry run python manage.py migrate

# Create superuser if not exists
echo "Creating superuser..."
poetry run python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
END

# Collect static files
echo "Collecting static files..."
poetry run python manage.py collectstatic --noinput

# Start server
echo "Starting server..."
poetry run python manage.py runserver 0.0.0.0:8000 