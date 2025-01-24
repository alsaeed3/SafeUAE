# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY . .

RUN apt-get update && apt-get upgrade \
	&& apt-get install -y \
	netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]