import { useState } from 'react';
import { mockBookings } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, MessageSquare, Star, Home, FileText, Upload, Download, Trash2, FolderOpen, Send, User, ThumbsUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export function BookingsPage() {
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [timelyPayments, setTimelyPayments] = useState('yes');
  const [propertyCondition, setPropertyCondition] = useState('excellent');
  const [petBehavior, setPetBehavior] = useState('');
  const [hasPet, setHasPet] = useState('no');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Propietario',
      message: '¡Hola! Bienvenido a tu nuevo hogar. Si necesitas algo no dudes en contactarme.',
      timestamp: '2023-10-26 10:30',
      isOwner: true,
    },
    {
      id: 2,
      sender: 'Inquilino',
      message: 'Muchas gracias. Todo está perfecto.',
      timestamp: '2023-10-26 15:45',
      isOwner: false,
    },
    {
      id: 3,
      sender: 'Inquilino',
      message: 'Hola, quería consultarte sobre el ajuste del valor del alquiler para el próximo mes.',
      timestamp: '2025-10-20 09:15',
      isOwner: false,
    },
    {
      id: 4,
      sender: 'Propietario',
      message: 'Hola! Claro, podemos coordinar una reunión esta semana para revisarlo.',
      timestamp: '2025-10-20 11:30',
      isOwner: true,
    },
  ]);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Contrato de Alquiler.pdf',
      uploadedBy: 'Propietario',
      uploadDate: '2023-10-20',
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'Comprobante de Pago - Octubre 2025.pdf',
      uploadedBy: 'Inquilino',
      uploadDate: '2025-10-05',
      size: '345 KB',
    },
    {
      id: 3,
      name: 'Inventario de Propiedad.pdf',
      uploadedBy: 'Propietario',
      uploadDate: '2023-10-25',
      size: '1.8 MB',
    },
    {
      id: 4,
      name: 'Comprobante de Pago - Septiembre 2025.pdf',
      uploadedBy: 'Inquilino',
      uploadDate: '2025-09-05',
      size: '350 KB',
    },
  ]);

  // Contrato vigente: solo el apartamento moderno con contrato de 3 años
  const currentRental = {
    id: 'b1',
    property: mockBookings[0].property, // Apartamento moderno en el centro
    startDate: '2022-10-01',
    endDate: '2025-10-01',
    monthlyPrice: 350000, // Valor mensual actual
  };
  
  // Contratos pendientes de reseñas (contrato terminado pero falta reseña de alguna parte)
  const [pendingReviewRentals, setPendingReviewRentals] = useState([
    {
      id: 'rental-1',
      property: 'Apartamento en Palermo',
      address: 'Av. Santa Fe 3250, Buenos Aires, Argentina',
      startDate: '2019-08-01',
      endDate: '2022-08-01',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      tenantReviewSubmitted: false,
      ownerReviewSubmitted: false,
      ownerName: 'María González',
      tenantRating: null,
      monthlyPrice: 320000,
    },
  ]);

  // Historial de alquileres finalizados (ambas reseñas completadas)
  const [finishedRentals, setFinishedRentals] = useState([
    {
      id: 'rental-2',
      property: 'Estudio en Belgrano',
      address: 'Av. Cabildo 1850, Buenos Aires, Argentina',
      startDate: '2016-05-01',
      endDate: '2019-05-01',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: true,
      ownerName: 'Carlos Rodríguez',
      tenantRating: 4.8,
      ownerRating: 4.5,
      tenantReviewComment: 'Excelente propietario, siempre disponible para resolver cualquier problema. La comunicación fue muy fluida y profesional durante todo el contrato.',
      ownerReviewComment: 'Inquilino responsable y cuidadoso con la propiedad. Siempre cumplió con los pagos en tiempo y forma. Muy recomendable.',
      monthlyPrice: 310000,
      chatHistory: [
        {
          id: 1,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Hola Carlos, hay una gotera en el baño que necesita reparación.',
          timestamp: '2017-03-15T10:30:00',
        },
        {
          id: 2,
          sender: 'owner',
          senderName: 'Carlos Rodríguez',
          message: 'Hola, gracias por avisar. Enviaré al plomero mañana mismo.',
          timestamp: '2017-03-15T11:15:00',
        },
        {
          id: 3,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Perfecto, muchas gracias por la rapidez.',
          timestamp: '2017-03-15T11:30:00',
        },
        {
          id: 4,
          sender: 'owner',
          senderName: 'Carlos Rodríguez',
          message: 'El plomero ya terminó. ¿Todo bien?',
          timestamp: '2017-03-16T15:00:00',
        },
        {
          id: 5,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Sí, quedó perfecto. Gracias!',
          timestamp: '2017-03-16T16:00:00',
        },
      ],
      documents: [
        {
          id: 1,
          name: 'Contrato de Alquiler.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2016-05-01',
          size: '2.4 MB',
        },
        {
          id: 2,
          name: 'Inventario de Propiedad.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2016-05-01',
          size: '1.8 MB',
        },
        {
          id: 3,
          name: 'Comprobante Final - Abril 2019.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2019-04-05',
          size: '350 KB',
        },
      ],
    },
    {
      id: 'rental-3',
      property: 'Departamento con balcón en Recoleta',
      address: 'Av. Santa Fe 2156, Buenos Aires',
      startDate: '2013-02-01',
      endDate: '2016-02-01',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: true,
      ownerName: 'Laura Méndez',
      tenantRating: 5.0,
      ownerRating: 4.9,
      tenantReviewComment: 'Laura fue una propietaria ejemplar. Siempre atenta a cualquier necesidad y muy respetuosa con nuestra privacidad. El departamento estaba en excelentes condiciones.',
      ownerReviewComment: 'Inquilinos excepcionales. Cuidaron el departamento como si fuera propio y la comunicación fue excelente durante los 3 años. Altamente recomendados.',
      chatHistory: [
        {
          id: 1,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Hola Laura, se quemó una lámpara del living. ¿Tengo que cambiarla yo o la cambias vos?',
          timestamp: '2019-08-10T18:20:00',
        },
        {
          id: 2,
          sender: 'owner',
          senderName: 'Laura Méndez',
          message: 'Hola! Las lámparas corren por cuenta mía. Paso mañana con una nueva.',
          timestamp: '2019-08-10T19:00:00',
        },
        {
          id: 3,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Perfecto, muchas gracias!',
          timestamp: '2019-08-10T19:15:00',
        },
        {
          id: 4,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Laura, el aire acondicionado está haciendo ruido. ¿Podríamos que lo revisen?',
          timestamp: '2020-02-05T10:00:00',
        },
        {
          id: 5,
          sender: 'owner',
          senderName: 'Laura Méndez',
          message: 'Sí, claro. Coordino el service para esta semana.',
          timestamp: '2020-02-05T11:30:00',
        },
        {
          id: 6,
          sender: 'owner',
          senderName: 'Laura Méndez',
          message: 'El técnico puede ir el jueves a las 15hs. ¿Te viene bien?',
          timestamp: '2020-02-05T14:00:00',
        },
        {
          id: 7,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Perfecto, ahí estaré. Gracias!',
          timestamp: '2020-02-05T14:30:00',
        },
      ],
      documents: [
        {
          id: 1,
          name: 'Contrato 3 años - Recoleta.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2018-06-01',
          size: '3.1 MB',
        },
        {
          id: 2,
          name: 'Inventario y Estado Inicial.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2018-06-01',
          size: '2.2 MB',
        },
        {
          id: 3,
          name: 'Renovación de Garantía 2020.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2020-06-01',
          size: '1.5 MB',
        },
        {
          id: 4,
          name: 'Acta de Entrega Final.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2021-06-01',
          size: '950 KB',
        },
        {
          id: 5,
          name: 'Último Comprobante de Pago.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2021-05-05',
          size: '280 KB',
        },
      ],
    },
    {
      id: 'rental-4',
      property: 'Monoambiente en Villa Crespo',
      address: 'Av. Corrientes 5832, Buenos Aires',
      startDate: '2010-11-01',
      endDate: '2013-11-01',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      tenantReviewSubmitted: true,
      ownerReviewSubmitted: true,
      ownerName: 'Roberto Gómez',
      tenantRating: 4.2,
      ownerRating: 4.0,
      tenantReviewComment: 'Roberto fue un buen propietario en general. A veces tardaba un poco en responder pero siempre solucionó los problemas. El departamento cumplió con las expectativas.',
      ownerReviewComment: 'Buen inquilino. Cumplió con los pagos y cuidó la propiedad. Hubo algunos retrasos menores en los pagos pero siempre avisó con anticipación.',
      chatHistory: [
        {
          id: 1,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Hola Roberto, el termotanque no está funcionando bien.',
          timestamp: '2018-07-20T09:00:00',
        },
        {
          id: 2,
          sender: 'owner',
          senderName: 'Roberto Gómez',
          message: 'Hola, disculpa la demora. ¿Qué síntomas tiene?',
          timestamp: '2018-07-21T14:00:00',
        },
        {
          id: 3,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'No calienta el agua suficiente. Tarda mucho.',
          timestamp: '2018-07-21T15:00:00',
        },
        {
          id: 4,
          sender: 'owner',
          senderName: 'Roberto Gómez',
          message: 'Ok, mando al gasista la semana que viene.',
          timestamp: '2018-07-22T10:00:00',
        },
        {
          id: 5,
          sender: 'tenant',
          senderName: 'Tú',
          message: 'Roberto, este mes voy a pagar unos días tarde, hubo un problema con mi sueldo.',
          timestamp: '2019-04-02T12:00:00',
        },
        {
          id: 6,
          sender: 'owner',
          senderName: 'Roberto Gómez',
          message: 'No hay problema, avisame cuando puedas.',
          timestamp: '2019-04-02T18:00:00',
        },
      ],
      documents: [
        {
          id: 1,
          name: 'Contrato de Alquiler 2017.pdf',
          uploadedBy: 'Propietario',
          uploadDate: '2017-03-01',
          size: '2.1 MB',
        },
        {
          id: 2,
          name: 'Garantía Propietaria.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2017-03-01',
          size: '1.3 MB',
        },
        {
          id: 3,
          name: 'Comprobante Marzo 2020.pdf',
          uploadedBy: 'Inquilino',
          uploadDate: '2020-03-05',
          size: '310 KB',
        },
      ],
    },
  ]);
  
  const handleSubmitReview = () => {
    if (!selectedRental) return;
    
    // Update the rental with tenant's review
    const updatedRental = {
      ...selectedRental,
      tenantRating: reviewRating,
      tenantReviewSubmitted: true,
    };
    
    // Check if owner has also submitted their review
    if (updatedRental.ownerReviewSubmitted) {
      // Both reviews completed - move to finished rentals
      setPendingReviewRentals(pendingReviewRentals.filter(r => r.id !== selectedRental.id));
      setFinishedRentals([...finishedRentals, updatedRental]);
      toast.success('Reseña enviada. El contrato ha sido finalizado exitosamente');
    } else {
      // Only tenant review submitted - keep in pending
      setPendingReviewRentals(pendingReviewRentals.map(rental => 
        rental.id === selectedRental.id ? updatedRental : rental
      ));
      toast.success('Reseña enviada. Esperando reseña del propietario para finalizar el contrato');
    }
    
    setReviewOpen(false);
    
    // Reset form
    setReviewRating(5);
    setReviewComment('');
    setTimelyPayments('yes');
    setPropertyCondition('excellent');
    setPetBehavior('');
    setHasPet('no');
    setSelectedRental(null);
  };

  const CurrentRentalCard = ({ rental }: { rental: typeof currentRental }) => {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
            <ImageWithFallback
              src={rental.property.images[0]}
              alt={rental.property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Link
                  to={`/property/${rental.property.id}`}
                  className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 mb-2 inline-block"
                >
                  {rental.property.title}
                </Link>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {rental.property.location.city}, {rental.property.location.country}
                  </span>
                </div>
              </div>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Vigente
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Inicio de contrato</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(rental.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Fin de contrato</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(rental.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Valor mensual actual</p>
                <p className="text-gray-900 dark:text-gray-100 text-xl">${rental.monthlyPrice}</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contactar propietario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Chat con el Propietario</DialogTitle>
                      <DialogDescription>
                        {rental.property.title}
                      </DialogDescription>
                    </DialogHeader>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[400px] max-h-[500px]">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.isOwner ? 'justify-start' : 'justify-end'}`}
                        >
                          {msg.isOwner && (
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-purple-600" />
                              </div>
                            </div>
                          )}
                          <div className={`flex flex-col ${msg.isOwner ? 'items-start' : 'items-end'} max-w-[70%]`}>
                            <div className={`rounded-lg px-4 py-2 ${
                              msg.isOwner 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                                : 'bg-blue-600 text-white'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {msg.sender} • {new Date(msg.timestamp).toLocaleString('es-ES', { 
                                day: 'numeric', 
                                month: 'short', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          {!msg.isOwner && (
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
                                sender: 'Inquilino',
                                message: newMessage,
                                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                isOwner: false,
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
                                sender: 'Inquilino',
                                message: newMessage,
                                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                isOwner: false,
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
                <Dialog open={documentsOpen} onOpenChange={setDocumentsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
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
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const newDoc = {
                                      id: documents.length + 1,
                                      name: file.name,
                                      uploadedBy: 'Inquilino',
                                      uploadDate: new Date().toISOString().split('T')[0],
                                      size: `${(file.size / 1024).toFixed(0)} KB`,
                                    };
                                    setDocuments([newDoc, ...documents]);
                                    toast.success('Documento cargado exitosamente');
                                    e.target.value = '';
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
                        <h4 className="text-gray-900 mb-3">Documentos guardados ({documents.length})</h4>
                        {documents.map((doc, index) => (
                          <div key={doc.id}>
                            <Card className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <div className="flex-1">
                                    <p className="text-gray-900">{doc.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                      <span className="flex items-center gap-1">
                                        <Badge 
                                          variant="secondary" 
                                          className={doc.uploadedBy === 'Inquilino' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}
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
                                    onClick={() => {
                                      setDocuments(documents.filter(d => d.id !== doc.id));
                                      toast.success('Documento eliminado');
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                            {index < documents.length - 1 && <Separator className="my-2" />}
                          </div>
                        ))}
                        
                        {documents.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No hay documentos cargados aún</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const PendingReviewRentalCard = ({ rental }: { rental: typeof pendingReviewRentals[0] }) => {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-amber-200 bg-amber-50/30">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
            <ImageWithFallback
              src={rental.image}
              alt={rental.property}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <h3 className="text-gray-900">{rental.property}</h3>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{rental.address}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-gray-500 text-xs">Inicio de contrato</p>
                  <p className="text-gray-900">
                    {new Date(rental.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-gray-500 text-xs">Fin de contrato</p>
                  <p className="text-gray-900">
                    {new Date(rental.endDate).toLocaleDateString()}
                  </p>
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
                      {rental.tenantReviewSubmitted ? (
                        <Badge variant="default" className="bg-green-600">✓ Tu reseña enviada</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-200">⏳ Falta tu reseña</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {rental.ownerReviewSubmitted ? (
                        <Badge variant="default" className="bg-green-600">✓ Reseña del propietario enviada</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-200">⏳ Falta reseña del propietario</Badge>
                      )}
                    </div>
                  </div>
                  {!rental.tenantReviewSubmitted && (
                    <p className="text-xs text-amber-800 mt-2">
                      El contrato se finalizará cuando ambas partes completen sus reseñas
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex gap-2 pt-4 border-t">
              {!rental.tenantReviewSubmitted ? (
                <>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedRental(rental);
                      setReviewOpen(true);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Dejar reseña al propietario
                  </Button>
                </>
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-gray-600 text-center">
                    Esperando reseña del propietario para finalizar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const FinishedRentalCard = ({ rental }: { rental: typeof finishedRentals[0] }) => {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
            <ImageWithFallback
              src={rental.image}
              alt={rental.property}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <h3 className="text-gray-900">{rental.property}</h3>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{rental.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {rental.tenantRating && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">Tu reseña</span>
                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded">
                      <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                      <span className="text-sm">{rental.tenantRating}</span>
                    </div>
                  </div>
                )}
                {rental.ownerRating && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">Propietario</span>
                    <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded">
                      <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                      <span className="text-sm">{rental.ownerRating}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-gray-500 text-xs">Inicio de contrato</p>
                  <p className="text-gray-900">
                    {new Date(rental.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-gray-500 text-xs">Fin de contrato</p>
                  <p className="text-gray-900">
                    {new Date(rental.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setSelectedRental(rental);
                  setDetailsOpen(true);
                }}
              >
                Ver detalles completos
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-gray-900 dark:text-gray-100 mb-8">Mis Alquileres</h1>

        <Tabs defaultValue="vigente" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="vigente">
              Vigente (1)
            </TabsTrigger>
            <TabsTrigger value="pendiente">
              Pendiente de reseñas ({pendingReviewRentals.length})
            </TabsTrigger>
            <TabsTrigger value="finalizado">
              Finalizado ({finishedRentals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vigente" className="space-y-4">
            <CurrentRentalCard rental={currentRental} />
          </TabsContent>

          <TabsContent value="pendiente" className="space-y-4">
            {pendingReviewRentals.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-gray-900 mb-2">No hay contratos pendientes de reseñas</h2>
                <p className="text-gray-600">
                  Los contratos terminados aparecerán aquí hasta que ambas partes completen sus reseñas
                </p>
              </div>
            ) : (
              pendingReviewRentals.map((rental) => (
                <PendingReviewRentalCard key={rental.id} rental={rental} />
              ))
            )}
          </TabsContent>

          <TabsContent value="finalizado" className="space-y-4">
            {finishedRentals.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-gray-900 mb-2">No hay alquileres finalizados</h2>
                <p className="text-gray-600">
                  Tu historial de alquileres aparecerá aquí
                </p>
              </div>
            ) : (
              finishedRentals.map((rental) => (
                <FinishedRentalCard key={rental.id} rental={rental} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dejar reseña al propietario</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia de alquiler en {selectedRental?.property}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating */}
            <div>
              <Label className="text-gray-900 mb-2 block">Calificación general</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= reviewRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{reviewRating} estrellas</span>
              </div>
            </div>

            <Separator />

            {/* Tenant-specific questions for rating the landlord */}
            <div>
              <h4 className="text-gray-900 mb-4">Evaluación del propietario</h4>
              
              <div className="space-y-4">
                {/* Communication */}
                <div>
                  <Label className="text-gray-900 mb-2 block">
                    ¿Cómo fue la comunicación con el propietario?
                  </Label>
                  <RadioGroup value={propertyCondition} onValueChange={setPropertyCondition}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="comm-excellent" />
                      <Label htmlFor="comm-excellent">Excelente - Siempre disponible y respondía rápido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="comm-good" />
                      <Label htmlFor="comm-good">Buena - Respondía en tiempo razonable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="comm-fair" />
                      <Label htmlFor="comm-fair">Regular - A veces tardaba en responder</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="comm-poor" />
                      <Label htmlFor="comm-poor">Deficiente - Difícil de contactar</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Maintenance response */}
                <div>
                  <Label className="text-gray-900 mb-2 block">
                    ¿Cómo respondió a solicitudes de mantenimiento/reparaciones?
                  </Label>
                  <RadioGroup value={timelyPayments} onValueChange={setTimelyPayments}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="maint-excellent" />
                      <Label htmlFor="maint-excellent">Excelente - Atendió todo rápidamente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mostly" id="maint-good" />
                      <Label htmlFor="maint-good">Buena - Resolvió la mayoría de problemas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sometimes" id="maint-fair" />
                      <Label htmlFor="maint-fair">Regular - Tardó en resolver algunos problemas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="maint-poor" />
                      <Label htmlFor="maint-poor">Deficiente - No atendió solicitudes</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Professionalism */}
                <div>
                  <Label className="text-gray-900 mb-2 block">
                    ¿Respetó tu privacidad y términos del contrato?
                  </Label>
                  <RadioGroup value={hasPet} onValueChange={setHasPet}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="privacy-yes" />
                      <Label htmlFor="privacy-yes">Sí - Siempre profesional y respetuoso</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mostly" id="privacy-mostly" />
                      <Label htmlFor="privacy-mostly">En su mayoría - Algunas situaciones menores</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="privacy-no" />
                      <Label htmlFor="privacy-no">No - Hubo problemas de privacidad/contrato</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comment */}
            <div>
              <Label htmlFor="review-comment" className="text-gray-900 mb-2 block">
                Comentarios adicionales
              </Label>
              <Textarea
                id="review-comment"
                placeholder="Comparte detalles sobre tu experiencia con el propietario..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tu reseña ayudará a otros usuarios a tomar decisiones informadas
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setReviewOpen(false);
                  setSelectedRental(null);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="flex-1"
                disabled={!reviewComment.trim()}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Enviar reseña
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del contrato finalizado</DialogTitle>
            <DialogDescription>
              {selectedRental?.property} - Contrato del {selectedRental?.startDate && new Date(selectedRental.startDate).toLocaleDateString('es-ES')} al {selectedRental?.endDate && new Date(selectedRental.endDate).toLocaleDateString('es-ES')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Property Summary */}
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                  <ImageWithFallback
                    src={selectedRental?.image}
                    alt={selectedRental?.property}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="text-gray-900 mb-1">{selectedRental?.property}</h3>
                  <p className="text-gray-600 text-sm mb-2">{selectedRental?.address}</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Propietario:</span>
                      <span className="text-gray-900 ml-1">{selectedRental?.ownerName}</span>
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
                {/* Tenant Review */}
                <Card className="p-4 bg-blue-50/50 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm">Tu reseña al propietario</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                      <span className="text-sm">{selectedRental?.tenantRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedRental?.tenantReviewComment}
                  </p>
                </Card>

                {/* Owner Review */}
                <Card className="p-4 bg-purple-50/50 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <Home className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm">Reseña del propietario</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-purple-500 text-purple-500" />
                      <span className="text-sm">{selectedRental?.ownerRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedRental?.ownerReviewComment}
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
                {selectedRental?.chatHistory && selectedRental.chatHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRental.chatHistory.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.sender === 'tenant' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === 'tenant'
                              ? 'bg-blue-600'
                              : 'bg-purple-600'
                          }`}
                        >
                          {msg.sender === 'tenant' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Home className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-[70%] ${
                            msg.sender === 'tenant' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.sender === 'tenant'
                                ? 'bg-blue-600 text-white'
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

              {selectedRental?.documents && selectedRental.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedRental.documents.map((doc: any) => (
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
                        <Button variant="ghost" size="sm">
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
                  setSelectedRental(null);
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
