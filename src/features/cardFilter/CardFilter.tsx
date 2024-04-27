import { $, component$, noSerialize, useOn } from '@builder.io/qwik';
import { Menu }                              from '~/components/menu';
import { cardFilter, sortDirection }         from '~/config/cardFilter';
import { useFetchCards }                     from '~/routes/cards';
import { useDebounce }                       from '~/utils/useDebounce';

export const CardFilter = component$(() => {
  const action = useFetchCards();

  const a = useDebounce(1000, $((event: CustomEvent) => {
    event.target?.dispatchEvent(new CustomEvent('formUpdated'));
  }));

  const callToAction = $(async (formData: FormData) => {
    const r = action.submit(formData);
    console.log('qxc r', r);
  });

  // EVENTS
  useOn('formUpdated', $((event: CustomEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);

    formData.set('page', '1');
    formData.set('size', '10');
    console.log(formData);
    void callToAction(formData);
  }));

  useOn('descUpdated', $((e) => {
    void a(noSerialize(e));
  }));

  return (
    <form onChange$={async (e: InputEvent) => {
      if (e.target.name === 'desc') return;
      e.target?.form!.dispatchEvent(new CustomEvent('formUpdated'));
    }}>
      <Menu name="sortBy">
        {cardFilter.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </Menu>

      <Menu name="sortDirection">
        {sortDirection.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </Menu>

      <input name="name" onInput$={e => {
        e.target?.form!.dispatchEvent(new CustomEvent('descUpdated'));
      }} type="text" placeholder="Name" />
    </form>
  );
});
