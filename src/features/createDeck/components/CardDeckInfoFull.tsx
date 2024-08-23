import { component$ }      from '@builder.io/qwik';
import { CardDeckControl } from '~/features/createDeck/components/CardDeckControl';
import type { DeckCard }   from "~/models/Deck";

interface CardDeckInfoFullProps {
  unitCardsQuantity: number;
  actionCardsQuantity: number;
  monumentAndWeaponCardsQuantity: number;
  treasureCardsQuantity: number;
  treasureTotalCost: number;
  orderedUnitCards: DeckCard[];
  orderedActionCards: DeckCard[];
  orderedMonumentAndWeaponCards: DeckCard[];
  orderedTreasureCards: DeckCard[];
  orderedSideCards: DeckCard[];
  sideCardsQuantity: number;
}

export const CardDeckInfoFull = component$<CardDeckInfoFullProps>(
  (
    {
      unitCardsQuantity,
      actionCardsQuantity,
      monumentAndWeaponCardsQuantity,
      treasureCardsQuantity,
      treasureTotalCost,
      orderedUnitCards,
      orderedSideCards,
      orderedMonumentAndWeaponCards,
      orderedActionCards,
      orderedTreasureCards,
      sideCardsQuantity,
    }
  ) => {

    return (
      <>
        <div class="gap-4">
          <div>
            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Unidades ({unitCardsQuantity})</p>
            <div class="flex flex-wrap">
              {orderedUnitCards.map(c => (
                <CardDeckControl orientation="horizontal" key={c.id} card={c}/>
              ))}
            </div>
          </div>
          <div>
            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Acciones ({actionCardsQuantity})</p>
            <div class="flex flex-wrap">
              {orderedActionCards.map(c => (
                <CardDeckControl orientation="horizontal" key={c.id} card={c}/>
              ))}
            </div>
          </div>
        </div>

        {orderedMonumentAndWeaponCards.length > 0 &&
          <div>
            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Monumentos y Armas
              ({monumentAndWeaponCardsQuantity})</p>
            <div class="flex flex-wrap">
              {orderedMonumentAndWeaponCards.map(c => (
                <CardDeckControl orientation="horizontal" key={c.id} card={c}/>
              ))}
            </div>
          </div>
        }

        <div>
          <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Tesoros ({treasureCardsQuantity})
            Puntos: {treasureTotalCost}</p>
          <div class="flex flex-wrap">
            {orderedTreasureCards.map(c => (
              <CardDeckControl orientation="horizontal" key={c.id} card={c}/>
            ))}
          </div>
        </div>

        {orderedSideCards.length > 0 &&
          <div class="p-4">
            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Side ({sideCardsQuantity})</p>
            <div class="flex flex-wrap">
              {orderedSideCards.map(c => (
                <CardDeckControl orientation="horizontal" isSide key={c.id} card={c}/>
              ))}
            </div>
          </div>
        }
      </>
    );
  });
