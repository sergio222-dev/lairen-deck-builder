import { $, component$, useContext } from '@builder.io/qwik';
import { MenuTw, MenuTwItem }        from '~/components/menuTw';
import { Switch }                    from '~/components/switch/Switch';
import { Text }                      from '~/components/text';
import { DeckCreationContext }       from '~/stores/deckCreationContext';

export const CreateForm = component$(() => {
  const c = useContext(DeckCreationContext);

  const handleChange = $<(v: boolean) => void>((v) => c.deckData.isPrivate = v);

  const handleNameChange = $((e: Event) => {
    c.deckData.name = (e.target as HTMLInputElement).value;
  });

  const handleDescriptionName = $((e: Event) => {
    c.deckData.description = (e.target as HTMLInputElement).value;
  });

  return (
    <div>
      <div class="flex justify-center items-center">
        <Text value={c.deckData.name} placeholder="Deck Name" onInput$={handleNameChange}/>
        <MenuTw>
          <MenuTwItem label="sergio" value="sergio"/>
        </MenuTw>
        <div>
          <Switch id="public" name="sergio" value={c.deckData.isPrivate} onChange={handleChange}/>
          is public?
        </div>
      </div>
      <div class="flex">
        <Text value={c.deckData.description} placeholder="Description" class="w-full" type="text"
              onInput$={handleDescriptionName}/>
      </div>
    </div>
  )
});
