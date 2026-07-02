'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Utensils,
  ArrowLeft,
  RefreshCw,
  Coffee,
  GlassWater,
  Wine,
  Beer
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface Recipe {
  id: string
  nombre: string
  nombre_corto: string
  categoria: string
  metodo_preparacion: string
  garnish: string
  precio_venta: number
  costo_total: number
  margen_ganancia: number
  activa: boolean
}

export default function RecipesPage() {
  const supabase = createClient()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('recetas')
        .select('*')
        .eq('activa', true)
        .order('nombre')

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoria: string) => {
    if (categoria?.includes('tequila')) return <GlassWater className="h-4 w-4" />
    if (categoria?.includes('vodka')) return <GlassWater className="h-4 w-4" />
    if (categoria?.includes('ron')) return <Wine className="h-4 w-4" />
    if (categoria?.includes('whiskey')) return <Beer className="h-4 w-4" />
    if (categoria?.includes('mezcal')) return <GlassWater className="h-4 w-4" />
    if (categoria?.includes('ginebra')) return <GlassWater className="h-4 w-4" />
    return <Coffee className="h-4 w-4" />
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.nombre_corto?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-2xl font-bold text-gray-900">Recetas</h1>
              <p className="text-sm text-gray-500">Gestiona las recetas del bar</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Receta
            </Button>
            <Button variant="outline" onClick={fetchRecipes}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar recetas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {getCategoryIcon(recipe.categoria)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{recipe.nombre}</h3>
                      <p className="text-sm text-gray-500">{recipe.nombre_corto || recipe.categoria}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {recipe.margen_ganancia?.toFixed(0) || 0}% margen
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Precio venta</p>
                    <p className="font-medium text-gray-900">${recipe.precio_venta}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Costo</p>
                    <p className="font-medium text-gray-900">${recipe.costo_total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                {recipe.garnish && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Garnish: </span>
                    <span className="text-gray-700">{recipe.garnish}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-gray-400">{recipe.metodo_preparacion || 'Método no especificado'}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
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

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron recetas</p>
          </div>
        )}
      </div>
    </div>
  )
}
