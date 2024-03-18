import React, { FC, useEffect, useState } from "react";
import {
  defaultSimulationParameters,
  type Patient,
  type SimulationParameters,
} from "./types";
import { createPopulation, updatePopulation } from "./diseaseModel";
import { LineChart, Line, YAxis, XAxis, Legend } from "recharts";

const Patient: FC<{ patient: Patient }> = ({ patient }) => {

const getFace = () => {
  if (patient.deceased == false) {
    if (patient.infected == false) {
  if (patient.vaccinated == false) {

    return "😀"
  } else {
    return "😎"
  }
  
} 
else {
return "🤢"

}

  } else {
  return "💀"
  }

}

  return (
    <div
      className="patient"
      style={{ left: `${patient.x}%`, top: `${patient.y}%` }}
    >
      {getFace()}
    </div>
  );
};

type DataPoint = {
  infected: number;
  vaccinations: number ;
  deaths: number ;
  total: number;
  round: number;
};

const Settings: FC<{
  parameters: SimulationParameters;
  setParameters: (p: SimulationParameters) => void;
}> = ({ parameters, setParameters }) => {
  return (
    <section>      
      <div>
        <label>Infection Chance:</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={parameters.infectionChance}
          onChange={(e) =>
            setParameters({
              ...parameters,
              infectionChance: parseFloat(e.target.value),
            })
          }
        />
        <input
          type="number"
          min="0"
          max="100"
          value={parameters.infectionChance}
          onChange={(e) =>
            setParameters({
              ...parameters,
              infectionChance: parseFloat(e.target.value),
            })
          }
        />
      </div>
      <div>
        <label>Vaccination Rate:</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={parameters.vaccinationRate}
          onChange={(e) =>
            setParameters({
              ...parameters,
              vaccinationRate: parseFloat(e.target.value),
            })
          }
        />
        <input
          type="number"
          min="0"
          max="100"
          value={parameters.vaccinationRate}
          onChange={(e) =>
            setParameters({
              ...parameters,
              vaccinationRate: parseFloat(e.target.value),
            })
          }
        />
      </div>
    </section>
  );
};

const App: FC = () => {
  const [popSize, setPopSize] = useState<number>(40); /* Sqrt of size */
  const [population, setPopulation] = useState<Patient[]>(
    createPopulation(1600)
  );
  const [lineToGraph, setLineToGraph] = useState<"infected" | "vaccinations" | "deaths">(
    "infected"
  );
  const [diseaseData, setDiseaseData] = useState<DataPoint[]>([]);
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const [simulationParameters, setSimulationParameters] =
    useState<SimulationParameters>(defaultSimulationParameters);

  useEffect(() => {
    // Each time the population changes, we add an item to our disease...
    let infectedCount = population.filter((p) => p.infected).length;
    let vaccinatedCount = population.filter((p) => p.vaccinated).length;
    let deathCount = population.filter((p) => p.deceased).length;
    let oldInfectedCount =
      diseaseData.length > 0 ? diseaseData[diseaseData.length - 1].infected : 0;
    setDiseaseData([
      ...diseaseData,
      {
        infected: infectedCount,
        vaccinations: vaccinatedCount,
        deaths: deathCount,
        total: population.length,
        round: diseaseData.length,
      },
    ]);
  }, [population]);

  const runTurn = () => {
    setPopulation(updatePopulation(population, simulationParameters));
  };

  const onPopInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopSize(parseInt(e.target.value));
  };

  const resetPopulation = () => {
    setAutoMode(false)
    setPopulation(createPopulation(popSize * popSize));
    setDiseaseData([]);
  };
  const autoRun = () => {
    setAutoMode(true);
  };
  const stop = () => {
    setAutoMode(false);
  };

  // We have an "effect" to run in auto-mode...
  useEffect(() => {
    if (autoMode) {
      console.log("Automatically run the next one in a half a sec");
      setTimeout(runTurn, 250);
    }
  }, [autoMode, population]);

  return (
    <div>
      <h1>My Systems Model</h1>
      Population: {population.length}. Infected:{" "} 
      {population.filter((p) => p.infected).length}
       . Vaccinated: {""}
      {population.filter((p) => p.vaccinated).length}  .
      <button onClick={runTurn} disabled={autoMode}>Next turn...</button>
      <button onClick={autoRun}>AutoRun</button>
      <button onClick={stop}>Stop</button>
      <input
        type="range"
        min="5"
        max="150"
        value={popSize}
        onChange={onPopInput}
      />
      
      <button onClick={resetPopulation}>Reset Population</button>
      <Settings parameters={simulationParameters} setParameters={setSimulationParameters} />
      <section className="side-by-side">
        <div className="chartContainer">
          <LineChart data={diseaseData} width={400} height={400}>
          <Legend verticalAlign="top" height={36}/>
            <YAxis />
            <XAxis />
            <Line type="monotone" dataKey={lineToGraph} stroke="#f00" />
            <Line type="monotone" dataKey={"vaccinations"} stroke="#3ff" />
            <Line type="monotone" dataKey={"deaths"} stroke="#000" />
          </LineChart>
         </div>

         <div className="emojiKey">
          <h1>Key:</h1> 
          <p>Healthy=😀</p>
          <p>Vaccinated=😎</p>
          <p>Sick=🤢</p> 
          <p>Dead=💀</p>
        </div>
       
        <div className="world">
          {population.map((patient) => (
            <Patient key={patient.id} patient={patient} />
          ))}
        </div>
      </section>
      <table>
        <tr>
          <th>Round</th>
          <th>Total</th>
          <th>New</th>
        </tr>
        {diseaseData.map((dataPoint) => (
          <tr>
            <td>{dataPoint.round}</td>
            <td>{dataPoint.infected}</td>
            <td>{dataPoint.newInfections}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default App;
