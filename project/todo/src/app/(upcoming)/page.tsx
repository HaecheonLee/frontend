"use client";

import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import Container from "@/app/ui/task/container";
import View from "../ui/task/view";
import { useEffect, useState } from "react";
import { Todo } from "@/types/types";
import { getTodoList } from "@/utils/local-storage";

export default function Page() {
    const [todoList, setTodoList] = useState<Todo[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTodoList(() => getTodoList());
        }
    }, []);

    return (
        <>
            <div className="mb-10">
                <TypographyH1>Upcoming</TypographyH1>
            </div>
            <Container title="Today">
                {todoList.length === 0 && (
                    <div className="text-center">
                        <TypographySmall>
                            You have no tasks at the moment! 🎉
                        </TypographySmall>
                    </div>
                )}
                {todoList.length !== 0 &&
                    todoList.map((p) => <View key={p.id} title={p.title} />)}
            </Container>
        </>
    );
}
