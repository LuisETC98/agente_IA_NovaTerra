import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings, ChatCohere
from langchain_community.vectorstores import FAISS

from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Cargar variable de entorno (COHERE_API_KEY)
load_dotenv()

def inicializar_agente():
    # 1. Crear Embeddings (usamos el modelo multilenguaje de Cohere vital para español)
    embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")

    # 2. Cargar o crear la base de datos vectorial persistente (FAISS)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    faiss_dir = os.path.join(base_dir, "faiss_index")

    # Si existe el índice en disco, cargarlo directamente en milisegundos
    if os.path.exists(faiss_dir) and os.path.exists(os.path.join(faiss_dir, "index.faiss")):
        vectorstore = FAISS.load_local(
            faiss_dir,
            embeddings,
            allow_dangerous_deserialization=True
        )
    else:
        # Cargar documentos PDF desde la carpeta
        doc_dir = "documentos" if os.path.exists("documentos") else os.path.join(base_dir, "documentos")
        loader = PyPDFDirectoryLoader(doc_dir)
        documentos = loader.load()

        # Dividir los textos en fragmentos manejables
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, 
            chunk_overlap=150
        )
        fragmentos = text_splitter.split_documents(documentos)

        # Crear y persistir la base de datos vectorial local (FAISS)
        vectorstore = FAISS.from_documents(fragmentos, embeddings)
        vectorstore.save_local(faiss_dir)

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # 3. Configurar el LLM de Cohere
    llm = ChatCohere(model="command-r-08-2024", temperature=0.3)

    # 4. Crear el Prompt del sistema
    system_prompt = (
        "Eres el asistente virtual oficial del Banco NovaTerra. "
        "Tu tarea es responder preguntas de los empleados y colaboradores "
        "utilizando ÚNICAMENTE la información proporcionada en el contexto. "
        "Si la respuesta no está en el contexto, indica amablemente que no tienes esa información, "
        "no inventes datos, tarifas ni políticas. Mantén un tono profesional y corporativo.\n\n"
        "Contexto recuperado:\n{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])

    # 5. Unir todo en una cadena (Chain)
    qa_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, qa_chain)

    return rag_chain
