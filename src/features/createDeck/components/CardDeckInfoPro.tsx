import { component$ }         from "@builder.io/qwik";
import { CardDeckControlPro } from "~/features/createDeck/components/CardDeckControlPro";
import type { DeckCard }      from "~/models/Deck";

interface CardDeckInfoProProps {
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

export const CardDeckInfoPro = component$<CardDeckInfoProProps>((
  {
    unitCardsQuantity,
    actionCardsQuantity,
    monumentAndWeaponCardsQuantity,
    treasureCardsQuantity,
    treasureTotalCost,
    orderedUnitCards,
    orderedActionCards,
    orderedMonumentAndWeaponCards,
    orderedTreasureCards,
    orderedSideCards,
    sideCardsQuantity
  }
) => {

  return (
    <>
      <div class="sm:flex sm:flex-wrap sm:items-start w-full sm:gap-2">
        <div class="sm:min-w-[40%] 2xl:min-w-[40%]  md:w-full md:min-w-[100%] flex-1">
          <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Unidades ({unitCardsQuantity})</p>
          {orderedUnitCards.map(c => (
            <CardDeckControlPro orientation="horizontal" key={c.id} card={c}/>
          ))}
        </div>
        <div class="sm:min-w-[40%] 2xl:min-w-[40%]  md:w-full md:min-w-[100%] flex-1">
          <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Acciones ({actionCardsQuantity})</p>
          {orderedActionCards.map(c => (
            <CardDeckControlPro orientation="horizontal" key={c.id} card={c}/>
          ))}
        </div>
        {orderedMonumentAndWeaponCards.length > 0 &&
          <div class="sm:min-w-[40%] 2xl:min-w-[40%]  md:w-full md:min-w-[100%] flex-1">
            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Monumentos y Armas
              ({monumentAndWeaponCardsQuantity})</p>
            {orderedMonumentAndWeaponCards.map(c => (
              <CardDeckControlPro orientation="horizontal" key={c.id} card={c}/>
            ))}
          </div>
        }
        <div class="sm:min-w-[40%] 2xl:min-w-[40%]  md:w-full md:min-w-[100%] flex-1">
          <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Tesoros ({treasureCardsQuantity})
            Puntos: {treasureTotalCost}</p>
          {orderedTreasureCards.map(c => (
            <CardDeckControlPro orientation="horizontal" key={c.id} card={c}/>
          ))}
        </div>

        {orderedSideCards.length > 0 &&
          <div class="sm:min-w-[40%] 2xl:min-w-[40%] md:w-full md:min-w-[100%] flex-1">
            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Side ({sideCardsQuantity})</p>
            {orderedSideCards.map(c => (
              <CardDeckControlPro orientation="horizontal" isSide key={c.id} card={c}/>
            ))}
          </div>
        }
      </div>
    </>
  )
})
