
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductModal = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: categories.length > 0 ? categories[0] : '',
    image_url: '',
    available: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || (categories.length > 0 ? categories[0] : ''),
        image_url: product.image_url || '',
        available: product.available !== undefined ? product.available : true,
        id: product.id
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories.length > 0 ? categories[0] : '',
        image_url: '',
        available: true,
      });
    }
  }, [product, categories, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, available: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || parseFloat(formData.price) <= 0) {
        alert("Por favor, complete el nombre y un precio válido (mayor que cero).");
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="gradient-bg rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-transparent border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">{product ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
            <CardDescription className="text-white/80">
              {product ? 'Actualiza los detalles del producto.' : 'Añade un nuevo producto al inventario.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white/90">Nombre del Producto</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <div>
                <Label htmlFor="description" className="text-white/90">Descripción</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-white/90">Precio (MXN)</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required min="0.01" className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white/90">Categoría</Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Res, Pollo, Cerdo" className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
                </div>
              </div>
              <div>
                <Label htmlFor="image_url" className="text-white/90">URL de la Imagen (Opcional)</Label>
                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="available" name="available" checked={formData.available} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="available" className="text-white/90">Disponible para la venta</Label>
              </div>
              <CardFooter className="flex justify-end space-x-3 p-0 pt-6">
                <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">Cancelar</Button>
                <Button type="submit" className="bg-white text-primary hover:bg-white/90 shadow-lg hover-scale">
                  {product ? 'Guardar Cambios' : 'Añadir Producto'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;
