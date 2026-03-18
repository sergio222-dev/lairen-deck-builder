import { $, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Button }                                         from "~/components/button";
import { AppContext }                                     from "~/stores/appContext";
import { DECK_CREATION_CONTEXT }                          from "~/UI/deck/store/deckCreation.store";

interface DeckImporterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeckImporter = component$<DeckImporterProps>(({ isOpen, onClose }) => {
    const dialogRef   = useSignal<HTMLDialogElement>();
    const textAreaRef = useSignal<HTMLTextAreaElement>();

    // context
    const d   = useContext(DECK_CREATION_CONTEXT);
    const app = useContext(AppContext);

    // HANDLERS
    const handleImport = $(async () => {
        await d.resetDeck();

        try {
            const text = textAreaRef.value?.value;
            if (!text) {
                onClose();
                return;
            }

            app.isLoading = true;
            await d.importDeck(text);
        } catch (e) {
            console.error(e);
        } finally {
            app.isLoading = false;
            onClose();
        }
    })

    // EFFECTS
    useTask$(({ track }) => {
        track(() => isOpen);
        if (!isOpen) {
            dialogRef.value?.close();
        } else {
            dialogRef.value?.showModal();
        }
    })

    return (
            <dialog ref={dialogRef} class="p-4 max-w-xl w-full m-auto rounded shadow-lg shadow-black">
                <textarea disabled={app.isLoading} ref={textAreaRef} class="w-full h-full p-4" rows={10}
                          placeholder="Paste your deck here..."/>
                <div class="flex items-center justify-end gap-2 mt-2">
                    <Button disabled={app.isLoading} onClick$={() => onClose()}>Cancelar</Button>
                    <Button disabled={app.isLoading} onClick$={() => handleImport()}>Importar</Button>
                </div>
            </dialog>
    );

})
