import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Button }                                                   from "~/components/button";
import { Chip }                                         from "~/components/chip/Chip";
import { Text }                                         from "~/components/text";
import { useCreateAlbumAction }                         from "~/routes/album";
import { ALBUM_LIST_CONTEXT }                                       from "~/UI/album/store/albumList.store";

interface CreateAlbumProps {
    isOpen: boolean;
    onClose: () => void;
    availableSets: string[];
}

export const CreateAlbum = component$<CreateAlbumProps>(({ isOpen, onClose, availableSets }) => {
    const modalRef    = useSignal<HTMLDialogElement>()
    const formRef     = useSignal<HTMLFormElement>()
    const createdTags = useStore<{ tags: string[] }>({
        tags: [],
    });

    const f = useCreateAlbumAction();
    const a = useContext(ALBUM_LIST_CONTEXT);


    // const a = useContext(ALBUM_CREATE_CONTEXT);

    const currentTag = useSignal('')

    const handleAddTag = $(() => {
        if (currentTag.value === '') return;
        if (!createdTags.tags.includes(currentTag.value))
            createdTags.tags.push(currentTag.value);
        currentTag.value = '';
    })

    const removeTag = $((tag: string) => {
        if (!tag) return;
        createdTags.tags = createdTags.tags.filter((t) => t !== tag);
    });

    const handleInput = $((e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            void handleAddTag();
        }
    });

    const handleSubmit = $(async (e: SubmitEvent, el: HTMLFormElement) => {
        const formData = new FormData(el);

        createdTags.tags.forEach(t => formData.append('tags[]', t))

        const { status } = await f.submit(formData);

        if (status === 200) {
            await a.listAlbums();
            onClose();
        }
    });

    useTask$(({ track }) => {
        track(() => isOpen);

        if (!isOpen) {
            modalRef.value?.close();
            formRef.value && formRef.value.reset();
            createdTags.tags = [];
        } else {
            modalRef.value?.showModal();
        }
    })

    return (
            <dialog ref={modalRef} class="p-4 container max-w-xl">
                <form preventdefault:submit ref={formRef} onSubmit$={handleSubmit}>

                    <div class="flex flex-col">
                        <label for="album-name">Name</label>
                        <Text id="album-name" name="name" required/>
                    </div>
                    <div class="flex flex-col mt-2">
                        <fieldset>
                            <legend>Select Set for album</legend>
                            {f.value?.fieldErrors && f.value.fieldErrors['sets[]'] && (
                                    <span class="text-red-600">Should select at least one set</span>
                            )}
                            {availableSets.map(s => (
                                    <div key={s} class="flex gap-2">
                                        <input id={`set-${s}`} name={`sets[]`} value={s} type="checkbox"/>
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
                    {f.value?.fieldErrors && f.value.fieldErrors['tags[]'] && (
                            <span class="text-red-600">Should add at least one tag</span>
                    )}
                    <div class="flex gap-2 mt-2">
                        {createdTags.tags.map(t => (
                                <Chip key={t} class="select-none hover:cursor-pointer"
                                      role="button"
                                      tabIndex={0}
                                      onClick$={() => removeTag(t)}>{t}</Chip>
                        ))}
                    </div>


                    <div class="flex gap-2 justify-end">
                        <Button type="button" onClick$={onClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </dialog>
    )
});
