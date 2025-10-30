import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Material {
  id: number;
  name: string;
  description: string;
  quantity: number;
  minQuantity: number;
  amount: number;
}

interface Order {
  id: number;
  material_id: number;
  materialName: string;
  quantity: number;
  timestamp: string;
  customer: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  isAutomatic?: boolean;
}

interface Transaction {
  id: number;
  material_id: number;
  materialName: string;
  type: 'receipt' | 'writeoff';
  timestamp: string;
  quantity: number;
}

const Index = () => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: 'Гайка М8', description: 'Гайка шестигранная оцинкованная', quantity: 1500, minQuantity: 500, amount: 2.5 },
    { id: 2, name: 'Болт М10', description: 'Болт с шестигранной головкой', quantity: 800, minQuantity: 300, amount: 5.0 },
    { id: 3, name: 'Шайба 8мм', description: 'Шайба плоская увеличенная', quantity: 2000, minQuantity: 800, amount: 1.2 },
    { id: 4, name: 'Винт М6', description: 'Винт с потайной головкой', quantity: 400, minQuantity: 500, amount: 3.5 },
    { id: 5, name: 'Саморез 4х50', description: 'Саморез по дереву', quantity: 3000, minQuantity: 1000, amount: 0.8 },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 1, material_id: 2, materialName: 'Болт М10', quantity: 200, timestamp: '2025-10-28T10:30:00', customer: 'ООО "СтройТех"', amount: 1000, status: 'completed' },
    { id: 2, material_id: 1, materialName: 'Гайка М8', quantity: 500, timestamp: '2025-10-29T14:20:00', customer: 'ИП Иванов', amount: 1250, status: 'pending' },
    { id: 3, material_id: 4, materialName: 'Винт М6', quantity: 200, timestamp: '2025-10-30T09:15:00', customer: 'Автозаказ (система)', amount: 700, status: 'pending', isAutomatic: true },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, material_id: 1, materialName: 'Гайка М8', type: 'receipt', timestamp: '2025-10-25T08:00:00', quantity: 1000 },
    { id: 2, material_id: 2, materialName: 'Болт М10', type: 'writeoff', timestamp: '2025-10-26T11:30:00', quantity: 150 },
    { id: 3, material_id: 3, materialName: 'Шайба 8мм', type: 'receipt', timestamp: '2025-10-27T13:45:00', quantity: 1500 },
    { id: 4, material_id: 5, materialName: 'Саморез 4х50', type: 'writeoff', timestamp: '2025-10-28T15:20:00', quantity: 500 },
    { id: 5, material_id: 4, materialName: 'Винт М6', type: 'receipt', timestamp: '2025-10-29T10:10:00', quantity: 300 },
  ]);

  const [newMaterial, setNewMaterial] = useState({ name: '', description: '', quantity: 0, minQuantity: 0, amount: 0 });
  const [newOrder, setNewOrder] = useState({ material_id: 0, quantity: 0, customer: '' });
  const [newTransaction, setNewTransaction] = useState({ material_id: 0, type: 'receipt' as 'receipt' | 'writeoff', quantity: 0 });

  const totalMaterials = materials.length;
  const lowStockCount = materials.filter(m => m.quantity < m.minQuantity).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.amount), 0);

  const handleAddMaterial = () => {
    if (!newMaterial.name || newMaterial.quantity < 0) {
      toast({ title: 'Ошибка', description: 'Заполните все поля корректно', variant: 'destructive' });
      return;
    }
    const material: Material = {
      id: materials.length + 1,
      ...newMaterial,
    };
    setMaterials([...materials, material]);
    setNewMaterial({ name: '', description: '', quantity: 0, minQuantity: 0, amount: 0 });
    toast({ title: 'Успешно', description: 'Материал добавлен' });
  };

  const handleDeleteMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast({ title: 'Успешно', description: 'Материал удален' });
  };

  const handleAddOrder = () => {
    if (!newOrder.material_id || newOrder.quantity <= 0) {
      toast({ title: 'Ошибка', description: 'Заполните все поля корректно', variant: 'destructive' });
      return;
    }
    const material = materials.find(m => m.id === newOrder.material_id);
    if (!material) return;

    const order: Order = {
      id: orders.length + 1,
      material_id: newOrder.material_id,
      materialName: material.name,
      quantity: newOrder.quantity,
      timestamp: new Date().toISOString(),
      customer: newOrder.customer,
      amount: material.amount * newOrder.quantity,
      status: 'pending',
    };
    setOrders([...orders, order]);
    setNewOrder({ material_id: 0, quantity: 0, customer: '' });
    toast({ title: 'Успешно', description: 'Заказ создан' });
  };

  const handleAddTransaction = () => {
    if (!newTransaction.material_id || newTransaction.quantity <= 0) {
      toast({ title: 'Ошибка', description: 'Заполните все поля корректно', variant: 'destructive' });
      return;
    }
    const material = materials.find(m => m.id === newTransaction.material_id);
    if (!material) return;

    const transaction: Transaction = {
      id: transactions.length + 1,
      material_id: newTransaction.material_id,
      materialName: material.name,
      type: newTransaction.type,
      timestamp: new Date().toISOString(),
      quantity: newTransaction.quantity,
    };

    setTransactions([transaction, ...transactions]);

    setMaterials(materials.map(m => {
      if (m.id === newTransaction.material_id) {
        const newQuantity = newTransaction.type === 'receipt' 
          ? m.quantity + newTransaction.quantity 
          : m.quantity - newTransaction.quantity;
        return { ...m, quantity: Math.max(0, newQuantity) };
      }
      return m;
    }));

    setNewTransaction({ material_id: 0, type: 'receipt', quantity: 0 });
    toast({ title: 'Успешно', description: 'Операция выполнена' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Система учета материальных ресурсов</h1>
          <p className="text-slate-600">Автоматизация учета и формирования заказов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Всего материалов</CardTitle>
              <Icon name="Package" className="text-blue-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{totalMaterials}</div>
              <p className="text-xs text-slate-500 mt-1">Уникальных позиций</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Низкие запасы</CardTitle>
              <Icon name="AlertTriangle" className="text-orange-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{lowStockCount}</div>
              <p className="text-xs text-slate-500 mt-1">Требуют пополнения</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Активные заказы</CardTitle>
              <Icon name="ShoppingCart" className="text-green-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{pendingOrders}</div>
              <p className="text-xs text-slate-500 mt-1">В обработке</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Общая стоимость</CardTitle>
              <Icon name="DollarSign" className="text-purple-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{totalValue.toFixed(2)}₽</div>
              <p className="text-xs text-slate-500 mt-1">На складе</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="materials">
              <Icon name="Package" size={16} className="mr-2" />
              Материалы
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Icon name="ArrowLeftRight" size={16} className="mr-2" />
              Операции
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Список материалов</CardTitle>
                  <CardDescription>Управление складскими запасами</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-800">{material.name}</h3>
                            {material.quantity < material.minQuantity && (
                              <Badge variant="destructive" className="text-xs">
                                <Icon name="AlertCircle" size={12} className="mr-1" />
                                Низкий запас
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{material.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-slate-600">
                              Остаток: <span className="font-semibold text-slate-800">{material.quantity} шт</span>
                            </span>
                            <span className="text-slate-600">
                              Мин. уровень: <span className="font-semibold text-slate-800">{material.minQuantity} шт</span>
                            </span>
                            <span className="text-slate-600">
                              Цена: <span className="font-semibold text-slate-800">{material.amount}₽</span>
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Добавить материал</CardTitle>
                  <CardDescription>Новая позиция на склад</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        placeholder="Например, Гайка М8"
                        value={newMaterial.name}
                        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Input
                        id="description"
                        placeholder="Краткое описание"
                        value={newMaterial.description}
                        onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Количество</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="0"
                        value={newMaterial.quantity || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minQuantity">Мин. уровень</Label>
                      <Input
                        id="minQuantity"
                        type="number"
                        placeholder="0"
                        value={newMaterial.minQuantity || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, minQuantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Цена за единицу</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newMaterial.amount || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, amount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <Button onClick={handleAddMaterial} className="w-full">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Добавить материал
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Список заказов</CardTitle>
                  <CardDescription>История и активные заказы</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Материал</TableHead>
                        <TableHead>Количество</TableHead>
                        <TableHead>Заказчик</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {order.materialName}
                              {order.isAutomatic && (
                                <Badge variant="secondary" className="text-xs">
                                  <Icon name="Zap" size={10} className="mr-1" />
                                  Авто
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{order.quantity} шт</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.amount.toFixed(2)}₽</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === 'completed'
                                  ? 'default'
                                  : order.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {order.status === 'completed' ? 'Выполнен' : order.status === 'pending' ? 'В ожидании' : 'Отменен'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Создать заказ</CardTitle>
                    <CardDescription>Новый заказ материалов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="order-material">Материал</Label>
                        <Select
                          value={newOrder.material_id.toString()}
                          onValueChange={(value) => setNewOrder({ ...newOrder, material_id: parseInt(value) })}
                        >
                          <SelectTrigger id="order-material">
                            <SelectValue placeholder="Выберите материал" />
                          </SelectTrigger>
                          <SelectContent>
                            {materials.map((m) => (
                              <SelectItem key={m.id} value={m.id.toString()}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="order-quantity">Количество</Label>
                        <Input
                          id="order-quantity"
                          type="number"
                          placeholder="0"
                          value={newOrder.quantity || ''}
                          onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="order-customer">Заказчик</Label>
                        <Input
                          id="order-customer"
                          placeholder="Название организации"
                          value={newOrder.customer}
                          onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddOrder} className="w-full">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Создать заказ
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Автозаказы</CardTitle>
                    <CardDescription>Материалы с низким запасом</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {materials
                        .filter((m) => m.quantity < m.minQuantity)
                        .map((material) => (
                          <div key={material.id} className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-sm text-slate-800">{material.name}</p>
                                <p className="text-xs text-slate-600">
                                  Осталось: {material.quantity} шт
                                </p>
                              </div>
                              <Icon name="AlertTriangle" size={16} className="text-orange-500" />
                            </div>
                            <p className="text-xs text-slate-600">
                              Рекомендуется заказать: <span className="font-semibold">{material.minQuantity - material.quantity + 100} шт</span>
                            </p>
                          </div>
                        ))}
                      {materials.filter((m) => m.quantity < m.minQuantity).length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">Все материалы в норме</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>История операций</CardTitle>
                  <CardDescription>Поступления и списания материалов</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Материал</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Количество</TableHead>
                        <TableHead>Дата</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">#{transaction.id}</TableCell>
                          <TableCell>{transaction.materialName}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'receipt' ? 'default' : 'secondary'}>
                              <Icon
                                name={transaction.type === 'receipt' ? 'ArrowDown' : 'ArrowUp'}
                                size={12}
                                className="mr-1"
                              />
                              {transaction.type === 'receipt' ? 'Поступление' : 'Списание'}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={transaction.type === 'receipt' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}
                          >
                            {transaction.type === 'receipt' ? '+' : '-'}
                            {transaction.quantity} шт
                          </TableCell>
                          <TableCell>{new Date(transaction.timestamp).toLocaleString('ru-RU')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Новая операция</CardTitle>
                  <CardDescription>Поступление или списание</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="trans-material">Материал</Label>
                      <Select
                        value={newTransaction.material_id.toString()}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, material_id: parseInt(value) })}
                      >
                        <SelectTrigger id="trans-material">
                          <SelectValue placeholder="Выберите материал" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((m) => (
                            <SelectItem key={m.id} value={m.id.toString()}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trans-type">Тип операции</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value: 'receipt' | 'writeoff') => setNewTransaction({ ...newTransaction, type: value })}
                      >
                        <SelectTrigger id="trans-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receipt">
                            <div className="flex items-center">
                              <Icon name="ArrowDown" size={14} className="mr-2 text-green-500" />
                              Поступление
                            </div>
                          </SelectItem>
                          <SelectItem value="writeoff">
                            <div className="flex items-center">
                              <Icon name="ArrowUp" size={14} className="mr-2 text-red-500" />
                              Списание
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trans-quantity">Количество</Label>
                      <Input
                        id="trans-quantity"
                        type="number"
                        placeholder="0"
                        value={newTransaction.quantity || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, quantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <Button onClick={handleAddTransaction} className="w-full">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Выполнить операцию
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
