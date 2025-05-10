
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, PlusCircle, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const initialShippingZones = [
  { id: 'ZONE001', name: 'Colonia Centro', cost: 50.00 },
  { id: 'ZONE002', name: 'Colonia Roma Norte', cost: 65.00 },
  { id: 'ZONE003', name: 'Colonia Condesa', cost: 60.00 },
];

const ShippingZoneModal = ({ isOpen, onClose, onSave, zone }) => {
  const [formData, setFormData] = useState({ name: '', cost: 0 });

  useEffect(() => {
    if (zone) {
      setFormData({ name: zone.name, cost: zone.cost });
    } else {
      setFormData({ name: '', cost: 0 });
    }
  }, [zone]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.cost < 0) {
      alert("Por favor, complete el nombre de la colonia y un costo válido.");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="gradient-bg rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-transparent border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">{zone ? 'Editar Colonia' : 'Nueva Colonia'}</CardTitle>
            <CardDescription className="text-white/80">
              {zone ? `Actualiza los detalles de ${zone.name}.` : 'Añade una nueva colonia y su costo de envío.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white/90">Nombre de la Colonia</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 bg-white/20 placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <div>
                <Label htmlFor="cost" className="text-white/90">Costo de Envío (MXN$)</Label>
                <Input id="cost" name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} required min="0" className="mt-1 bg-white/20 placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <CardFooter className="flex justify-end space-x-3 p-0 pt-6">
                <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">Cancelar</Button>
                <Button type="submit" className="bg-white text-primary hover:bg-white/90 shadow-lg hover-scale">{zone ? 'Guardar Cambios' : 'Crear Colonia'}</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const ShippingCostManagementPage = () => {
  const [shippingZones, setShippingZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [zoneToDelete, setZoneToDelete] = useState(null);

  useEffect(() => {
    const storedZones = localStorage.getItem('shippingZones');
    if (storedZones) {
      setShippingZones(JSON.parse(storedZones));
    } else {
      setShippingZones(initialShippingZones);
      localStorage.setItem('shippingZones', JSON.stringify(initialShippingZones));
    }
  }, []);

  const updateLocalStorage = useCallback((updatedZones) => {
    localStorage.setItem('shippingZones', JSON.stringify(updatedZones));
  }, []);

  const handleSaveZone = (zoneData) => {
    let updatedZones;
    if (currentZone) {
      updatedZones = shippingZones.map(z => z.id === currentZone.id ? { ...z, ...zoneData } : z);
      toast({ title: "Colonia Actualizada", description: `${zoneData.name} ha sido actualizada.` });
    } else {
      const newZone = { ...zoneData, id: `ZONE${String(Date.now()).slice(-3)}${String(shippingZones.length + 1).padStart(3, '0')}` };
      updatedZones = [...shippingZones, newZone];
      toast({ title: "Colonia Creada", description: `${newZone.name} ha sido añadida.` });
    }
    setShippingZones(updatedZones);
    updateLocalStorage(updatedZones);
    closeModal();
  };
  
  const confirmDeleteZone = (zoneId) => {
    const zone = shippingZones.find(z => z.id === zoneId);
    setZoneToDelete(zone);
  };

  const executeDeleteZone = () => {
    if (zoneToDelete) {
      const updatedZones = shippingZones.filter(z => z.id !== zoneToDelete.id);
      setShippingZones(updatedZones);
      updateLocalStorage(updatedZones);
      toast({ title: "Colonia Eliminada", description: `${zoneToDelete.name} ha sido eliminada.`, variant: "destructive" });
    }
    setZoneToDelete(null);
  };

  const openModal = (zone = null) => {
    setCurrentZone(zone);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentZone(null);
  };

  const filteredZones = useMemo(() => {
    return shippingZones.filter(zone =>
      zone.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [shippingZones, searchTerm]);

  return (
    <AlertDialog>
      <div className="text-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 p-6 glass-card rounded-xl shadow-2xl flex justify-between items-center"
        >
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar colonia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 focus:bg-white text-gray-800"
            />
          </div>
          <Button onClick={() => openModal()} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-scale">
            <PlusCircle className="mr-2 h-5 w-5" /> Nueva Colonia
          </Button>
        </motion.div>

        <motion.div
          layout
          className="overflow-hidden rounded-xl glass-card shadow-2xl"
        >
          <Table>
            <TableHeader className="bg-white/30">
              <TableRow>
                <TableHead className="text-white font-semibold"><MapPin className="inline-block mr-1 h-4 w-4" />Nombre de la Colonia</TableHead>
                <TableHead className="text-white font-semibold text-right"><DollarSign className="inline-block mr-1 h-4 w-4" />Costo de Envío</TableHead>
                <TableHead className="text-white font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredZones.length > 0 ? (
                  filteredZones.map((zone) => (
                    <motion.tr
                      key={zone.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover-scale border-b border-white/10 last:border-b-0"
                    >
                      <TableCell className="font-medium text-white">{zone.name}</TableCell>
                      <TableCell className="text-right text-white">MXN${zone.cost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-100 mr-2" onClick={() => openModal(zone)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-200" onClick={() => confirmDeleteZone(zone.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-white/80 py-10">
                      No se encontraron colonias.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <ShippingZoneModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveZone}
              zone={currentZone}
            />
          )}
        </AnimatePresence>
      </div>
      {zoneToDelete && (
         <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que quieres eliminar la colonia {zoneToDelete.name}? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setZoneToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={executeDeleteZone}>Eliminar Colonia</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default ShippingCostManagementPage;
