import { EateryItem } from "./EateryItem";

export function EateryList({ eateries, onVote }: any) {
  return (
    <div className="flex flex-col gap-4 mt-6 w-full max-w-xl">
      {eateries.map((e: any) => (
        <EateryItem key={e.id} eatery={e} onVote={onVote} />
      ))}
    </div>
  );
}