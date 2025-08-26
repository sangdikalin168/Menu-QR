import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore'; // Import useAuthStore
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LoadingPage from '@/components/ui/LoadingPage';

interface LoginForm {
    username: string;
    password: string;
}

const Login: React.FC<{ className?: string }> = ({ className, ...props }) => {
    const { login } = useAuth();
    const { isAuthChecked, isAuthenticated } = useAuthStore(); // Get store state
    const navigate = useNavigate();
    const form = useForm<LoginForm>({
        defaultValues: { username: '', password: '' },
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthChecked && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthChecked, isAuthenticated, navigate]);

    const onSubmit = async (data: LoginForm) => {
        if (!data.username || !data.password) {
            toast.error('Username and password are required');
            form.setError('root', { message: 'Username and password are required' });
            return;
        }

        try {
            console.log('Submitting login:', data);
            await login(data.username, data.password);
            toast.success('Login successful');
        } catch (error: any) {
            console.error('Login submit error:', error);
            if (error.message.includes('Invalid credentials')) {
                toast.error('Invalid username or password');
                form.setError('root', { message: 'Invalid username or password' });
            } else {
                toast.error('An unexpected error occurred');
                form.setError('root', { message: 'An unexpected error occurred' });
            }
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn('flex flex-col gap-6', className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="flex flex-col gap-6">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Username" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {form.formState.errors.root && (
                                            <p className="text-red-500">{form.formState.errors.root.message}</p>
                                        )}
                                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? <LoadingPage /> : 'Login'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;