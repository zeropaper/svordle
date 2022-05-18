/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'wordnet' {
  export type init = () => Promise<void>;
  export type list = () => any;
}
