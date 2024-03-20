import type { Patient } from "./types";
import type { SimulationParameters } from "./types";

export const createPopulation = (size = 1600) => {
  const population: Patient[] = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      timeElasped: 0,
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      infectionTime: 0,
      vaccinated: false,
      deceased: false,
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};




const updatePatient = (
  patient: Patient,
  population: Patient[],
  params: SimulationParameters
): Patient => {
  let updatedPatient = { ...patient };
  updatedPatient = { ...patient, timeElasped: patient.timeElasped + 1 };
  
  // IF we are NOT sick, see if our neighbors are sick...
  // choose a partner
  const partner = population[Math.floor(Math.random() * population.length)];
  let recoveryTime = 2



if(partner.deceased == false) {

  if(partner.infected == true && patient.timeElasped - patient.infectionTime > recoveryTime) {

  let chance = Math.floor(Math.random() * 100)
console.log(params.deathChance,chance)
  if (chance > params.deathChance) {
      updatedPatient = { ...patient, infected : false, infectionTime: 0, vaccinated : true,};
      
  }else {
    console.log("Person Died" + chance/params.deathChance * 100)
    updatedPatient = { ...patient, infected : false, infectionTime: 0, deceased : true, vaccinated : false,};
  }


}
  if (patient.vaccinated == true) {
       if (partner.infected && 100*Math.random() < params.infectionChance/10) {       
      
    updatedPatient = { ...patient, infected : true, infectionTime: patient.timeElasped };
  }   

  }  else {
    let randomNumber = Math.floor(Math.random() * 1000)

  if(randomNumber < params.vaccinationRate) {

updatedPatient = { ...patient, vaccinated : true };

  }
    if (partner.infected && 100*Math.random() < params.infectionChance) {       
      
      updatedPatient = { ...patient, infected : true, infectionTime: patient.timeElasped };
    }   
  }
}





  
  
  

  return updatedPatient;
};

export const updatePopulation = (
  population: Patient[],
  params: SimulationParameters
): Patient[] => {
  // Run updatePatient once per patient to create *new* patients for new round.
  return population.map((patient) =>
    updatePatient(patient, population, params)
  );
};
