
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Package,
  History,
  Users,
  Settings,
  LogOut,
  Sun,
  CloudRain,
  Menu,
  X,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Productos', path: '/products', icon: Package },
  { name: 'Historial de Pedidos', path: '/order-history', icon: History },
  { name: 'Configuración', path: '/settings', icon: Settings },
];

const Layout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRaining, setIsRaining] = useState(() => {
    const storedRaining = localStorage.getItem('isRaining');
    return storedRaining ? JSON.parse(storedRaining) : false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('isRaining', JSON.stringify(isRaining));
    toast({
      title: "Estado del clima actualizado",
      description: isRaining ? "Ahora está lloviendo." : "Ha dejado de llover.",
    });
  }, [isRaining, toast]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-center p-6 border-b border-slate-700">
        <ShoppingBag size={32} className="text-white mr-3" />
        <h1 className="text-2xl font-semibold text-white">CARNES RH</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out
              ${isActive
                ? 'bg-primary text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  );


  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-800 shadow-xl md:hidden"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:bg-slate-800 md:shadow-lg">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 shadow-md bg-slate-800/50 backdrop-blur-md">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2 text-white" onClick={toggleSidebar}>
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            <h2 className="text-xl font-semibold text-white">Panel de Administración</h2>
          </div>
          <div className="flex items-center space-x-3">
            {isRaining ? <CloudRain size={20} className="text-blue-400" /> : <Sun size={20} className="text-yellow-400" />}
            <Label htmlFor="raining-switch" className="text-sm text-slate-300">
              ¿Está lloviendo?
            </Label>
            <Switch
              id="raining-switch"
              checked={isRaining}
              onCheckedChange={setIsRaining}
              aria-label="Estado de lluvia"
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 gradient-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
