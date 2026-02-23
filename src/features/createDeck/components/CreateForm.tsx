import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { useLocation, useNavigate }             from "@builder.io/qwik-city";
import { Button }                               from "~/components/button";
import { Icon }                                 from "~/components/icons/Icon";
import { Menu }                                 from "~/components/menu";
import { Switch }                               from '~/components/switch/Switch';
import { Text }                                 from '~/components/text';
import { DeckImporter }                         from "~/features/importer/DeckImporter";
import { AppContext }                           from "~/stores/appContext";
import { DECK_CREATION_CONTEXT }                from "~/UI/deck/store/deckCreation.store";
import { USER_CONTEXT }                         from "~/UI/user/store/user.store";
import { generateDeckImage, loadDeck }          from "~/utils/deckImageGenerator";
import { parseToText }                          from "~/utils/parser";

export const CreateForm = component$(() => {
    const isImportOpen = useSignal(false);
    const location     = useLocation();
    const navigation   = useNavigate();

    const inputRef = useSignal<HTMLInputElement>();

    // const deckStore = useContext(DeckCreationContext);
    const d         = useContext(DECK_CREATION_CONTEXT);
    const app       = useContext(AppContext);
    const userStore = useContext(USER_CONTEXT)

    const handleCloseImportDialog = $(() => {
        isImportOpen.value = false;
    })

    const handleChange = $<(v: boolean) => void>((v) => d.isPublic = v);

    const handleNameChange = $((e: Event) => {
        d.name = (e.target as HTMLInputElement).value;
    });

    const handleDescriptionName = $((e: Event) => {
        d.description = (e.target as HTMLInputElement).value;
    });

    return (
            <div class="p-2">
                <div class="flex flex-wrap items-center justify-between py-2">
                    <Text value={d.name} placeholder="Deck Name" onInput$={handleNameChange}/>
                    {userStore.user && (
                            <div>
                                <Switch
                                        id="public"
                                        name="isPublic"
                                        value={d.isPublic}
                                        onChange={handleChange}
                                />
                                is public?
                            </div>
                    )}
                </div>

                {userStore.user && (
                        <div class="flex py-2">
                            <Text
                                    value={d.description}
                                    placeholder="Description"
                                    class="w-full"
                                    type="text"
                                    onInput$={handleDescriptionName}
                            />
                        </div>
                )}
                <div class="flex items-center justify-between gap-2">
                    <Menu>
                        <div q:slot="label">Menu</div>
                        <div class="flex flex-col gap-2">
                            {userStore.user && (
                                    <Button
                                            class="bg-primary p-4 text-black ring-red-600 active:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={app.isLoading}
                                            onClick$={$(async () => {
                                                app.isLoading = true;
                                                let result    = 0;

                                                try {
                                                    result = await d.saveDeck();
                                                } finally {
                                                    app.isLoading = false;
                                                }

                                                if (location.params["id"] === "" && result > 0) {
                                                    void navigation(`/decks/create/${result}`);
                                                }
                                            })}
                                    >
                                        {d.deckId !== 0 ? "Update" : "Create"}
                                    </Button>
                            )}
                            <div class="flex gap-2">
                                {userStore.user && (
                                        <Button
                                                class="ring-red-600 active:ring-2"
                                                disabled={app.isLoading || d.deckId < 1}
                                                onClick$={$(async () => {
                                                    app.isLoading = true;
                                                    try {
                                                        if (!app.dialogYesNo?.value) return;
                                                        const response = await app.dialogYesNo.value.open(
                                                                "Estas seguro?");

                                                        if (!response) {
                                                            app.isLoading = false;
                                                            return;
                                                        }
                                                        await d.deleteDeck();
                                                    } finally {
                                                        app.isLoading = false;
                                                    }

                                                    void navigation(`/mydecks/`);
                                                })}
                                        >
                                            {" "}
                                            <Icon name="trash" width={24} height={24} class="fill-primary"/>{" "}
                                        </Button>
                                )}
                                <Button
                                        class="ring-red-600 active:ring-2"
                                        onClick$={() => navigator.clipboard.writeText(parseToText(d))}
                                >
                                    <Icon name="copy" width={24} height={24} class="fill-primary"/>
                                </Button>
                                <Button class="ring-red-600 active:ring-2" onClick$={() => (isImportOpen.value = true)}>
                                    <Icon name="import" width={24} height={24} class="fill-primary"/>
                                </Button>
                                <Button class="ring-red-600 active:ring-2" onClick$={() => inputRef.value?.click()}>
                                    <Icon name="upload" width={24} height={24} class="fill-primary"/>
                                </Button>
                                <input
                                        ref={inputRef}
                                        hidden
                                        type="file"
                                        onChange$={async (e: Event) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];

                                            if (!file) return;

                                            const deckString = await loadDeck(file);

                                            app.isLoading = true;
                                            await d.importDeck(deckString);
                                            app.isLoading = false;
                                        }}
                                />
                            </div>
                            <Button
                                    disabled={app.isLoading}
                                    class="ring-red-600 active:ring-2"
                                    onClick$={async () => {
                                        app.isLoading = true;
                                        await generateDeckImage(d);
                                        app.isLoading = false;
                                    }}
                            >
                                Generate Image
                            </Button>
                        </div>
                    </Menu>
                    {/*<DeckTypesConfigurator/>*/}
                    <Menu right>
                        <div q:slot="label">View</div>
                        <div class="flex gap-2 text-black">
                            <Button> <Icon name="gallery" width={24} height={24}/> </Button>
                            <Button disabled> <Icon name="list" width={24} height={24}/> </Button>
                            {/*<Button onClick$={() => (deckStore.view = "simple")}>Full</Button>*/}
                            {/*<Button onClick$={() => (deckStore.view = "pro")}>Pro</Button>*/}
                        </div>
                    </Menu>
                </div>
                <DeckImporter isOpen={isImportOpen.value} onClose={handleCloseImportDialog}/>
            </div>
    );
});
