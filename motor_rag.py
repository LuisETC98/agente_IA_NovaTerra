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
    # 1. Cargar documentos PDF desde la carpeta
    loader = PyPDFDirectoryLoader("documentos")
    documentos = loader.load()

    # 2. Dividir los textos en fragmentos manejables
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=150
    )
    fragmentos = text_splitter.split_documents(documentos)

    # 3. Crear Embeddings (usamos el modelo multilenguaje de Cohere vital para español)
    embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")

    # 4. Almacenar en base de datos vectorial local (FAISS)
    vectorstore = FAISS.from_documents(fragmentos, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # 5. Configurar el LLM de Cohere
    llm = ChatCohere(model="command-r-08-2024", temperature=0.3)

    # 6. Crear el Prompt del sistema
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

    # 7. Unir todo en una cadena (Chain)
    qa_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, qa_chain)

    return rag_chain
