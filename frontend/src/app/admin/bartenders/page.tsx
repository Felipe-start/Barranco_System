'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  ArrowLeft,
  RefreshCw,
  Star,
  User,
  Coffee,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'

interface Bartender {
  id: string
  nombre_completo: string
  codigo: string
  activo: boolean
  ventas_totales: number
  bebidas_preparadas: number
  calificacion_eficiencia: number
  usuario_id: string
}

export default function BartendersPage() {
  const supabase = createClient()
  const [bartenders, setBartenders] = useState<Bartender[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBartenders()
  }, [])

  const fetchBartenders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bartenders')
        .select('*')
        .eq('activo', true)
        .order('nombre_completo')

      if (error) throw error
      setBartenders(data || [])
    } catch (error) {
      console.error('Error fetching bartenders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getColor = (index: number) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-red-600', 'bg-teal-600']
    return colors[index % colors.length]
  }

  const filteredBartenders = bartenders.filter(bartender =>
    bartender.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bartender.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bartenders</h1>
              <p className="text-sm text-gray-500">Gestiona el equipo de bartenders</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Bartender
            </Button>
            <Button variant="outline" onClick={fetchBartenders}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar bartenders..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBartenders.map((bartender, index) => (
            <Card key={bartender.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className={`h-12 w-12 ${getColor(index)}`}>
                    <AvatarFallback className="text-white text-sm font-semibold">
                      {getInitials(bartender.nombre_completo)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{bartender.nombre_completo}</h3>
                      <Badge className={bartender.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {bartender.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Código: {bartender.codigo || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500">Ventas</p>
                    <p className="text-sm font-bold text-gray-900">${bartender.ventas_totales?.toFixed(0) || 0}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Bebidas</p>
                    <p className="text-sm font-bold text-gray-900">{bartender.bebidas_preparadas || 0}</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-500">Eficiencia</p>
                    <p className="text-sm font-bold text-gray-900">{bartender.calificacion_eficiencia?.toFixed(0) || 0}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {bartender.calificacion_eficiencia > 90 ? 'Excelente' :
                       bartender.calificacion_eficiencia > 70 ? 'Bueno' : 'Mejorable'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBartenders.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron bartenders</p>
          </div>
        )}
      </div>
    </div>
  )
}
