
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, PlusCircle, Edit, Trash2, ShieldCheck, UserCog, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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


const initialUsers = [
  { id: 'USER001', name: 'Admin User', email: 'admin@carnesrh.com', role: 'admin', enabled: true },
  { id: 'USER002', name: 'Empleado Uno', email: 'empleado1@carnesrh.com', role: 'employee', enabled: true },
  { id: 'USER003', name: 'Empleado Dos', email: 'empleado2@carnesrh.com', role: 'employee', enabled: false },
];

const UserRoles = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};

const UserModal = ({ isOpen, onClose, onSave, user, currentUserRole }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', role: UserRoles.EMPLOYEE, password: '', enabled: true
  });

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: '' }); 
    } else {
      setFormData({ name: '', email: '', role: UserRoles.EMPLOYEE, password: '', enabled: true });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleEnabledChange = (checked) => {
    setFormData(prev => ({ ...prev, enabled: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!user && !formData.password)) {
      alert("Por favor, complete todos los campos obligatorios. La contraseña es requerida para nuevos usuarios.");
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
        className="gradient-bg rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-transparent border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</CardTitle>
            <CardDescription className="text-white/80">
              {user ? `Actualiza los detalles de ${user.name}.` : 'Añade un nuevo usuario al sistema.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white/90">Nombre Completo</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 bg-white/20 placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white/90">Correo Electrónico</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1 bg-white/20 placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <Label htmlFor="password">{user ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required={!user} className="mt-1 bg-white/20 placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select name="role" value={formData.role} onValueChange={handleRoleChange} disabled={currentUserRole !== UserRoles.ADMIN && user?.role === UserRoles.ADMIN}>
                    <SelectTrigger id="role" className="mt-1 w-full bg-white/20 text-white border-white/30 focus:bg-white/30 focus:border-white [&>span]:text-white">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {Object.values(UserRoles).map(role => (
                        <SelectItem key={role} value={role} className="hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-primary">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div className="flex items-center space-x-2 pt-2">
                  <Switch id="enabled" checked={formData.enabled} onCheckedChange={handleEnabledChange} disabled={currentUserRole !== UserRoles.ADMIN && user?.id === 'USER001'} />
                  <Label htmlFor="enabled" className="text-white/90">Habilitado</Label>
                </div>
              <CardFooter className="flex justify-end space-x-3 p-0 pt-6">
                <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">Cancelar</Button>
                <Button type="submit" className="bg-white text-primary hover:bg-white/90 shadow-lg hover-scale" disabled={currentUserRole !== UserRoles.ADMIN && user?.role === UserRoles.ADMIN && user?.id !== 'USER001' && user?.id === formData.id}>
                  {user ? 'Guardar Cambios' : 'Crear Usuario'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = useState(null);
  
  const currentUserRole = UserRoles.ADMIN; 

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const updateLocalStorage = useCallback((updatedUsers) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }, []);

  const handleSaveUser = (userData) => {
    let updatedUsers;
    if (currentUserToEdit) {
      updatedUsers = users.map(u => u.id === currentUserToEdit.id ? { ...u, ...userData, password: userData.password || u.password } : u);
      toast({ title: "Usuario Actualizado", description: `${userData.name} ha sido actualizado.` });
    } else {
      const newUser = { ...userData, id: `USER${String(Date.now()).slice(-3)}${String(users.length + 1).padStart(3, '0')}` };
      updatedUsers = [...users, newUser];
      toast({ title: "Usuario Creado", description: `${newUser.name} ha sido añadido.` });
    }
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    closeModal();
  };

  const confirmDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user && user.role === UserRoles.ADMIN && currentUserRole !== UserRoles.ADMIN) {
        toast({ title: "Acción no permitida", description: "No puedes eliminar a un administrador.", variant: "destructive"});
        return;
    }
    setUserToDelete(user);
  };

  const executeDeleteUser = () => {
    if (userToDelete) {
      if (userToDelete.id === 'USER001' && currentUserRole === UserRoles.ADMIN) { 
        toast({ title: "Acción no permitida", description: "El administrador principal no puede ser eliminado.", variant: "destructive"});
        setUserToDelete(null);
        return;
      }
      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      updateLocalStorage(updatedUsers);
      toast({ title: "Usuario Eliminado", description: `${userToDelete.name} ha sido eliminado.`, variant: "destructive" });
    }
    setUserToDelete(null);
  };

  const openModal = (user = null) => {
    setCurrentUserToEdit(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUserToEdit(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [users, searchTerm]);

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
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 focus:bg-white text-gray-800"
            />
          </div>
          {currentUserRole === UserRoles.ADMIN && (
            <Button onClick={() => openModal()} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-scale">
              <PlusCircle className="mr-2 h-5 w-5" /> Nuevo Usuario
            </Button>
          )}
        </motion.div>

        <motion.div
          layout
          className="overflow-hidden rounded-xl glass-card shadow-2xl"
        >
          <Table>
            <TableHeader className="bg-white/30">
              <TableRow>
                <TableHead className="text-white font-semibold">Nombre</TableHead>
                <TableHead className="text-white font-semibold">Correo</TableHead>
                <TableHead className="text-white font-semibold text-center">Rol</TableHead>
                <TableHead className="text-white font-semibold text-center">Estado</TableHead>
                <TableHead className="text-white font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover-scale border-b border-white/10 last:border-b-0"
                    >
                      <TableCell className="font-medium text-white">{user.name}</TableCell>
                      <TableCell className="text-white">{user.email}</TableCell>
                      <TableCell className="text-center text-white">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === UserRoles.ADMIN ? 'bg-sky-500/30 text-sky-300' : 'bg-teal-500/30 text-teal-300'}`}>
                          {user.role === UserRoles.ADMIN ? <ShieldCheck className="inline-block mr-1 h-4 w-4"/> : <UserCog className="inline-block mr-1 h-4 w-4"/>}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-white">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.enabled ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                          {user.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {currentUserRole === UserRoles.ADMIN || user.id === 'USER001' ? (
                          <>
                            <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-100 mr-2" onClick={() => openModal(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.id !== 'USER001' && currentUserRole === UserRoles.ADMIN && ( 
                               <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-200" onClick={() => confirmDeleteUser(user.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            )}
                          </>
                        ) : (
                           <span className="text-xs text-gray-400 italic">Sin acciones</span>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-white/80 py-10">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <UserModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveUser}
              user={currentUserToEdit}
              currentUserRole={currentUserRole}
            />
          )}
        </AnimatePresence>
      </div>
      {userToDelete && (
         <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que quieres eliminar al usuario {userToDelete.name}? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={executeDeleteUser}>Eliminar Usuario</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default UserManagementPage;
