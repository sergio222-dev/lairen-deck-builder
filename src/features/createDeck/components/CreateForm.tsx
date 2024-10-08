import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { useLocation, useNavigate }             from "@builder.io/qwik-city";
import { Button }                               from "~/components/button";
import { Icon }                                 from "~/components/icons/Icon";
import { Switch }                               from '~/components/switch/Switch';
import { Text }                                 from '~/components/text';
import { DeckImporter }                         from "~/features/importer/DeckImporter";
import { AppContext }                           from "~/stores/appContext";
import { DeckCreationContext }                  from '~/stores/deckCreationContext';
import { parseToText }                          from "~/utils/parser";

export const CreateForm = component$(() => {
  const isImportOpen   = useSignal(false);
  const location       = useLocation();
  const navigation     = useNavigate();

  const deckStore = useContext(DeckCreationContext);
  const app       = useContext(AppContext);

  const handleCloseImportDialog = $(() => {
    isImportOpen.value = false;
  })

  const handleChange = $<(v: boolean) => void>((v) => deckStore.deckData.isPrivate = v);

  const handleNameChange = $((e: Event) => {
    deckStore.deckData.name = (e.target as HTMLInputElement).value;
  });

  const handleDescriptionName = $((e: Event) => {
    deckStore.deckData.description = (e.target as HTMLInputElement).value;
  });

  return (
    <div class="p-2">
      <div class="flex justify-between items-center flex-wrap py-2">
        <Text value={deckStore.deckData.name} placeholder="Deck Name" onInput$={handleNameChange}/>
        <div>
          <Switch id="public" name="sergio" value={deckStore.deckData.isPrivate} onChange={handleChange}/>
          is public?
        </div>
      </div>
      <div class="flex py-2">
        <Text value={deckStore.deckData.description} placeholder="Description" class="w-full" type="text"
              onInput$={handleDescriptionName}/>
      </div>
      <div class="flex items-center gap-2">
        <Button
          class="bg-primary p-4 disabled:opacity-50 disabled:cursor-not-allowed active:ring-2 ring-red-600"
          disabled={app.isLoading}
          onClick$={$(async () => {
            app.isLoading = true;
            let result = 0;

            try {
              result = await deckStore.createDeck();
            } finally {
              app.isLoading = false;
            }

            if (location.params['id'] === '' && result > 0) {
              void navigation(`/decks/create/${result}`);
            }
          })}
        >Create/Update Deck
        </Button>
        <Button class="active:ring-2 ring-red-600"
                onClick$={() => navigator.clipboard.writeText(parseToText(deckStore.deckData))}>
          <Icon name="copy" width={24} height={24} class="fill-primary"/>
        </Button>
        <Button class="active:ring-2 ring-red-600" onClick$={() => isImportOpen.value = true}>
          <Icon name="import" width={24} height={24} class="fill-primary"/>
        </Button>
      </div>
      <DeckImporter isOpen={isImportOpen.value} onClose={handleCloseImportDialog}/>
    </div>
  )
});
