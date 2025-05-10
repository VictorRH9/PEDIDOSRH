
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2, PackageSearch, PackagePlus, PackageX } from 'lucide-react';
import { AppContext } from '@/contexts/AppContext';
import ProductModal from '@/components/ProductModal';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const supabase = appContext?.supabase;
  const session = appContext?.session;
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!supabase || !session) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (error) {
      console.error('Error fetching products:', error);
      toast({ title: "Error", description: `No se pudieron cargar los productos: ${error.message}`, variant: "destructive" });
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  }, [supabase, session, toast]);

  useEffect(() => {
    if (supabase && session) {
      fetchProducts();
    } else if (!session && !isLoading && supabase) {
        toast({ title: "Sesión no encontrada", description: "Por favor, inicia sesión para ver los productos.", variant: "default" });
        setIsLoading(false);
    } else if (!supabase) {
        toast({ title: "Error de conexión", description: "No se pudo conectar con el servicio de datos.", variant: "destructive" });
        setIsLoading(false);
    }
  }, [supabase, session, fetchProducts, isLoading, toast]);

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete || !supabase) return;
    const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
    if (error) {
      toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
    } else {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast({ title: "Producto Eliminado", description: `El producto ${productToDelete.name} ha sido eliminado.` });
    }
    setProductToDelete(null);
  };

  const handleSaveProduct = async (productData) => {
    if (!supabase) return;
    const upsertData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        image_url: productData.image_url,
        available: productData.available,
        user_id: session?.user?.id 
    };

    let result;
    if (productData.id) { 
        result = await supabase.from('products').update(upsertData).eq('id', productData.id).select().single();
    } else { 
        result = await supabase.from('products').insert(upsertData).select().single();
    }
    
    const { data, error } = result;

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      if (productData.id) {
        setProducts(prev => prev.map(p => (p.id === data.id ? data : p)));
        toast({ title: "Producto Actualizado", description: `El producto ${data.name} ha sido actualizado.` });
      } else {
        setProducts(prev => [data, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
        toast({ title: "Producto Añadido", description: `El producto ${data.name} ha sido añadido.` });
      }
      setIsModalOpen(false);
      fetchProducts(); 
    }
  };
  
  const handleToggleAvailability = async (product) => {
    if (!supabase) return;
    const updatedAvailability = !product.available;
    const { data, error } = await supabase
      .from('products')
      .update({ available: updatedAvailability })
      .eq('id', product.id)
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: `No se pudo cambiar la disponibilidad de ${product.name}.`, variant: "destructive" });
    } else {
      setProducts(prev => prev.map(p => (p.id === data.id ? data : p)));
      toast({
        title: "Disponibilidad Actualizada",
        description: `${data.name} ahora está ${data.available ? 'disponible' : 'no disponible'}.`,
      });
    }
  };


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading && !products.length) {
    return (
      <div className="p-4 md:p-8 min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 space-y-6 min-h-[calc(100vh-theme(spacing.16))]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-white"
        >
          Gestión de Productos
        </motion.h1>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex gap-2"
        >
          <Input
            type="text"
            placeholder="Buscar productos o categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-white/10 text-white placeholder-white/50 border-white/20 focus:bg-white/20 focus:border-primary"
          />
          <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90 text-white">
            <PackagePlus className="mr-2 h-5 w-5" /> Nuevo Producto
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="glass-card-2 shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-white">{product.name}</CardTitle>
                      <Switch
                        checked={product.available}
                        onCheckedChange={() => handleToggleAvailability(product)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                      />
                    </div>
                    {product.category && <CardDescription className="text-primary-light font-semibold pt-1">{product.category}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {product.image_url ? (
                      <img  class="w-full h-40 object-cover rounded-md mb-3" alt={product.name} src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
                    ) : (
                      <div className="w-full h-40 bg-white/5 rounded-md mb-3 flex items-center justify-center">
                        <PackageX size={48} className="text-white/30" />
                      </div>
                    )}
                    <p className="text-white/80 text-sm mb-2 line-clamp-3">{product.description || "Sin descripción."}</p>
                    <p className="text-2xl font-bold text-primary">MXN${Number(product.price).toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 border-t border-white/10 pt-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)} className="text-sky-300 hover:text-sky-100">
                      <Edit size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)} className="text-red-400 hover:text-red-200">
                      <Trash2 size={18} />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <PackageSearch size={64} className="mx-auto text-white/50 mb-4" />
            <h3 className="text-xl font-semibold text-white">No se encontraron productos</h3>
            <p className="text-white/70 mt-1">
              {searchTerm ? "Intenta con otra búsqueda o revisa tus filtros." : (isLoading ? "Cargando productos..." : "Añade nuevos productos para comenzar.")}
            </p>
             {(!isLoading && products.length === 0 && !searchTerm) && (
                <Button onClick={handleAddProduct} className="mt-4 bg-primary hover:bg-primary/90 text-white">
                    <PackagePlus className="mr-2 h-5 w-5" /> Añadir Primer Producto
                </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={uniqueCategories}
      />

      {productToDelete && (
        <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/80">
                Esta acción eliminará permanentemente el producto "{productToDelete.name}". No podrás deshacer esto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setProductToDelete(null)} className="text-white border-white/50 hover:bg-white/10">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteProduct} className="bg-red-500 hover:bg-red-600">Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};

export default ProductsPage;
