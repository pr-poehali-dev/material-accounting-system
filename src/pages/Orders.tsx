import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Order {
  id: number;
  materialId: number;
  materialName: string;
  quantity: number;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp: Date;
  isAuto: boolean;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, materialId: 1, materialName: 'Гайка М8', quantity: 1000, customer: 'ООО "Монтаж"', amount: 2500, status: 'completed', timestamp: new Date('2025-10-28'), isAuto: false },
    { id: 2, materialId: 2, materialName: 'Болт М10', quantity: 500, customer: 'ИП Петров', amount: 2500, status: 'processing', timestamp: new Date('2025-10-29'), isAuto: false },
    { id: 3, materialId: 4, materialName: 'Саморез 4x50', quantity: 800, customer: 'ООО "СтройКомплект"', amount: 640, status: 'pending', timestamp: new Date('2025-10-30'), isAuto: true },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    materialName: '',
    quantity: '',
    customer: '',
  });

  const materials = [
    { id: 1, name: 'Гайка М8', price: 2.5 },
    { id: 2, name: 'Болт М10', price: 5.0 },
    { id: 3, name: 'Шайба М8', price: 1.2 },
    { id: 4, name: 'Саморез 4x50', price: 0.8 },
    { id: 5, name: 'Винт М6', price: 3.5 },
  ];

  const handleAddOrder = () => {
    if (!newOrder.materialName || !newOrder.quantity || !newOrder.customer) {
      toast.error('Заполните все поля');
      return;
    }

    const material = materials.find((m) => m.name === newOrder.materialName);
    if (!material) return;

    const order: Order = {
      id: orders.length + 1,
      materialId: material.id,
      materialName: material.name,
      quantity: parseInt(newOrder.quantity),
      customer: newOrder.customer,
      amount: material.price * parseInt(newOrder.quantity),
      status: 'pending',
      timestamp: new Date(),
      isAuto: false,
    };

    setOrders([...orders, order]);
    setNewOrder({ materialName: '', quantity: '', customer: '' });
    setIsDialogOpen(false);
    toast.success('Заказ создан');
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'Ожидает',
      processing: 'В работе',
      completed: 'Завершен',
      cancelled: 'Отменен',
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      completed: 'bg-green-500',
      cancelled: 'bg-gray-500',
    };
    return colors[status];
  };

  const manualOrders = orders.filter((o) => !o.isAuto);
  const autoOrders = orders.filter((o) => o.isAuto);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Заказы</h1>
          <p className="text-muted-foreground mt-1">Управление заказами материалов</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Создать заказ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Новый заказ</DialogTitle>
              <DialogDescription>Создайте новый заказ на материалы</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="material">Материал</Label>
                <Select value={newOrder.materialName} onValueChange={(value) => setNewOrder({ ...newOrder, materialName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите материал" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.name}>
                        {material.name} ({material.price.toFixed(2)} ₽)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Количество</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Заказчик</Label>
                <Input
                  id="customer"
                  placeholder="ООО «Компания»"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                />
              </div>
              {newOrder.materialName && newOrder.quantity && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Итого</span>
                    <span className="text-lg font-bold">
                      {(materials.find((m) => m.name === newOrder.materialName)!.price * parseInt(newOrder.quantity)).toFixed(2)} ₽
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddOrder}>Создать</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <Icon name="FileText" size={16} className="mr-2" />
            Ручные заказы ({manualOrders.length})
          </TabsTrigger>
          <TabsTrigger value="auto">
            <Icon name="Zap" size={16} className="mr-2" />
            Автоматические ({autoOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <div className="grid gap-4">
            {manualOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                      <CardDescription>{order.timestamp.toLocaleDateString('ru-RU')}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>{getStatusLabel(order.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Материал</p>
                      <p className="font-medium">{order.materialName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Количество</p>
                      <p className="font-medium">{order.quantity} шт</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Заказчик</p>
                      <p className="font-medium">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Сумма</p>
                      <p className="font-medium text-primary">{order.amount.toFixed(2)} ₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auto" className="mt-6">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Автоматические заказы</p>
              <p className="text-blue-700 mt-1">Формируются автоматически при достижении минимального уровня запасов</p>
            </div>
          </div>
          <div className="grid gap-4">
            {autoOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Icon name="Zap" size={18} className="text-primary" />
                      <div>
                        <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                        <CardDescription>{order.timestamp.toLocaleDateString('ru-RU')}</CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>{getStatusLabel(order.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Материал</p>
                      <p className="font-medium">{order.materialName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Количество</p>
                      <p className="font-medium">{order.quantity} шт</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Заказчик</p>
                      <p className="font-medium">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Сумма</p>
                      <p className="font-medium text-primary">{order.amount.toFixed(2)} ₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
