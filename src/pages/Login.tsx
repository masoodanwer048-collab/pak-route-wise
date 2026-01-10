
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, User, AlertCircle, Building2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Login({ isCarrier = false }: { isCarrier?: boolean }) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirectParam = queryParams.get('redirect');
    
    // Default redirects: /carrier/manifests for carrier login, / for others
    const defaultRedirect = isCarrier ? '/carrier/manifests' : '/';
    const from = (location.state as any)?.from?.pathname || redirectParam || defaultRedirect;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Small artificial delay to simulate server request
            await new Promise(resolve => setTimeout(resolve, 800));

            const success = await login(username, password);

            if (success) {
                // AuthContext handles the success toast with correct user data
                navigate(from, { replace: true });
            } else {
                setError('Invalid credentials. Please try again.');
                toast.error("Login failed");
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoFill = (u: string, p: string) => {
        setUsername(u);
        setPassword(p);
        toast.info(`Filled credentials for ${u}`);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-8 animate-fade-in">

                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <img src="/kohesar_logo.png" alt="Kohesar Logistics" className="h-12 w-auto" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                            {isCarrier ? "Carrier Portal" : "Logistics Management System"}
                        </h1>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {isCarrier ? "Authorized Carrier Access" : "Secure Enterprise Access"}
                        </p>
                    </div>
                </div>

                <Card className="border-t-4 border-t-primary shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-gray-900 dark:text-white">
                            {isCarrier ? "Carrier Login" : "Sign In"}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Enter your credentials to access your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">Email</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="username"
                                        placeholder="e.g. shipping@demo.com"
                                        className="pl-9 text-gray-900 dark:text-white"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
                                    <a href="#" className="text-sm font-medium text-primary hover:underline hover:text-primary/90" onClick={(e) => { e.preventDefault(); toast.info("Please contact IT Support to reset your password."); }}>
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-9 pr-9 text-gray-900 dark:text-white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm font-medium text-gray-600 dark:text-gray-300">Remember me for 30 days</Label>
                            </div>

                            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Login to Workspace"}
                            </Button>
                        </form>

                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-gray-50/50 dark:bg-gray-800/50 border-t p-6">
                        <div className="text-xs text-center text-gray-600 dark:text-gray-400 uppercase tracking-wider font-bold">
                            Demo Accounts
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <Button variant="outline" size="sm" className="text-xs font-medium border-gray-300" onClick={() => handleDemoFill('shipping@demo.com', 'Demo@1234')}>
                                Shipping Agent
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs font-medium border-gray-300" onClick={() => handleDemoFill('clearing@demo.com', 'Demo@1234')}>
                                Clearing Agent
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs font-medium border-gray-300" onClick={() => handleDemoFill('transport@demo.com', 'Demo@1234')}>
                                Carrier
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs font-medium border-gray-300" onClick={() => handleDemoFill('terminal@demo.com', 'Demo@1234')}>
                                Terminal
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs font-medium border-gray-300 col-span-2" onClick={() => handleDemoFill('admin@demo.com', 'Admin@1234')}>
                                Admin (All Access)
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <div className="text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                    <p>© 2025 Kohesar Logistics. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
