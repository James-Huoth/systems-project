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
};

export const defaultSimulationParameters: SimulationParameters = {
  distanceThreshold: 5,
  movement: 5,
  infectionChance: 5,
  vaccinationChance: 50,
};

