# 🏦 Portal Asistente Digital - Banco NovaTerra

## 📖 Descripción General
Portal oficial del **Banco NovaTerra**, diseñado con una interfaz moderna, limpia y de nivel empresarial para responder de manera rápida, precisa y segura consultas sobre normativas bancarias, tarifas, límites de transferencias, políticas de seguridad y ley de fraudes.

La plataforma cuenta con una arquitectura desacoplada **Full-Stack**:
- **Backend (API REST):** Desarrollado en Python con **FastAPI** y el motor de recuperación documental **LangChain + FAISS + Cohere**.
- **Frontend (SPA):** Desarrollado en **React 18 + Vite**, con estilos utilitarios modernos en **Tailwind CSS**, iconografía en **Lucide React** y efectos interactivos (Mesh Gradients y Orbe Prisma Nova).

---

## 🏗️ Estructura del Proyecto

```text
agente_IA_NovaTerra/
├── backend/
│   ├── api.py                    # Servidor REST FastAPI (Endpoint POST /api/chat)
│   ├── motor_rag.py              # Motor de inferencia y base vectorial FAISS
│   ├── documentos/               # Documentos normativos oficiales en PDF
│   └── requirements_backend.txt  # Dependencias Python
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Aplicación interactiva React y comunicación con API
│   │   ├── main.jsx              # Punto de entrada de la SPA
│   │   └── index.css             # Configuración Tailwind CSS
│   ├── index.html                # Plantilla HTML con tipografías Inter y Poppins
│   ├── package.json              # Dependencias de Node.js
│   ├── vite.config.js            # Configuración de Vite
│   └── tailwind.config.js        # Configuración de Tailwind CSS
├── api.py                        # Punto de entrada raíz alternativo para FastAPI
├── requirements_backend.txt      # Requerimientos backend en la raíz
└── README.md
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Lenguaje:** Python 3.12
* **Framework Web:** FastAPI & Uvicorn
* **Framework IA:** LangChain & LangChain Community
* **Embeddings & LLM:** Cohere (`embed-multilingual-v3.0` y `command-r-08-2024`)
* **Base Vectorial:** FAISS (Facebook AI Similarity Search)
* **Gestión de Entorno:** `python-dotenv`

### Frontend
* **Framework:** React 18+ con Vite
* **Estilos:** Tailwind CSS 3 (Diseño responsivo, modo oscuro/claro, Glassmorphism y Mesh Gradients)
* **Iconografía:** Lucide React
* **Tipografía:** Inter y Poppins (Google Fonts)

---

## 🚀 Instrucciones para Levantar el Proyecto Localmente

### 1. Configuración del Backend (FastAPI)

1. Crear y activar el entorno virtual de Python:
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # En Linux/Mac
   # venv\Scripts\activate     # En Windows
   ```

2. Instalar las dependencias del backend:
   ```bash
   pip install -r requirements_backend.txt
   ```

3. Configurar la clave de API en un archivo `.env`:
   ```bash
   COHERE_API_KEY=tu_clave_de_cohere_aqui
   ```

4. Iniciar el servidor backend:
   ```bash
   uvicorn api:app --reload
   ```
   *El servidor quedará disponible en:* `http://localhost:8000`  
   *Documentación Swagger interactiva:* `http://localhost:8000/docs`

---

### 2. Configuración del Frontend (React + Vite)

1. Ingresar a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Instalar las dependencias de Node.js:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
   *La aplicación web estará disponible en:* `http://localhost:5173`

---

## 💡 Consultas Soportadas por el Asistente

El asistente está respaldado por la documentación oficial vigente del banco:
* **Protocolo Ley de Fraudes (Normativa N° 20.009):** Umbrales de 35 UF, plazos de restitución de 5 días hábiles y declaraciones juradas.
* **Tarifario Internacional:** Comisiones por giros en el exterior (cajeros Plus/Cirrus) y exenciones del Plan Signature.
* **Límites de Transferencias (Política TEF):** Límites de $250.000 para destinatarios nuevos en las primeras 24h y topes para cuentas Empresa y Pyme.
* **Privacidad y Derechos ARCO:** Resguardo de datos por 5 años según la CMF y ejercicio de derechos de acceso y rectificación.
* **Términos de Canales Digitales:** Protocolos de seguridad NovaPass y responsabilidades del titular.
