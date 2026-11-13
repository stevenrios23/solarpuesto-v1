import "./styles.css";
import { useMemo, useState } from "react";
import {
  dimensionar,
  horasDeUso,
  formatoHoras,
  DEFAULTS,
} from "./lib/formulas.js";
import { CASOS } from "./lib/casos.js";

// Importación directa de imágenes desde src/imagenes para Vite
import p1_1 from "./imagenes/paso1_1.jpg";
import p1_2 from "./imagenes/paso1_2.jpg";
import p1_3 from "./imagenes/paso1_3.jpg";
import p1_4 from "./imagenes/paso1_4.jpg";

import p2_1 from "./imagenes/paso2_1.jpg";
import p2_2 from "./imagenes/paso2_2.jpg";
import p2_3 from "./imagenes/paso2_3.jpg";
import p2_4 from "./imagenes/paso2_4.jpg";

import p3_1 from "./imagenes/paso3_1.jpg";
import p3_2 from "./imagenes/paso3_2.jpg";
import p3_3 from "./imagenes/paso3_3.jpg";
import p3_4 from "./imagenes/paso3_4.jpg";

import p4_1 from "./imagenes/paso4_1.jpg";
import p4_2 from "./imagenes/paso4_2.jpg";
import p4_3 from "./imagenes/paso4_3.jpg";

let nextId = 1;
const nuevoDispositivo = () => ({
  id: nextId++,
  nombre: "",
  cantidad: 1,
  potencia: "",
  tipo: "usos",
  horario: "dia",
  min: "",
  usos: "",
  horas: "",
  horasConectado: "",
  ciclo: "",
});

const CIUDADES_COLOMBIA = [
  {
    nombre: "Neiva (Huila - Excelente Sol)",
    hsp: 5.2,
    impacto:
      "☀️ Neiva cuenta con alta radiación constante. Al ser un excelente promedio de Horas Pico Solar, el sistema requiere la cantidad estándar y óptima de paneles, resultando muy económico y rentable para el comerciante.",
  },
  {
    nombre: "Bogotá (Zona Andina / Alta Nubosidad)",
    hsp: 3.8,
    impacto:
      "☁️ Bogotá presenta menor radiación por nubosidad constante. Esto significa que el HSP baja, obligando a instalar 1 panel solar adicional y un banco de baterías un poco mayor para garantizar la autonomía en días grises.",
  },
  {
    nombre: "Medellín (Valle de Aburrá)",
    hsp: 4.5,
    impacto:
      "⛅ Medellín ofrece un rendimiento solar moderado-alto con variaciones estacionales. El dimensionamiento se mantiene equilibrado sin disparar los costos de inversión.",
  },
  {
    nombre: "La Guajira (Costa / Máximo Sol de Colombia)",
    hsp: 6.0,
    impacto:
      "🌵 La Guajira tiene el mayor potencial solar del país. Gracias a su alto HSP, se aprovecha al máximo cada rayo de sol, reduciendo al mínimo la cantidad de paneles necesarios y maximizando la rentabilidad.",
  },
  {
    nombre: "Villavicencio (Piedemonte Llanero)",
    hsp: 4.2,
    impacto:
      "🌧️ Villavicencio tiene buena radiación pero temporadas de fuertes lluvias e invierno. Requiere un margen de seguridad prudente en las baterías para asegurar la energía del puesto.",
  },
];

const PASOS_INSTALACION_DETALLADA = [
  {
    paso: "1",
    titulo: "Conexión del Banco de Baterías al Regulador de Carga",
    descripcion:
      "Regla de oro: Conecte primero la batería de 12V al controlador antes de manipular cualquier otro elemento.",
    subpasos: [
      {
        texto:
          "Identifique los bornes de conexión para la batería en el regulador de carga.",
        img: p1_1,
        iconoAlt: "📊 Diagrama Regulador y Batería",
      },
      {
        texto:
          "Conecte firmemente el cable positivo (+) de la batería al borne positivo del regulador.",
        img: p1_2,
        iconoAlt: "🔴 Conexión Borne Positivo (+)",
      },
      {
        texto:
          "Conecte el cable negativo (-) de la batería al borne negativo del regulador.",
        img: p1_3,
        iconoAlt: "⚫ Conexión Borne Negativo (-)",
      },
      {
        texto:
          "Verificación en pantalla: Los LED o display del regulador deben encender indicando 12V.",
        img: p1_4,
        iconoAlt: "🖥️ Voltímetro / Display 12V",
      },
    ],
    alerta:
      "⚠ NUNCA conecte los paneles solares al regulador sin haber conectado primero la batería.",
  },
  {
    paso: "2",
    titulo: "Instalación y Conexión de los Paneles Solares",
    descripcion:
      "Oriente los paneles hacia la radiación solar y conéctalos de manera segura al puerto solar del regulador.",
    subpasos: [
      {
        texto:
          "Utilice cable solar especializado de doble aislamiento con protección UV y conectores MC4.",
        img: p2_1,
        iconoAlt: "🔌 Cable Solar y Conectores MC4",
      },
      {
        texto:
          "Mantenga los paneles cubiertos con un cartón o lona mientras realiza los empalmes.",
        img: p2_2,
        iconoAlt: "☀️ Protección Cubierta Paneles",
      },
      {
        texto:
          "Conecte los cables positivo y negativo a la entrada solar (símbolo de panel ☀️) del regulador.",
        img: p2_3,
        iconoAlt: "⚡ Cableado Trasero Paneles MC4",
      },
      {
        texto:
          "Verificación final: Al retirar la cubierta, el indicador solar del regulador mostrará carga activa.",
        img: p2_4,
        iconoAlt: "✅ Display MPPT Carga Activa",
      },
    ],
    alerta:
      "⚠ Asegúrese de que los cables queden firmes y protegidos contra roces con la estructura metálica.",
  },
  {
    paso: "3",
    titulo: "Conexión del Inversor de Corriente a la Batería",
    descripcion:
      "El inversor transforma la corriente continua (12V DC) a corriente alterna (110V AC) para los electrodomésticos.",
    subpasos: [
      {
        texto:
          "Conecte el inversor DIRECTAMENTE a los bornes principales de la batería (nunca a LOAD).",
        img: p3_1,
        iconoAlt: "⚡ Conexión Directa Inversor-Batería",
      },
      {
        texto:
          "Utilice cables de cobre de gran calibre (AWG 6 u 8) para soportar la corriente de arranque.",
        img: p3_2,
        iconoAlt: "🧵 Cables AWG 6 Cobre Grueso",
      },
      {
        texto:
          "Instale un fusible o breaker de protección en el cable positivo para prevenir cortos.",
        img: p3_3,
        iconoAlt: "🧯 Fusible de Seguridad 200A",
      },
      {
        texto:
          "Verificación: Encienda el interruptor del inversor y compruebe su ventilador y luz de estado.",
        img: p3_4,
        iconoAlt: "🟢 Switch Encendido / Ventilación",
      },
    ],
    alerta:
      "⚠ Mantenga el inversor en un espacio seco, ventilado y completamente alejado de humedad o calor extremo.",
  },
  {
    paso: "4",
    titulo: "Conexión de los Electrodomésticos y Cargas",
    descripcion:
      "Enchufe los equipos de su puesto comercial en las salidas correspondientes del sistema.",
    subpasos: [
      {
        texto:
          "Los equipos de 110V (licuadora, nevera, datáfono) deben enchufarse a los tomacorrientes del inversor.",
        img: p4_1,
        iconoAlt: "🔌 Equipos 110V AC al Inversor",
      },
      {
        texto:
          "Las lámparas o tiras LED de bajo consumo (12V) se conectan directo a la salida DC (LOAD).",
        img: p4_2,
        iconoAlt: "💡 Tira LED 12V DC a Salida LOAD",
      },
      {
        texto:
          "Prueba final: Encienda una carga pequeña para confirmar que la energía fluye de forma estable.",
        img: p4_3,
        iconoAlt: "💡 Prueba de Carga del Sistema",
      },
    ],
    alerta:
      "⚠ No sobrepase la potencia máxima en vatios (W) que soporta su inversor al mismo tiempo.",
  },
];

