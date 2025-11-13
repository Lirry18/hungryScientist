import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addEatery } from "../api"
import { toast } from "sonner";

export function AddEateryForm({ onAdd }: { onAdd: () => void }) {
    const [name, setName] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const res = await addEatery(name);
        if (res.error) toast.error(res.error);
        else {
            toast.success('Eatery added');
            setName("");
            onAdd();
        }
    }

    return (
        <form onSubmit={submit} className="flex gap-2 mt-4 w-full max-w-md">
            <Input
                placeholder="Add a new eatery"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit">Add</Button>
        </form>
    );
}