
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentMethods } from "@/constants/order";

const SendOrderModal = ({ isOpen, onClose, onConfirm, order }) => {
  const [realTotal, setRealTotal] = useState(order?.total || 0);
  const [paidWith, setPaidWith] = useState(order?.total || 0);
  const [changeGiven, setChangeGiven] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(order?.paymentMethod || PaymentMethods.CASH);
  const [folioWeb, setFolioWeb] = useState(order?.folioWeb || '');
  const [deliveryManCarriesChange, setDeliveryManCarriesChange] = useState(order?.deliveryManCarriesChange || false);


  useEffect(() => {
    if (order) {
      setRealTotal(order.total);
      setPaidWith(order.total); 
      setPaymentMethod(order.paymentMethod || PaymentMethods.CASH);
      setFolioWeb(order.folioWeb || `WEB${order.id.slice(-4)}`); // Default folioWeb
      setDeliveryManCarriesChange(order.deliveryManCarriesChange || false);
    }
  }, [order]);

  useEffect(() => {
    const change = parseFloat(paidWith) - parseFloat(realTotal);
    setChangeGiven(change >= 0 ? change : 0);
  }, [realTotal, paidWith]);

  const handleConfirm = () => {
    if (parseFloat(paidWith) < parseFloat(realTotal)) {
      alert("La cantidad pagada no puede ser menor que el total real.");
      return;
    }
    onConfirm({
      realTotal: parseFloat(realTotal),
      paidWith: parseFloat(paidWith),
      changeGiven: parseFloat(changeGiven),
      paymentMethod: paymentMethod,
      folioWeb: folioWeb,
      deliveryManCarriesChange: changeGiven > 0 ? deliveryManCarriesChange : false, // Only relevant if there's change
    });
  };

  if (!isOpen || !order) return null;

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
            <CardTitle className="text-2xl">Confirmar Envío Pedido: {order.id}</CardTitle>
            <CardDescription className="text-white/80">
              Cliente: {order.customerName}. Total Parcial: MXN${order.total.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label htmlFor="folioWeb" className="text-white/90">Folio Web</Label>
                <Input
                    id="folioWeb"
                    type="text"
                    value={folioWeb}
                    onChange={(e) => setFolioWeb(e.target.value)}
                    className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white"
                    placeholder="Ej: WEB1234 o FacturaXYZ"
                />
            </div>
            <div>
              <Label htmlFor="paymentMethodSend" className="text-white/90">Forma de Pago Final</Label>
                <Select name="paymentMethodSend" value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethodSend" className="mt-1 w-full bg-white/20 text-white border-white/30 focus:bg-white/30 focus:border-white [&>span]:text-white">
                    <SelectValue placeholder="Seleccionar forma de pago" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                    {Object.values(PaymentMethods).map(method => (
                    <SelectItem key={method} value={method} className="hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-primary">
                        {method}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div>
              <Label htmlFor="realTotal" className="text-white/90">Total Real (MXN$)</Label>
              <Input
                id="realTotal"
                type="number"
                step="0.01"
                value={realTotal}
                onChange={(e) => setRealTotal(parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white"
              />
            </div>
            <div>
              <Label htmlFor="paidWith" className="text-white/90">Con Cuánto Paga (MXN$)</Label>
              <Input
                id="paidWith"
                type="number"
                step="0.01"
                value={paidWith}
                onChange={(e) => setPaidWith(parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white"
              />
            </div>
            <div>
              <Label className="text-white/90">Cambio a Entregar (MXN$)</Label>
              <p className="text-2xl font-bold text-green-400 mt-1">MXN${changeGiven.toFixed(2)}</p>
            </div>

            {changeGiven > 0 && (
                 <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="deliveryManCarriesChange"
                    checked={deliveryManCarriesChange}
                    onCheckedChange={setDeliveryManCarriesChange}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-600"
                  />
                  <Label htmlFor="deliveryManCarriesChange" className="text-white/90">¿Repartidor lleva cambio?</Label>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="bg-green-500 hover:bg-green-600 text-white shadow-lg hover-scale">
              Confirmar Envío y Pago
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SendOrderModal;
