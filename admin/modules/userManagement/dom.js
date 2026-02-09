// modules/dom.js
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export function show(el) {
  el.style.display = 'block';
}

export function hide(el) {
  el.style.display = 'none';
}
