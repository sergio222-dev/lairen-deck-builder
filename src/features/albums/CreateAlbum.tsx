import { $, component$, useComputed$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Button }                                                       from "~/components/button";
import { Chip }                                                         from "~/components/chip/Chip";
import { Text }                                                         from "~/components/text";
import { ALBUM_CREATE_CONTEXT }                                         from "~/UI/album/store/albumCreate.store";

interface CreateAlbumProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateAlbum = component$<CreateAlbumProps>(({ isOpen, onClose }) => {
    const modalRef = useSignal<HTMLDialogElement>()
    const formRef = useSignal<HTMLFormElement>()

    const a = useContext(ALBUM_CREATE_CONTEXT);

    const currentTag = useSignal('')

    const isValid = useComputed$(() => {
        return a.createdTags.length > 0;
    })


    const handleAddTag = $(() => {
        if (currentTag.value === '') return;
        void a.addTag(currentTag.value);
        currentTag.value = '';
    })

    const removeTag = $((tag: string) => {
        if (!tag) return;
        void a.removeTag(tag);
    });

    const handleInput = $((e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            void handleAddTag();
        }
    });

    const handleReset = $(() => {
        void a.reset();
        formRef.value && formRef.value.reset();
    });

    useTask$(({ track }) => {
        track(() => isOpen);

        if (!isOpen) {
            modalRef.value?.close();
        } else {
            modalRef.value?.showModal();
        }
    })

    return (
            <dialog ref={modalRef} class="p-4 container max-w-xl">
                <form ref={formRef} onChange$={(e) => console.log(e)}>

                    <div class="flex flex-col">
                        <label for="album-name">Name</label>
                        <Text id="album-name" name="album-name" required/>
                    </div>
                    <div class="flex flex-col mt-2">
                        <fieldset>
                            <legend>Select Set for album</legend>
                            {a.availableSets.map(s => (
                                    <div key={s} class="flex gap-2">
                                        <input id={`set-${s}`} name={`sets`} required type="checkbox"/>
                                        <label for={`set-${s}`}>{s}</label>
                                    </div>
                            ))}
                        </fieldset>
                    </div>
                    <hr class="my-2"/>
                    <div class="flex gap-2">
                        <Text value={currentTag.value}
                              onKeyDown$={handleInput}
                              onInput$={(_, el) => currentTag.value = el.value}
                        />
                        <Button type="button" onClick$={handleAddTag}>ADD TAG</Button>
                    </div>
                    <div class="flex gap-2 mt-2">
                        {a.createdTags.map(t => (
                                <Chip key={t} class="select-none hover:cursor-pointer"
                                      role="button"
                                      tabIndex={0}
                                      onClick$={() => removeTag(t)}>{t}</Chip>
                        ))}
                    </div>


                    <div class="flex gap-2 justify-end">
                        <Button type="button" onClick$={() => {
                            void handleReset();
                            onClose()
                        }}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </dialog>
    )
});
