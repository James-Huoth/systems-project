export type Patient = {
  timeElasped: number;
  id: number;
  x: number;
  y: number;
  infected: boolean;
  infectionTime: number;
  vaccinated: boolean;
  deceased: boolean;
};

export type SimulationParameters = {  
  infectionChance: number;
  vaccinationRate: number;
  deathChance: number;
};

export const defaultSimulationParameters: SimulationParameters = {
  infectionChance: 5,
  vaccinationRate: 5,
  deathChance: 5,
};

