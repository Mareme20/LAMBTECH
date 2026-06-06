FROM python:3.11-slim

WORKDIR /usr/src/ia

# Install system build deps for scientific packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libpq-dev \
    python3-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY requirements.txt ./
RUN python -m pip install --upgrade pip setuptools wheel \
 && python -m pip install --no-cache-dir -r requirements.txt

# Copy IA code
COPY . /usr/src/ia

# Ensure entrypoint is executable and available
COPY entrypoint.sh /usr/local/bin/ia-entrypoint.sh
RUN chmod +x /usr/local/bin/ia-entrypoint.sh

ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["/usr/local/bin/ia-entrypoint.sh"]
