import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { PropertyRecord } from '../../lib/properties';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import {
  PlusCircle,
  Home,
  DollarSign,
  Calendar,
  Star,
  Eye,
  Edit,
  Trash2,
  User,
  ThumbsUp,
  AlertCircle,
  MessageSquare,
  FileText,
  Download,
  Upload,
  FolderOpen,
  Send,
} from 'lucide-react';

export function HostDashboardPage() {
  const [savedProperties, setSavedProperties] = useState<PropertyRecord[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState('');
  const [currentOwnerId, setCurrentOwnerId] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setPropertiesLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!alive) return;
      setCurrentOwnerId(user?.id ?? null);
      if (authError || !user) { setSavedProperties([]); setPropertiesError(authError?.message || 'Iniciá sesión para ver tus propiedades.'); setPropertiesLoading(false); return; }
      const { data, error } = await supabase.from('properties').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });
      if (!alive) return;
      setSavedProperties((data || []) as PropertyRecord[]);
      setPropertiesError(error?.message || '');
      setPropertiesLoading(false);
    };
    void load();
    return () => { alive = false; };
  }, [reloadVersion]);
  const deleteProperty = async (id: string) => {
    if (!currentOwnerId || !window.confirm('¿Eliminar esta publicación?')) return;
    const { error } = await supabase.from('properties').delete().eq('id', id).eq('owner_id', currentOwnerId);
    if (error) toast.error(error.message);
    else { toast.success('Propiedad eliminada'); setReloadVersion(v => v + 1); }
  };
  // Review state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [timelyPayments, setTimelyPayments] = useState('yes');
  const [propertyCondition, setPropertyCondition] = useState('excellent');
  const [petBehavior, setPetBehavior] = useState('good');
  const [hasPet, setHasPet] = useState('no');
  const [activeTab, setActiveTab] = useState('properties');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Mock documents for current rental
  const [currentDocuments] = useState([
    {
      id: 1,
      name: 'Contrato Casa Belgrano 2022-2025.pdf',
      uploadedBy: 'Propietario',
      uploadDate: '2022-11-01',
      size: '2.9 MB',
    },
    {
      id: 2,
      name: 'Inventario Inicial - Casa Belgrano.pdf',
      uploadedBy: 'Propietario',
      uploadDate: '2022-11-01',
      size: '1.6 MB',
    },
    {
      id: 3,
      name: 'Garantía Propietaria - Sofia Ramirez.pdf',
      uploadedBy: 'Inquilino',
      uploadDate: '2022-11-01',
      size: '1.1 MB',
    },
    {
      id: 4,
      name: 'Comprobante Octubre 2025.pdf',
      uploadedBy: 'Inquilino',
      uploadDate: '2025-10-05',
      size: '350 KB',
    },
  ]);

  // Contratos activos - propiedades alquiladas actualmente
  const [activeContracts] = useState([
    {
      id: 'active-1',
      tenant: {
        name: 'Sofía Ramírez',
        email: 'sofia.ramirez@example.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      },
      property: 'Casa con jardín en Belgrano',
      propertyAddress: 'Calle Juramento 2890, Belgrano',
      propertyImage: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800',
      startDate: '2022-11-01',
      endDate: '2025-11-01',
      monthlyRent: 580000,
      status: 'Vigente',
    },
    {
      id: 'active-2',
      tenant: {
        name: 'Diego Fernández',
        email: 'diego.fernandez@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      },
      property: 'Departamento 2 ambientes Palermo',
      propertyAddress: 'Av. Santa Fe 3450, Palermo',
      propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      startDate: '2023-03-15',
      endDate: '2026-03-15',
      monthlyRent: 450000,
      status: 'Vigente',
    },
    {
      id: 'active-3',
      tenant: {
        name: 'Carolina Méndez',
        email: 'carolina.mendez@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      },
      property: 'Monoambiente en Recoleta',
      propertyAddress: 'Av. Callao 1250, Recoleta',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      startDate: '2024-01-10',
      endDate: '2027-01-10',
      monthlyRent: 380000,
      status: 'Vigente',
    },
    {
      id: 'active-4',
      tenant: {
        name: 'Andrés Morales',
        email: 'andres.morales@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      },
      property: 'Departamento luminoso en Caballito',
      propertyAddress: 'Av. Rivadavia 5890, Caballito',
      propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      startDate: '2023-07-20',
      endDate: '2026-07-20',
      monthlyRent: 390000,
      status: 'Vigente',
    },
  ]);

  // Contratos pendientes de reseñas (contrato terminado pero falta reseña de alguna parte)
  const [pendingReviewContracts, setPendingReviewContracts] = useState([
    {
      id: 'pending-1',
      tenant: {
        name: 'Valeria Torres',
        email: 'valeria.torres@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      },
      property: 'Loft en Villa Crespo',
      propertyAddress: 'Av. Corrientes 5600, Villa Crespo',
      propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      startDate: '2019-09-01',
      endDate: '2022-09-01',
      monthlyRent: 400000,
      tenantReviewSubmitted: false,
      ownerReviewSubmitted: false,
      ownerRating: null,
    },
    {
      id: 'pending-2',
      tenant: {
        name: 'Gabriel Suárez',
        email: 'gabriel.suarez@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      },
      property: 'Departamento en Núñez',
      propertyAddress: 'Av. Libertador 7200, Núñez',
      propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      startDate: '2020-02-15',
      endDate: '2023-02-15',
      monthlyRent: 390000,
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: false,
      ownerRating: null,
    },
  ]);

  // Contratos finalizados (ambas reseñas completadas)
  const [finishedContracts] = useState([
    {
      id: 'finished-1',
      tenant: {
        name: 'Paula Giménez',
        email: 'paula.gimenez@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      },
      property: 'Departamento en Almagro',
      propertyAddress: 'Av. Corrientes 4200, Almagro',
      propertyImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      startDate: '2016-06-01',
      endDate: '2019-06-01',
      monthlyRent: 330000,
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: true,
      ownerRating: 4.7,
      tenantRating: 4.9,
      ownerReviewComment: 'Excelente inquilina, muy cuidadosa con la propiedad. Los pagos siempre fueron puntuales y la comunicación fue excelente. La recomendaría sin dudas.',
      tenantReviewComment: 'Propietario muy responsable y atento. Siempre resolvió los problemas de mantenimiento rápidamente. Muy buena experiencia.',
      chatHistory: [
        {
          id: 1,
          sender: 'tenant',
          senderName: 'Paula Giménez',
          message: 'Hola, se cortó el agua caliente. ¿Podés enviar a alguien a revisar el termotanque?',
          timestamp: '2017-08-15T09:00:00',
        },
        {
          id: 2,
          sender: 'owner',
          senderName: 'Tú',
          message: 'Hola Paula! Ya llamo al técnico. Mañana a las 11 hs puede ir, ¿te viene bien?',
          timestamp: '2017-08-15T10:30:00',
        },
        {
          id: 3,
          sender: 'tenant',
          senderName: 'Paula Giménez',
          message: 'Perfecto, muchas gracias!',
          timestamp: '2017-08-15T10:45:00',
        },
        {
          id: 4,
          sender: 'owner',
          senderName: 'Tú',
          message: 'El técnico ya terminó. Me dijo que quedó todo funcionando bien.',
          timestamp: '2017-08-16T13:00:00',
        },
        {
          id: 5,
          sender: 'tenant',
          senderName: 'Paula Giménez',
          message: 'Sí, ya está todo ok. Gracias por la rapidez!',
          timestamp: '2017-08-16T14:00:00',
        },
      ],
      documents: [
        {
          id: 1,
          name: 'Contrato Almagro 2016-2019.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2016-06-01',
          size: '2.5 MB',
        },
        {
          id: 2,
          name: 'Inventario Inicial.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2016-06-01',
          size: '1.4 MB',
        },
        {
          id: 3,
          name: 'Acta de Entrega Final.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2019-06-01',
          size: '850 KB',
        },
        {
          id: 4,
          name: 'Último comprobante de pago.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2019-05-05',
          size: '310 KB',
        },
      ],
    },
    {
      id: 'finished-2',
      tenant: {
        name: 'Fernando Castro',
        email: 'fernando.castro@example.com',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      },
      property: 'Casa en Villa Urquiza',
      propertyAddress: 'Calle Blanco Encalada 5200, Villa Urquiza',
      propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      startDate: '2013-04-10',
      endDate: '2016-04-10',
      monthlyRent: 520000,
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: true,
      ownerRating: 5.0,
      tenantRating: 4.8,
      ownerReviewComment: 'Inquilino excepcional. Durante los 3 años cuidó la casa como si fuera suya. Pagos siempre a tiempo y excelente comunicación. El mejor inquilino que tuve.',
      tenantReviewComment: 'Excelente propietario. Siempre disponible y muy justo. La casa estaba en perfectas condiciones y cualquier problema se resolvió inmediatamente.',
      chatHistory: [
        {
          id: 1,
          sender: 'tenant',
          senderName: 'Fernando Castro',
          message: 'Hola! Hay una pérdida de agua en el baño. ¿Podés enviar un plomero?',
          timestamp: '2014-11-20T08:00:00',
        },
        {
          id: 2,
          sender: 'owner',
          senderName: 'Tú',
          message: 'Hola Fernando! Ya coordino. El plomero puede ir esta tarde, ¿estás en casa?',
          timestamp: '2014-11-20T09:00:00',
        },
        {
          id: 3,
          sender: 'tenant',
          senderName: 'Fernando Castro',
          message: 'Sí, perfecto! Muchas gracias por la rapidez.',
          timestamp: '2014-11-20T09:15:00',
        },
        {
          id: 4,
          sender: 'tenant',
          senderName: 'Fernando Castro',
          message: 'Hola, quería consultarte si puedo hacer una parrilla en el patio.',
          timestamp: '2015-03-10T16:00:00',
        },
        {
          id: 5,
          sender: 'owner',
          senderName: 'Tú',
          message: 'Hola! Sí, no hay problema. Podés hacerla donde te quede más cómodo.',
          timestamp: '2015-03-10T17:30:00',
        },
        {
          id: 6,
          sender: 'tenant',
          senderName: 'Fernando Castro',
          message: 'Genial! Muchas gracias!',
          timestamp: '2015-03-10T18:00:00',
        },
      ],
      documents: [
        {
          id: 1,
          name: 'Contrato Villa Urquiza 2013-2016.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2013-04-10',
          size: '2.7 MB',
        },
        {
          id: 2,
          name: 'Inventario y Fotos.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2013-04-10',
          size: '3.1 MB',
        },
        {
          id: 3,
          name: 'Seguro de Caución.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2013-04-10',
          size: '1.9 MB',
        },
        {
          id: 4,
          name: 'Renovación Seguro 2015.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2015-04-10',
          size: '1.8 MB',
        },
        {
          id: 5,
          name: 'Entrega Final - Fotos.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2016-04-10',
          size: '2.3 MB',
        },
      ],
    },
    {
      id: 'finished-3',
      tenant: {
        name: 'Mariana Vega',
        email: 'mariana.vega@example.com',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
      },
      property: 'Departamento en San Telmo',
      propertyAddress: 'Calle Defensa 850, San Telmo',
      propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      startDate: '2017-08-01',
      endDate: '2020-08-01',
      monthlyRent: 360000,
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: true,
      ownerRating: 4.5,
      tenantRating: 4.7,
      ownerReviewComment: 'Buena inquilina. Cuidó el departamento y cumplió con los pagos. Hubo algunos inconvenientes menores pero se resolvieron bien.',
      tenantReviewComment: 'Buen propietario en general. Resolvió los problemas aunque a veces tardó un poco. El departamento era cómodo.',
      chatHistory: [
        {
          id: 1,
          sender: 'tenant',
          senderName: 'Mariana Vega',
          message: 'Hola, la cerradura de la puerta está fallando. ¿Podés cambiarla?',
          timestamp: '2018-05-12T10:30:00',
        },
        {
          id: 2,
          sender: 'owner',
          senderName: 'Tú',
          message: 'Hola Mariana, la semana que viene coordino con el cerrajero.',
          timestamp: '2018-05-13T18:00:00',
        },
        {
          id: 3,
          sender: 'tenant',
          senderName: 'Mariana Vega',
          message: 'Ok, gracias!',
          timestamp: '2018-05-13T19:00:00',
        },
        {
          id: 4,
          sender: 'tenant',
          senderName: 'Mariana Vega',
          message: 'Hola, este mes me voy a atrasar unos días con el pago.',
          timestamp: '2019-07-03T11:00:00',
        },
        {
          id: 5,
          sender: 'owner',
          senderName: 'Tú',
          message: 'No hay problema, avisame cuando puedas.',
          timestamp: '2019-07-04T10:00:00',
        },
      ],
      documents: [
        {
          id: 1,
          name: 'Contrato San Telmo.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2017-08-01',
          size: '2.4 MB',
        },
        {
          id: 2,
          name: 'Garantía Propietaria.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2017-08-01',
          size: '1.3 MB',
        },
        {
          id: 3,
          name: 'Comprobante Final Julio 2020.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2020-07-05',
          size: '330 KB',
        },
      ],
    },
  ]);

  // Las propiedades provienen del usuario autenticado en Supabase.
  const myProperties = savedProperties.map(p => ({
    id: p.id,
    title: p.title,
    location: `${p.city}, ${p.country}`,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    monthlyRent: Number(p.price),
    image: p.images?.[0] || '',
    status: 'Disponible',
    currentTenant: null as string | null,
  }));

  const handleSubmitTenantReview = () => {
    if (!selectedContract) return;

    // Update the contract with owner's review
    const updatedContract = {
      ...selectedContract,
      ownerRating: reviewRating,
      ownerReviewSubmitted: true,
    };

    // Check if tenant has also submitted their review
    if (updatedContract.tenantReviewSubmitted) {
      // Both reviews completed - move to finished contracts
      setPendingReviewContracts(pendingReviewContracts.filter((c) => c.id !== selectedContract.id));
      toast.success('Reseña enviada. El contrato ha sido finalizado exitosamente');
    } else {
      // Only owner review submitted - keep in pending
      setPendingReviewContracts(
        pendingReviewContracts.map((contract) => (contract.id === selectedContract.id ? updatedContract : contract))
      );
      toast.success('Reseña enviada. Esperando reseña del inquilino para finalizar el contrato');
    }

    setReviewOpen(false);

    // Reset form
    setReviewRating(5);
    setReviewComment('');
    setTimelyPayments('yes');
    setPropertyCondition('excellent');
    setPetBehavior('good');
    setHasPet('no');
    setSelectedContract(null);
  };

  const stats = [
    {
      label: 'Total propiedades',
      value: myProperties.length,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Alquileres activos',
      value: activeContracts.length,
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Ingresos mensuales',
      value: `$${activeContracts.reduce((sum, contract) => sum + contract.monthlyRent, 0)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Ocupación',
      value: `${(myProperties.length ? Math.round((activeContracts.length / myProperties.length) * 100) : 0)}%`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 dark:text-gray-100 mb-2">Mis Propiedades</h1>
            <p className="text-gray-600 dark:text-gray-400">Gestiona tus propiedades y contratos de alquiler</p>
          </div>
          <Link to="/host/add-property">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar propiedad
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-gray-900 dark:text-gray-100 text-2xl">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} dark:bg-opacity-20 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color} dark:opacity-90`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">Las secciones de contratos y reseñas conservan temporalmente los ejemplos del prototipo de Figma; todavía no representan contratos reales. «Mis propiedades» sí consulta Supabase.</p>
        {/* Tabs for Active Contracts, Pending Reviews, Finished Contracts, and Properties */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active-contracts">Contratos Activos ({activeContracts.length})</TabsTrigger>
            <TabsTrigger value="pending-contracts">Pendientes de reseñas ({pendingReviewContracts.length})</TabsTrigger>
            <TabsTrigger value="finished-contracts">Finalizados ({finishedContracts.length})</TabsTrigger>
            <TabsTrigger value="properties">Mis Propiedades ({myProperties.length})</TabsTrigger>
          </TabsList>

          {/* Active Contracts Tab */}
          <TabsContent value="active-contracts" className="space-y-4">
            {activeContracts.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h2 className="text-gray-900 dark:text-gray-100 mb-2">No hay contratos activos</h2>
                <p className="text-gray-600 dark:text-gray-400">Tus contratos de alquiler vigentes aparecerán aquí</p>
              </div>
            ) : (
              activeContracts.map((contract) => (
                <Card key={contract.id} className="overflow-hidden hover:shadow-lg transition-shadow border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-950/20">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                      <ImageWithFallback src={contract.propertyImage} alt={contract.property} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-gray-900 dark:text-gray-100">{contract.property}</h3>
                            <Badge className="bg-green-600">Vigente</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{contract.propertyAddress}</p>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                              <ImageWithFallback src={contract.tenant.avatar} alt={contract.tenant.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 dark:text-gray-100">{contract.tenant.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{contract.tenant.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Valor mensual actual</p>
                          <p className="text-gray-900 dark:text-gray-100 text-2xl">${contract.monthlyRent}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Inicio de contrato</p>
                            <p className="text-gray-900 dark:text-gray-100">{new Date(contract.startDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Fin de contrato</p>
                            <p className="text-gray-900 dark:text-gray-100">{new Date(contract.endDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t justify-end">
                        <Dialog open={chatOpen && selectedContract?.id === contract.id} onOpenChange={(open) => {
                          setChatOpen(open);
                          if (!open) setSelectedContract(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContract(contract);
                                setMessages([
                                  {
                                    id: 1,
                                    sender: 'Propietario',
                                    message: 'Hola, ¿todo bien con la propiedad?',
                                    timestamp: '2024-01-15T10:00:00',
                                    isOwner: true,
                                  },
                                  {
                                    id: 2,
                                    sender: contract.tenant.name,
                                    message: 'Sí, todo perfecto. Muy cómoda la casa.',
                                    timestamp: '2024-01-15T11:00:00',
                                    isOwner: false,
                                  },
                                ]);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contactar inquilino
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Chat con el Inquilino</DialogTitle>
                              <DialogDescription>
                                {contract.property} - {contract.tenant.name}
                              </DialogDescription>
                            </DialogHeader>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[400px] max-h-[500px]">
                              {messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex gap-3 ${msg.isOwner ? 'justify-end' : 'justify-start'}`}
                                >
                                  {!msg.isOwner && (
                                    <div className="flex-shrink-0">
                                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-purple-600" />
                                      </div>
                                    </div>
                                  )}
                                  <div className={`flex flex-col ${msg.isOwner ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                    <div className={`rounded-lg px-4 py-2 ${
                                      msg.isOwner 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                    }`}>
                                      <p className="text-sm">{msg.message}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                      {msg.sender} • {new Date(msg.timestamp).toLocaleString('es-ES', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  </div>
                                  {msg.isOwner && (
                                    <div className="flex-shrink-0">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-green-600" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Message Input */}
                            <div className="border-t pt-4">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Escribe tu mensaje..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newMessage.trim()) {
                                      const newMsg = {
                                        id: messages.length + 1,
                                        sender: 'Propietario',
                                        message: newMessage,
                                        timestamp: new Date().toISOString(),
                                        isOwner: true,
                                      };
                                      setMessages([...messages, newMsg]);
                                      setNewMessage('');
                                      toast.success('Mensaje enviado');
                                    }
                                  }}
                                />
                                <Button
                                  onClick={() => {
                                    if (newMessage.trim()) {
                                      const newMsg = {
                                        id: messages.length + 1,
                                        sender: 'Propietario',
                                        message: newMessage,
                                        timestamp: new Date().toISOString(),
                                        isOwner: true,
                                      };
                                      setMessages([...messages, newMsg]);
                                      setNewMessage('');
                                      toast.success('Mensaje enviado');
                                    }
                                  }}
                                  disabled={!newMessage.trim()}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Presiona Enter para enviar
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog open={documentsOpen && selectedContract?.id === contract.id} onOpenChange={(open) => {
                          setDocumentsOpen(open);
                          if (!open) setSelectedContract(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedContract(contract)}
                            >
                              <FolderOpen className="h-4 w-4 mr-2" />
                              Documentos
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Repositorio de Documentos</DialogTitle>
                              <DialogDescription>
                                Gestiona y visualiza todos los documentos relacionados con este alquiler
                              </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4">
                              {/* Upload Section */}
                              <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
                                <div className="flex items-start gap-4">
                                  <Upload className="h-5 w-5 text-blue-600 mt-1" />
                                  <div className="flex-1">
                                    <h4 className="text-gray-900 mb-2">Cargar nuevo documento</h4>
                                    <div className="flex gap-2">
                                      <Input
                                        type="file"
                                        className="flex-1 bg-white"
                                        onChange={(e) => {
                                          if (e.target.files?.[0]) {
                                            toast.success('Documento cargado exitosamente');
                                          }
                                        }}
                                      />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                      Formatos aceptados: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                                    </p>
                                  </div>
                                </div>
                              </Card>

                              {/* Documents List */}
                              <div className="space-y-3">
                                <h4 className="text-gray-900 mb-3">Documentos guardados ({currentDocuments.length})</h4>
                                {currentDocuments.map((doc) => (
                                  <Card key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div className="flex-1">
                                          <p className="text-gray-900">{doc.name}</p>
                                          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                            <span className="flex items-center gap-1">
                                              <Badge 
                                                variant="secondary" 
                                                className={doc.uploadedBy === 'Propietario' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}
                                              >
                                                {doc.uploadedBy}
                                              </Badge>
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(doc.uploadDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span>•</span>
                                            <span>{doc.size}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toast.success('Descargando documento...')}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toast.success('Documento eliminado')}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending-contracts" className="space-y-4">
            {pendingReviewContracts.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h2 className="text-gray-900 dark:text-gray-100 mb-2">No hay contratos pendientes de reseñas</h2>
                <p className="text-gray-600 dark:text-gray-400">Los contratos terminados aparecerán aquí hasta que ambas partes completen sus reseñas</p>
              </div>
            ) : (
              pendingReviewContracts.map((contract) => (
                <Card key={contract.id} className="overflow-hidden hover:shadow-lg transition-shadow border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                      <ImageWithFallback src={contract.propertyImage} alt={contract.property} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 dark:text-gray-100 mb-2">{contract.property}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{contract.propertyAddress}</p>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                              <ImageWithFallback src={contract.tenant.avatar} alt={contract.tenant.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 dark:text-gray-100">{contract.tenant.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{contract.tenant.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Inicio de contrato</p>
                            <p className="text-gray-900 dark:text-gray-100">{new Date(contract.startDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Fin de contrato</p>
                            <p className="text-gray-900 dark:text-gray-100">{new Date(contract.endDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Alquiler mensual</p>
                            <p className="text-gray-900 dark:text-gray-100">${contract.monthlyRent}</p>
                          </div>
                        </div>
                      </div>

                      <Card className="p-3 bg-amber-100 border-amber-300 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-amber-900 mb-2">
                              <span className="font-semibold">Contrato terminado - Reseñas pendientes</span>
                            </p>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                {contract.ownerReviewSubmitted ? (
                                  <Badge variant="default" className="bg-green-600">
                                    ✓ Tu reseña enviada
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-gray-200">
                                    ⏳ Falta tu reseña
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {contract.tenantReviewSubmitted ? (
                                  <Badge variant="default" className="bg-green-600">
                                    ✓ Reseña del inquilino enviada
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-gray-200">
                                    ⏳ Falta reseña del inquilino
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {!contract.ownerReviewSubmitted && (
                              <p className="text-xs text-amber-800 mt-2">El contrato se finalizará cuando ambas partes completen sus reseñas</p>
                            )}
                          </div>
                        </div>
                      </Card>

                      <div className="flex gap-2 pt-4 border-t justify-end">
                        {!contract.ownerReviewSubmitted ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedContract(contract);
                              setReviewOpen(true);
                            }}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Dejar reseña al inquilino
                          </Button>
                        ) : (
                          <p className="text-sm text-gray-600 flex-1">Esperando reseña del inquilino para finalizar</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Finished Contracts Tab */}
          <TabsContent value="finished-contracts" className="space-y-4">
            {finishedContracts.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-gray-900 mb-2">No hay contratos finalizados</h2>
                <p className="text-gray-600">Los contratos de alquiler finalizados aparecerán aquí</p>
              </div>
            ) : (
              finishedContracts.map((contract) => (
                <Card key={contract.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                      <ImageWithFallback src={contract.propertyImage} alt={contract.property} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-2">{contract.property}</h3>
                          <p className="text-gray-600 text-sm mb-3">{contract.propertyAddress}</p>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                              <ImageWithFallback src={contract.tenant.avatar} alt={contract.tenant.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{contract.tenant.name}</p>
                              <p className="text-xs text-gray-500">{contract.tenant.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {contract.ownerRating && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-500">Tu reseña</span>
                              <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full">
                                <Star className="h-4 w-4 fill-purple-600 text-purple-600" />
                                <span className="text-sm text-purple-900">{contract.ownerRating}</span>
                              </div>
                            </div>
                          )}
                          {contract.tenantRating && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-500">Reseña inquilino</span>
                              <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                                <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                                <span className="text-sm text-blue-900">{contract.tenantRating}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 text-xs">Inicio de contrato</p>
                            <p className="text-gray-900">{new Date(contract.startDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 text-xs">Fin de contrato</p>
                            <p className="text-gray-900">{new Date(contract.endDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-gray-500 text-xs">Alquiler mensual</p>
                            <p className="text-gray-900">${contract.monthlyRent}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedContract(contract);
                            setDetailsOpen(true);
                          }}
                        >
                          Ver detalles completos
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-4">
            {propertiesLoading && <p className="py-6 text-gray-600">Cargando tus propiedades...</p>}
            {propertiesError && <p role="alert" className="py-4 text-red-600">{propertiesError}</p>}
            {!propertiesLoading && !propertiesError && myProperties.length === 0 && (
              <div className="text-center py-10"><p className="mb-4">Todavía no publicaste propiedades.</p><Link to="/host/add-property"><Button>Publicar mi primera propiedad</Button></Link></div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 relative">
                    <ImageWithFallback src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-3 right-3 ${property.status === 'Alquilado' ? 'bg-green-600' : 'bg-blue-600'}`}>{property.status}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.location}</p>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Habitaciones</p>
                        <p className="text-gray-900">{property.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Baños</p>
                        <p className="text-gray-900">{property.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Alquiler</p>
                        <p className="text-gray-900">${property.monthlyRent}</p>
                      </div>
                    </div>

                    {property.currentTenant && (
                      <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">Inquilino actual</p>
                        <p className="text-sm text-gray-900">{property.currentTenant}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link to={`/property/${property.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full"><Eye className="h-4 w-4 mr-2" />Ver</Button></Link>
                      <Link to={`/host/edit-property/${property.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full"><Edit className="h-4 w-4 mr-2" />Editar</Button></Link>
                      <Button variant="outline" size="sm" onClick={() => void deleteProperty(property.id)} aria-label={`Eliminar ${property.title}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dejar reseña del inquilino</DialogTitle>
            <DialogDescription>Comparte tu experiencia con {selectedContract?.tenant.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Calificación general</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewRating(rating)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${rating <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{reviewRating} de 5</span>
              </div>
            </div>

            <Separator />

            {/* Specific Questions */}
            <div className="space-y-4">
              <h3 className="text-gray-900 text-sm">Preguntas específicas</h3>

              <div className="space-y-2">
                <Label>¿Los pagos fueron puntuales?</Label>
                <RadioGroup value={timelyPayments} onValueChange={setTimelyPayments}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="payments-yes" />
                    <Label htmlFor="payments-yes" className="cursor-pointer">
                      Sí, siempre a tiempo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sometimes" id="payments-sometimes" />
                    <Label htmlFor="payments-sometimes" className="cursor-pointer">
                      A veces con retrasos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="payments-no" />
                    <Label htmlFor="payments-no" className="cursor-pointer">
                      Frecuentemente retrasados
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>¿En qué estado dejó la propiedad?</Label>
                <RadioGroup value={propertyCondition} onValueChange={setPropertyCondition}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="condition-excellent" />
                    <Label htmlFor="condition-excellent" className="cursor-pointer">
                      Excelente estado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="condition-good" />
                    <Label htmlFor="condition-good" className="cursor-pointer">
                      Buen estado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="condition-fair" />
                    <Label htmlFor="condition-fair" className="cursor-pointer">
                      Estado regular
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="condition-poor" />
                    <Label htmlFor="condition-poor" className="cursor-pointer">
                      Mal estado
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>¿Tuvo mascotas?</Label>
                <RadioGroup value={hasPet} onValueChange={setHasPet}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="pet-no" />
                    <Label htmlFor="pet-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="pet-yes" />
                    <Label htmlFor="pet-yes" className="cursor-pointer">
                      Sí
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {hasPet === 'yes' && (
                <div className="space-y-2">
                  <Label>¿Cómo fue el comportamiento de la mascota?</Label>
                  <RadioGroup value={petBehavior} onValueChange={setPetBehavior}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="pet-excellent" />
                      <Label htmlFor="pet-excellent" className="cursor-pointer">
                        Excelente, sin daños
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="pet-good" />
                      <Label htmlFor="pet-good" className="cursor-pointer">
                        Bueno, daños menores
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="pet-fair" />
                      <Label htmlFor="pet-fair" className="cursor-pointer">
                        Regular, algunos daños
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="pet-poor" />
                      <Label htmlFor="pet-poor" className="cursor-pointer">
                        Mal, daños significativos
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            <Separator />

            {/* Comment */}
            <div className="space-y-2">
              <Label>Comentario (opcional)</Label>
              <Textarea
                placeholder="Comparte más detalles sobre tu experiencia con este inquilino..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setReviewOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmitTenantReview} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Enviar reseña
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del contrato finalizado</DialogTitle>
            <DialogDescription>
              {selectedContract?.property} - Contrato del {selectedContract?.startDate && new Date(selectedContract.startDate).toLocaleDateString('es-ES')} al {selectedContract?.endDate && new Date(selectedContract.endDate).toLocaleDateString('es-ES')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Property Summary */}
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                  <ImageWithFallback
                    src={selectedContract?.propertyImage}
                    alt={selectedContract?.property}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="text-gray-900 mb-1">{selectedContract?.property}</h3>
                  <p className="text-gray-600 text-sm mb-2">{selectedContract?.propertyAddress}</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Inquilino:</span>
                      <span className="text-gray-900 ml-1">{selectedContract?.tenant.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-gray-900">Reseñas</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Review */}
                <Card className="p-4 bg-purple-50/50 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <Home className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm">Tu reseña al inquilino</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-purple-500 text-purple-500" />
                      <span className="text-sm">{selectedContract?.ownerRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedContract?.ownerReviewComment}
                  </p>
                </Card>

                {/* Tenant Review */}
                <Card className="p-4 bg-blue-50/50 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm">Reseña del inquilino</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                      <span className="text-sm">{selectedContract?.tenantRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedContract?.tenantReviewComment}
                  </p>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Chat History */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="text-gray-900">Historial de conversación</h3>
              </div>
              
              <Card className="p-4 max-h-64 overflow-y-auto">
                {selectedContract?.chatHistory && selectedContract.chatHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedContract.chatHistory.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.sender === 'owner' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === 'owner'
                              ? 'bg-purple-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          {msg.sender === 'owner' ? (
                            <Home className="h-4 w-4 text-white" />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-[70%] ${
                            msg.sender === 'owner' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.sender === 'owner'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1">
                            {new Date(msg.timestamp).toLocaleString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay mensajes en el historial</p>
                )}
              </Card>
            </div>

            <Separator />

            {/* Documents */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-gray-900">Documentos del contrato</h3>
              </div>

              {selectedContract?.documents && selectedContract.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedContract.documents.map((doc: any) => (
                    <Card key={doc.id} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{doc.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                              <Badge 
                                variant="secondary" 
                                className={doc.uploadedBy === 'Inquilino' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}
                              >
                                {doc.uploadedBy}
                              </Badge>
                              <span>•</span>
                              <span>{new Date(doc.uploadDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toast.success('Descargando documento...')}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8">
                  <p className="text-gray-500 text-center">No hay documentos disponibles</p>
                </Card>
              )}
            </div>

            {/* Close button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedContract(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
