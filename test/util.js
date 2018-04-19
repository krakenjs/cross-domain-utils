/* @flow */

window.console.karma = () => {
    let karma = window.karma || (window.top && window.top.karma) || (window.opener && window.opener.karma);
    karma.log('debug', arguments);
    // eslint-disable-next-line no-console
    console.log.apply(console, arguments);
};
