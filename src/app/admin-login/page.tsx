'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: userData } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', session.user.id)
            .single()
          if (userData?.rol === 'admin') {
            router.push('/admin')
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña')
      setLoading(false)
      return
    }

    try {
      const result = await login(email.trim(), password, 'admin')
      if (result.success) {
        router.push('/admin')
      } else {
        setError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">BARRANCO</span>
            <span className="ml-2 text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full">ADMIN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Administrador</h2>
          <p className="text-sm sm:text-base text-gray-500">Inicia sesión para acceder al panel de administración</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-10 text-sm sm:text-base h-10 sm:h-11 focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 text-sm sm:text-base h-10 sm:h-11 focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="text-sm">
                  <AlertDescription className="flex items-center gap-2">
                    <span>❌</span> {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base h-10 sm:h-11 transition-colors"
                disabled={loading || authLoading}
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <div className="text-center pt-2">
                <Link 
                  href="/" 
                  className="text-sm sm:text-base text-gray-500 hover:text-gray-700 inline-flex items-center transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver a selección de rol
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] sm:text-xs text-gray-400">
            Sistema seguro • Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
}
