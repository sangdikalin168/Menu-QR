// src/config/apollo.ts
import { ApolloClient, InMemoryCache, from, gql } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { setContext } from '@apollo/client/link/context';
import { useAuthStore } from '../store/authStore';

// Validate environment variable
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    console.error('VITE_API_URL is not defined in .env');
    throw new Error('VITE_API_URL is required');
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
    failedQueue = [];
};

const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
        console.error('Network error:', networkError);
        return;
    }
    if (graphQLErrors) {
        console.error('GraphQL errors:', graphQLErrors);
        for (let err of graphQLErrors) {
            if (err.extensions?.code === 'UNAUTHENTICATED') {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(token => {
                            operation.setContext({
                                headers: {
                                    ...operation.getContext().headers,
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            return forward(operation);
                        })
                        .catch(error => {
                            console.error('Failed to retry operation:', error);
                            return;
                        });
                }
                isRefreshing = true;
                return client
                    .mutate({
                        mutation: gql`
                            mutation RefreshToken {
                                refreshToken {
                                    accessToken
                                }
                            }
                        `,
                        context: { headers: { 'no-auth': true }, credentials: 'include' },
                    })
                    .then(async ({ data }) => {
                        console.log('Refresh token success:', data);
                        const { accessToken } = data.refreshToken;
                        useAuthStore.getState().setAccessToken(accessToken);
                        // Persist access token into cookie so authLink (and non-react code) can read it for subsequent requests
                        try {
                            // extend cookie life to 7 days to avoid auto-logout from short-lived cookie
                            const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
                            document.cookie = `accessToken=${accessToken}; max-age=${maxAge}; path=/; ${import.meta.env.PROD ? 'secure; samesite=None;' : ''}`;
                        } catch {
                            console.warn('Unable to write accessToken cookie after refresh');
                        }
                        processQueue(null, accessToken);
                        operation.setContext({
                            headers: {
                                ...operation.getContext().headers,
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        // refetch current user to update store
                        try {
                            await client.query({ query: gql`{ me { id username display_name role { name } } }`, fetchPolicy: 'network-only' });
                        } catch (e) {
                            // ignore
                        }
                        return forward(operation);
                    })
                    .catch(error => {
                        console.error('Refresh token failed:', error.message, error);
                        processQueue(error);
                        useAuthStore.getState().logout();
                        window.location.href = '/login';
                        return;
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            }
        }
    }
});

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
}

// authLink prefers the accessToken in the zustand store (keeps runtime in sync). Fall back to cookie if not present.
const authLink = setContext((_, { headers }) => {
    const tokenFromStore = useAuthStore.getState().accessToken;
    const token = tokenFromStore || getCookie('accessToken');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const client = new ApolloClient({
    link: from([authLink, errorLink, uploadLink]),
    cache: new InMemoryCache(),
});