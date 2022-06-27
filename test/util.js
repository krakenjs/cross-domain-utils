/* @flow */

window.console.karma = (...args) => {
  const karma =
    window.karma ||
    (window.top && window.top.karma) ||
    (window.opener && window.opener.karma);
  karma.log("debug", ...args);
  // eslint-disable-next-line no-console
  console.log.apply(console, args);
};
