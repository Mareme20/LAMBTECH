FROM python:3.12-slim

WORKDIR /usr/src/ia

# Install system deps required for psycopg2 and plotting libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    python3-dev \
    python3-setuptools \
    python3-distutils \
    pkg-config \
    gfortran \
    libatlas-base-dev \
    libopenblas-dev \
    liblapack-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy IA code
COPY . /usr/src/ia

# Install Python requirements system-wide (slim images may lack venv support)
RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install --no-cache-dir -r requirements.txt

# Ensure entrypoint is executable
COPY entrypoint.sh /usr/src/ia/entrypoint.sh
RUN chmod +x /usr/src/ia/entrypoint.sh

ENV PATH="/usr/local/bin:$PATH"
ENV PYTHONUNBUFFERED=1

CMD ["/usr/src/ia/entrypoint.sh"]
