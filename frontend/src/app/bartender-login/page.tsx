'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BartenderLoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (pin === '1234') {
      setTimeout(() => {
        router.push('/bartender')
        setLoading(false)
      }, 1000)
    } else {
      setError('PIN incorrecto. Intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/80 rounded-2xl backdrop-blur-sm shadow-lg mb-4">
            <span className="text-3xl font-black text-gray-900 tracking-tight">
              BARRANCO
            </span>
            <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              BARTENDER
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">Bartender</h2>
          <p className="text-gray-500 text-sm">Inicia sesión para acceder a tu estación</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">PIN de acceso</CardTitle>
            <CardDescription className="text-center">
              Ingresa tu código PIN de 4 dígitos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    className="pl-10 text-center text-2xl tracking-widest font-bold"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setPin(value)
                      setError('')
                    }}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-lg py-6"
                disabled={loading || pin.length < 4}
              >
                {loading ? 'Verificando...' : 'Ingresar'}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                ¿Olvidaste tu PIN?
              </Link>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver a selección de rol
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
