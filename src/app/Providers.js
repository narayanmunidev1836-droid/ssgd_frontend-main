"use client";

import { Provider } from "react-redux";
import Favicon from "react-favicon";
import { store } from "../Redux/store";
import _faviconUrl from "../assets/images/SSGD-logo.webp";
const faviconUrl = _faviconUrl.src;

// Parity with the old src/App.js — console.log was disabled globally.
// Runs client-side only (Providers is a client component), like before.
console.log = function no_console() {};

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <Favicon url={faviconUrl} />
      {children}
    </Provider>
  );
}
