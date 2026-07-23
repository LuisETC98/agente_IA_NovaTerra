# 🏦 Asistente Interno RAG - Banco NovaTerra

## 📖 Descripción General
Este proyecto consiste en un agente de Inteligencia Artificial (Chatbot) diseñado específicamente para el uso interno de los empleados y colaboradores del **Banco NovaTerra**. Su propósito es responder de manera rápida, precisa y segura a preguntas relacionadas con las políticas internas, tarifas, límites transaccionales y términos de servicio de la institución. 

El agente está construido bajo el paradigma **RAG (Generación Aumentada por Recuperación)**, lo que garantiza que las respuestas se basen estrictamente en la documentación oficial del banco, eliminando el riesgo de alucinaciones (inventar información).

---

## 🏗️ Arquitectura de la Solución
La solución implementa una arquitectura RAG estándar que consta de las siguientes fases:
1. **Ingesta de Datos:** Carga de documentos oficiales en formato PDF utilizando `PyPDFDirectoryLoader`.
2. **Procesamiento y División:** El texto se divide en fragmentos manejables mediante `RecursiveCharacterTextSplitter` para mantener el contexto semántico.
3. **Incrustaciones (Embeddings):** Los fragmentos de texto se convierten en vectores numéricos usando el modelo multilenguaje de Cohere.
4. **Base de Datos Vectorial:** Los vectores se almacenan localmente utilizando **FAISS**, permitiendo búsquedas de similitud ultrarrápidas.
5. **Recuperación y Generación:** Al recibir una pregunta, el sistema busca los fragmentos más relevantes en FAISS y se los pasa al LLM de Cohere junto con un *Prompt* de sistema estricto para formular la respuesta final.

---

## 🛠️ Tecnologías y Herramientas Utilizadas
* **Lenguaje:** Python 3.12
* **Interfaz de Usuario:** Streamlit
* **Framework IA:** LangChain & LangChain Classic
* **Modelo de Lenguaje (LLM):** Cohere (`command-r-08-2024` para generación y `embed-multilingual-v3.0` para embeddings).
* **Base de Datos Vectorial:** FAISS (Meta)
* **Gestión de Entorno:** `python-dotenv` para la carga segura de API Keys.

---

## 🚀 Instrucciones para Ejecutar el Proyecto (Local)

### 1. Clonar el repositorio y preparar archivos
Asegúrate de tener una carpeta llamada `documentos` en la raíz del proyecto que contenga los PDFs oficiales del banco.

### 2. Crear y activar el entorno virtual
Es altamente recomendable usar un entorno virtual para evitar conflictos de dependencias:

`python -m venv venv`

**Activar en Windows:**
`venv\Scripts\activate`

**Activar en Mac/Linux:**
`source venv/bin/activate`

### 3. Instalar dependencias
Con el entorno virtual activado, instala los requerimientos:

`pip install -r requirements.txt`

### 4. Configurar Variables de Entorno
Crea un archivo llamado `.env` en la raíz del proyecto y añade tu clave de API de Cohere:

`COHERE_API_KEY=tu_clave_de_cohere_aqui`

### 5. Ejecutar la Aplicación
Inicia el servidor local de Streamlit:

`streamlit run app.py`

La aplicación se abrirá automáticamente en tu navegador web en `http://localhost:8501`.

---

## 💡 Ejemplos de Preguntas Soportadas
El agente está entrenado para responder consultas sobre la documentación cargada. Puedes probar con las siguientes preguntas:

* *"¿Cuál es la política de privacidad de la empresa y los derechos ARCO?"*
* *"¿Cuáles son los límites diarios para transferencias de una persona natural nueva?"*
* *"¿Cuánto se cobra de comisión por girar dinero en el extranjero?"*
* *"¿Qué debo hacer si transfiero dinero a un RUT equivocado?"*
* *"¿Cuáles son las causales para que el banco cierre unilateralmente una cuenta?"*

---

## 🤖 Ejemplos de Respuestas Generadas por el Agente

**Pregunta del usuario:**
"¿Cuánto cuesta mantener la Tarjeta de Crédito Black?"

**Respuesta del Agente:**
"La Tarjeta de Crédito Black de Banco NovaTerra tiene un costo de mantención semestral de 3.0 UF. Cabe destacar que este costo es bonificable si se hace un uso frecuente de la tarjeta. Además, incluye beneficios como 6 accesos a salones VIP de aeropuertos."

---

**Pregunta del usuario:**
"¿Qué hago si un cliente pierde su teléfono móvil y tiene la App instalada?"

**Respuesta del Agente:**
"Según nuestro Protocolo de Seguridad, en caso de robo o pérdida del teléfono móvil, el cliente debe acceder a su sucursal web desde un computador seguro. Una vez allí, debe ingresar a la sección 'Seguridad > Mis Dispositivos' y proceder a desvincular forzosamente la sesión de la App móvil del teléfono extraviado."


##**Link web del proyecto (alojamiento en Oracle Cloud)**
* *http://161.153.217.56:8501/ 
