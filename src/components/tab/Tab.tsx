import type { HTMLAttributes } from "@builder.io/qwik";
import { component$, Slot }    from "@builder.io/qwik";

interface TabProps extends HTMLAttributes<HTMLDivElement> {

}

export const Tab = component$<TabProps>((props) => {
    return (
            <div {...props}>
                <div class="p-2 pt-4 rounded-t-2xl bg-(--qwik-primary)">
                    <Slot name="title"/>
                </div>
                <div class="flex flex-wrap border-(--qwik-primary) border-2 rounded-b-2xl p-2">
                    <Slot/>
                </div>
            </div>
    )
})
