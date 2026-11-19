# Imagen base oficial de Python 3.11 optimizada
FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema requeridas para librerías nativas y healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements_backend.txt .
RUN pip install --no-cache-dir -r requirements_backend.txt

# Copiar archivos de lógica del servidor y base de conocimiento RAG
COPY backend/ ./backend/
COPY api.py motor_rag.py ./
COPY documentos/ ./documentos/
COPY faiss_index/ ./faiss_index/

# Asegurar que documentos e índices estén accesibles en ambas rutas
RUN cp -r documentos backend/ 2>/dev/null || true && \
    cp -r faiss_index backend/ 2>/dev/null || true

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

# Verificación de salud del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Comando de inicio del servidor FastAPI con Uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
