import type { RequestEvent } from '@builder.io/qwik-city';
import type { User }         from '~/app/shared/application/DTO/user.dto';
import { QWIK_CONSTANTS }    from '~/lib/constants/qwik';

export function GetCurrentUser(request: RequestEvent) {
  return () => {
    return request.sharedMap.get(QWIK_CONSTANTS.REQUEST_USER) as User | null;
  }
}
