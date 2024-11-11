#!/bin/sh

# Wait for database
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
  echo "Waiting for database connection..."
done
echo "Database is up!"

# Install dependencies using Poetry
echo "Installing dependencies..."
poetry install --no-interaction --no-ansi

# Apply database migrations
echo "Making migrations..."
poetry run python manage.py makemigrations
poetry run python manage.py migrate

# Create superuser if not exists
echo "Creating superuser..."
poetry run python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
END

# Start server
echo "Starting server..."
poetry run python manage.py runserver 0.0.0.0:8000