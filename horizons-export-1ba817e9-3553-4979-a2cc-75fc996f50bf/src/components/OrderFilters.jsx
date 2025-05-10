
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter, Search } from 'lucide-react';
import { motion } from "framer-motion";

const OrderFilters = ({ searchTerm, onSearchTermChange, statusFilter, onStatusFilterChange, totalOrders, filteredOrdersCount, availableStatuses }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 p-6 glass-card rounded-xl shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cliente o ID..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 bg-white/80 focus:bg-white text-gray-800"
          />
        </div>
        <div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full bg-white/80 focus:bg-white text-gray-800">
              <ListFilter className="inline-block mr-2 h-5 w-5 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">Todos los Estados</SelectItem>
              {availableStatuses.map(status => (
                <SelectItem key={status} value={status} className="hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-primary">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         <p className="text-sm text-white/80 md:text-right md:self-center">
          Mostrando {filteredOrdersCount} de {totalOrders} pedidos.
        </p>
      </div>
    </motion.div>
  );
};

export default OrderFilters;
