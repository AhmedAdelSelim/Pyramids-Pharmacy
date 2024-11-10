FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH
ENV PATH="${PATH}:/root/.local/bin"

# Copy Poetry files
COPY pyproject.toml poetry.lock ./

# Configure Poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy project files
COPY . .

# Create necessary directories
RUN mkdir -p /app/static /app/media

# Copy scripts
COPY scripts/wait-for-it.sh /scripts/wait-for-it.sh
COPY scripts/entrypoint.sh /scripts/entrypoint.sh
RUN chmod +x /scripts/wait-for-it.sh /scripts/entrypoint.sh

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=pharmacy.settings

EXPOSE 8000

ENTRYPOINT ["/scripts/entrypoint.sh"] 