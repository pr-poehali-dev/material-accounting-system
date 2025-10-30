import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Material {
  id: number;
  name: string;
  description: string;
  amount: number;
  stock: number;
  minStock: number;
}

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: 'Гайка М8', description: 'Гайка оцинкованная, диаметр 8мм', amount: 2.5, stock: 1200, minStock: 500 },
    { id: 2, name: 'Болт М10', description: 'Болт оцинкованный, длина 50мм', amount: 5.0, stock: 350, minStock: 300 },
    { id: 3, name: 'Шайба М8', description: 'Шайба плоская оцинкованная', amount: 1.2, stock: 2500, minStock: 1000 },
    { id: 4, name: 'Саморез 4x50', description: 'Саморез по дереву, оцинкованный', amount: 0.8, stock: 180, minStock: 400 },
    { id: 5, name: 'Винт М6', description: 'Винт с потайной головкой', amount: 3.5, stock: 800, minStock: 300 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    amount: '',
    stock: '',
    minStock: '',
  });

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.amount || !newMaterial.stock || !newMaterial.minStock) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const material: Material = {
      id: materials.length + 1,
      name: newMaterial.name,
      description: newMaterial.description,
      amount: parseFloat(newMaterial.amount),
      stock: parseInt(newMaterial.stock),
      minStock: parseInt(newMaterial.minStock),
    };

    setMaterials([...materials, material]);
    setNewMaterial({ name: '', description: '', amount: '', stock: '', minStock: '' });
    setIsDialogOpen(false);
    toast.success('Материал добавлен');
  };

  const handleDeleteMaterial = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast.success('Материал удален');
  };

  const getStockStatus = (stock: number, minStock: number) => {
    const percentage = (stock / minStock) * 100;
    if (percentage < 50) return { label: 'Критично', color: 'bg-red-500' };
    if (percentage < 100) return { label: 'Низкий', color: 'bg-yellow-500' };
    return { label: 'Норма', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Материалы</h1>
          <p className="text-muted-foreground mt-1">Управление материальными ресурсами</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={20} />
              Добавить материал
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Новый материал</DialogTitle>
              <DialogDescription>Добавьте новый материал в систему учета</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  placeholder="Гайка М10"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание материала"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Цена (₽) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newMaterial.amount}
                    onChange={(e) => setNewMaterial({ ...newMaterial, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Остаток *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={newMaterial.stock}
                    onChange={(e) => setNewMaterial({ ...newMaterial, stock: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Мин. остаток *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    placeholder="0"
                    value={newMaterial.minStock}
                    onChange={(e) => setNewMaterial({ ...newMaterial, minStock: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddMaterial}>Добавить</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => {
          const status = getStockStatus(material.stock, material.minStock);
          return (
            <Card key={material.id} className="hover:shadow-lg transition-all duration-200 hover-scale">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{material.name}</CardTitle>
                    <CardDescription className="mt-1">{material.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Цена за единицу</span>
                    <span className="font-semibold">{material.amount.toFixed(2)} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Остаток</span>
                    <span className="font-semibold">{material.stock} шт</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Мин. остаток</span>
                    <span className="font-semibold">{material.minStock} шт</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Статус</span>
                    <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialsPage;
