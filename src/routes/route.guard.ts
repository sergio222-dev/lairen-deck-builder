export const ROUTES_GUARDED = [
  '/mydecks',
  '/album',

];


export function isRouteGuard(route: string) {
  return ROUTES_GUARDED.some(r => route.includes(r));
}
