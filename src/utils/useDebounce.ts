import { $, QRL, useSignal } from '@builder.io/qwik';

export const useDebounce = <T>(TIME: number, callback: QRL) => {
  const debounce = useSignal<number>();
  return $((value: T) => {
    if (debounce.value) {
      clearTimeout(debounce.value);
    }

    debounce.value = window.setTimeout(() => {
      // form.formData.set('desc', text.value);
      // form.formData.set('page', '1');
      // form.formData.set('size', '10');
      //
      void callback(value);
      // void action.submit(form.formData);
    }, TIME);
  });
};
