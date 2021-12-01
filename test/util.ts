/* eslint-disable eslint-comments/no-unlimited-disable, eslint-comments/disable-enable-pair, unicorn/no-abusive-eslint-disable */
/* eslint-disable */
export {};

// @ts-ignore karma doesnt exist on console natively
window.console.karma = (...args) => {
    // @ts-ignore karma doesnt exist on window natively
    const karma : Karma = window.karma || window.top?.karma || window.opener?.karma;

    karma.log('debug', ...args);

    console.log.apply(console, args);
};
