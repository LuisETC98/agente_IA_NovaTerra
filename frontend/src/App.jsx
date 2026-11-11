import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  FileText,
  CreditCard,
  Scale,
  Activity,
  Lock,
  ArrowUpRight,
  Copy,
  Check,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  ChevronRight,
  BookOpen,
  RotateCcw,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// URL del backend FastAPI (configurable vía variable de entorno o localhost por defecto)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Base normativa oficial del banco (Lenguaje 100% corporativo y limpio)
const DOCS = [
  {
    id: 'DOC-01',
    title: 'Protocolo Ley de Fraudes',
    code: 'Normativa N° 20.009',
    tag: 'Protección al Cliente',
    updated: 'Vigente 2026',
    snippet: 'Art. 4°: El banco procederá a la restitución íntegra de los fondos reclamados en un plazo máximo de 5 días hábiles para montos iguales o inferiores a 35 UF.'
  },
  {
    id: 'DOC-02',
    title: 'Tarifario Internacional',
    code: 'Anexo Tarifas Vigentes',
    tag: 'Comisiones y Exterior',
    updated: 'Vigente 2026',
    snippet: 'Sección 3.2: Todo giro en cajeros automáticos del extranjero (Red Plus/Cirrus) aplica una tarifa fija de US$ 3.00 más 1.9% de comisión internacional. Clientes Plan Signature cuentan con giros liberados.'
  },
  {
    id: 'DOC-03',
    title: 'Límites de Transferencias',
    code: 'Política Operativa TEF',
    tag: 'Seguridad Transaccional',
    updated: 'Vigente 2026',
    snippet: 'Punto 1.8: Todo nuevo destinatario tendrá un límite máximo de $250.000 CLP durante las primeras 24 horas. Cuentas Empresas y Pyme operan hasta $15.000.000 CLP diarios con autorización NovaPass.'
  },
  {
    id: 'DOC-04',
    title: 'Privacidad y Protección de Datos',
    code: 'Política de Privacidad ARCO',
    tag: 'Marco Legal',
    updated: 'Vigente 2026',
    snippet: 'Cláusula 9: En cumplimiento con la Comisión para el Mercado Financiero (CMF), los registros históricos se resguardan por 5 años posteriores al cierre del producto.'
  },
  {
    id: 'DOC-05',
    title: 'Términos y Condiciones Canales Digitales',
    code: 'Reglamento de Operaciones',
    tag: 'Términos Legales',
    updated: 'Vigente 2026',
    snippet: 'Cláusula 4.1: El acceso a la banca en línea y canales móviles exige doble factor de autenticación NovaPass para resguardo y control del titular.'
  }
];

// Consultas rápidas sugeridas en la pantalla de bienvenida
const QUICK_PROMPTS = [
  {
    key: 'fraude',
    title: 'Cobertura por Fraudes',
    desc: 'Plazos de abono y protección legal',
    prompt: '¿Cuál es el protocolo y plazo por reclamo de fraude bajo la Ley de Fraudes?',
    icon: Scale,
    grad: 'from-cyan-500 to-blue-600'
  },
  {
    key: 'giro',
    title: 'Uso en el Extranjero',
    desc: 'Tarifas por giro internacional y beneficios',
    prompt: '¿Cuánto se cobra de comisión por giros en cajeros del extranjero?',
    icon: CreditCard,
    grad: 'from-emerald-500 to-teal-600'
  },
  {
    key: 'limites',
    title: 'Límites de Transferencia',
    desc: 'Montos máximos para personas y empresas',
    prompt: '¿Cuáles son los límites de transferencia TEF para un destinatario nuevo y cuentas empresa?',
    icon: Activity,
    grad: 'from-violet-500 to-indigo-600'
  },
  {
    key: 'privacidad',
    title: 'Privacidad de Datos',
    desc: 'Resguardo de historial y derechos ARCO',
    prompt: '¿Cómo funciona la política de privacidad y retención de datos según la normativa ARCO?',
    icon: ShieldCheck,
    grad: 'from-amber-500 to-orange-600'
  }
];

