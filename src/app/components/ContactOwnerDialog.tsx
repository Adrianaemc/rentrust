import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { Property } from '../types';
import { MapPin } from 'lucide-react';

interface ContactOwnerDialogProps {
  property: Property;
  trigger?: React.ReactNode;
}

export function ContactOwnerDialog({ property, trigger }: ContactOwnerDialogProps) {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Por favor escribe un mensaje');
      return;
    }

    // Aquí iría la lógica para enviar el mensaje al backend
    // Por ahora simulamos el envío exitoso
    toast.success('¡Propuesta enviada! El propietario recibirá tu mensaje y se pondrá en contacto contigo.');
    setMessage('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            Contactar propietario
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>¿Quieres alquilar esta propiedad?</DialogTitle>
            <DialogDescription>
              Envía un mensaje al propietario para consultar disponibilidad y coordinar una visita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Información de la propiedad */}
            <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{property.title}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{property.location.city}</span>
                </div>
                <p className="mt-1">
                  <span className="text-gray-900">${property.price}</span>
                  <span className="text-xs text-gray-600"> / mes</span>
                </p>
              </div>
            </div>

            {/* Información del propietario */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={property.host.avatar} alt={property.host.name} />
                <AvatarFallback>{property.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{property.host.name}</p>
                <p className="text-xs text-gray-600">Propietario</p>
              </div>
            </div>

            {/* Campo de mensaje */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Tu mensaje <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Ejemplo: Hola, estoy interesado/a en alquilar tu propiedad. Soy profesional/familia de [número] personas. Me gustaría coordinar una visita. Planeo mudarme aproximadamente en [mes/fecha]. Quedo atento/a a tu respuesta. Saludos."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                💡 Incluye: presentación personal, composición familiar y fecha aproximada de mudanza.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setMessage('');
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Enviar mensaje
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
