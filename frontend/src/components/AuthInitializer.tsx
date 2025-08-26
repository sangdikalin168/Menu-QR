import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { gql } from '@apollo/client';

const ME_QUERY = gql`
    query Me {
        me {
            id
            username
            display_name
            role {
                name
            }
        }
    }
`;

export const AuthInitializer = () => {
    const client = useApolloClient();
    const setUser = useAuthStore((state) => state.setUser);
    const setAuthChecked = useAuthStore((state) => state.setAuthChecked);
    const initializeRefreshTokenTimer = useAuthStore((state) => state.initializeRefreshTokenTimer);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Running ME_QUERY to check authentication');
                const { data } = await client.query({
                    query: ME_QUERY,
                    fetchPolicy: 'network-only',
                });
                console.log('ME_QUERY success:', data);
                if (data.me) {
                    setUser(data.me);
                    initializeRefreshTokenTimer();
                } else {
                    // Try to refresh using HttpOnly cookie (backend supports reading jwt cookie)
                    try {
                        const { data: refreshData } = await client.mutate({
                            mutation: gql`
                                mutation RefreshToken {
                                    refreshToken { accessToken }
                                }
                            `,
                            context: { credentials: 'include' },
                        });
                        const newToken = refreshData?.refreshToken?.accessToken;
                        if (newToken) {
                            setAccessToken(newToken);
                            // persist cookie as well for authLink fallback
                            try {
                                const maxAge = 7 * 24 * 60 * 60; // 7 days
                                document.cookie = `accessToken=${newToken}; max-age=${maxAge}; path=/; ${import.meta.env.PROD ? 'secure; samesite=None;' : ''}`;
                            } catch (e) {
                                console.warn('Failed to set accessToken cookie', e);
                            }
                            // re-run ME to populate user
                            const { data: me2 } = await client.query({ query: ME_QUERY, fetchPolicy: 'network-only' });
                            if (me2?.me) {
                                setUser(me2.me);
                                initializeRefreshTokenTimer();
                            }
                        }
                    } catch (err) {
                        console.warn('Refresh attempt failed during init', err);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('ME_QUERY error:', error);
                setUser(null);
            } finally {
                setAuthChecked(true);
            }
        };
        checkAuth();
    }, [client, setUser, setAuthChecked, initializeRefreshTokenTimer, setAccessToken]);

    return null;
};