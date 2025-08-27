import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { gql } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

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
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await client.query({
                    query: ME_QUERY,
                    fetchPolicy: 'network-only',
                });
                if (data.me) {
                    setUser(data.me);
                    initializeRefreshTokenTimer();
                } else {
                    // Check for refresh token before attempting refresh
                    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
                    if (!refreshToken) {
                        setUser(null);
                        if (location.pathname !== '/login') {
                            navigate('/dashboard');
                        }
                        return;
                    }
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
                            try {
                                const maxAge = 7 * 24 * 60 * 60;
                                document.cookie = `accessToken=${newToken}; max-age=${maxAge}; path=/; ${import.meta.env.PROD ? 'secure; samesite=None;' : ''}`;
                            } catch (e) {
                                console.warn('Failed to set accessToken cookie', e);
                            }
                            const { data: me2 } = await client.query({ query: ME_QUERY, fetchPolicy: 'network-only' });
                            if (me2?.me) {
                                setUser(me2.me);
                                initializeRefreshTokenTimer();
                            }
                        } else {
                            setUser(null);
                            if (location.pathname !== '/login') {
                                navigate('/dashboard');
                            }
                        }
                    } catch (err) {
                        console.warn('Refresh attempt failed during init', err);
                        setUser(null);
                        if (location.pathname !== '/login') {
                            navigate('/dashboard');
                        }
                    }
                }
            } catch (error) {
                console.error('ME_QUERY error:', error);
                setUser(null);
                if (location.pathname !== '/login') {
                    navigate('/dashboard');
                }
            } finally {
                setAuthChecked(true);
            }
        };
        checkAuth();
    }, [client, setUser, setAuthChecked, initializeRefreshTokenTimer, setAccessToken, navigate, location.pathname]);

    return null;
};