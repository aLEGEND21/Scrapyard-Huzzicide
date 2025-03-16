FROM python:3.10.8

# Install dependencies
COPY requirements.txt .
RUN pip install -v --no-cache-dir -r requirements.txt

COPY . .

CMD python -u app.py