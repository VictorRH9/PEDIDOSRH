
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from '@/contexts/AppContext';
import { PlusCircle, Trash2, Edit, MapPin, Users, Sun } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeliveryZoneModal = ({ isOpen, onClose, onSave, zone }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    if (zone) {
      setName(zone.name || '');
      setCost(zone.cost || '');
    } else {
      setName('');
      setCost('');
    }
  }, [zone, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || cost === '' || parseFloat(cost) < 0) {
      alert("Por favor, complete el nombre y un costo válido para la zona.");
      return;
    }
    onSave({ ...zone, name, cost: parseFloat(cost) });
    onClose();
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="gradient-bg rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-transparent border-0 text-white">
          <CardHeader>
            <CardTitle>{zone ? 'Editar Zona de Envío' : 'Nueva Zona de Envío'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="zoneName" className="text-white/90">Nombre de la Colonia</Label>
                <Input id="zoneName" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <div>
                <Label htmlFor="zoneCost" className="text-white/90">Costo de Envío (MXN)</Label>
                <Input id="zoneCost" type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required min="0" className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">Cancelar</Button>
                <Button type="submit" className="bg-white text-primary hover:bg-white/90 shadow-lg">Guardar Zona</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const RainStatusSetting = ({ isRainActive, onToggleRain }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
    <Card className="glass-card-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center"><Sun className="mr-2 text-yellow-400" /> Estado de Lluvia</CardTitle>
        <CardDescription className="text-white/70">Indica si está lloviendo para ajustar costos de envío o notificaciones.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-3 py-6">
        <Switch
          id="rain-status"
          checked={isRainActive}
          onCheckedChange={onToggleRain}
          className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-gray-600"
        />
        <Label htmlFor="rain-status" className="text-lg text-white">
          {isRainActive ? "Está Lloviendo" : "No está Lloviendo"}
        </Label>
      </CardContent>
    </Card>
  </motion.div>
);

const DeliveryZonesSetting = ({ deliveryZones, onAddZone, onEditZone, onDeleteZone }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
    <Card className="glass-card-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center"><MapPin className="mr-2 text-green-400" /> Costos de Envío por Colonia</CardTitle>
        <CardDescription className="text-white/70">Gestiona las colonias y sus respectivos costos de envío.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 py-6">
        <Button onClick={onAddZone} className="w-full bg-primary hover:bg-primary/90 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Añadir Nueva Zona
        </Button>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {deliveryZones && deliveryZones.length > 0 ? deliveryZones.map(zone => (
            <div key={zone.id || zone.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold text-white">{zone.name}</p>
                <p className="text-sm text-primary-light">MXN${Number(zone.cost).toFixed(2)}</p>
              </div>
              <div className="space-x-1">
                <Button variant="ghost" size="icon" onClick={() => onEditZone(zone)} className="text-sky-300 hover:text-sky-100 h-8 w-8">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteZone(zone)} className="text-red-400 hover:text-red-200 h-8 w-8">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          )) : <p className="text-center text-white/60 py-4">No hay zonas de envío configuradas.</p>}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const UsersSetting = ({ users }) => (
   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="lg:col-span-2">
    <Card className="glass-card-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center"><Users className="mr-2 text-purple-400" /> Gestión de Usuarios (Simplificado)</CardTitle>
        <CardDescription className="text-white/70">Visualiza los usuarios registrados en el sistema.</CardDescription>
      </CardHeader>
      <CardContent className="py-6">
         <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {users && users.length > 0 ? users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold text-white">{user.email}</p>
                <p className="text-sm text-purple-300">Rol: {user.role || 'usuario'}</p>
              </div>
            </div>
          )) : <p className="text-center text-white/60 py-4">No hay usuarios para mostrar o no se pudieron cargar.</p>}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);


const SettingsPage = () => {
  const { isRainActive, setIsRainActive, deliveryZones, setDeliveryZones, supabase, session } = useContext(AppContext);
  const { toast } = useToast();

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    if (!supabase || !session?.user) return;
    if (session.user) {
       setUsers([{id: session.user.id, email: session.user.email, role: session.user.role || 'usuario'}]);
    }
  }, [supabase, session]);

  useEffect(() => {
     fetchUsers();
  }, [fetchUsers]);

  const handleToggleRain = (checked) => {
    setIsRainActive(checked);
    toast({
      title: "Estado de Lluvia Actualizado",
      description: `Ahora está ${checked ? 'lloviendo' : 'sin lluvia'}.`,
    });
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setIsZoneModalOpen(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleDeleteZoneConfirmation = (zone) => {
     setZoneToDelete(zone);
  };

  const confirmDeleteZone = async () => {
    if (!zoneToDelete || !supabase) return;
    const { error } = await supabase.from('delivery_zones').delete().eq('id', zoneToDelete.id);
    if (error) {
        toast({title: "Error", description: `No se pudo eliminar la zona ${zoneToDelete.name}. ${error.message}`, variant: "destructive"});
    } else {
        setDeliveryZones(prev => prev.filter(z => z.id !== zoneToDelete.id));
        toast({title: "Zona Eliminada", description: `La zona ${zoneToDelete.name} ha sido eliminada.`});
    }
    setZoneToDelete(null);
  };

  const handleSaveZone = async (zoneData) => {
    if (!supabase) return;
    const upsertData = { name: zoneData.name, cost: zoneData.cost };
    let result;

    if (zoneData.id) {
      result = await supabase.from('delivery_zones').update(upsertData).eq('id', zoneData.id).select().single();
    } else {
      result = await supabase.from('delivery_zones').insert(upsertData).select().single();
    }
    
    const { data, error } = result;

    if (error) {
      toast({ title: "Error al guardar zona", description: error.message, variant: "destructive" });
    } else {
      if (zoneData.id) {
        setDeliveryZones(prev => prev.map(z => (z.id === data.id ? data : z)));
        toast({ title: "Zona Actualizada", description: `La zona ${data.name} ha sido actualizada.` });
      } else {
        setDeliveryZones(prev => [...(prev || []), data]);
        toast({ title: "Zona Añadida", description: `La zona ${data.name} ha sido añadida.` });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 space-y-8 min-h-[calc(100vh-theme(spacing.16))]"
    >
      <motion.h1 
         initial={{ x: -20, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         transition={{ delay: 0.1, duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-white mb-8"
      >
        Configuración General
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RainStatusSetting isRainActive={isRainActive} onToggleRain={handleToggleRain} />
        <DeliveryZonesSetting 
            deliveryZones={deliveryZones || []} 
            onAddZone={handleAddZone} 
            onEditZone={handleEditZone} 
            onDeleteZone={handleDeleteZoneConfirmation} 
        />
        <UsersSetting users={users || []} />
      </div>

      <DeliveryZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        onSave={handleSaveZone}
        zone={editingZone}
      />
      {zoneToDelete && (
        <AlertDialog open={!!zoneToDelete} onOpenChange={() => setZoneToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">¿Confirmar Eliminación?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/80">
                ¿Estás seguro de que quieres eliminar la zona de envío "{zoneToDelete.name}"? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setZoneToDelete(null)} className="text-white border-white/50 hover:bg-white/10">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteZone} className="bg-red-500 hover:bg-red-600">Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};

export default SettingsPage;
