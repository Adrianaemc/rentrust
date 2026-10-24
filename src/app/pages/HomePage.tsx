import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { mockProperties } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { ArrowRight, Search, MessageCircle, FileText, Lock, Check, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/Footer';

export function HomePage() {
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-white text-5xl md:text-6xl mb-4">
              Alquileres transparentes, propietarios confiables
            </h1>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 mb-2">Propiedades destacadas</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Propiedades cuidadosamente seleccionadas con las mejores reseñas
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline">
              Ver todo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 dark:text-gray-100 mb-8 text-center">
            Elige el tipo de alojamiento
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Departamentos', image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?w=400' },
              { name: 'Casas', image: 'https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=400' },
              { name: 'Locales', image: 'https://images.unsplash.com/photo-1601019404210-8bb5dd3ab015?w=400' },
              { name: 'Oficinas', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=400' },
            ].map((category) => (
              <Link
                key={category.name}
                to="/listings"
                className="group relative overflow-hidden rounded-lg aspect-square hover:shadow-lg transition-shadow"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <span className="text-white p-4">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 dark:text-gray-100 mb-4">
              ¿Cómo funciona RenTrust?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Un proceso simple y transparente para encontrar tu próximo hogar o inquilino ideal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mb-2 h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Busca y Explora</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Navega entre propiedades verificadas y envía propuestas a propietarios. <span className="text-green-600 dark:text-green-400">100% gratis</span>
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mb-2 h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Conecta y Coordina</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                El propietario acepta tu propuesta. Coordinan una visita para conocerse. <span className="text-green-600 dark:text-green-400">100% gratis</span>
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center relative">
                  <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-xs px-1.5">
                    Premium
                  </Badge>
                </div>
              </div>
              <div className="mb-2 h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Desbloquea Premium</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Si deciden avanzar, ambas partes pagan <span className="text-purple-600 dark:text-purple-400">4% del primer mes</span> para acceder a todas las herramientas
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mb-2 h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Gestiona Todo en RenTrust</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chat, documentación, contratos digitales y más durante los 3 años de alquiler
              </p>
            </div>
          </div>

          {/* Premium Features Banner */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-900 dark:text-gray-100">Funcionalidades Premium</h3>
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                    Pago único
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Desbloquea todo lo necesario para un proceso de alquiler seguro y organizado
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: MessageCircle, title: 'Chat interno seguro', description: 'Mensajería encriptada' },
                { icon: FileText, title: 'Gestión de documentación', description: 'Sube y comparte archivos' },
                { icon: Calendar, title: 'Calendario compartido', description: 'Coordina visitas y vencimientos' },
                { icon: FileText, title: 'Historial de pagos', description: 'Seguimiento y recordatorios' },
                { icon: Check, title: 'Verificación de identidad', description: 'Seguridad para ambas partes' },
                { icon: MessageCircle, title: 'Sistema de reseñas', description: 'Reseñas verificadas' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">{feature.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-gray-100 mb-1">💡 Modelo transparente y justo</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solo pagas cuando hay un match exitoso. Ambas partes acceden a todas las funcionalidades durante los 3 años del contrato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