const SECCIONES_INFO = {
  soluciones: {
    titulo: "💡 Soluciones Energéticas Adaptativas",
    descripcion:
      "SolarPuesto V1.0 está diseñado para cubrir las necesidades reales del comercio informal ambulante en Colombia. Ofrece soluciones a medida para la venta de alimentos, bebidas, iluminación nocturna y datáfonos de pago sin depender de conexiones eléctricas ilegales.",
    puntos: [
      "Autonomía energética de 6 a 12 horas continuas para jornadas extendidas.",
      "Cálculo automático de baterías de gel / AGM seguras para transporte.",
      "Inversores senoidales portátiles para licuadoras, neveras y registradoras.",
    ],
  },
  caracteristicas: {
    titulo: "🛠️ Características del Software",
    descripcion:
      "Herramienta de ingeniería fotovoltaica simplificada para usuarios con o sin conocimientos de electricidad.",
    puntos: [
      "Algoritmo dinámico que discrimina consumo por uso continuo, intermitente o ciclo de refrigeración.",
      "Base de datos con la radiación solar real (HSP) de las principales zonas comerciales de Colombia.",
      "Generación de reportes PDF descargables con desglose de costos y espacio para firmas de aprobación.",
    ],
  },
  impacto: {
    titulo: "🌱 Impacto Socioeconómico y Ambiental",
    descripcion:
      "Especialmente enfocado en dignificar el trabajo de los comerciantes informales en Neiva y toda Colombia.",
    puntos: [
      "Reducción del 100% en gastos diarios de alquiler de planta de gasolina o ruidos molestos.",
      "Sustitución de fuentes contaminantes por energía 100% limpia y renovable.",
      "Acceso a cotizaciones formales estructuradas para solicitar microcréditos de financiamiento.",
    ],
  },
  tecnicoInstalador: {
    titulo: "👨‍🔧 Rol del Técnico Instalador Fotovoltaico",
    descripcion:
      "Módulo especial para ingenieros y técnicos encargados de la calibración de protecciones y controladores de carga MPPT en el puesto.",
    puntos: [
      "Cálculo preciso del calibre de cable AWG para evitar caídas de tensión a 12V.",
      "Configuración de parámetros de carga de baterías GEL/AGM (Absorción y Flotación).",
      "Diagramas paso a paso para el ensamble seguro sin riesgo de cortocircuitos.",
    ],
  },
  comercianteMovil: {
    titulo: "🛍️ Beneficios para el Comerciante Móvil",
    descripcion:
      "Optimizaciones diseñadas para que vendedores de jugos, fritos, tinto y artesanías conozcan sus retornos financieros.",
    puntos: [
      "Ahorro estimado mensual de $150.000 a $300.000 COP al eliminar cobros ilegales de corriente.",
      "Operación continua sin depender de puestos fijos ni cables atravesados en la vía pública.",
      "Sistemas modulares y portátiles adaptables a carritos de madera o metal.",
    ],
  },
  panelTecnico: {
    titulo: "☀️ Especificaciones Técnicas: Panel Monocristalino 450Wp",
    descripcion:
      "Módulo fotovoltaico de alta eficiencia seleccionado por SolarPuesto para espacios reducidos en carros ambulantes.",
    puntos: [
      "Potencia Máxima (Pmax): 450 Vatios Pico (Wp).",
      "Tecnología: Silicio Monocristalino PERC con celda dividida (Half-Cell).",
      "Eficiencia del Módulo: 21.5% de aprovechamiento solar.",
      "Dimensiones: 176 cm x 109 cm (Estructura ligera adaptable a techos de puesto).",
    ],
  },
};

