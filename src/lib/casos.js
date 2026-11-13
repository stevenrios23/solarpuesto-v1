// Casos de referencia (Acta 002) con valores reales de puestos ambulantes.

export const CASOS = [
  {
    nombre: "🥤 Puesto de jugos",
    filas: [
      { nombre: "Licuadora (jugos)", cantidad: 1, potencia: 550, tipo: "usos", min: 2, usos: 55, horario: "dia" },
      { nombre: "Lámpara LED", cantidad: 2, potencia: 10, tipo: "continuo", horas: 5, horario: "noche" },
      { nombre: "Datáfono", cantidad: 1, potencia: 15, tipo: "continuo", horas: 3, horario: "dia" },
      { nombre: "Celular (carga)", cantidad: 1, potencia: 10, tipo: "usos", min: 30, usos: 3, horario: "dia" },
      { nombre: "Radio de música", cantidad: 1, potencia: 40, tipo: "continuo", horas: 6, horario: "ambos" }
    ]
  },
  {
    nombre: "📱 Luces LED + datáfono",
    filas: [
      { nombre: "Lámpara LED", cantidad: 4, potencia: 10, tipo: "continuo", horas: 5, horario: "noche" },
      { nombre: "Tira LED", cantidad: 1, potencia: 20, tipo: "continuo", horas: 6, horario: "noche" },
      { nombre: "Celular (carga)", cantidad: 1, potencia: 10, tipo: "usos", min: 30, usos: 6, horario: "dia" },
      { nombre: "Datáfono", cantidad: 1, potencia: 15, tipo: "continuo", horas: 6, horario: "dia" },
      { nombre: "Radio de música", cantidad: 1, potencia: 40, tipo: "continuo", horas: 8, horario: "ambos" }
    ]
  },
  {
    nombre: "❄️ Refrigerador pequeño",
    filas: [
      { nombre: "Refrigerador pequeño", cantidad: 1, potencia: 90, tipo: "refri", horasConectado: 12, ciclo: 35, horario: "ambos" },
      { nombre: "Lámpara LED", cantidad: 2, potencia: 10, tipo: "continuo", horas: 6, horario: "noche" },
      { nombre: "Datáfono", cantidad: 1, potencia: 15, tipo: "continuo", horas: 4, horario: "dia" }
    ]
  },
  {
    nombre: "🔀 Puesto mixto",
    filas: [
      { nombre: "Licuadora", cantidad: 1, potencia: 550, tipo: "usos", min: 2, usos: 50, horario: "dia" },
      { nombre: "Lámpara LED", cantidad: 3, potencia: 10, tipo: "continuo", horas: 6, horario: "noche" },
      { nombre: "Datáfono", cantidad: 1, potencia: 15, tipo: "continuo", horas: 5, horario: "dia" },
      { nombre: "Celular (carga)", cantidad: 1, potencia: 10, tipo: "usos", min: 30, usos: 4, horario: "dia" },
      { nombre: "Radio de música", cantidad: 1, potencia: 40, tipo: "continuo", horas: 7, horario: "ambos" }
    ]
  },
  {
    nombre: "🍟 Puesto de fritura",
    filas: [
      { nombre: "Fritadora / plancha", cantidad: 1, potencia: 1200, tipo: "usos", min: 3, usos: 40, horario: "dia" },
      { nombre: "Ventilador extractor", cantidad: 1, potencia: 60, tipo: "continuo", horas: 5, horario: "dia" },
      { nombre: "Lámpara LED", cantidad: 2, potencia: 10, tipo: "continuo", horas: 5, horario: "noche" },
      { nombre: "Datáfono", cantidad: 1, potencia: 15, tipo: "continuo", horas: 3, horario: "dia" }
    ]
  }
];