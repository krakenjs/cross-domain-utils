import { getUserAgent } from '../../src';
import { getSameDomainWindow } from '../win';

describe('getUserAgent cases', () => {

    it('should get the real user agent', () => {
        const userAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
        const win = getSameDomainWindow({
            navigator: {
                userAgent
            }
        });
        const result = getUserAgent(win);

        if (result !== userAgent) {
            throw new Error(
                `Expected getUserAgent to return ${ userAgent }, actually got ${ result }`
            );
        }
    });

    it('should get the mock user agent', () => {
        const mockUserAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
        const win = getSameDomainWindow({
            navigator: {
                mockUserAgent
            }
        });
        const result = getUserAgent(win);

        if (result !== mockUserAgent) {
            throw new Error(
                `Expected getUserAgent to return ${ mockUserAgent }, actually got ${ result }`
            );
        }
    });

});
