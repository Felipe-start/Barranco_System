'use client'

import { useState } from 'react'
import {
  Search,
  Bell,
  LogOut,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Coffee,
  Plus,
  Clock,
  Menu,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

const drinks = [
  { name: 'La Margarina', price: 180, category: 'Tequila', popular: true },
  { name: 'Sol Eterno', price: 185, category: 'Ron', popular: true },
  { name: 'Beso Fresco', price: 170, category: 'Vodka', popular: false },
  { name: 'Obra de Arte', price: 200, category: 'Mezcal', popular: true },
  { name: 'Barranco Spritz', price: 210, category: 'Spritz', popular: false },
  { name: 'Happy Drink', price: 190, category: 'Ron', popular: true },
  { name: 'Buena Vibra', price: 200, category: 'Ginebra', popular: false },
  { name: 'Siempre Bien', price: 190, category: 'Whiskey', popular: false },
]

export default function BartenderDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDrinks = drinks.filter((drink) =>
    drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drink.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center ml-2 lg:ml-0">
                <span className="text-xl font-bold text-gray-900">BARRANCO</span>
                <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Bartender
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar bebidas..."
                  className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500 w-48 lg:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </Button>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-green-600 text-white">CV</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">¡Hola, Carlos!</h1>
                <p className="text-gray-500">Estación de trabajo</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva orden
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDrinks.map((drink, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{drink.name}</h3>
                        <p className="text-sm text-gray-500">{drink.category}</p>
                      </div>
                      {drink.popular && (
                        <Badge className="bg-green-100 text-green-700">Popular</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-gray-900">${drink.price}</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Preparar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="link" className="mt-4 text-green-600">
              Ver todas las recetas →
            </Button>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RESUMEN DEL TURNO</CardTitle>
                <CardDescription>Tu rendimiento hoy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Bebidas</span>
                  </div>
                  <span className="text-lg font-bold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Ventas totales</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">$3,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Merma registrada</span>
                  </div>
                  <span className="text-lg font-bold text-red-500">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Rendimiento</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">92%</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Productividad</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Terminar turno
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                  Reportar merma
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Coffee className="h-4 w-4 mr-2 text-blue-500" />
                  Ver recetas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
