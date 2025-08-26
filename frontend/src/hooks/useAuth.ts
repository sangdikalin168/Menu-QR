// src/hooks/useAuth.ts
import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    user: { id: number; username: string; display_name: string; role: { name: string } } | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, display_name: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
    const client = useApolloClient();
    const navigate = useNavigate();
    const { isAuthenticated, user, setAccessToken, setUser, accessToken, logout } = useAuthStore();

    // Apollo auth link setup (if not already in apollo.ts)
    useEffect(() => {
        if (accessToken) {
            client.setLink(
                client.link.concat((operation, forward) => {
                    operation.setContext(({ headers = {} }) => ({
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }));
                    return forward(operation);
                })
            );
        }
    }, [accessToken, client]);

    const fetchUser = async () => {
        try {
            const { data } = await client.query({
                query: gql`
                    query Me {
                        me {
                            id
                            username
                            display_name
                            role {
                                id
                                name
                                description
                                permissions {
                                    id
                                    name
                                    description
                                }
                            }
                        }
                    }
                `,
                fetchPolicy: 'network-only',
            });
            setUser(data.me);
        } catch (error) {
            console.error('Fetch user error:', error);
            setUser(null);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const { data } = await client.mutate({
                mutation: gql`
                    mutation Login($username: String!, $password: String!) {
                        login(username: $username, password: $password) {
                            accessToken
                            refreshToken
                        }
                    }
                `,
                variables: { username, password },
            });
            console.log('Login success:', data);
            setAccessToken(data.login.accessToken);
            await fetchUser();
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (username: string, password: string, display_name: string) => {
        try {
            const { data } = await client.mutate({
                mutation: gql`
                    mutation Register($username: String!, $password: String!, $display_name: String!) {
                        register(username: $username, password: $password, display_name: $display_name) {
                            accessToken
                        }
                    }
                `,
                variables: { username, password, display_name },
            });
            console.log('Register success:', data);
            setAccessToken(data.register.accessToken);
            setUser(null); // User info not returned for security
            navigate('/dashboard');
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logoutHandler = async () => {
        console.log('Logging out...');

        try {
            const result = await client.mutate({
                mutation: gql`
                    mutation {
                        logout
                    }
                `,
            });
            console.log('Logout result:', result);
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            logout();
            navigate('/login');
        }
    };

    return { isAuthenticated, user, login, register, logout: logoutHandler };
};