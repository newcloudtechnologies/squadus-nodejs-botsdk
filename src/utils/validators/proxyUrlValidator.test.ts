/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { Agent } from 'http';

import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

import {
    validateProxyUrl,
    getProxyType,
    getProxyAgent,
} from './proxyUrlValidator';

describe('validateProxyUrl', () => {
    describe('valid HTTP/HTTPS URLs', () => {
        it('should not throw for http:// URL', () => {
            expect(() =>
                validateProxyUrl('http://proxy.example.com:8080'),
            ).not.toThrow();
        });

        it('should not throw for https:// URL', () => {
            expect(() =>
                validateProxyUrl('https://proxy.example.com:8080'),
            ).not.toThrow();
        });

        it('should not throw for http:// URL with credentials', () => {
            expect(() =>
                validateProxyUrl('http://user:password@proxy.example.com:8080'),
            ).not.toThrow();
        });

        it('should not throw for https:// URL with credentials', () => {
            expect(() =>
                validateProxyUrl('https://user:password@proxy.example.com:443'),
            ).not.toThrow();
        });

        it('should not throw for HTTP:// (uppercase scheme)', () => {
            expect(() =>
                validateProxyUrl('HTTP://proxy.example.com:8080'),
            ).not.toThrow();
        });

        it('should not throw for HTTPS:// (uppercase scheme)', () => {
            expect(() =>
                validateProxyUrl('HTTPS://proxy.example.com:8080'),
            ).not.toThrow();
        });

        it('should not throw for mixed case scheme', () => {
            expect(() =>
                validateProxyUrl('Http://proxy.example.com:8080'),
            ).not.toThrow();
        });

        it('should not throw for http:// URL with IP address', () => {
            expect(() =>
                validateProxyUrl('http://193.233.197.241:21648'),
            ).not.toThrow();
        });

        it('should not throw for http:// URL without port', () => {
            expect(() =>
                validateProxyUrl('http://proxy.example.com'),
            ).not.toThrow();
        });
    });

    describe('valid SOCKS URLs', () => {
        it('should not throw for socks:// URL', () => {
            expect(() =>
                validateProxyUrl('socks://proxy.example.com:1080'),
            ).not.toThrow();
        });

        it('should not throw for socks4:// URL', () => {
            expect(() =>
                validateProxyUrl('socks4://proxy.example.com:1080'),
            ).not.toThrow();
        });

        it('should not throw for socks5:// URL', () => {
            expect(() =>
                validateProxyUrl('socks5://proxy.example.com:1080'),
            ).not.toThrow();
        });

        it('should not throw for SOCKS5:// (uppercase scheme)', () => {
            expect(() =>
                validateProxyUrl('SOCKS5://proxy.example.com:1080'),
            ).not.toThrow();
        });

        it('should not throw for socks5:// URL with credentials', () => {
            expect(() =>
                validateProxyUrl(
                    'socks5://user:password@proxy.example.com:1080',
                ),
            ).not.toThrow();
        });

        it('should not throw for socks5:// URL with IP address', () => {
            expect(() =>
                validateProxyUrl('socks5://193.233.197.241:1080'),
            ).not.toThrow();
        });
    });

    describe('invalid URLs', () => {
        it('should throw for URL without scheme (credentials@host:port)', () => {
            expect(() =>
                validateProxyUrl('user:password@193.233.197.241:21648'),
            ).toThrow('URL must start with one of');
        });

        it('should throw for URL without scheme (host:port only)', () => {
            expect(() => validateProxyUrl('193.233.197.241:21648')).toThrow(
                'URL must start with one of',
            );
        });

        it('should throw for URL with ftp:// scheme', () => {
            expect(() =>
                validateProxyUrl('ftp://proxy.example.com:8080'),
            ).toThrow('URL must start with one of');
        });

        it('should throw for empty string', () => {
            expect(() => validateProxyUrl('')).toThrow(
                'URL must start with one of',
            );
        });

        it('should throw for hostname only', () => {
            expect(() => validateProxyUrl('proxy.example.com')).toThrow(
                'URL must start with one of',
            );
        });

        it('should throw for URL with missing double slash', () => {
            expect(() =>
                validateProxyUrl('http:proxy.example.com:8080'),
            ).toThrow('URL must start with one of');
        });

        it('should throw for URL with single slash', () => {
            expect(() =>
                validateProxyUrl('http:/proxy.example.com:8080'),
            ).toThrow('URL must start with one of');
        });

        it('should include the invalid URL in error message', () => {
            const invalidUrl = 'user:pass@host:1234';
            expect(() => validateProxyUrl(invalidUrl)).toThrow(
                `Invalid proxyUrl: "${invalidUrl}"`,
            );
        });
    });
});

