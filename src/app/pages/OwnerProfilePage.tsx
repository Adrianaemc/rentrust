import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Mail, Phone, Shield, Edit2, Home, TrendingUp, DollarSign, Users, Star, Building2, CreditCard, LogOut, Calendar, Bell, MessageCircle, Check, X, Clock, ChevronRight, Lock, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { mockRentalProposals, RentalProposal } from '../data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { TenantReviewsDialog } from '../components/TenantReviewsDialog';
import { UnlockPremiumDialog } from '../components/UnlockPremiumDialog';

export function OwnerProfilePage() {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [proposals, setProposals] = useState<RentalProposal[]>(mockRentalProposals);
  const [selectedProposal, setSelectedProposal] = useState<RentalProposal | null>(null);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [tenantReviewsOpen, setTenantReviewsOpen] = useState(false);
  const [unlockPremiumOpen, setUnlockPremiumOpen] = useState(false);
  
  const handleLogout = async () => {
    try { await logout(); toast.success('Sesión cerrada exitosamente'); navigate('/'); }
    catch { toast.error('No se pudo cerrar la sesión'); }
  };
  
  const [ownerData, setOwnerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+54 11 4567-8901',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Propietario con más de 10 años de experiencia en el mercado inmobiliario. Comprometido con ofrecer propiedades de calidad.',
    company: 'Inversiones CR S.A.',
    taxId: '30-12345678-9',
    address: 'Av. Santa Fe 1860, Buenos Aires, Argentina',
    bankAccount: 'AR12 0110 1234 5678 9012 3456 7890',
  });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/'); return; }
    if (user.type !== 'owner') { navigate(user.type === 'owner' ? '/profile/owner' : '/profile/tenant'); return; }
    supabase.auth.getUser().then(({ data }) => {
      const saved = data.user?.user_metadata?.profile ?? {};
      setOwnerData(prev => ({ ...prev, ...saved, name: data.user?.user_metadata?.name || user.name, email: user.email }));
    });
  }, [loading, user?.email, user?.type, navigate]);

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({ data: { profile: ownerData, name: ownerData.name } });
    if (error) { toast.error(error.message); return; }
    setIsEditing(false);
    toast.success('¡Perfil actualizado exitosamente!');
  };

  const handleViewProposal = (proposal: RentalProposal) => {
    setSelectedProposal(proposal);
    setProposalDialogOpen(true);
  };

  const handleAcceptProposal = (proposalId: string) => {
    setProposals(proposals.map(p => 
      p.id === proposalId ? { ...p, status: 'accepted' as const, visitScheduled: false, premiumUnlocked: false } : p
    ));
    toast.success('¡Propuesta aceptada! Coordina una visita con el inquilino.');
    setProposalDialogOpen(false);
  };

  const handleUnlockPremium = () => {
    if (selectedProposal) {
      setProposals(proposals.map(p => 
        p.id === selectedProposal.id ? { ...p, premiumUnlocked: true } : p
      ));
      toast.success('¡Funcionalidades premium desbloqueadas! Ahora puedes usar chat, documentación y más.');
      setUnlockPremiumOpen(false);
      setProposalDialogOpen(false);
    }
  };

  const handleRejectProposal = (proposalId: string) => {
    setProposals(proposals.map(p => 
      p.id === proposalId ? { ...p, status: 'rejected' as const } : p
    ));
    toast.success('Propuesta rechazada');
    setProposalDialogOpen(false);
  };

  const pendingProposalsCount = proposals.filter(p => p.status !== 'accepted' && p.status !== 'rejected').length;

  // Estadísticas del propietario
  const statistics = {
    totalProperties: 5,
    activeRentals: 4,
    monthlyIncome: 1800000,
    occupancyRate: 80,
    averageRating: 4.7,
    totalReviews: 89,
  };

  // Propiedades activas (mock data)
  const activeProperties = [
    {
      id: 1,
      title: 'Apartamento moderno en Palermo',
      address: 'Av. Santa Fe 3450, Palermo, Buenos Aires, Argentina',
      monthlyRent: 450000,
      status: 'Ocupado',
      tenant: 'Laura Martínez',
      nextPayment: '2025-11-01',
      contractStart: '2023-01-15',
      contractEnd: '2026-01-15',
    },
    {
      id: 2,
      title: 'Estudio en Belgrano',
      address: 'Av. Cabildo 1850, Buenos Aires, Argentina',
      monthlyRent: 310000,
      status: 'Ocupado',
      tenant: 'David García',
      nextPayment: '2025-11-05',
      contractStart: '2024-03-01',
      contractEnd: '2027-03-01',
    },
    {
      id: 3,
      title: 'Departamento exterior en Recoleta',
      address: 'Av. Callao 1250, Recoleta, Buenos Aires, Argentina',
      monthlyRent: 380000,
      status: 'Disponible',
      tenant: null,
      nextPayment: null,
      contractStart: null,
      contractEnd: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-gray-900 mb-8">Perfil de Propietario</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="p-6 h-fit">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={ownerData.avatar} />
                <AvatarFallback>
                  {ownerData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-gray-900 mb-1">{ownerData.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{ownerData.email}</p>
              <Badge className="mb-4 bg-blue-600">Propietario Verificado</Badge>
              <Button variant="outline" className="w-full mb-4">
                <Edit2 className="h-4 w-4 mr-2" />
                Cambiar foto
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">Email verificado</span>
                </div>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">Teléfono verificado</span>
                </div>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">Identidad verificada</span>
                </div>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">Empresa verificada</span>
                </div>
                <Badge variant="secondary">✓</Badge>
              </div>
            </div>

            <Separator className="my-6" />

            {pendingProposalsCount > 0 && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 mb-1">
                        {pendingProposalsCount} nueva{pendingProposalsCount !== 1 ? 's' : ''} propuesta{pendingProposalsCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-600">
                        Inquilinos interesados en tus propiedades
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}

            <div className="space-y-3">
              <h3 className="text-gray-900 text-sm">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Home className="h-4 w-4 mr-2 text-blue-600" />
                    Propiedades
                  </span>
                  <span className="text-gray-900">{statistics.totalProperties}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    Alquileres activos
                  </span>
                  <span className="text-gray-900">{statistics.activeRentals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                    Ocupación
                  </span>
                  <span className="text-gray-900">{statistics.occupancyRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Calificación
                  </span>
                  <span className="text-gray-900">{statistics.averageRating}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Ingresos mensuales</span>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-gray-900">${statistics.monthlyIncome.toLocaleString()}</p>
            </div>

            <Separator className="my-6" />

            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </Card>

          {/* Settings */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Información personal</TabsTrigger>
                <TabsTrigger value="proposals" className="relative">
                  Propuestas
                  {pendingProposalsCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white px-2 py-0 h-5 min-w-5 rounded-full text-xs">
                      {pendingProposalsCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="properties">Propiedades</TabsTrigger>
                <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="proposals">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-gray-900">Propuestas de alquiler</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Gestiona las solicitudes de inquilinos interesados en tus propiedades
                      </p>
                    </div>
                    {pendingProposalsCount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {pendingProposalsCount} nueva{pendingProposalsCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {proposals.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No tienes propuestas en este momento</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {proposals.map((proposal) => (
                        <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-4">
                            {/* Property Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={proposal.propertyImage}
                                alt={proposal.propertyTitle}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="text-gray-900 mb-1 truncate">{proposal.propertyTitle}</h4>
                                  <p className="text-sm text-gray-600 truncate">{proposal.propertyAddress}</p>
                                </div>
                                <Badge 
                                  className={
                                    proposal.status === 'accepted' ? 'bg-green-500' :
                                    proposal.status === 'rejected' ? 'bg-gray-500' :
                                    'bg-yellow-500'
                                  }
                                >
                                  {proposal.status === 'accepted' ? 'Aceptada' :
                                   proposal.status === 'rejected' ? 'Rechazada' :
                                   'Pendiente'}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={proposal.tenant.avatar}
                                    alt={proposal.tenant.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-gray-900">{proposal.tenant.name}</p>
                                      <div className="flex items-center gap-0.5">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-gray-600">{proposal.tenant.rating.toFixed(1)}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      {new Date(proposal.date).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                                {proposal.message}
                              </p>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewProposal(proposal)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Ver detalles
                                </Button>
                                {proposal.status !== 'accepted' && proposal.status !== 'rejected' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => handleAcceptProposal(proposal.id)}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Aceptar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRejectProposal(proposal.id)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Rechazar
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="personal">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900">Información personal</h3>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          Guardar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          value={ownerData.name.split(' ')[0]}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          value={ownerData.name.split(' ')[1]}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={ownerData.email}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Número de teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={ownerData.phone}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Nombre de la empresa (opcional)</Label>
                      <Input
                        id="company"
                        value={ownerData.company}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={ownerData.address}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Sobre mí / Empresa</Label>
                      <Textarea
                        id="bio"
                        value={ownerData.bio}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="properties">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900">Mis propiedades</h3>
                    <Button size="sm">
                      <Home className="h-4 w-4 mr-2" />
                      Agregar propiedad
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {activeProperties.map((property) => (
                      <div key={property.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-gray-900 mb-1">{property.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                            <div className="flex items-center gap-4">
                              <Badge
                                variant={property.status === 'Ocupado' ? 'default' : 'secondary'}
                                className={property.status === 'Ocupado' ? 'bg-green-600' : ''}
                              >
                                {property.status}
                              </Badge>
                              <span className="text-sm text-gray-900">
                                €{property.monthlyRent}/mes
                              </span>
                            </div>
                          </div>
                        </div>

                        {property.tenant && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Inquilino actual:</p>
                                <p className="text-gray-900">{property.tenant}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600">Próximo pago:</p>
                                <p className="text-gray-900">{property.nextPayment}</p>
                              </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Inicio de contrato:</p>
                                <p className="text-gray-900">
                                  {new Date(property.contractStart).toLocaleDateString('es-ES', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600">Fin de contrato:</p>
                                <p className="text-gray-900">
                                  {new Date(property.contractEnd).toLocaleDateString('es-ES', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Ver detalles
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Editar
                          </Button>
                          {property.status === 'Disponible' && (
                            <Button variant="outline" size="sm" className="flex-1">
                              Publicar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-gray-900 mb-2">Resumen</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total propiedades</p>
                        <p className="text-gray-900">{statistics.totalProperties}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ingresos totales</p>
                        <p className="text-gray-900">€{statistics.monthlyIncome}/mes</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Preferencias de notificaciones</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Nuevas solicitudes de alquiler</p>
                        <p className="text-sm text-gray-600">
                          Notificarme cuando alguien solicite alquilar una propiedad
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Recordatorios de pago</p>
                        <p className="text-sm text-gray-600">
                          Alertas sobre pagos pendientes de inquilinos
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Mensajes de inquilinos</p>
                        <p className="text-sm text-gray-600">
                          Recibir mensajes y consultas de inquilinos
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Solicitudes de mantenimiento</p>
                        <p className="text-sm text-gray-600">
                          Notificarme sobre reportes de mantenimiento
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Vencimiento de contratos</p>
                        <p className="text-sm text-gray-600">
                          Recordatorios 30 días antes del vencimiento
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Emails de marketing</p>
                        <p className="text-sm text-gray-600">
                          Recibir consejos y noticias sobre gestión inmobiliaria
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Proposal Details Dialog */}
        {selectedProposal && (
          <Dialog open={proposalDialogOpen} onOpenChange={setProposalDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
              <div className="px-6 pt-6">
                <DialogHeader>
                  <DialogTitle>Detalles de la propuesta</DialogTitle>
                  <DialogDescription>
                    Revisa la información completa del inquilino interesado
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-4 px-6 overflow-y-auto flex-1">
                {/* Property Info */}
                <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={selectedProposal.propertyImage}
                    alt={selectedProposal.propertyTitle}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{selectedProposal.propertyTitle}</h4>
                    <p className="text-sm text-gray-600 mb-1">{selectedProposal.propertyAddress}</p>
                    <p className="text-sm">
                      <span className="text-gray-900">${selectedProposal.propertyPrice}</span>
                      <span className="text-gray-600"> / mes</span>
                    </p>
                  </div>
                </div>

                {/* Tenant Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-gray-900 mb-3">Información del inquilino</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={selectedProposal.tenant.avatar}
                      alt={selectedProposal.tenant.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">{selectedProposal.tenant.name}</p>
                      {selectedProposal.status === 'accepted' && (
                        <p className="text-sm text-gray-600">{selectedProposal.tenant.email}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-900">{selectedProposal.tenant.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-600">· {selectedProposal.tenant.reviewCount} reseña{selectedProposal.tenant.reviewCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Reviews Button */}
                  <button
                    onClick={() => setTenantReviewsOpen(true)}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <div className="text-left">
                        <p className="text-sm text-gray-900">Ver reseñas como inquilino</p>
                        <p className="text-xs text-gray-600">
                          {selectedProposal.tenant.reviewCount} evaluaciones de propietarios anteriores
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>

                  <Separator className="my-3" />

                  {selectedProposal.status === 'accepted' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{selectedProposal.tenant.phone}</span>
                      </div>
                      {selectedProposal.moveInDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            Mudanza aproximada:{' '}
                            {new Date(selectedProposal.moveInDate).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedProposal.status !== 'accepted' && selectedProposal.moveInDate && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          Mudanza aproximada:{' '}
                          {new Date(selectedProposal.moveInDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-gray-900 mb-2">Mensaje del inquilino</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedProposal.message}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    Enviado el{' '}
                    {new Date(selectedProposal.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t px-6 py-4 bg-white">
                <DialogFooter className="flex-col gap-3 sm:flex-col">
                {selectedProposal.status === 'pending' ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectProposal(selectedProposal.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button
                      onClick={() => handleAcceptProposal(selectedProposal.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aceptar propuesta
                    </Button>
                  </>
                ) : selectedProposal.status === 'accepted' && !selectedProposal.premiumUnlocked ? (
                  <>
                    <div className="w-full p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-1">Propuesta aceptada exitosamente</p>
                          <p className="text-sm text-gray-600">
                            Coordina una visita con {selectedProposal.tenant.name} y cuando decidan avanzar con el alquiler, desbloquea las funcionalidades premium.
                          </p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1 mb-3 ml-13">
                        <li className="flex items-center gap-2">
                          <MessageCircle className="h-3 w-3 text-purple-600" />
                          Chat interno seguro
                        </li>
                        <li className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-purple-600" />
                          Gestión de documentación
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-purple-600" />
                          Sistema de reseñas
                        </li>
                      </ul>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" onClick={() => setProposalDialogOpen(false)} className="flex-1">
                        Cerrar
                      </Button>
                      <Button
                        onClick={() => setUnlockPremiumOpen(true)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Desbloquear Premium
                      </Button>
                    </div>
                  </>
                ) : selectedProposal.status === 'accepted' && selectedProposal.premiumUnlocked ? (
                  <>
                    <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-green-900 mb-1">Premium activado</p>
                          <p className="text-sm text-green-700">
                            Ahora puedes usar chat, documentación y todas las funcionalidades premium.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setProposalDialogOpen(false)} className="w-full">
                      Cerrar
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setProposalDialogOpen(false)}>
                    Cerrar
                  </Button>
                )}
              </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Tenant Reviews Dialog */}
        {selectedProposal && (
          <TenantReviewsDialog
            open={tenantReviewsOpen}
            onOpenChange={setTenantReviewsOpen}
            tenantName={selectedProposal.tenant.name}
            tenantAvatar={selectedProposal.tenant.avatar}
            rating={selectedProposal.tenant.rating}
            reviewCount={selectedProposal.tenant.reviewCount}
            reviews={selectedProposal.tenant.reviews}
            aiSummary={selectedProposal.tenant.aiSummary}
          />
        )}

        {/* Unlock Premium Dialog */}
        {selectedProposal && (
          <UnlockPremiumDialog
            open={unlockPremiumOpen}
            onOpenChange={setUnlockPremiumOpen}
            onConfirmPayment={handleUnlockPremium}
            propertyTitle={selectedProposal.propertyTitle}
            propertyPrice={selectedProposal.propertyPrice}
            userType="owner"
          />
        )}
      </div>
    </div>
  );
}
