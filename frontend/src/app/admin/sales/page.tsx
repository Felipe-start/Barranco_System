'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  ArrowLeft,
  RefreshCw,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface Sale {
  id: string
  fecha_hora: string
  total: number
  metodo_pago: string
  estado: string
  receta_nombre: string
  bartender_nombre: string
  sucursal_nombre: string
}

export default function SalesPage() {
  const supabase = createClient()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          recetas (nombre),
          bartenders (nombre_completo),
          sucursales (nombre)
        `)
        .order('fecha_hora', { ascending: false })
        .limit(50)

      if (error) throw error

      const formattedData = data?.map((item: any) => ({
        ...item,
        receta_nombre: item.recetas?.nombre || 'Sin receta',
        bartender_nombre: item.bartenders?.nombre_completo || 'Sin bartender',
        sucursal_nombre: item.sucursales?.nombre || 'Sin sucursal'
      })) || []

      setSales(formattedData)
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(sale =>
    sale.receta_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.bartender_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular totales
  const totalVentas = sales.reduce((sum, sale) => sum + (sale.total || 0), 0)
  const promedioVenta = sales.length > 0 ? totalVentas / sales.length : 0

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
              <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
              <p className="text-sm text-gray-500">Historial de ventas del bar</p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchSales}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Ventas</p>
                  <p className="text-2xl font-bold text-gray-900">${totalVentas.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Promedio por Venta</p>
                  <p className="text-2xl font-bold text-gray-900">${promedioVenta.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total de Ventas</p>
                  <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtro */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por receta o bartender..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Receta</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Bartender</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Sucursal</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Método</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(sale.fecha_hora).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {sale.receta_nombre}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sale.bartender_nombre}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sale.sucursal_nombre}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sale.metodo_pago || 'Efectivo'}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                      ${sale.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={sale.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {sale.estado || 'Completada'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron ventas</p>
          </div>
        )}
      </div>
    </div>
  )
}