describe('getProxyType', () => {
    it('should return "http" for http:// URL', () => {
        expect(getProxyType('http://proxy.example.com:8080')).toBe('http');
    });

    it('should return "http" for https:// URL', () => {
        expect(getProxyType('https://proxy.example.com:8080')).toBe('http');
    });

    it('should return "http" for HTTP:// (uppercase)', () => {
        expect(getProxyType('HTTP://proxy.example.com:8080')).toBe('http');
    });

    it('should return "socks" for socks:// URL', () => {
        expect(getProxyType('socks://proxy.example.com:1080')).toBe('socks');
    });

    it('should return "socks" for socks4:// URL', () => {
        expect(getProxyType('socks4://proxy.example.com:1080')).toBe('socks');
    });

    it('should return "socks" for socks5:// URL', () => {
        expect(getProxyType('socks5://proxy.example.com:1080')).toBe('socks');
    });

    it('should return "socks" for SOCKS5:// (uppercase)', () => {
        expect(getProxyType('SOCKS5://proxy.example.com:1080')).toBe('socks');
    });
});

describe('getProxyAgent', () => {
    describe('when proxyUrl is provided', () => {
        it('should return HttpsProxyAgent for http:// URL', () => {
            const agent = getProxyAgent({
                proxyUrl: 'http://proxy.example.com:8080',
            });
            expect(agent).toBeInstanceOf(HttpsProxyAgent);
        });

        it('should return HttpsProxyAgent for https:// URL', () => {
            const agent = getProxyAgent({
                proxyUrl: 'https://proxy.example.com:8080',
            });
            expect(agent).toBeInstanceOf(HttpsProxyAgent);
        });

        it('should return SocksProxyAgent for socks:// URL', () => {
            const agent = getProxyAgent({
                proxyUrl: 'socks://proxy.example.com:1080',
            });
            expect(agent).toBeInstanceOf(SocksProxyAgent);
        });

        it('should return SocksProxyAgent for socks4:// URL', () => {
            const agent = getProxyAgent({
                proxyUrl: 'socks4://proxy.example.com:1080',
            });
            expect(agent).toBeInstanceOf(SocksProxyAgent);
        });

        it('should return SocksProxyAgent for socks5:// URL', () => {
            const agent = getProxyAgent({
                proxyUrl: 'socks5://proxy.example.com:1080',
            });
            expect(agent).toBeInstanceOf(SocksProxyAgent);
        });

        it('should throw for invalid proxyUrl', () => {
            expect(() =>
                getProxyAgent({ proxyUrl: 'user:pass@host:1234' }),
            ).toThrow('URL must start with one of');
        });

        it('should ignore agent param when proxyUrl is provided', () => {
            const customAgent = new Agent();
            const result = getProxyAgent({
                proxyUrl: 'http://proxy.example.com:8080',
                agent: customAgent,
            });
            expect(result).not.toBe(customAgent);
            expect(result).toBeInstanceOf(HttpsProxyAgent);
        });
    });

    describe('when proxyUrl is not provided', () => {
        it('should return the passed agent', () => {
            const customAgent = new Agent();
            const result = getProxyAgent({ agent: customAgent });
            expect(result).toBe(customAgent);
        });

        it('should return undefined when neither proxyUrl nor agent provided', () => {
            const result = getProxyAgent({});
            expect(result).toBeUndefined();
        });

        it('should return undefined when proxyUrl is undefined', () => {
            const result = getProxyAgent({ proxyUrl: undefined });
            expect(result).toBeUndefined();
        });
    });
});
