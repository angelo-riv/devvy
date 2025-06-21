FROM python:3.10-slim

WORKDIR /app

COPY app.py /app/
COPY test_app.py /app/

RUN pip install flask pytest
CMD ["python", "test_app.py"]