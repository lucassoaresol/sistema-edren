import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authQueryKey } from '@/lib/auth';
import { login } from '@/lib/api';

const loginFormSchema = z.object({
  username: z.string().trim().min(1, 'Informe o usuario.'),
  password: z.string().min(1, 'Informe a senha.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onError: () => {
      setError('Usuario ou senha invalidos.');
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(authQueryKey, user);
      await navigate({ to: '/' });
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-edren-background px-5 py-10 text-edren-text">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <BrandLogo className="mb-4 h-9 w-44 text-edren-green" />
          <CardTitle>Acessar sistema</CardTitle>
          <CardDescription>Entre com seu usuario e senha para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              setError(null);
              loginMutation.mutate(values);
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input autoComplete="username" id="username" {...form.register('username')} />
              {form.formState.errors.username ? (
                <p className="text-sm text-red-700">{form.formState.errors.username.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                autoComplete="current-password"
                id="password"
                type="password"
                {...form.register('password')}
              />
              {form.formState.errors.password ? (
                <p className="text-sm text-red-700">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}

            <Button className="w-full" disabled={loginMutation.isPending} type="submit">
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
