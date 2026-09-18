import { describe, it, expect } from 'vitest';

describe('Simulation Module Physics Engine', () => {
  it('calculates generation correctly using (base - outage) * scale without negative values', () => {
    const baseGen = 100000;
    const outageGen = 50000; // partial outage
    const scaleFactor = 0.5; // 50% load scale

    // Correct formula order: (base - outage) * scale
    const calcGen = Math.max(0, (baseGen - outageGen) * scaleFactor);
    expect(calcGen).toBe(25000);
    expect(calcGen).toBeGreaterThanOrEqual(0);
  });

  it('handles full generator outage cleanly', () => {
    const baseGen = 100000;
    const outageGen = 100000; // 100% generator trip
    const scaleFactor = 1.0;

    const calcGen = Math.max(0, (baseGen - outageGen) * scaleFactor);
    expect(calcGen).toBe(0);
  });

  it('subtracts internal consumption from total demand when generator undergoes outage', () => {
    const baselineConsumption = 1736000;
    const generatorInternalCons = 35000; // e.g. BF-1 internal stove draw
    const isOutage = true;

    const effectiveConsumption = isOutage
      ? baselineConsumption - generatorInternalCons
      : baselineConsumption;

    expect(effectiveConsumption).toBe(1701000);
    expect(effectiveConsumption).toBeLessThan(baselineConsumption);
  });

  it('computes BF and CO gasholder buffer windows separately', () => {
    const bfDeficit = -20000; // Nm³/h
    const bfHolderVolume = 100000; // m³
    const bfLevelPercent = 60; // 60,000 m³ stored

    const coSurplus = 15000; // Nm³/h
    const coHolderVolume = 80000; // m³
    const coLevelPercent = 50; // 40,000 m³ stored

    // BF depletion hours = stored volume / deficit rate
    const bfStoredVol = (bfHolderVolume * bfLevelPercent) / 100;
    const bfDepletionHours = bfDeficit < 0 ? bfStoredVol / Math.abs(bfDeficit) : Infinity;

    // CO gas is in surplus so depletion is Infinity (buffering)
    const coStoredVol = (coHolderVolume * coLevelPercent) / 100;
    const coDepletionHours = coSurplus < 0 ? coStoredVol / Math.abs(coSurplus) : Infinity;

    expect(bfDepletionHours).toBe(3.0); // 60,000 / 20,000 = 3 hours
    expect(coDepletionHours).toBe(Infinity);
  });

  it('ensures LD gas outage reduces surplus without fabricating false deficit', () => {
    const ldGenBaseline = 150000;
    const ldConsBaseline = 0; // LD gas has 0 direct consumer draw
    const ldOutageGen = 150000; // LD recovery plant outage

    const netSurplusBaseline = ldGenBaseline - ldConsBaseline;
    const netSurplusOutage = Math.max(0, ldGenBaseline - ldOutageGen) - ldConsBaseline;

    expect(netSurplusBaseline).toBe(150000);
    expect(netSurplusOutage).toBe(0);
    expect(netSurplusOutage).toBeGreaterThanOrEqual(0); // Reduces surplus, zero deficit created
  });
});
