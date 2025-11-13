import { useEffect, useState } from "react";
import { fetchEateries } from "./api";
import { AddEateryForm } from "./components/AddEateryForm";
import { EateryList } from "./components/EateryList";

export default function App() {
  const [eateries, setEateries] = useState([]);

  async function load() {
    const data = await fetchEateries();
    setEateries(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Hungry Scientist Ranking</h1>
      <AddEateryForm onAdd={load} />
      <EateryList eateries={eateries} onVote={load} />
    </div>
  );
}