import { component$ } from "@builder.io/qwik";

interface AvatarProps {
  image?: string;
}

export const Avatar = component$<AvatarProps>(({ image }) => {
  return (
    <div class="w-[32px] h-[32px] bg-primary rounded-full ring-2 ring-white">
      {!image && <div class="w-full h-full bg-white rounded-full ring-2 ring-primary"></div>}
      {image && <img width="96" height="96" src={image} alt="avatar" class="w-full h-full rounded-full"/>}
    </div>
  );
});
