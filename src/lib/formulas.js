// Módulo puro de cálculo — SolarPuesto V1.0 (sin dependencias de UI ni DOM -> 100% testable)

export const DEFAULTS = {
  hsp: 4.5,     // horas pico solar (Neiva)
  eff: 0.8,     // eficiencia del sistema
  margen: 0.25, // margen de pérdidas
  tension: 12,  // V del banco de baterías
  dod: 0.5,     // profundidad de descarga
  ppanel: 450   // Wp por panel comercial
};

// Uso real diario (horas) de un elemento, según su tipo.
// - usos:      m * u * c / 60        (minutos por uso × usos al día × cantidad)
// - continuo:  t                     (horas encendido/día)
// - refri:     t_conectado × ciclo%  (compresor no consume a toda hora)
export function horasDeUso(a) {
  const c = a.cantidad || 0;
  if (a.tipo === "usos") return ((a.min || 0) * (a.usos || 0) * c) / 60;
  if (a.tipo === "continuo") return a.horas || 0;
  if (a.tipo === "refri") return (a.horasConectado || 0) * ((a.ciclo || 0) / 100);
  return 0;
}

// Dimensiona el sistema completo a partir de la lista de aparatos.
// Devuelve un objeto puro con KPIs, desglose por aparato, material y
// refinio del consumo nocturno (lo cubre la batería).
export function dimensionar(aparatos, params = DEFAULTS) {
  const p = { ...DEFAULTS, ...params };

  const filas = aparatos.map((a) => {
    const horas = horasDeUso(a);
    const potenciaTotal = a.potencia * a.cantidad;
    const energiaWh = potenciaTotal * horas;
    return { ...a, horas, potenciaTotal, energiaWh };
  });

  const totalWh = filas.reduce((s, f) => s + f.energiaWh, 0);
  const totalW = filas.reduce((s, f) => s + f.potenciaTotal, 0);
  const pico = filas.length ? Math.max(0, ...filas.map((f) => f.potenciaTotal)) : 0;

  const nocturnoWh = filas
    .filter((f) => f.horario === "noche" || f.horario === "ambos")
    .reduce((s, f) => s + f.energiaWh, 0);

  // Paneles:  Wp = (E / HSP) * (1 / eff) * (1 + margen);  N = ceil(Wp / Wpanel)
  const wp = (totalWh / p.hsp) * (1 / p.eff) * (1 + p.margen);
  const nPaneles = totalWh > 0 ? Math.ceil(wp / p.ppanel) : 0;

  // Batería:  Ah = E * (1 + margen) / (V * DOD)
  const ah = totalWh > 0 ? (totalWh * (1 + p.margen)) / (p.tension * p.dod) : 0;

  // Inversor:  >= P_pico * 1.25  (margen de arranque)
  const watInversor = Math.max(pico * 1.25, totalW * 1.25);

  // Garantía: los paneles re-cargan la batería dentro de las HSP
  const produccionDiariaKWh = wp * p.hsp;

  return {
    filas,
    totalW,
    totalWh,
    pico,
    nocturnoWh,
    wp,
    nPaneles,
    ah,
    watInversor,
    produccionDiariaWh: produccionDiariaKWh // Wp × HSP
  };
}

// Formatea horas (flotante) como "X h Y min".
export function formatoHoras(h) {
  if (!(h > 0)) return "—";
  const totalMin = Math.round(h * 60);
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  if (hh === 0) return `${mm} min`;
  if (mm === 0) return `${hh} h`;
  return `${hh} h ${mm} min`;
}