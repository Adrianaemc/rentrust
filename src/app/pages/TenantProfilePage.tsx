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
import { User, Mail, Phone, Shield, Edit2, MapPin, Calendar, Home, Star, LogOut, Bell, MessageCircle, Check, X, ChevronRight, Clock, Lock, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { mockTenantProposals, TenantProposalResponse } from '../data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { UnlockPremiumDialog } from '../components/UnlockPremiumDialog';
import { ReviewsDialog } from '../components/ReviewsDialog';

export function TenantProfilePage() {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [proposals, setProposals] = useState<TenantProposalResponse[]>(mockTenantProposals);
  const [selectedProposal, setSelectedProposal] = useState<TenantProposalResponse | null>(null);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [unlockPremiumOpen, setUnlockPremiumOpen] = useState(false);
  const [ownerReviewsOpen, setOwnerReviewsOpen] = useState(false);
  
  const handleLogout = async () => {
    try { await logout(); toast.success('Sesión cerrada exitosamente'); navigate('/'); }
    catch { toast.error('No se pudo cerrar la sesión'); }
  };
  
  const [tenantData, setTenantData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+34 912 345 678',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Profesional en búsqueda de alquiler a largo plazo. Me gusta mantener los espacios limpios y ordenados.',
    occupation: 'Ingeniera de Software',
    currentAddress: 'Av. Santa Fe 2450, Buenos Aires, Argentina',
    monthlyIncome: '450000',
    preferredLocations: ['Buenos Aires Centro', 'Palermo', 'Recoleta'],
    preferredPropertyType: 'Apartamento',
    maxBudget: '400000',
    moveInDate: '2025-02-01',
  });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/'); return; }
    if (user.type !== 'tenant') { navigate(user.type === 'owner' ? '/profile/owner' : '/profile/tenant'); return; }
    supabase.auth.getUser().then(({ data }) => {
      const saved = data.user?.user_metadata?.profile ?? {};
      setTenantData(prev => ({ ...prev, ...saved, name: data.user?.user_metadata?.name || user.name, email: user.email }));
    });
  }, [loading, user?.email, user?.type, navigate]);

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({ data: { profile: tenantData, name: tenantData.name } });
    if (error) { toast.error(error.message); return; }
    setIsEditing(false);
    toast.success('¡Perfil actualizado exitosamente!');
  };

  const handleViewProposal = (proposal: TenantProposalResponse) => {
    setSelectedProposal(proposal);
    setProposalDialogOpen(true);
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

  // Contar propuestas con respuestas nuevas (aceptadas o rechazadas que no se han leído)
  const newResponsesCount = proposals.filter(p => 
    (p.status === 'accepted' || p.status === 'rejected') && p.responseDate
  ).length;

  // Historial de alquileres previos (mock data)
  const rentalHistory = [
    {
      id: 1,
      property: 'Apartamento en Palermo',
      address: 'Av. Santa Fe 3250, Buenos Aires, Argentina',
      period: '2022 - 2024',
      rating: 5,
    },
    {
      id: 2,
      property: 'Estudio en Belgrano',
      address: 'Av. Cabildo 1850, Buenos Aires, Argentina',
      period: '2020 - 2022',
      rating: 4.8,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-gray-900 mb-8">Perfil de Inquilino</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="p-6 h-fit">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={tenantData.avatar} />
                <AvatarFallback>
                  {tenantData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-gray-900 mb-1">{tenantData.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{tenantData.email}</p>
              <Badge className="mb-4 bg-green-600">Inquilino Verificado</Badge>
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
            </div>

            <Separator className="my-6" />

            {newResponsesCount > 0 && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 mb-1">
                        {newResponsesCount} respuesta{newResponsesCount !== 1 ? 's' : ''} nueva{newResponsesCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-600">
                        Propietarios respondieron a tus propuestas
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}

            <div className="space-y-3">
              <h3 className="text-gray-900 text-sm">Estadísticas</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Alquileres completados</span>
                <span className="text-gray-900">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calificación promedio</span>
                <span className="text-gray-900 flex items-center">
                  4.9 <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Miembro desde</span>
                <span className="text-gray-900">2015</span>
              </div>
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
                  Mis Propuestas
                  {newResponsesCount > 0 && (
                    <Badge className="ml-2 bg-green-500 text-white px-2 py-0 h-5 min-w-5 rounded-full text-xs">
                      {newResponsesCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="preferences">Preferencias</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="proposals">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-gray-900">Mis Propuestas</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Estado de las solicitudes que enviaste a propietarios
                      </p>
                    </div>
                    {newResponsesCount > 0 && (
                      <Badge className="bg-green-500 text-white">
                        {newResponsesCount} nueva{newResponsesCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {proposals.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No has enviado propuestas aún</p>
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
                                    proposal.status === 'rejected' ? 'bg-red-500' :
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
                                    src={proposal.owner.avatar}
                                    alt={proposal.owner.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div>
                                    <p className="text-sm text-gray-900">{proposal.owner.name}</p>
                                    <p className="text-xs text-gray-600">
                                      Enviada el {new Date(proposal.sentDate).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {proposal.status === 'accepted' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <p className="text-sm text-green-900">
                                      ¡Tu propuesta fue aceptada!
                                    </p>
                                  </div>
                                  <p className="text-xs text-green-700">
                                    El propietario respondió el {new Date(proposal.responseDate!).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              )}

                              {proposal.status === 'rejected' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <X className="h-4 w-4 text-red-600" />
                                    <p className="text-sm text-red-900">
                                      Propuesta no aceptada
                                    </p>
                                  </div>
                                  <p className="text-xs text-red-700">
                                    El propietario respondió el {new Date(proposal.responseDate!).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              )}

                              {proposal.status !== 'accepted' && proposal.status !== 'rejected' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    <p className="text-sm text-yellow-900">
                                      Esperando respuesta del propietario
                                    </p>
                                  </div>
                                </div>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProposal(proposal)}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Ver detalles
                              </Button>
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
                          value={tenantData.name.split(' ')[0]}
                          onChange={(e) => {
                            const lastName = tenantData.name.split(' ')[1] || '';
                            setTenantData({ ...tenantData, name: `${e.target.value} ${lastName}` });
                          }}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          value={tenantData.name.split(' ')[1] || ''}
                          onChange={(e) => {
                            const firstName = tenantData.name.split(' ')[0];
                            setTenantData({ ...tenantData, name: `${firstName} ${e.target.value}` });
                          }}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={tenantData.email}
                        onChange={(e) => setTenantData({ ...tenantData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Número de teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={tenantData.phone}
                        onChange={(e) => setTenantData({ ...tenantData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="occupation">Ocupación</Label>
                      <Input
                        id="occupation"
                        value={tenantData.occupation}
                        onChange={(e) => setTenantData({ ...tenantData, occupation: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="currentAddress">Dirección actual</Label>
                      <Input
                        id="currentAddress"
                        value={tenantData.currentAddress}
                        onChange={(e) => setTenantData({ ...tenantData, currentAddress: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Sobre mí</Label>
                      <Textarea
                        id="bio"
                        value={tenantData.bio}
                        onChange={(e) => setTenantData({ ...tenantData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Preferencias de búsqueda</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="propertyType">Tipo de propiedad preferida</Label>
                      <Input
                        id="propertyType"
                        value={tenantData.preferredPropertyType}
                        onChange={(e) => setTenantData({ ...tenantData, preferredPropertyType: e.target.value })}
                        placeholder="Ej: Apartamento, Casa, Estudio"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxBudget">Presupuesto máximo (€/mes)</Label>
                      <Input
                        id="maxBudget"
                        type="number"
                        value={tenantData.maxBudget}
                        onChange={(e) => setTenantData({ ...tenantData, maxBudget: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="moveInDate">Fecha de mudanza deseada</Label>
                      <Input
                        id="moveInDate"
                        type="date"
                        value={tenantData.moveInDate}
                        onChange={(e) => setTenantData({ ...tenantData, moveInDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Ubicaciones preferidas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tenantData.preferredLocations.map((location) => (
                          <Badge key={location} variant="secondary">
                            <MapPin className="h-3 w-3 mr-1" />
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h4 className="text-gray-900">Requisitos de la propiedad</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">Permite mascotas</p>
                          <p className="text-sm text-gray-600">
                            Buscar propiedades que admitan mascotas
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">Amueblado</p>
                          <p className="text-sm text-gray-600">
                            Preferir propiedades amuebladas
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">Garage incluido</p>
                          <p className="text-sm text-gray-600">
                            Requiere espacio de estacionamiento
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <Button className="w-full mt-6">Guardar preferencias</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Historial de alquileres</h3>

                  <div className="space-y-4">
                    {rentalHistory.map((rental) => (
                      <div key={rental.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Home className="h-4 w-4 text-blue-600" />
                              <h4 className="text-gray-900">{rental.property}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <MapPin className="h-3 w-3" />
                              {rental.address}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              {rental.period}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{rental.rating}</span>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Ver detalles
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Descargar contrato
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Nota:</strong> Tu historial de alquileres ayuda a los propietarios a conocer tu trayectoria como inquilino.
                    </p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Preferencias de notificaciones</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Nuevas propiedades disponibles</p>
                        <p className="text-sm text-gray-600">
                          Notificarme cuando haya propiedades que coincidan con mis preferencias
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Cambios de precio</p>
                        <p className="text-sm text-gray-600">
                          Alertas sobre reducciones de precio en propiedades guardadas
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Mensajes de propietarios</p>
                        <p className="text-sm text-gray-600">
                          Recibir mensajes de propietarios de propiedades
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Recordatorios de pago</p>
                        <p className="text-sm text-gray-600">
                          Recordatorios sobre próximos pagos de alquiler
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">Emails de marketing</p>
                        <p className="text-sm text-gray-600">
                          Recibir ofertas promocionales y noticias
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
                    Revisa tu solicitud y la respuesta del propietario
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

                {/* Status Banner */}
                {selectedProposal.status === 'accepted' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-green-900 mb-1">¡Felicitaciones! Tu propuesta fue aceptada</p>
                        <p className="text-sm text-green-700">
                          El propietario {selectedProposal.owner.name} aceptó tu solicitud el{' '}
                          {new Date(selectedProposal.responseDate!).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProposal.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-red-900 mb-1">Propuesta no aceptada</p>
                        <p className="text-sm text-red-700">
                          El propietario respondió el{' '}
                          {new Date(selectedProposal.responseDate!).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProposal.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-yellow-900 mb-1">Esperando respuesta</p>
                        <p className="text-sm text-yellow-700">
                          El propietario todavía no ha respondido a tu propuesta
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Owner Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-gray-900 mb-3">Propietario</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={selectedProposal.owner.avatar}
                      alt={selectedProposal.owner.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">{selectedProposal.owner.name}</p>
                      {selectedProposal.status === 'accepted' && (
                        <p className="text-sm text-gray-600">{selectedProposal.owner.email}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-900">{selectedProposal.owner.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-600">· {selectedProposal.owner.reviewCount} reseña{selectedProposal.owner.reviewCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Reviews Button */}
                  <button
                    onClick={() => setOwnerReviewsOpen(true)}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <div className="text-left">
                        <p className="text-sm text-gray-900">Ver reseñas como propietario</p>
                        <p className="text-xs text-gray-600">
                          {selectedProposal.owner.reviewCount} evaluaciones de inquilinos anteriores
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>

                  {selectedProposal.status === 'accepted' && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{selectedProposal.owner.phone}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Your Message */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-gray-900 mb-2">Tu mensaje</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedProposal.message}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    Enviado el{' '}
                    {new Date(selectedProposal.sentDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Owner Response */}
                {selectedProposal.responseMessage && (
                  <div className={`border rounded-lg p-4 ${
                    selectedProposal.status === 'accepted' ? 'bg-green-50 border-green-200' :
                    selectedProposal.status === 'rejected' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <h4 className="text-gray-900 mb-2">Respuesta del propietario</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedProposal.responseMessage}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      Respondido el{' '}
                      {new Date(selectedProposal.responseDate!).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {/* Next Steps */}
                {selectedProposal.status === 'accepted' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-gray-900 mb-2">Próximos pasos</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Contacta al propietario para coordinar la visita a la propiedad</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Prepara la documentación necesaria (recibos de sueldo, garantías, DNI)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Revisa los términos del contrato antes de firmar</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t px-6 py-4 bg-white">
                <DialogFooter className="flex-col gap-3 sm:flex-col">
                {selectedProposal.status === 'accepted' && !selectedProposal.premiumUnlocked && (
                  <>
                    <div className="w-full p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-1">¡Tu propuesta fue aceptada!</p>
                          <p className="text-sm text-gray-600">
                            Contacta a {selectedProposal.owner.name} para coordinar una visita. Cuando decidan avanzar con el alquiler, desbloquea las funcionalidades premium.
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
                          Gestión de documentación y contratos
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-purple-600" />
                          Sistema de reseñas verificadas
                        </li>
                      </ul>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          window.location.href = `mailto:${selectedProposal.owner.email}`;
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar email
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          window.location.href = `tel:${selectedProposal.owner.phone}`;
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                    </div>
                    <Button
                      onClick={() => setUnlockPremiumOpen(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Desbloquear funcionalidades premium
                    </Button>
                  </>
                )}
                {selectedProposal.status === 'accepted' && selectedProposal.premiumUnlocked && (
                  <>
                    <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-green-900 mb-1">Premium activado</p>
                          <p className="text-sm text-green-700">
                            Ahora puedes usar chat, documentación y todas las funcionalidades premium con {selectedProposal.owner.name}.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          window.location.href = `mailto:${selectedProposal.owner.email}`;
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar email
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          window.location.href = `tel:${selectedProposal.owner.phone}`;
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                    </div>
                    <Button variant="outline" onClick={() => setProposalDialogOpen(false)} className="w-full">
                      Cerrar
                    </Button>
                  </>
                )}
                {selectedProposal.status !== 'accepted' && (
                  <Button variant="outline" onClick={() => setProposalDialogOpen(false)}>
                    Cerrar
                  </Button>
                )}
              </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Unlock Premium Dialog */}
        {selectedProposal && (
          <UnlockPremiumDialog
            open={unlockPremiumOpen}
            onOpenChange={setUnlockPremiumOpen}
            onConfirmPayment={handleUnlockPremium}
            propertyTitle={selectedProposal.propertyTitle}
            propertyPrice={selectedProposal.propertyPrice}
            userType="tenant"
          />
        )}

        {/* Owner Reviews Dialog */}
        {selectedProposal && (
          <ReviewsDialog
            open={ownerReviewsOpen}
            onOpenChange={setOwnerReviewsOpen}
            reviews={selectedProposal.owner.reviews}
            hostRating={selectedProposal.owner.rating}
            hostName={selectedProposal.owner.name}
          />
        )}
      </div>
    </div>
  );
}
