/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

import type { Agent } from 'http';

const SUPPORTED_SCHEMES = ['http', 'https', 'socks', 'socks4', 'socks5'];
const PROTOCOL_REGEXP = new RegExp(`^(${SUPPORTED_SCHEMES.join('|')})://`, 'i');
const SOCKS_REGEXP = /^socks[45]?:\/\//i;

export type ProxyType = 'http' | 'socks';

export function validateProxyUrl(url: string): void {
    if (!PROTOCOL_REGEXP.test(url)) {
        const schemes = SUPPORTED_SCHEMES.map((s) => `${s}://`).join(', ');
        throw new Error(
            `Invalid proxyUrl: "${url}". URL must start with one of: ${schemes}`,
        );
    }
}

export function getProxyType(url: string): ProxyType {
    if (SOCKS_REGEXP.test(url)) {
        return 'socks';
    }
    return 'http';
}

export function getProxyAgent(params: {
    proxyUrl?: string;
    agent?: Agent;
}): Agent | undefined {
    const { proxyUrl, agent } = params;

    if (!proxyUrl) {
        return agent;
    }

    validateProxyUrl(proxyUrl);

    if (getProxyType(proxyUrl) === 'socks') {
        return new SocksProxyAgent(proxyUrl);
    }

    return new HttpsProxyAgent(proxyUrl);
}
