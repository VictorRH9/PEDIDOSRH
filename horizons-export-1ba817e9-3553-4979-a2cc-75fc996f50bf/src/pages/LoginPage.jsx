
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { LogIn, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Attempt to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      // If sign-in fails, check if it's because the user doesn't exist or invalid credentials
      // Supabase often returns "Invalid login credentials" for both non-existent user and wrong password
      // So, we'll try to sign them up.
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      setIsLoading(false);

      if (signUpError) {
        // If signUp also fails, it might be due to various reasons (e.g., email already registered with different method, password policy)
        toast({
          title: "Error de Autenticación",
          description: signUpError.message || "No se pudo iniciar sesión ni registrar. Verifica tus credenciales o la contraseña puede ser muy débil.",
          variant: "destructive",
        });
      } else if (signUpData.user) {
        // signUpData.session will be null if email confirmation is required
        // signUpData.user will contain user info even if confirmation is pending
        if (signUpData.session) { // User is logged in immediately
            toast({
                title: "Cuenta Creada e Inicio de Sesión Exitoso",
                description: "¡Bienvenido! Tu cuenta ha sido creada y has iniciado sesión.",
            });
            navigate('/');
        } else if (signUpData.user && !signUpData.session) { // Email confirmation might be pending
            toast({
                title: "Registro Exitoso",
                description: "Cuenta creada. Por favor, revisa tu correo para confirmar tu cuenta si es necesario, luego intenta iniciar sesión.",
                variant: "default",
                duration: 7000,
            });
        } else { // Should not happen if user object exists
             toast({
                title: "Error de Registro",
                description: "Ocurrió un error inesperado durante el registro.",
                variant: "destructive",
            });
        }
      } else { // Fallback for unexpected signUp outcome
         toast({
          title: "Error",
          description: "Ocurrió un error inesperado durante el proceso de registro.",
          variant: "destructive",
        });
      }
    } else if (signInData.user) { // Sign-in was successful
      setIsLoading(false);
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenido de nuevo!",
      });
      navigate('/');
    } else { // Fallback for unexpected signIn outcome
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado durante el inicio de sesión.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md glass-card shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <ShoppingBag size={48} className="text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white">CARNES RH</CardTitle>
            <CardDescription className="text-white/80 pt-2">
              Accede o crea tu cuenta para gestionar pedidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-white/90">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-white/90">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white"
                />
              </motion.div>
              <CardFooter className="p-0 pt-4">
                <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90 shadow-lg hover-scale" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <LogIn className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Procesando...' : 'Acceder / Registrar'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
           <p className="text-center text-xs text-white/60 pb-6 px-6">
             Si no tienes cuenta, se creará una automáticamente. Las contraseñas deben tener al menos 6 caracteres.
           </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
