import { describe, it, expect } from "vitest";
import { dimensionar, horasDeUso, formatoHoras, DEFAULTS } from "../src/lib/formulas.js";
import { CASOS } from "../src/lib/casos.js";

describe("horasDeUso (uso real por tipo)", () => {
  it("U-01: uso por usos -> (min × usos × cant)/60", () => {
    const h = horasDeUso({ tipo: "usos", min: 2, usos: 55, cantidad: 1 });
    expect(h).toBeCloseTo(1.8333, 3); // 1 h 50 min
  });

  it("U-02: continuo -> horas encendidas", () => {
    expect(horasDeUso({ tipo: "continuo", horas: 6, cantidad: 1 })).toBe(6);
  });

  it("U-03: refri -> horas conectadas × ciclo", () => {
    expect(horasDeUso({ tipo: "refri", horasConectado: 12, ciclo: 35, cantidad: 1 })).toBeCloseTo(4.2, 5);
    expect(horasDeUso({ tipo: "refri", horasConectado: 12, ciclo: 40, cantidad: 1 })).toBeCloseTo(4.8, 5);
  });

  it("U-04: la cantidad multiplica en uso por usos", () => {
    expect(horasDeUso({ tipo: "usos", min: 2, usos: 55, cantidad: 2 })).toBeCloseTo(3.6667, 3);
  });
});

describe("dimensionar — potencia y energía", () => {
  const licuadora = { nombre: "Licuadora", cantidad: 2, potencia: 550, tipo: "usos", min: 2, usos: 55, horario: "dia" };

  it("U-04: potencia instalada = p × cant (suma por unidad)", () => {
    const r = dimensionar([licuadora]);
    expect(r.totalW).toBe(1100);
    expect(r.pico).toBe(1100);
  });

  it("U-02: continuo LED 45W × 3 × 6h = 810 Wh", () => {
    const r = dimensionar([{ nombre: "Foco LED", cantidad: 3, potencia: 45, tipo: "continuo", horas: 6, horario: "dia" }]);
    expect(r.totalWh).toBe(810);
    expect(r.totalW).toBe(135);
  });

  it("U-05: número de paneles redondea hacia arriba (3,11 -> 4)", () => {
    const r = dimensionar(
      [{ nombre: "X", cantidad: 1, potencia: 550, tipo: "continuo", horas: 10, horario: "dia" }],
      { ...DEFAULTS, hsp: 4.5, ppanel: 450 }
    );
    // E = 5500 Wh -> wp = 5500/4.5/0.8*1.25 ≈ 1909 -> ceil(1909/450)=5
    expect(r.wp).toBeCloseTo(1909.72, 1);
    expect(r.nPaneles).toBe(5);
  });

  it("U-06: batería = E(1+m)/(V×DOD)", () => {
    const r = dimensionar(
      [{ nombre: "X", cantidad: 1, potencia: 550, tipo: "continuo", horas: 10, horario: "dia" }],
      { ...DEFAULTS, tension: 12, dod: 0.5 }
    );
    // Ah = 5500*1.25/(12*0.5) ≈ 1145.83
    expect(r.ah).toBeCloseTo(1145.83, 1);
  });

  it("U-07: inversor ≥ pico × 1,25", () => {
    const r = dimensionar(
      [{ nombre: "Fritadora", cantidad: 1, potencia: 1200, tipo: "continuo", horas: 2, horario: "dia" }]
    );
    expect(r.watInversor).toBe(1500);
  });
});

describe("refinio del consumo nocturno", () => {
  it("U-08: E_noche solo incluye horario noche/ambos", () => {
    const r = dimensionar([
      { nombre: "Luces", cantidad: 2, potencia: 10, tipo: "continuo", horas: 5, horario: "noche" }, // 100 Wh
      { nombre: "Radio", cantidad: 1, potencia: 40, tipo: "continuo", horas: 6, horario: "ambos" }   // 240 Wh
    ]);
    expect(r.nocturnoWh).toBe(340);
    expect(r.nocturnoWh).toBeLessThanOrEqual(r.totalWh);
  });

  it("U-09: 'ambos' cuenta en el consumo nocturno", () => {
    const r = dimensionar([{ nombre: "Refri", cantidad: 1, potencia: 90, tipo: "refri", horasConectado: 12, ciclo: 35, horario: "ambos" }]);
    expect(r.nocturnoWh).toBeCloseTo(378, 5);
  });

  it("U-10: lista vacía no rompe (totales 0, paneles 0)", () => {
    const r = dimensionar([]);
    expect(r.totalW).toBe(0);
    expect(r.totalWh).toBe(0);
    expect(r.nPaneles).toBe(0);
    expect(r.ah).toBe(0);
  });
});

describe("casos de referencia (Acta 002)", () => {
  it.each(CASOS)("$nombre — resultado coherente", (caso) => {
    const r = dimensionar(caso.filas);
    expect(r.totalW).toBeGreaterThan(0);
    expect(r.totalWh).toBeGreaterThan(0);
    expect(r.nPaneles).toBeGreaterThanOrEqual(1);
    expect(r.watInversor).toBeGreaterThanOrEqual(r.pico * 1.25);
    expect(r.nocturnoWh).toBeLessThanOrEqual(r.totalWh);
  });

  it("Caso fritura: fritadora 1200W 3min×40 = 2400 Wh", () => {
    const fila = CASOS[4].filas.find((f) => f.nombre.includes("Fritadora"));
    const r = dimensionar([fila]);
    expect(r.totalWh).toBe(2400);
  });
});

describe("formatoHoras", () => {
  it("formatea horas y minutos", () => {
    expect(formatoHoras(1.8333)).toBe("1 h 50 min");
    expect(formatoHoras(0.5)).toBe("30 min");
    expect(formatoHoras(6)).toBe("6 h");
    expect(formatoHoras(0)).toBe("—");
  });
});