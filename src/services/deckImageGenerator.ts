import { CARD_TYPES }               from "~/models/CardTypes";
import type { DeckCard, DeckState } from "~/models/Deck";

const NUM_COLS                      = 5;
const SPACE_BETWEEN_TITLE_AND_CARDS = 20;
const CARD_HEIGHT                   = 270;
const STATING_HEIGHT_CARD_ZONE      = 150;

function splitChunk(array: any[], chunkSize: number) {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}

export async function generateDeckImage(deck: DeckState) {
  // calcualte the height of canvas
  const { name, masterDeck, treasureDeck, sideDeck } = deck
  // calculate number of zones
  const units                                        = Object.values(masterDeck)
    .filter(c => c.type === CARD_TYPES.UNIT);
  const actions                                      = Object.values(masterDeck)
    .filter(c => c.type === CARD_TYPES.ACTION);
  const monumentsAndWeapons                          = Object.values(masterDeck)
    .filter(c => c.type === CARD_TYPES.MONUMENTO || c.type === CARD_TYPES.ARMA);
  const treasures                                    = Object.values(treasureDeck);
  const sideDeckCards                                = Object.values(sideDeck);

  let cardZoneHeight = 0;
  cardZoneHeight += calculateHeightOfCardZone(units.length);
  cardZoneHeight += calculateHeightOfCardZone(actions.length);
  cardZoneHeight += calculateHeightOfCardZone(monumentsAndWeapons.length);
  cardZoneHeight += calculateHeightOfCardZone(treasures.length);
  cardZoneHeight += calculateHeightOfCardZone(sideDeckCards.length);

  const height = cardZoneHeight + STATING_HEIGHT_CARD_ZONE;

  const canvas =  document.createElement('canvas');
  canvas.height = height;
  canvas.width  = 1200;
  const ctx    = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.font      = '24px Arial'
  ctx.fillStyle = '#212529'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white'
  ctx.fillText('Nombre de mazo:', 50, 50)

  ctx.fillText(name, 250, 50)

  // count all cards except for side deck and treasures
  const totalCards = Object.values(masterDeck).reduce((acc, c) => acc + c.quantity, 0);
  ctx.fillText(`Total de cartas: ${totalCards}`, 50, 90);

  // print all units
  await printCards(ctx, units, 'Unidades', STATING_HEIGHT_CARD_ZONE);

  // print all actions
  let yHeight = calculateHeightOfCardZone(units.length);
  await printCards(ctx, actions, 'Acciones', STATING_HEIGHT_CARD_ZONE + yHeight);

  // print all monuments and weapons
  if (monumentsAndWeapons.length > 0) {
    yHeight += calculateHeightOfCardZone(actions.length);
    await printCards(ctx, monumentsAndWeapons, 'Monumentos y armas', STATING_HEIGHT_CARD_ZONE + yHeight);
  }

  // print all treasures
  yHeight += calculateHeightOfCardZone(monumentsAndWeapons.length > 0 ? monumentsAndWeapons.length : actions.length);
  await printCards(ctx, treasures, 'Tesoros', STATING_HEIGHT_CARD_ZONE + yHeight);

  // print all side deck
  yHeight += calculateHeightOfCardZone(treasures.length);
  await printCards(ctx, sideDeckCards, 'Side deck', STATING_HEIGHT_CARD_ZONE + yHeight);

  return canvas.toDataURL('image/png');
}

async function printCards(ctx: CanvasRenderingContext2D, cards: DeckCard[], title: string, sy: number) {
  const units   = cards;
  const loadingImg = [];

  ctx.font      = '24px Arial';
  ctx.fillStyle = 'white';
  const quantity = units.reduce((acc, c) => acc + c.quantity, 0);
  ctx.fillText(`${title} (${quantity}):`, 50, sy)

  const cardDrawingZoneY = sy + SPACE_BETWEEN_TITLE_AND_CARDS;

  const cardChunks = splitChunk(units, NUM_COLS);

  // load all images
  for (const [index, chunk] of cardChunks.entries()) {
    const y = cardDrawingZoneY + index * CARD_HEIGHT;

    for (const [i, c] of chunk.entries()) {
      const x = 50 + i * 200;
      if (!c.thumbnail) {
        // console.log(`skipping ${c.name}`);
        continue;
      }
      console.log(`loading ${c.thumbnail}`);
      const cardFront = new Image();
      cardFront.crossOrigin = '*';
      cardFront.src = c.thumbnail;

      loadingImg.push(new Promise((resolve, reject) => {
        cardFront.onload = () => {
          // console.log(`drawing ${c.name}`);
          ctx.drawImage(cardFront, x, y);
          ctx.font        = '50px Arial';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth   = 8;
          ctx.strokeText(`x${c.quantity}`, x + 75, y + 150);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(`x${c.quantity}`, x + 75, y + 150);
          resolve(c.name);
        };
        cardFront.onerror = () => reject(new Error('Could not load image'));
      }));
    }
  }

  await Promise.all(loadingImg);
  // console.log('all images loaded for ', title);
}

function calculateHeightOfCardZone(cardsLength: number) {
  return Math.ceil(cardsLength / NUM_COLS) * CARD_HEIGHT + SPACE_BETWEEN_TITLE_AND_CARDS + 50;
}
