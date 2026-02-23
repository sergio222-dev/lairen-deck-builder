import type { QRL, Signal }   from '@builder.io/qwik';
import type { DialogYesNoNo } from '~/components/dialogs/DialogYesNo';

export interface AppContextState {
  isLoading: boolean;
  dialogYesNo: Signal<DialogYesNoNo | undefined> | undefined;
  setLoading: QRL<(this: AppContextState, isLoading: boolean) => void>;
  isMaintenance: boolean;
}
