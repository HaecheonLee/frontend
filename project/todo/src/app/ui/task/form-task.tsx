"use client";

import { Input } from "@/components/ui/input";
import ErrorLabel from "./error-label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "../date-picker";
import { Button } from "@/components/ui/button";
import { Category, TaskActionState, Todo } from "@/types/types";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { getCategories } from "@/utils/local-storage";
import { toTitleCase } from "@/lib/utils";

interface IFormTaskProps {
    state: TaskActionState;
    isPending: boolean;
    submitLabel: "Create" | "Edit";
    initialTodo?: Todo;
    handleSubmit: (
        formData: FormData,
        date: Date,
        selectedTagIds: string[]
    ) => void;
    goBack: () => void;
}

export default function FormTask({
    state,
    isPending,
    submitLabel,
    initialTodo,
    handleSubmit,
    goBack,
}: IFormTaskProps) {
    const [date, setDate] = useState<Date | undefined>(() =>
        initialTodo?.dueDate ? new Date(initialTodo?.dueDate) : new Date()
    );
    const [types, setTypes] = useState<Category[]>([]);
    const [tags, setTags] = useState<Category[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    useEffect(() => {
        setTypes(getCategories("TYPE"));
        setTags(getCategories("TAG"));
    }, []);

    const submit = (formData: FormData) => {
        handleSubmit(formData, date ?? new Date(), selectedTagIds);
    };

    return (
        <form action={submit}>
            <div>
                <Input
                    name="title"
                    type="text"
                    placeholder="New task"
                    className="mb-2 text-base md:text-sm"
                    aria-describedby="title-error"
                    defaultValue={initialTodo?.title ?? ""}
                />
                <div id="title-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.title &&
                        state.errors.title.map((error: string) => (
                            <ErrorLabel key={error} message={error} />
                        ))}
                </div>
            </div>
            <div>
                <Textarea
                    name="description"
                    className="text-base md:text-sm"
                    placeholder="Write your task in detail here."
                    aria-describedby="description-error"
                    defaultValue={initialTodo?.description ?? ""}
                />
                <div
                    id="description-error"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state.errors?.description &&
                        state.errors.description.map((error: string) => (
                            <ErrorLabel key={error} message={error} />
                        ))}
                </div>
            </div>
            <div className="mt-2 mb-2 gap-x-2">
                <div className="flex gap-x-2 mb-2">
                    <div className="flex-1">
                        <DatePicker
                            date={date}
                            setDate={setDate}
                            aria-describedby="due-date-error"
                        />
                        <div
                            id="due-date-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.dueDate &&
                                state.errors.dueDate.map((error: string) => (
                                    <ErrorLabel key={error} message={error} />
                                ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <Select
                            name="type"
                            aria-describedby="type-error"
                            defaultValue={initialTodo?.type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {types.map((type) => (
                                        <SelectItem
                                            value={type.id}
                                            key={type.id}
                                        >
                                            {toTitleCase(type.title)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div
                            id="type-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.type &&
                                state.errors.type.map((error: string) => (
                                    <ErrorLabel key={error} message={error} />
                                ))}
                        </div>
                    </div>
                </div>
                <div className="mb-2 lg:mb-0">
                    {tags.map((tag) => (
                        <Toggle
                            value={tag.id}
                            key={tag.id}
                            style={{ backgroundColor: tag.color }}
                            variant="outline"
                            className="mr-1 mb-1 truncate max-w-[100px] inline"
                            onPressedChange={(pressed) => {
                                if (pressed) {
                                    setSelectedTagIds((ids) =>
                                        ids.concat(tag.id)
                                    );
                                } else {
                                    setSelectedTagIds((ids) =>
                                        ids.filter((id) => id !== tag.id)
                                    );
                                }
                            }}
                            defaultPressed={
                                initialTodo?.tags?.includes(tag.id) ?? false
                            }
                        >
                            {toTitleCase(tag.title)}
                        </Toggle>
                    ))}
                    <div id="tag-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.type &&
                            state.errors.type.map((error: string) => (
                                <ErrorLabel key={error} message={error} />
                            ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-1">
                <Button
                    type="button"
                    onClick={goBack}
                    disabled={isPending}
                    aria-disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    aria-disabled={isPending}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
