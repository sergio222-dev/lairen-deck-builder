import { component$, useVisibleTask$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
}                                      from "@builder.io/qwik-city";
import { DialogYesNoNo }               from "~/components/dialogs/DialogYesNo";
import { RouterHead } from "./components/router-head/router-head";

import "./global.scss";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.customElements.define("dialog-yes-no", DialogYesNoNo);
  });

  return (
    <QwikCityProvider>
      <head>
        <title>LDB</title>
        <meta char-set="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en" class="theme-dark">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
