# Excpected dir: backend
FROM python:3.13

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install python packages
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY django .

# Expose port 8000
EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate && gunicorn FlowCord.wsgi:application --bind 0.0.0.0:8000"]