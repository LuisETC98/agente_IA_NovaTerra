import os
import sys
from typing import List, Optional, Any, Dict
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Asegurar importación de motor_rag desde el directorio actual
try:
    from motor_rag import inicializar_agente
except ImportError:
    from .motor_rag import inicializar_agente

# Mapeo de metadatos de documentos normativos oficiales de Banco NovaTerra
CATALOGO_DOCUMENTOS: Dict[str, Dict[str, str]] = {
    "1_Politica_Privacidad.pdf": {
        "id": "DOC-04",
        "title": "Privacidad y Protección de Datos",
        "code": "Política de Privacidad ARCO",
        "tag": "Marco Legal",
        "updated": "Vigente 2026",
    },
    "2_Terminos_Condiciones.pdf": {
        "id": "DOC-05",
        "title": "Términos y Condiciones Canales Digitales",
        "code": "Reglamento de Operaciones",
        "tag": "Términos Legales",
        "updated": "Vigente 2026",
    },
    "3_FAQ_Transacciones.pdf": {
        "id": "DOC-03",
        "title": "Límites de Transferencias",
        "code": "Política Operativa TEF",
        "tag": "Seguridad Transaccional",
        "updated": "Vigente 2026",
    },
    "4_Seguridad_Fraude.pdf": {
        "id": "DOC-01",
        "title": "Protocolo Ley de Fraudes",
        "code": "Normativa N° 20.009",
        "tag": "Protección al Cliente",
        "updated": "Vigente 2026",
    },
    "5_Tarifas_Comisiones.pdf": {
        "id": "DOC-02",
        "title": "Tarifario Internacional",
        "code": "Anexo Tarifas Vigentes",
        "tag": "Comisiones y Exterior",
        "updated": "Vigente 2026",
    },
}

# Variable global para almacenar el agente RAG instanciado
agente_rag = None

def cargar_motor_rag():
    """Inicializa y almacena en caché el agente RAG."""
    global agente_rag
    if agente_rag is None:
        print("[INFO] Inicializando motor de inteligencia artificial RAG de Banco NovaTerra...")
        agente_rag = inicializar_agente()
        print("[INFO] Motor RAG cargado exitosamente.")
    return agente_rag

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-cargar el agente al iniciar el servidor para respuestas inmediatas
    try:
        cargar_motor_rag()
    except Exception as e:
        print(f"[ALERTA] No se pudo precargar el motor RAG al inicio: {e}")
    yield

app = FastAPI(
    title="Portal NovaTerra - API Asistente Digital",
    description="Backend oficial para consultas de normativa y asistencia bancaria de Banco NovaTerra",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS para permitir solicitudes desde el frontend React + Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic para Request / Response
class ChatRequest(BaseModel):
    pregunta: str = Field(..., description="Consulta del cliente o colaborador bancario")

class FuenteDocumento(BaseModel):
    archivo: str
    titulo: str
    codigo: str
    pagina: int
    extracto: str

class DocumentoReferencia(BaseModel):
    id: str
    title: str
    code: str
    tag: str
    updated: str
    snippet: str

class ChatResponse(BaseModel):
    respuesta: str
    fuentes: List[FuenteDocumento]
    documento: Optional[DocumentoReferencia] = None
    kpis: Optional[List[Dict[str, str]]] = None
    steps: Optional[List[str]] = None

@app.get("/")
def estado_api():
    """Endpoint raíz para verificar el estado de la API."""
    return {
        "institucion": "Banco NovaTerra",
        "servicio": "Asistente Digital Corporativo",
        "estado": "Operativo",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    """Endpoint de salud del servicio."""
    return {
        "status": "ok",
        "agente_inicializado": agente_rag is not None
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal de inferencia RAG.
    Recibe la pregunta, consulta la base documental y retorna la respuesta con metadatos oficiales.
    """
    pregunta = request.pregunta.strip()
    if not pregunta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La pregunta no puede estar vacía."
        )

    try:
        agente = cargar_motor_rag()
        if agente is None:
            raise RuntimeError("El agente no se encuentra disponible.")

        # Invocación de la cadena LangChain RAG
        resultado = agente.invoke({"input": pregunta})
        texto_respuesta = resultado.get("answer", "")
        context_docs = resultado.get("context", [])

        # Procesar fuentes y metadatos
        fuentes: List[FuenteDocumento] = []
        doc_referencia: Optional[DocumentoReferencia] = None

        for d in context_docs:
            src = d.metadata.get("source", "")
            filename = os.path.basename(src)
            page_num = d.metadata.get("page", 0) + 1
            meta = CATALOGO_DOCUMENTOS.get(filename, {
                "id": "DOC-OFICIAL",
                "title": filename.replace(".pdf", "").replace("_", " "),
                "code": "Normativa Vigente",
                "tag": "Documento Oficial",
                "updated": "Vigente 2026"
            })
            
            clean_content = d.page_content.strip().replace("\n", " ")
            snippet = clean_content[:260] + ("..." if len(clean_content) > 260 else "")

            fuentes.append(FuenteDocumento(
                archivo=filename,
                titulo=meta["title"],
                codigo=meta["code"],
                pagina=page_num,
                extracto=snippet
            ))

        # Construir documento de referencia principal para el Drawer
        if context_docs:
            primary_chunk = context_docs[0]
            p_filename = os.path.basename(primary_chunk.metadata.get("source", ""))
            p_meta = CATALOGO_DOCUMENTOS.get(p_filename, {
                "id": "DOC-OFICIAL",
                "title": p_filename.replace(".pdf", "").replace("_", " "),
                "code": "Normativa Vigente",
                "tag": "Documento Oficial",
                "updated": "Vigente 2026"
            })
            p_page = primary_chunk.metadata.get("page", 0) + 1
            p_clean = primary_chunk.page_content.strip()
            p_snippet = p_clean[:320] + ("..." if len(p_clean) > 320 else "")

            doc_referencia = DocumentoReferencia(
                id=p_meta["id"],
                title=p_meta["title"],
                code=f"{p_meta['code']} (Pág. {p_page})",
                tag=p_meta["tag"],
                updated=p_meta["updated"],
                snippet=p_snippet
            )

        return ChatResponse(
            respuesta=texto_respuesta,
            fuentes=fuentes,
            documento=doc_referencia,
            kpis=[],
            steps=[]
        )

    except Exception as e:
        print(f"[ERROR] Error procesando consulta en /api/chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error al procesar la consulta en la normativa bancaria."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