const iconoHorario = (h) =>
  h === "noche" ? "🌙 " : h === "ambos" ? "🌗 " : "☀️ ";

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(true); // Estado del bombillo (Tema Oscuro por defecto)
  const [tab, setTab] = useState("carga");
  const [aparatos, setAparatos] = useState([]);
  const [params, setParams] = useState({ ...DEFAULTS });
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(
    CIUDADES_COLOMBIA[0],
  );

  const datos = useMemo(
    () => dimensionar(aparatos, params),
    [aparatos, params],
  );
  const cargado = aparatos.some(
    (a) => a.nombre.trim() && (parseFloat(a.potencia) || 0) > 0,
  );

  const setAparato = (id, campo, valor) =>
    setAparatos((lista) =>
      lista.map((a) => (a.id === id ? { ...a, [campo]: valor } : a)),
    );

  const agregar = () => setAparatos((l) => [...l, nuevoDispositivo()]);

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar este dispositivo?")) return;
    setAparatos((l) => l.filter((a) => a.id !== id));
  };

  const cargarCaso = (i) =>
    setAparatos(CASOS[i].filas.map((f) => ({ ...f, id: nextId++ })));

  const calcular = () => {
    const errores = [];
    aparatos.forEach((a) => {
      if (!a.nombre.trim())
        return errores.push("Completa el nombre de cada dispositivo.");
      if (!(parseFloat(a.potencia) > 0))
        return errores.push(`Revisa la potencia de "${a.nombre}".`);
      if (a.tipo === "usos" && !((parseFloat(a.min) || 0) > 0))
        return errores.push(`Indica minutos por uso de "${a.nombre}".`);
      if (a.tipo === "usos" && !(parseInt(a.usos) >= 1))
        return errores.push(`Indica usos/día de "${a.nombre}".`);
      if (a.tipo === "continuo" && !((parseFloat(a.horas) || 0) > 0))
        return errores.push(`Indica horas encendido de "${a.nombre}".`);
      if (a.tipo === "refri" && !((parseFloat(a.horasConectado) || 0) > 0))
        return errores.push(`Indica horas conectado de "${a.nombre}".`);
      if (a.tipo === "refri" && !(parseFloat(a.ciclo) >= 20))
        return errores.push(`Indica el ciclo % de "${a.nombre}".`);
      return null;
    });
    if (errores.length) return window.alert(errores[0]);
    setTab("resultado");
  };

  const setParam = (campo, valor) =>
    setParams((p) => ({ ...p, [campo]: valor }));

  const seleccionarCiudad = (e) => {
    const idx = e.target.selectedIndex;
    const ciudadObj = CIUDADES_COLOMBIA[idx];
    setCiudadSeleccionada(ciudadObj);
    setParam("hsp", ciudadObj.hsp);
  };

  const costoPaneles = (datos.nPaneles || 0) * 450000;
  const costoBateria = Math.ceil((datos.ah || 0) / 100) * 550000;
  const costoInversor = (datos.watInversor || 0) > 0 ? 350000 : 0;
  const costoCableado = cargado ? 80000 : 0;
  const costoTotal =
    costoPaneles + costoBateria + costoInversor + costoCableado;

  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const picoCalculado = datos.totalW || datos.pico || 0;
  const alertaPotenciaExcesiva = picoCalculado > 350;

  const handleLogin = (e) => {
    e.preventDefault();
    setAutenticado(true);
    setModalLogin(false);
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    window.alert("¡Registro exitoso! Ya puedes iniciar sesión con tu correo.");
    setModalRegistro(false);
    setModalLogin(true);
  };

  const abrirSeccion = (clave) => {
    setModalInfo(SECCIONES_INFO[clave]);
  };

  // VISTA 1: LANDING PAGE CON MODO OSCURO / CLARO Y BOTÓN REGISTRARSE
  if (!autenticado) {
    return (
      <div
        className={
          modoOscuro ? "landing-wrapper" : "landing-wrapper light-theme"
        }
      >
        <header className="q10-nav">
          <div className="q10-logo">
            <span className="logo-brand">SolarPuesto</span>
            <span className="logo-badge">V1.0</span>
          </div>
          <nav className="q10-links">
            <button
              className="nav-link-btn"
              onClick={() => abrirSeccion("soluciones")}
            >
              Soluciones
            </button>
            <button
              className="nav-link-btn"
              onClick={() => abrirSeccion("caracteristicas")}
            >
              Características
            </button>
            <button
              className="nav-link-btn"
              onClick={() => abrirSeccion("impacto")}
            >
              Impacto Social
            </button>
          </nav>
          <div className="q10-actions">
            {/* BOTÓN BOMBILLO PARA CAMBIAR TEMA */}
            <button
              className="btn-bombillo"
              onClick={() => setModoOscuro(!modoOscuro)}
              title="Cambiar Tema Oscuro/Claro"
            >
              {modoOscuro ? "💡" : "🌙"}
            </button>
            <button className="btn-text" onClick={() => setModalLogin(true)}>
              Iniciar sesión
            </button>
            <button
              className="btn-orange"
              onClick={() => setModalRegistro(true)}
            >
              Registrarse
            </button>
          </div>
        </header>

        {/* HERO BANNER DE ALTO IMPACTO */}
        <section className="hero-banner-dark">
          <div className="hero-content-grid">
            <div className="hero-text-side">
              <div className="badge-solar-neon">
                ⚡ POTENCIA FOTOVOLTAICA INFORMAL
              </div>
              <h1 className="hero-title-dark">
                LA ENERGÍA DE TU NEGOCIO
                <br />
                <span className="text-highlight-orange">
                  EN UN SOLO SOFTWARE
                </span>
              </h1>
              <p className="hero-desc-dark">
                Plataforma inteligente para dimensionamiento, cotización y
                gestión de sistemas fotovoltaicos portátiles en el comercio
                informal de Colombia.
              </p>
              <div className="hero-action-group">
                <button
                  className="btn-hero-primary"
                  onClick={() => setModalLogin(true)}
                >
                  Ingresar al Dashboard ➔
                </button>
                <button
                  className="btn-hero-secondary"
                  onClick={() => abrirSeccion("caracteristicas")}
                >
                  Ver características técnicas
                </button>
              </div>
            </div>

            <div className="hero-visual-side">
              <div className="solar-glow-bg"></div>
              <div className="hero-cards-stack">
                <div
                  className="hero-character-card card-main"
                  onClick={() => abrirSeccion("tecnicoInstalador")}
                >
                  <div className="card-avatar">👨‍🔧</div>
                  <div className="card-info">
                    <h4>Técnico Instalador</h4>
                    <p>Sistemas Módulo MPPT 12V</p>
                    <span className="badge-ok">
                      ● Ver Parámetros de Instalación
                    </span>
                  </div>
                </div>

                <div
                  className="hero-character-card card-sub"
                  onClick={() => abrirSeccion("comercianteMovil")}
                >
                  <div className="card-avatar">🛍️</div>
                  <div className="card-info">
                    <h4>Comerciante Móvil</h4>
                    <p>Puesto de Comida / Licuadoras</p>
                    <span className="badge-stat">Autonomía y Retorno COP</span>
                  </div>
                </div>

                {/* WIDGET PANEL SOLAR ANIMADO E INTERACTIVO */}
                <div
                  className="solar-panel-graphic interactive-panel"
                  onClick={() => abrirSeccion("panelTecnico")}
                >
                  <div className="panel-status-bar">
                    <span className="live-dot"></span>{" "}
                    <b>Carga Solar Activa: 12.8V</b>
                    <small>Haz clic para ficha técnica 🔍</small>
                  </div>

                  <div className="panel-grid-animated">
                    <div className="solar-cell cell-1"></div>
                    <div className="solar-cell cell-2"></div>
                    <div className="solar-cell cell-3"></div>
                    <div className="solar-cell cell-4"></div>
                    <div className="solar-cell cell-5"></div>
                    <div className="solar-cell cell-6"></div>
                  </div>

                  <div className="panel-tag">
                    ☀️ Módulo Fotovoltaico Monocristalino 450Wp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIONES INTERACTIVAS DETALLADAS EN LA LANDING */}
        <section className="q10-grid-cards" id="caracteristicas">
          <div
            className="card-feat"
            onClick={() => abrirSeccion("caracteristicas")}
          >
            <div className="icon">⚡</div>
            <h3>Dimensionamiento Real</h3>
            <p>
              Calcula el consumo exacto de tus dispositivos considerando
              factores de arranque y ciclaje de trabajo.
            </p>
          </div>
          <div
            className="card-feat"
            onClick={() => abrirSeccion("caracteristicas")}
          >
            <div className="icon">🗺️</div>
            <h3>Geolocalización HSP</h3>
            <p>
              Ajuste automático de la radiación solar para Neiva, Bogotá,
              Medellín, La Guajira y más ciudades.
            </p>
          </div>
          <div
            className="card-feat"
            onClick={() => abrirSeccion("caracteristicas")}
          >
            <div className="icon">📄</div>
            <h3>Cotización en PDF</h3>
            <p>
              Genera fichas técnicas de ingeniería con costos reales en COP
              listas para presentar a microcréditos.
            </p>
          </div>
        </section>

        <section className="q10-section-info" id="soluciones">
          <div className="info-box">
            <h2>💡 Soluciones Fotovoltaicas para el Comercio Móvil</h2>
            <p>
              Diseñado para que vendedores ambulantes de alimentos, bebidas y
              artesanías calculen con exactitud cuántos paneles y baterías
              necesitan para operar todo el día de forma autónoma.
            </p>
            <button
              className="btn-orange"
              onClick={() => abrirSeccion("soluciones")}
            >
              Saber más sobre Soluciones
            </button>
          </div>
        </section>

        <section className="q10-section-info alt" id="impacto">
          <div className="info-box">
            <h2>🌱 Impacto Social y Sostenibilidad en Colombia</h2>
            <p>
              Reemplaza los ruidosos y costosos generadores de gasolina por
              energía solar limpia, impulsando la formalización y reduciendo los
              costos operativos de los microempresarios.
            </p>
            <button
              className="btn-orange"
              onClick={() => abrirSeccion("impacto")}
            >
              Saber más sobre Impacto Social
            </button>
          </div>
        </section>

        {/* MODAL EXPLICATIVO INDEPENDIENTE */}
        {modalInfo && (
          <div className="modal-backdrop" onClick={() => setModalInfo(null)}>
            <div
              className="modal-card modal-info"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{modalInfo.titulo}</h2>
                <button
                  className="btn-close"
                  onClick={() => setModalInfo(null)}
                >
                  ✕
                </button>
              </div>
              <p
                style={{
                  color: modoOscuro ? "#cbd5e1" : "#475569",
                  marginBottom: "15px",
                  lineHeight: "1.5",
                }}
              >
                {modalInfo.descripcion}
              </p>
              <ul
                style={{
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                {modalInfo.puntos.map((pt, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: "0.92rem",
                      color: modoOscuro ? "#e2e8f0" : "#334155",
                    }}
                  >
                    <b>•</b> {pt}
                  </li>
                ))}
              </ul>
              <button
                className="btn-orange-block"
                onClick={() => {
                  setModalInfo(null);
                  setModalLogin(true);
                }}
              >
                Probar en la calculadora solar
              </button>
            </div>
          </div>
        )}

        {/* MODAL LOGIN */}
        {modalLogin && (
          <div className="modal-backdrop" onClick={() => setModalLogin(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Iniciar Sesión en SolarPuesto</h2>
                <button
                  className="btn-close"
                  onClick={() => setModalLogin(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="usuario@comercio.co"
                    defaultValue="comerciante@neiva.gov.co"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    defaultValue="123456"
                    required
                  />
                </div>
                <button type="submit" className="btn-orange-block">
                  Entrar al Sistema
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL REGISTRO (CREAR CUENTA) */}
        {modalRegistro && (
          <div
            className="modal-backdrop"
            onClick={() => setModalRegistro(false)}
          >
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Crear Nueva Cuenta</h2>
                <button
                  className="btn-close"
                  onClick={() => setModalRegistro(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleRegistro}>
                <div className="input-group">
                  <label>Nombre del Comerciante / Negocio</label>
                  <input
                    type="text"
                    placeholder="Ej: Jugos Naturales El Sol"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="tucorreo@dominio.co"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    placeholder="Repite tu contraseña"
                    required
                  />
                </div>
                <button type="submit" className="btn-orange-block">
                  Registrarse Ahora
                </button>
              </form>
            </div>
          </div>
        )}

        <footer className="q10-footer">
          Prototipo de Software Académico — Universidad FET / SolarPuesto V1.0
        </footer>
      </div>
    );
  }

  // VISTA 2: DASHBOARD DE CÁLCULO (RESPETA EL TEMA OSCURO O CLARO SELECCIONADO CON EL BOMBILLO)
  return (
    <div
      className={
        modoOscuro ? "app app-dark-dashboard" : "app app-light-dashboard"
      }
    >
      <header className="dashboard-header no-print">
        <div className="header-left">
          <div className="sol" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.2" fill="#f97316" />
              <g stroke="#f97316" strokeWidth="1.8" strokeLinecap="round">
                <line x1="12" y1="1.5" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22.5" />
                <line x1="1.5" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22.5" y2="12" />
                <line x1="4.3" y1="4.3" x2="6" y2="6" />
                <line x1="18" y1="18" x2="19.8" y2="19.8" />
                <line x1="4.3" y1="19.7" x2="6" y2="18" />
                <line x1="18" y1="6" x2="19.8" y2="4.2" />
              </g>
            </svg>
          </div>
          <div>
            <h1>
              SolarPuesto <span className="vers">V1.0</span>
            </h1>
            <div className="subtitulo">
              Calculadora de potencia y material para puestos de comercio
              informal
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* BOMBILLO EN EL HEADER DEL DASHBOARD */}
          <button
            className="btn-bombillo"
            onClick={() => setModoOscuro(!modoOscuro)}
            title="Cambiar Tema Oscuro/Claro"
          >
            {modoOscuro ? "💡" : "🌙"}
          </button>
          <button className="btn-logout" onClick={() => setAutenticado(false)}>
            Cerrar Sesión 🚪
          </button>
        </div>
      </header>

      <nav className="no-print">
        <button
          className={tab === "carga" ? "activo" : ""}
          onClick={() => setTab("carga")}
        >
          1. Carga de dispositivos
        </button>
        <button
          className={tab === "resultado" ? "activo" : ""}
          onClick={() => setTab("resultado")}
        >
          2. Resultado
        </button>
        <button
          className={tab === "guia" ? "activo" : ""}
          onClick={() => setTab("guia")}
        >
          3. Guía de Instalación
        </button>
      </nav>

      <main>
        {tab === "carga" && (
          <>
            <div
              className={modoOscuro ? "aviso aviso-dark" : "aviso aviso-light"}
            >
              Agrega los elementos que usa <b>tu</b> negocio (licuadora, luces,
              nevera, celular…). Para cada uno elige su
              <b> tipo de uso</b> y la app calcula el consumo acertado según
              cuánto lo usas:
              <br />
              🔁 <b>Por usos</b> = veces que lo prendes · ⏱ <b>Continuo</b> =
              prendido toda la jornada · ❄️ <b>Refrigeración</b> = compresor con
              ciclo de trabajo.
            </div>

            <section
              className={
                modoOscuro ? "tarjeta tarjeta-dark" : "tarjeta tarjeta-light"
              }
            >
              <h3>🌐 Ejemplos reales de puestos ambulantes</h3>
              <p className="ayuda">
                Elige un tipo de puesto para cargar sus dispositivos con valores
                reales. Puedes editar todo y agregar lo que use tu negocio.
              </p>
              <div className="barra-botones">
                {CASOS.map((c, i) => (
                  <button
                    key={c.nombre}
                    className={
                      modoOscuro
                        ? "btn btn-ejemplo-dark"
                        : "btn btn-ejemplo-light"
                    }
                    onClick={() => cargarCaso(i)}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </section>

            <section
              className={
                modoOscuro ? "tarjeta tarjeta-dark" : "tarjeta tarjeta-light"
              }
            >
              <h3>📝 Tabla de carga de dispositivos de tu puesto</h3>
              <div className="tabla-wrap">
                <table className={modoOscuro ? "tabla-dark" : "tabla-light"}>
                  <thead>
                    <tr>
                      <th>Dispositivo</th>
                      <th className="centrada">Cant.</th>
                      <th>Potencia real (W)</th>
                      <th>Tipo de uso</th>
                      <th>Horario</th>
                      <th>Uso en la jornada</th>
                      <th>Uso total (auto)</th>
                      <th className="centrada">Elim.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aparatos.map((a) => (
                      <FilaClave
                        key={a.id}
                        a={a}
                        onChange={setAparato}
                        onEliminar={eliminar}
                        modoOscuro={modoOscuro}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {aparatos.length === 0 && (
                <div className={modoOscuro ? "vacio-dark" : "vacio-light"}>
                  Aún no hay dispositivos. Haz clic en un ejemplo o en «Añadir
                  dispositivo».
                </div>
              )}
              <div className="barra-botones" style={{ marginTop: "15px" }}>
                <button
                  className={
                    modoOscuro
                      ? "btn btn-secundario-dark"
                      : "btn btn-secundario-light"
                  }
                  onClick={agregar}
                >
                  ➕ Añadir dispositivo
                </button>
                <button
                  className={
                    modoOscuro
                      ? "btn btn-primario-dark"
                      : "btn btn-primario-light"
                  }
                  onClick={calcular}
                >
                  🔍 Calcular resultado
                </button>
              </div>
            </section>
          </>
        )}

        {tab === "resultado" && (
          <>
            <div
              className={
                modoOscuro
                  ? "aviso aviso-dark no-print"
                  : "aviso aviso-light no-print"
              }
            >
              Este es tu resultado: la energía que consume tu puesto por día y
              el material solar que necesitas.
              <button
                className={
                  modoOscuro
                    ? "btn btn-secundario-dark imprimir"
                    : "btn btn-secundario-light imprimir"
                }
                onClick={() => window.print()}
              >
                🖨️ Imprimir Ficha Técnica PDF
              </button>
            </div>

            <div className="print-only-header">
              <div className="print-title-row">
                <div>
                  <h2
                    style={{ fontSize: "1.4rem", margin: 0, color: "#065f46" }}
                  >
                    SOLARPUESTO V1.0 — FICHA TÉCNICA Y COTIZACIÓN
                  </h2>
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: "0.85rem",
                      color: "#475569",
                    }}
                  >
                    Sistemas Fotovoltaicos para Comercio Informal Móvil
                  </p>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "0.8rem",
                    color: "#475569",
                  }}
                >
                  <div>
                    <b>Fecha de Emisión:</b> {fechaHoy}
                  </div>
                  <div>
                    <b>Documento:</b> COT-SOL-2026-001
                  </div>
                  <div>
                    <b>Ubicación:</b> Neiva, Huila (Colombia)
                  </div>
                </div>
              </div>
              <hr
                style={{
                  border: "0",
                  borderTop: "2px solid #10b981",
                  margin: "12px 0",
                }}
              />
            </div>

            {cargado && alertaPotenciaExcesiva && (
              <div
                style={{
                  background: modoOscuro ? "#450a0a" : "#fef2f2",
                  border: "1px solid #f87171",
                  padding: "15px",
                  borderRadius: "10px",
                  color: modoOscuro ? "#fecaca" : "#991b1b",
                  marginBottom: "20px",
                  fontSize: "0.92rem",
                  lineHeight: "1.5",
                }}
              >
                ⚠️ <b>AVISO DE RENTABILIDAD Y VIABILIDAD COMERCIAL:</b>
                <br />
                La potencia instalada de este puesto (
                {picoCalculado.toLocaleString("es")} W) supera los 350W
                recomendados para comercio ambulante básico. Superar este límite
                encarece drásticamente el banco de baterías y paneles, volviendo
                el proyecto poco viable económicamente para un microempresario.
                Se aconseja optimizar cargas de alto consumo.
              </div>
            )}

            <div className="grid-resultado">
              <div className={modoOscuro ? "kpi kpi-dark" : "kpi kpi-light"}>
                <div className="valor">
                  {cargado ? datos.totalW.toLocaleString("es") : "—"}
                </div>
                <div className="etiqueta">Potencia instalada (W)</div>
              </div>
              <div className={modoOscuro ? "kpi kpi-dark" : "kpi kpi-light"}>
                <div className="valor">
                  {cargado ? datos.totalWh.toLocaleString("es") : "—"}
                </div>
                <div className="etiqueta">Energía diaria (Wh/día)</div>
              </div>
              <div className={modoOscuro ? "kpi kpi-dark" : "kpi kpi-light"}>
                <div className="valor">
                  {cargado ? datos.nocturnoWh.toLocaleString("es") : "—"}
                </div>
                <div className="etiqueta">Consumo nocturno (batería) 🌙</div>
              </div>
            </div>

            <section
              className={
                modoOscuro ? "tarjeta tarjeta-dark" : "tarjeta tarjeta-light"
              }
            >
              <h3>📊 Desglose por dispositivo</h3>
              <div id="desglose">
                {cargado ? (
                  <table className={modoOscuro ? "tabla-dark" : "tabla-light"}>
                    <thead>
                      <tr>
                        <th>Dispositivo</th>
                        <th>Potencia</th>
                        <th>Uso real/día</th>
                        <th>Energía</th>
                        <th>Participación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.filas.map((f) => {
                        const pct =
                          datos.totalWh > 0
                            ? (f.energiaWh / datos.totalWh) * 100
                            : 0;
                        return (
                          <tr key={f.id}>
                            <td className="nombre-celda">{f.nombre}</td>
                            <td>{f.potenciaTotal.toLocaleString("es")} W</td>
                            <td>
                              {iconoHorario(f.horario)}
                              {formatoHoras(f.horas)}
                            </td>
                            <td>{f.energiaWh.toLocaleString("es")} Wh</td>
                            <td>
                              <span
                                className="barra-pct"
                                style={{
                                  width: `${Math.max(4, Math.min(100, pct * 2))}px`,
                                  background: "#f97316",
                                }}
                              />{" "}
                              {pct.toFixed(0)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div
                    className={
                      modoOscuro ? "aviso aviso-dark" : "aviso aviso-light"
                    }
                  >
                    Agrega dispositivos en la pestaña 1 para ver el desglose.
                  </div>
                )}
              </div>
            </section>

            <section
              className={
                modoOscuro
                  ? "tarjeta tarjeta-dark no-print"
                  : "tarjeta tarjeta-light no-print"
              }
            >
              <h3>🌍 Selector Rápido de Zona / Ciudad en Colombia</h3>
              <div className="campo" style={{ marginBottom: "12px" }}>
                <label>Ciudad de instalación:</label>
                <select
                  className={modoOscuro ? "select-dark" : "select-light"}
                  onChange={seleccionarCiudad}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  {CIUDADES_COLOMBIA.map((c) => (
                    <option key={c.nombre} value={c.hsp}>
                      {c.nombre} ({c.hsp} HSP)
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  background: modoOscuro
                    ? "rgba(5, 150, 105, 0.15)"
                    : "#ecfdf5",
                  border: "1px solid #34d399",
                  padding: "12px",
                  borderRadius: "8px",
                  color: modoOscuro ? "#6ee7b7" : "#065f46",
                  fontSize: "0.88rem",
                  lineHeight: "1.4",
                  marginTop: "10px",
                }}
              >
                <b>💡 Análisis geográfico de radiación:</b>{" "}
                {ciudadSeleccionada.impacto}
              </div>

              <h3 style={{ marginTop: "20px" }}>
                ⚙️ Parámetros avanzados configurables
              </h3>
              <div className="parametros">
                <Campo
                  label="Horas pico solar (HSP)"
                  valor={params.hsp}
                  paso="0.1"
                  min="1"
                  max="8"
                  onChange={(v) => setParam("hsp", v)}
                  modoOscuro={modoOscuro}
                />
                <Campo
                  label="Eficiencia del sistema"
                  valor={params.eff}
                  paso="0.05"
                  min="0.2"
                  max="1"
                  onChange={(v) => setParam("eff", v)}
                  modoOscuro={modoOscuro}
                />
                <Campo
                  label="Margen de pérdidas (%)"
                  valor={params.margen * 100}
                  paso="5"
                  min="0"
                  max="100"
                  onChange={(v) => setParam("margen", v / 100)}
                  modoOscuro={modoOscuro}
                />
                <Campo
                  label="Tensión batería (V)"
                  valor={params.tension}
                  paso="1"
                  min="12"
                  max="48"
                  onChange={(v) => setParam("tension", v)}
                  modoOscuro={modoOscuro}
                />
                <Campo
                  label="Profundidad de descarga (%)"
                  valor={params.dod * 100}
                  paso="5"
                  min="10"
                  max="90"
                  onChange={(v) => setParam("dod", v / 100)}
                  modoOscuro={modoOscuro}
                />
                <Campo
                  label="Potencia del panel (Wp)"
                  valor={params.ppanel}
                  paso="10"
                  min="50"
                  max="550"
                  onChange={(v) => setParam("ppanel", v)}
                  modoOscuro={modoOscuro}
                />
              </div>
            </section>

            <section
              className={
                modoOscuro ? "tarjeta tarjeta-dark" : "tarjeta tarjeta-light"
              }
            >
              <h3>🔥 Dimensionamiento del sistema solar</h3>
              {cargado ? (
                <>
                  <Material
                    icono="🔆"
                    nombre="Paneles fotovoltaicos"
                    detalle={`${params.ppanel} Wp · requerido ${Math.round(datos.wp)} Wp · HSP ${params.hsp}`}
                    valor={`${datos.nPaneles} panel(es)`}
                    modoOscuro={modoOscuro}
                  />
                  <Material
                    icono="🔋"
                    nombre="Banco de baterías"
                    detalle={`${params.tension} V · DOD ${Math.round(params.dod * 100)}%`}
                    valor={`${Math.round(datos.ah)} Ah`}
                    modoOscuro={modoOscuro}
                  />
                  <Material
                    icono="⚡"
                    nombre="Inversor"
                    detalle={`margen 25% sobre pico ${datos.pico.toLocaleString("es")} W`}
                    valor={`≥ ${Math.ceil(datos.watInversor)} W`}
                    modoOscuro={modoOscuro}
                  />
                </>
              ) : (
                <div
                  className={
                    modoOscuro ? "aviso aviso-dark" : "aviso aviso-light"
                  }
                >
                  Agrega dispositivos en la pestaña 1 para ver el
                  dimensionamiento.
                </div>
              )}
            </section>

            <section
              className={
                modoOscuro ? "tarjeta tarjeta-dark" : "tarjeta tarjeta-light"
              }
            >
              <h3>💵 Presupuesto Estimado de Inversión (COP)</h3>
              {cargado ? (
                <div>
                  <p
                    className="ayuda no-print"
                    style={{ color: modoOscuro ? "#94a3b8" : "#475569" }}
                  >
                    Estimación con precios promedio del mercado colombiano para
                    el equipamiento solar de tu puesto:
                  </p>
                  <Material
                    icono="🏷️"
                    nombre="Paneles Fotovoltaicos"
                    detalle={`${datos.nPaneles} panel(es) x ~$450.000 COP`}
                    valor={`$${costoPaneles.toLocaleString("es")} COP`}
                    modoOscuro={modoOscuro}
                  />
                  <Material
                    icono="🏷️"
                    nombre="Banco de Baterías"
                    detalle={`Soporte para ${Math.round(datos.ah)} Ah (~$550.000 COP c/u 100Ah)`}
                    valor={`$${costoBateria.toLocaleString("es")} COP`}
                    modoOscuro={modoOscuro}
                  />
                  <Material
                    icono="🏷️"
                    nombre="Inversor y Regulador"
                    detalle={`Soporta ${Math.ceil(datos.watInversor)} W de potencia pico`}
                    valor={`$${costoInversor.toLocaleString("es")} COP`}
                    modoOscuro={modoOscuro}
                  />
                  <Material
                    icono="🏷️"
                    nombre="Cableado y Protecciones"
                    detalle="Cableado solar duplex, conector MC4 y fusibles"
                    valor={`$${costoCableado.toLocaleString("es")} COP`}
                    modoOscuro={modoOscuro}
                  />
                  <div
                    className={
                      modoOscuro
                        ? "caja-total-inversion-dark"
                        : "caja-total-inversion-light"
                    }
                  >
                    💰 <b>INVERSIÓN TOTAL ESTIMADA:</b>{" "}
                    <span>${costoTotal.toLocaleString("es")} COP</span>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    modoOscuro ? "aviso aviso-dark" : "aviso aviso-light"
                  }
                >
                  Agrega dispositivos en la pestaña 1 para calcular el costo.
                </div>
              )}
            </section>

            <div className="print-only-footer">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "40px",
                }}
              >
                <div
                  style={{
                    borderTop: "1px solid #64748b",
                    width: "200px",
                    textAlign: "center",
                    paddingTop: "5px",
                    fontSize: "0.8rem",
                    color: "#334155",
                  }}
                >
                  <b>Aprobado / Técnico Encargado</b>
                  <br />
                  Sistemas SolarPuesto V1.0
                </div>
                <div
                  style={{
                    borderTop: "1px solid #64748b",
                    width: "200px",
                    textAlign: "center",
                    paddingTop: "5px",
                    fontSize: "0.8rem",
                    color: "#334155",
                  }}
                >
                  <b>Firma Vendedor / Comerciante</b>
                  <br />
                  Aceptación de cotización
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "guia" && (
          <>
            <div
              className={modoOscuro ? "aviso aviso-dark" : "aviso aviso-light"}
            >
              🛠️ <b>Manual Técnico Detallado con Evidencia Fotográfica</b>
            </div>

            <div className="casos">
              {PASOS_INSTALACION_DETALLADA.map((p) => (
                <article
                  className={
                    modoOscuro
                      ? "tarjeta tarjeta-dark"
                      : "tarjeta tarjeta-light"
                  }
                  key={p.paso}
                  style={{ marginBottom: "25px" }}
                >
                  <h3 style={{ color: "#f97316", marginBottom: "8px" }}>
                    Paso {p.paso}: {p.titulo}
                  </h3>
                  <p
                    style={{
                      color: modoOscuro ? "#94a3b8" : "#475569",
                      marginBottom: "15px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {p.descripcion}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {p.subpasos.map((sub, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "110px 1fr",
                          gap: "15px",
                          alignItems: "center",
                          background: modoOscuro
                            ? "rgba(15, 23, 42, 0.8)"
                            : "#ecfdf5",
                          padding: "12px",
                          borderRadius: "10px",
                          border: modoOscuro
                            ? "1px solid #334155"
                            : "1px solid #34d399",
                        }}
                      >
                        <img
                          src={sub.img}
                          alt={sub.iconoAlt}
                          style={{
                            width: "110px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #f97316",
                          }}
                        />
                        <div
                          style={{
                            color: modoOscuro ? "#e2e8f0" : "#065f46",
                            fontSize: "0.92rem",
                            lineHeight: "1.4",
                            fontWeight: "500",
                          }}
                        >
                          {sub.texto}
                        </div>
                      </div>
                    ))}
                  </div>

                  {p.alerta && (
                    <div
                      style={{
                        background: modoOscuro ? "#450a0a" : "#fef2f2",
                        border: "1px solid #f87171",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        color: modoOscuro ? "#fecaca" : "#991b1b",
                        fontSize: "0.88rem",
                        marginTop: "15px",
                      }}
                    >
                      {p.alerta}
                    </div>
                  )}
                </article>
              ))}

              <article
                className={
                  modoOscuro ? "tarjeta tarjeta-dark" : "tarjeta tarjeta-light"
                }
                style={{ marginBottom: "25px", border: "1px solid #f97316" }}
              >
                <h3 style={{ color: "#f97316", marginBottom: "8px" }}>
                  🛡️ Recomendaciones de Mantenimiento Preventivo
                </h3>
                <ul
                  style={{
                    color: modoOscuro ? "#cbd5e1" : "#334155",
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "0.92rem",
                  }}
                >
                  <li>
                    🧹 Limpie los paneles cada 15 días para evitar pérdida de
                    eficiencia.
                  </li>
                  <li>
                    🔍 Verifique trimestralmente que los bornes de la batería no
                    tengan corrosión.
                  </li>
                  <li>💧 Mantenga el inversor alejado de humedad o grasa.</li>
                </ul>
              </article>
            </div>
          </>
        )}
      </main>

      <footer className="pie-demo no-print" style={{ color: "#64748b" }}>
        Prototipo de software — SolarPuesto V1.0
      </footer>
    </div>
  );
}

function FilaClave({ a, onChange, onEliminar, modoOscuro }) {
  const horas = horasDeUso(a);
  const wh = (parseFloat(a.potencia) || 0) * horas;
  return (
    <tr>
      <td>
        <input
          className={modoOscuro ? "input-dark nombre" : "input-light nombre"}
          value={a.nombre}
          placeholder="Ej: Licuadora"
          onChange={(e) => onChange(a.id, "nombre", e.target.value)}
        />
      </td>
      <td className="centrada">
        <input
          className={
            modoOscuro ? "input-dark cantidad" : "input-light cantidad"
          }
          type="number"
          min="1"
          step="1"
          value={a.cantidad}
          onChange={(e) => onChange(a.id, "cantidad", e.target.value)}
        />
      </td>
      <td>
        <input
          className={
            modoOscuro ? "input-dark potencia" : "input-light potencia"
          }
          type="number"
          min="0"
          step="0.1"
          value={a.potencia}
          placeholder="W real"
          onChange={(e) => onChange(a.id, "potencia", e.target.value)}
        />
      </td>
      <td>
        <select
          className={modoOscuro ? "select-dark" : "select-light"}
          value={a.tipo}
          onChange={(e) => onChange(a.id, "tipo", e.target.value)}
        >
          <option value="usos">🔁 Por usos</option>
          <option value="continuo">⏱ Continuo</option>
          <option value="refri">❄️ Refrigeración</option>
        </select>
      </td>
      <td>
        <select
          className={modoOscuro ? "select-dark" : "select-light"}
          value={a.horario}
          onChange={(e) => onChange(a.id, "horario", e.target.value)}
        >
          <option value="dia">☀️ Día</option>
          <option value="noche">🌙 Noche</option>
          <option value="ambos">🌗 Ambos</option>
        </select>
      </td>
      <td>
        <div className="uso-container">
          {a.tipo === "usos" && (
            <>
              <input
                className={
                  modoOscuro ? "input-dark min_uso" : "input-light min_uso"
                }
                type="number"
                min="0"
                step="1"
                value={a.min}
                placeholder="Min uso"
                onChange={(e) => onChange(a.id, "min", e.target.value)}
              />
              <input
                className={
                  modoOscuro ? "input-dark usos_dia" : "input-light usos_dia"
                }
                type="number"
                min="1"
                step="1"
                value={a.usos}
                placeholder="Usos/día"
                onChange={(e) => onChange(a.id, "usos", e.target.value)}
              />
            </>
          )}
          {a.tipo === "continuo" && (
            <input
              className={
                modoOscuro ? "input-dark horas_dia" : "input-light horas_dia"
              }
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={a.horas}
              placeholder="Horas/día"
              onChange={(e) => onChange(a.id, "horas", e.target.value)}
            />
          )}
          {a.tipo === "refri" && (
            <>
              <input
                className={
                  modoOscuro
                    ? "input-dark horas_conn"
                    : "input-light horas_conn"
                }
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={a.horasConectado}
                placeholder="H conex"
                onChange={(e) =>
                  onChange(a.id, "horasConectado", e.target.value)
                }
              />
              <input
                className={
                  modoOscuro ? "input-dark ciclo" : "input-light ciclo"
                }
                type="number"
                min="20"
                max="60"
                step="5"
                value={a.ciclo}
                placeholder="Ciclo %"
                onChange={(e) => onChange(a.id, "ciclo", e.target.value)}
              />
            </>
          )}
        </div>
      </td>
      <td
        className="celda-uso-total"
        style={{ color: modoOscuro ? "#38bdf8" : "#0369a1" }}
      >
        {horas > 0 ? (
          <>
            {iconoHorario(a.horario)}
            {formatoHoras(horas)}
            <small style={{ display: "block", color: "#f97316" }}>
              {wh > 0 && `≈ ${wh.toLocaleString("es")} Wh/día`}
            </small>
          </>
        ) : (
          "—"
        )}
      </td>
      <td className="centrada">
        <button
          className="btn btn-accion btn-eliminar-dark"
          onClick={() => onEliminar(a.id)}
        >
          🗑
        </button>
      </td>
    </tr>
  );
}

function Campo({ label, valor, onChange, paso, min, max, modoOscuro }) {
  return (
    <div className="campo">
      <label style={{ color: modoOscuro ? "#cbd5e1" : "#475569" }}>
        {label}
      </label>
      <input
        className={modoOscuro ? "input-dark" : "input-light"}
        type="number"
        step={paso}
        min={min}
        max={max}
        value={valor}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          onChange(isNaN(v) ? 0 : v);
        }}
      />
    </div>
  );
}

function Material({ icono, nombre, detalle, valor, modoOscuro }) {
  return (
    <div className={modoOscuro ? "item-material-dark" : "item-material-light"}>
      <div className="icono">{icono}</div>
      <div>
        <div
          className="nombre"
          style={{ color: modoOscuro ? "#f8fafc" : "#0f172a" }}
        >
          {nombre}
        </div>
        <div
          className="detalle"
          style={{ color: modoOscuro ? "#94a3b8" : "#64748b" }}
        >
          {detalle}
        </div>
      </div>
      <div
        className="valor"
        style={{ color: modoOscuro ? "#34d399" : "#059669" }}
      >
        {valor}
      </div>
    </div>
  );
}

export { App };
