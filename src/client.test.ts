/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { Agent as HttpsAgent } from 'https';

import { RestClient, WSClient } from '@squadus/core';

import { MySquadusClient } from './client';

jest.mock('@squadus/core', () => {
    const actual = jest.requireActual('@squadus/core');
    return {
        ...actual,
        RestClient: jest.fn().mockImplementation(() => ({
            login: jest.fn(),
            getSettings: jest.fn(),
            setHeaders: jest.fn(),
        })),
        WSClient: jest.fn().mockImplementation(() => ({
            close: jest.fn(),
            events$: { pipe: jest.fn() },
            login: jest.fn(),
            open: jest.fn(),
            status$: {
                pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
            },
        })),
    };
});

describe('MySquadusClient proxy agent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should pass agent to RestClient constructor', () => {
        const agent = new HttpsAgent();

        new MySquadusClient({
            token: 'test-token',
            server: 'https://example.com',
            agent,
        });

        expect(RestClient).toHaveBeenCalledWith(
            'https://example.com',
            expect.any(String),
            agent,
        );
    });

    it('should pass agent to WSClient via requestArgs', () => {
        const agent = new HttpsAgent();

        new MySquadusClient({
            token: 'test-token',
            server: 'https://example.com',
            agent,
        });

        expect(WSClient).toHaveBeenCalledWith(
            expect.objectContaining({
                requestArgs: expect.objectContaining({
                    agent,
                }),
            }),
        );
    });

    it('should not include agent in requestArgs when not provided', () => {
        new MySquadusClient({
            token: 'test-token',
            server: 'https://example.com',
        });

        const wsCallArgs = (WSClient as jest.Mock).mock.calls[0][0];
        expect(wsCallArgs.requestArgs).not.toHaveProperty('agent');
    });

    it('should not pass agent to RestClient when not provided', () => {
        new MySquadusClient({
            token: 'test-token',
            server: 'https://example.com',
        });

        expect(RestClient).toHaveBeenCalledWith(
            'https://example.com',
            expect.any(String),
            undefined,
        );
    });
});
