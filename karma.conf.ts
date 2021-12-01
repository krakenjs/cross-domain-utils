// @ts-ignore
import { getKarmaConfig } from '@krakenjs/grumbler-scripts/config/karma.conf';

import { WEBPACK_CONFIG_TEST } from './webpack.config';

// Lets see if we can get the karma from karma-ts as a dev dep in grumbler-scripts
// this eliminates the any
export default function configKarma(karma : any) {

    let karmaConfig = getKarmaConfig(karma, {
        entry: 'test/index.ts',
        basePath: __dirname,
        webpack:  WEBPACK_CONFIG_TEST
    });

    karma.set(karmaConfig);
}
