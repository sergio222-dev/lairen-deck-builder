import { component$ } from '@builder.io/qwik';
import { GithubLink } from "~/components/github/GithubLink";

export default component$(() => {
  return (
    <div class="p-4 w-full">
      <div class="absolute right-0 top-0">
        <GithubLink />
      </div>
      <div>
        <img src="https://i.postimg.cc/4d8HSNdH/nicol-huelga.webp" alt="Nicol Huelga" class="container mx-auto aspect-[16/9] max-w-[400px] rounded-lg shadow-md"/>
      </div>
    </div>
  );
});
