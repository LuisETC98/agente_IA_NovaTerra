import streamlit as st
from motor_rag import inicializar_agente

# Configuración de la página (pestaña del navegador)
st.set_page_config(page_title="Asistente NovaTerra", layout="centered")

# Cabecera corporativa y descripción
st.title("Portal de Asistencia - Banco NovaTerra")

st.markdown("""
**¡Hola, equipo! Soy NovaAgent, tu asistente impulsado por IA.**
Estoy aquí para ayudarte a encontrar rápidamente información oficial sonre el banco para una mejor atención. 

**¿Qué información manejo?**
Conozco a la perfección la documentación interna actualizada. Puedes preguntarme sobre:

* **Seguridad y Privacidad:** Tratamiento de datos (ARCO), prevención de fraudes, Ley de Fraudes y uso de MFA.
* **Términos Legales:** Normativa de canales digitales, responsabilidades del cliente y causales de cierre de cuentas.
* **Límites Operativos:** Montos máximos diarios (TEF), tiempos de proceso y protocolos de reversión.
* **Tarifas:** Costos de mantención, comisiones por giros (nacionales/extranjero) y reposición de tarjetas.

**Ejemplos de cómo preguntarme:**
> *"¿Cuál es el límite de transferencias para un cliente nuevo?"*
> *"¿Cuánto cobramos por un giro internacional en un cajero?"*
> *"¿Qué debo hacer si un cliente reporta un fraude en su cuenta?"*

---
""")

# Inicializar el agente RAG (usamos caché para no procesar los PDF en cada mensaje)
@st.cache_resource
def cargar_agente():
    with st.spinner("Cargando y procesando documentos base..."):
        return inicializar_agente()

agente = cargar_agente()

# Inicializar el historial de chat en la sesión
if "mensajes" not in st.session_state:
    st.session_state.mensajes = []

# Mostrar mensajes anteriores
for msg in st.session_state.mensajes:
    with st.chat_message(msg["rol"]):
        st.markdown(msg["contenido"])

# Entrada de usuario
if prompt_usuario := st.chat_input("Escribe tu pregunta aquí..."):
    # Mostrar y guardar pregunta del usuario
    with st.chat_message("user"):
        st.markdown(prompt_usuario)
    st.session_state.mensajes.append({"rol": "user", "contenido": prompt_usuario})

    # Generar y mostrar respuesta del agente
    with st.chat_message("assistant"):
        with st.spinner("Buscando en la documentación..."):
            respuesta_rag = agente.invoke({"input": prompt_usuario})
            texto_respuesta = respuesta_rag["answer"]
            st.markdown(texto_respuesta)
            
    st.session_state.mensajes.append({"rol": "assistant", "contenido": texto_respuesta})