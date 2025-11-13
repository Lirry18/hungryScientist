import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { vote } from "../api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function EateryItem({ eatery, onVote }: any) {
    const [myVote, setMyVote] = useState<string | null>(null);
    const storageKey = `vote-${eatery.id}`;

    useEffect(() => {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) setMyVote(stored);
    }, [eatery.id]);

    async function handleVote(type: "up" | "down") {
        if (myVote === type) {
            toast.error(
                type === "up"
                    ? "You already upvoted this eatery."
                    : "You already downvoted this eatery."
            );
            return;
        }
        setMyVote(type);
        sessionStorage.setItem(storageKey, type);

        await vote(eatery.id, type);
        onVote();
        toast.success(
            type === "up"
                ? "Upvote recorded."
                : "Downvote recorded."
        );
    }

    return (
        <Card className="p-3">
            <div className="flex w-full gap-4">

                {/* EATERY NAME */}
                <h3 className="text-md font-semibold break-words flex-1 min-w-0">
                    {eatery.name}
                </h3>

                {/* SCORE AND VOTING SYSTEM */}
                <div className="flex items-center gap-2 shrink-0">
                    <Badge
                        className={`font-semibold px-2 py-1
                            ${eatery.score > 0 ? "bg-green-100 text-green-800" : ""}
                            ${eatery.score < 0 ? "bg-red-100 text-red-800" : ""}
                        `}
                        >
                        {eatery.score}
                        </Badge>

                    <div className="flex flex-col items-center">
                        {/*UPVOTE*/}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${myVote === "up" ? "text-green-600" : "text-gray-500"
                                }`}
                            onClick={() => handleVote("up")}
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                         {/*DOWNVOTE*/}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${myVote === "down" ? "text-red-600" : "text-gray-500"
                                }`}
                            onClick={() => handleVote("down")}
                        >
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