// SÍMBOLO INTERACTIVO CON IDENTIDAD: "ORBE PRISMA NOVA"
function NovaInteractiveOrb({ status, size = 'md', onClick, isDark }) {
  const [pulseClick, setPulseClick] = useState(false);

  const handleInteract = () => {
    setPulseClick(true);
    setTimeout(() => setPulseClick(false), 700);
    if (onClick) onClick();
  };

  // Colores y velocidades según estado del agente
  const themes = {
    idle: {
      primary: '#06b6d4',
      secondary: '#6366f1',
      accent: '#10b981',
      spinSpeed: '12s',
      label: 'En línea'
    },
    thinking: {
      primary: '#a855f7',
      secondary: '#06b6d4',
      accent: '#f43f5e',
      spinSpeed: '2.2s',
      label: 'Consultando normativa...'
    },
    speaking: {
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#3b82f6',
      spinSpeed: '4s',
      label: 'Información oficial'
    }
  };

  const active = themes[status] || themes.idle;
  const dimensions = size === 'lg' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-11 h-11';

  return (
    <div
      onClick={handleInteract}
      title="Haz clic para interactuar con Nova"
      className="relative inline-flex flex-col items-center justify-center cursor-pointer select-none group"
    >
      {/* Halo de Gradiente Atmosférico */}
      <div
        className={`absolute rounded-full blur-xl transition-all duration-700 ${
          size === 'lg' ? 'w-32 h-32 opacity-60 group-hover:opacity-90' : 'w-12 h-12 opacity-50 group-hover:opacity-80'
        } ${pulseClick ? 'scale-150 opacity-100' : 'scale-100'}`}
        style={{
          background: `conic-gradient(from 90deg, ${active.primary}, ${active.secondary}, ${active.accent}, ${active.primary})`
        }}
      />

      {/* Contenedor del Orbe SVG */}
      <div
        className={`relative ${dimensions} flex items-center justify-center transition-transform duration-500 ${
          pulseClick ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`orbGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={active.primary} />
              <stop offset="50%" stopColor={active.secondary} />
              <stop offset="100%" stopColor={active.accent} />
            </linearGradient>
            <radialGradient id={`coreGlow-${size}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor={active.primary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={active.secondary} stopOpacity="0.95" />
            </radialGradient>
          </defs>

          {/* Órbita Exterior Fluida */}
          <g
            style={{
              transformOrigin: '60px 60px',
              animation: `orbRotate ${active.spinSpeed} linear infinite`
            }}
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={`url(#orbGrad-${size})`}
              strokeWidth="2.5"
              strokeDasharray="28 14 10 14"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="60" cy="8" r="4" fill={active.primary} />
            <circle cx="60" cy="112" r="3" fill={active.accent} />
          </g>

          {/* Anillos Giroscópicos Cruzados */}
          <g
            style={{
              transformOrigin: '60px 60px',
              animation: `orbRotateReverse ${status === 'thinking' ? '1.8s' : '9s'} linear infinite`
            }}
          >
            <ellipse
              cx="60"
              cy="60"
              rx="42"
              ry="22"
              fill="none"
              stroke={`url(#orbGrad-${size})`}
              strokeWidth="2"
              opacity="0.65"
              transform="rotate(35 60 60)"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="42"
              ry="22"
              fill="none"
              stroke={active.primary}
              strokeWidth="1.5"
              strokeDasharray="16 20"
              opacity="0.65"
              transform="rotate(-35 60 60)"
            />
          </g>

          {/* Esfera Viva Central */}
          <g
            style={{
              transformOrigin: '60px 60px',
              animation: 'orbBreathe 3s ease-in-out infinite'
            }}
          >
            <circle cx="60" cy="60" r="22" fill={`url(#coreGlow-${size})`} />
            {/* Expresión/Ojos sutiles que le dan personalidad al Orbe */}
            <ellipse
              cx="53"
              cy="58"
              rx="2.2"
              ry={status === 'thinking' ? '1' : '3.2'}
              fill="#0f172a"
              opacity="0.75"
            />
            <ellipse
              cx="67"
              cy="58"
              rx="2.2"
              ry={status === 'thinking' ? '1' : '3.2'}
              fill="#0f172a"
              opacity="0.75"
            />
          </g>
        </svg>
      </div>

      {/* Etiqueta flotante en versión grande */}
      {size === 'lg' && (
        <div
          className={`mt-3 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide flex items-center gap-1.5 border backdrop-blur-md transition-colors ${
            isDark
              ? 'bg-slate-900/80 border-slate-700/80 text-cyan-300'
              : 'bg-white/90 border-slate-200 text-slate-700 shadow-xs'
          }`}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: active.primary }}
          />
          {active.label}
        </div>
      )}
    </div>
  );
}

export default function NovaTerraApp() {
  const [isDark, setIsDark] = useState(true);
  const [orbStatus, setOrbStatus] = useState('idle'); // idle | thinking | speaking
  const [input, setInput] = useState('');
  const [activeDoc, setActiveDoc] = useState(null); // Abre el drawer de evidencia
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, orbStatus]);

  // Procesar consulta con llamada real a la API de FastAPI
  const handleAsk = async (textQuery) => {
    if (!textQuery || !textQuery.trim() || orbStatus === 'thinking') return;

    const query = textQuery.trim();
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setOrbStatus('thinking');

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta: query }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: Código ${response.status}`);
      }

      const data = await response.json();
      const answerText = data.respuesta || 'No se obtuvo respuesta para la consulta.';

      // Mapear documento fuente si fue provisto por la API
      let docObj = data.documento;
      if (!docObj && data.fuentes && data.fuentes.length > 0) {
        const topFuente = data.fuentes[0];
        docObj = {
          id: 'DOC-REF',
          title: topFuente.titulo || topFuente.archivo,
          code: `${topFuente.codigo} (Pág. ${topFuente.pagina})`,
          tag: 'Normativa Oficial',
          updated: 'Vigente 2026',
          snippet: topFuente.extracto
        };
      }

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: answerText,
        doc: docObj,
        kpis: data.kpis || [],
        steps: data.steps || [],
        fuentes: data.fuentes || []
      };

      setMessages((prev) => [...prev, botMsg]);
      setOrbStatus('speaking');
      setTimeout(() => setOrbStatus('idle'), 2500);

    } catch (err) {
      console.error('Error al conectar con el backend:', err);
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'En este momento no pudimos conectar con el centro de normativa bancaria. Por favor asegúrate de que el servidor backend esté en ejecución e inténtalo nuevamente.',
        isError: true,
        doc: null
      };

      setMessages((prev) => [...prev, botMsg]);
      setOrbStatus('idle');
    }
  };

  // Copiar respuesta al portapapeles
  const copyResponse = (msg) => {
    const raw = (msg.text || '').replace(/\*\*/g, '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(raw);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = raw;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Renderizado elegante de respuestas con soporte de negritas, párrafos y listas
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter((l) => l.trim().length > 0);

    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
          const cleanLine = isBullet ? trimmed.replace(/^[\*\-•]\s*/, '') : trimmed;

          const segments = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className={isDark ? 'text-white font-semibold' : 'text-slate-900 font-semibold'}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          );

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-1 text-sm sm:text-base">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span className="flex-1">{segments}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-sm sm:text-base leading-relaxed">
              {segments}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`relative h-screen w-full flex flex-col overflow-hidden font-sans select-none sm:select-auto transition-colors duration-500 ${
        isDark ? 'bg-[#050811] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Animaciones CSS y Estilos de Scrollbar */}
      <style>{`
        @keyframes orbRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbRotateReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes orbBreathe {
          0%, 100% { transform: scale(0.94); }
          50% { transform: scale(1.08); }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.25); border-radius: 9999px; }
      `}</style>

      {/* LUCES AURORA DE FONDO (AMBIENT MESH GRADIENTS) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            isDark ? 'bg-cyan-600/20 opacity-70' : 'bg-cyan-400/25 opacity-60'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            isDark ? 'bg-indigo-600/20 opacity-60' : 'bg-indigo-400/20 opacity-50'
          }`}
        />
        <div
          className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            isDark ? 'bg-emerald-600/15 opacity-50' : 'bg-emerald-300/25 opacity-50'
          }`}
        />
      </div>

      {/* NAVBAR FLOTANTE GLASSMORPHISM */}
      <header
        className={`relative z-20 h-16 px-4 sm:px-6 border-b backdrop-blur-xl flex items-center justify-between shrink-0 transition-colors ${
          isDark ? 'bg-slate-950/60 border-white/10' : 'bg-white/75 border-slate-200/80'
        }`}
      >
        {/* Izquierda: Menú móvil + Identidad Corporativa */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenu(true)}
            className={`lg:hidden p-2 rounded-xl border ${
              isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-sm sm:text-base bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Banco NovaTerra
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30">
                  Asistente Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Centro de Consultas y Normativa Bancaria
              </p>
            </div>
          </div>
        </div>

        {/* Derecha: Mini Orbe + Acciones */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Si ya hay mensajes, mostramos el Orbe interactivo compacto en la barra */}
          {messages.length > 0 && (
            <div className="flex items-center gap-2 pr-1">
              <NovaInteractiveOrb
                status={orbStatus}
                size="sm"
                isDark={isDark}
                onClick={() => {
                  setOrbStatus('speaking');
                  setTimeout(() => setOrbStatus('idle'), 1200);
                }}
              />
            </div>
          )}

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              title="Nueva consulta"
              className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Nueva consulta</span>
            </button>
          )}

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-white/10 text-amber-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Cambiar tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL RESPONSIVO */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        
        {/* SIDEBAR IZQUIERDO (Escritorio) / DRAWER (Móvil) */}
        <aside
          className={`${
            mobileMenu ? 'fixed inset-0 z-50 flex' : 'hidden lg:flex'
          } lg:static lg:w-72 flex-col shrink-0`}
        >
          {/* Fondo oscuro en móvil */}
          {mobileMenu && (
            <div
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs lg:hidden"
            />
          )}

          <div
            className={`relative z-10 w-72 h-full flex flex-col border-r backdrop-blur-2xl p-4 transition-colors ${
              isDark ? 'bg-slate-950/85 border-white/10' : 'bg-white/90 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Normativa Vigente
              </span>
              <button onClick={() => setMobileMenu(false)} className="p-1.5 rounded-lg bg-slate-800/50">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta Gradiente de Estado del Servicio Bancario */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-indigo-600/15 border border-cyan-500/30 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Banca Digital
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  24/7
                </span>
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Información oficial alineada a la normativa CMF vigente.
              </p>
            </div>

            {/* Documentos Oficiales (Clic para ver extracto) */}
            <div className="flex-1 overflow-y-auto space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                Reglamentos y Tarifas
              </p>
              {DOCS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveDoc(doc);
                    setMobileMenu(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                    activeDoc?.id === doc.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border-cyan-500/50'
                      : isDark
                      ? 'bg-slate-900/50 border-white/5 hover:border-white/15 hover:bg-slate-900'
                      : 'bg-white border-slate-200/80 hover:border-cyan-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{doc.title}</p>
                      <span className="text-[10px] text-slate-400">{doc.tag}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 shrink-0" />
                </button>
              ))}
            </div>

            {/* Footer de Seguridad */}
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Canal Oficial Seguro
              </span>
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </aside>

        {/* ÁREA CENTRAL DE EXPERIENCIA (CHAT + HERO) */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div className="max-w-3xl mx-auto">
              
              {/* ESTADO INICIAL: HERO CON EL ORBE PRISMA Y TARJETAS RÁPIDAS */}
              {messages.length === 0 ? (
                <div className="min-h-[68vh] flex flex-col items-center justify-center text-center py-6">
                  <NovaInteractiveOrb
                    status={orbStatus}
                    size="lg"
                    isDark={isDark}
                    onClick={() => {
                      setOrbStatus('speaking');
                      setTimeout(() => setOrbStatus('idle'), 1200);
                    }}
                  />

                  <h1 className="mt-6 text-2xl sm:text-4xl font-extrabold tracking-tight">
                    Hola, soy{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                      Nova
                    </span>
                  </h1>
                  <p className={`mt-2 max-w-md text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tu asistente virtual de Banco NovaTerra. Resuelve dudas sobre tarifas, transferencias, seguridad y normativas al instante.
                  </p>

                  {/* Grid Responsivo de Tarjetas Rápidas con Gradientes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8 text-left">
                    {QUICK_PROMPTS.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => handleAsk(item.prompt)}
                          className={`group p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 hover:-translate-y-0.5 cursor-pointer ${
                            isDark
                              ? 'bg-slate-900/60 border-white/10 hover:border-cyan-500/50 hover:bg-slate-900/90 shadow-lg shadow-black/20'
                              : 'bg-white/90 border-slate-200/90 hover:border-cyan-400 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.grad} text-white shadow-md shrink-0`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs sm:text-sm font-bold group-hover:text-cyan-400 transition-colors">
                                {item.title}
                              </h3>
                              <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* FLUJO DE CONVERSACIÓN VISUAL */
                <div className="space-y-6 pb-4">
                  {/* Chips rápidos superiores */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {QUICK_PROMPTS.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleAsk(item.prompt)}
                        disabled={orbStatus === 'thinking'}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-all cursor-pointer ${
                          isDark
                            ? 'bg-slate-900/80 border-white/10 hover:border-cyan-500/50 text-slate-300'
                            : 'bg-white border-slate-200 hover:border-cyan-400 text-slate-700 shadow-2xs'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'user' ? (
                        <div className="max-w-md bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-lg shadow-blue-600/20">
                          <p className="text-sm font-medium">{msg.text}</p>
                        </div>
                      ) : (
                        /* TARJETA INTELIGENTE DEL AGENTE */
                        <div
                          className={`w-full rounded-3xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
                            isDark
                              ? 'bg-slate-900/75 border-white/10 shadow-2xl shadow-black/40'
                              : 'bg-white/95 border-slate-200/90 shadow-xl shadow-slate-200/60'
                          }`}
                        >
                          {/* Cabecera de la tarjeta */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                                {msg.isError ? 'Aviso del Sistema' : 'Respuesta Oficial'}
                              </span>
                            </div>

                            {/* Botón para abrir el respaldo normativo */}
                            {msg.doc && (
                              <button
                                onClick={() => setActiveDoc(msg.doc)}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Ver respaldo: {msg.doc.code || msg.doc.title}</span>
                              </button>
                            )}
                          </div>

                          {/* Contenido real devuelto por la API */}
                          <div className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                            {renderFormattedText(msg.text)}
                          </div>

                          {/* TARJETAS DE MÉTRICAS CLAVE (KPIs con gradientes, si son provistos) */}
                          {msg.kpis && msg.kpis.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                              {msg.kpis.map((kpi, idx) => (
                                <div
                                  key={idx}
                                  className={`relative overflow-hidden rounded-2xl p-3.5 border ${
                                    isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200/80'
                                  }`}
                                >
                                  <div
                                    className={`h-1 w-10 rounded-full bg-gradient-to-r ${kpi.gradient || 'from-cyan-500 to-blue-600'} mb-2`}
                                  />
                                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                    {kpi.label}
                                  </p>
                                  <p className="text-lg sm:text-xl font-extrabold mt-0.5">{kpi.value}</p>
                                  {kpi.sub && <p className="text-[11px] text-slate-400">{kpi.sub}</p>}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Pasos Clave Breves (si son provistos) */}
                          {msg.steps && msg.steps.length > 0 && (
                            <div className="space-y-2 mt-4 pt-2">
                              {msg.steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm">
                                  <div className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                                    {i + 1}
                                  </div>
                                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Acciones inferiores */}
                          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              Información verificada por Banco NovaTerra
                            </span>
                            <button
                              onClick={() => copyResponse(msg)}
                              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Estado de carga minimalista */}
                  {orbStatus === 'thinking' && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 w-fit">
                      <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                      <span className="text-xs font-medium text-cyan-300">
                        Nova está consultando la normativa oficial...
                      </span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* BARRA DE ENTRADA FLOTANTE (DOCK INFERIOR CON GRADIENTE) */}
          <div className="px-4 sm:px-8 pb-4 pt-2 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(input);
              }}
              className="max-w-3xl mx-auto relative group"
            >
              {/* Resplandor gradiente detrás del input */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-30 group-focus-within:opacity-80 blur-xs transition duration-300" />

              <div
                className={`relative flex items-center rounded-2xl border px-4 py-2.5 backdrop-blur-xl ${
                  isDark ? 'bg-slate-900/95 border-white/15' : 'bg-white border-slate-200'
                }`}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu consulta sobre cuentas, tarjetas, transferencias o fraudes..."
                  className="w-full bg-transparent text-sm focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || orbStatus === 'thinking'}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <span className="hidden sm:inline">Consultar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* DRAWER DESLIZANTE DE RESPALDO NORMATIVO */}
        {activeDoc && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              onClick={() => setActiveDoc(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div
              className={`relative z-10 w-full max-w-sm h-full p-6 flex flex-col justify-between border-l backdrop-blur-2xl animate-in slide-in-from-right ${
                isDark ? 'bg-slate-950/95 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Respaldo Normativo
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveDoc(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-800/50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400">
                    {activeDoc.tag || 'Normativa Oficial'}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{activeDoc.title || 'Documento Normativo'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeDoc.code || 'Código Oficial'}</p>

                  {/* Sello de documento verificado */}
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/25 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium">Documento Oficial</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{activeDoc.updated || 'Vigente 2026'}</span>
                  </div>

                  {/* Extracto literal del reglamento recuperado */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Extracto del Reglamento
                    </p>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed border-l-4 border-cyan-400 ${
                        isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      "{activeDoc.snippet}"
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveDoc(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
