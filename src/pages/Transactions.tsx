import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Transaction {
  id: number;
  materialId: number;
  materialName: string;
  type: 'incoming' | 'outgoing';
  quantity: number;
  timestamp: Date;
}

const TransactionsPage = () => {
  const [transactions] = useState<Transaction[]>([
    { id: 1, materialId: 1, materialName: 'Гайка М8', type: 'incoming', quantity: 1000, timestamp: new Date('2025-10-28 10:30') },
    { id: 2, materialId: 2, materialName: 'Болт М10', type: 'incoming', quantity: 500, timestamp: new Date('2025-10-28 11:15') },
    { id: 3, materialId: 1, materialName: 'Гайка М8', type: 'outgoing', quantity: 250, timestamp: new Date('2025-10-29 09:00') },
    { id: 4, materialId: 3, materialName: 'Шайба М8', type: 'incoming', quantity: 2000, timestamp: new Date('2025-10-29 14:20') },
    { id: 5, materialId: 2, materialName: 'Болт М10', type: 'outgoing', quantity: 150, timestamp: new Date('2025-10-29 16:45') },
    { id: 6, materialId: 4, materialName: 'Саморез 4x50', type: 'outgoing', quantity: 620, timestamp: new Date('2025-10-30 08:30') },
    { id: 7, materialId: 5, materialName: 'Винт М6', type: 'incoming', quantity: 800, timestamp: new Date('2025-10-30 10:00') },
    { id: 8, materialId: 3, materialName: 'Шайба М8', type: 'outgoing', quantity: 500, timestamp: new Date('2025-10-30 13:25') },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.materialName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: Transaction['type']) => {
    return type === 'incoming' ? 'Поступление' : 'Списание';
  };

  const getTypeIcon = (type: Transaction['type']) => {
    return type === 'incoming' ? 'ArrowDownCircle' : 'ArrowUpCircle';
  };

  const getTypeColor = (type: Transaction['type']) => {
    return type === 'incoming' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const totalIncoming = transactions.filter((t) => t.type === 'incoming').reduce((sum, t) => sum + t.quantity, 0);
  const totalOutgoing = transactions.filter((t) => t.type === 'outgoing').reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Операции</h1>
        <p className="text-muted-foreground mt-1">История всех операций с материалами</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего операций</CardTitle>
            <Icon name="Activity" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">За последние 7 дней</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Поступления</CardTitle>
            <Icon name="ArrowDownCircle" size={16} className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalIncoming}</div>
            <p className="text-xs text-muted-foreground mt-1">единиц материалов</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Списания</CardTitle>
            <Icon name="ArrowUpCircle" size={16} className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalOutgoing}</div>
            <p className="text-xs text-muted-foreground mt-1">единиц материалов</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск по названию материала..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Тип операции" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все операции</SelectItem>
            <SelectItem value="incoming">Поступления</SelectItem>
            <SelectItem value="outgoing">Списания</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История операций</CardTitle>
          <CardDescription>Все операции с материалами в хронологическом порядке</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getTypeColor(transaction.type)}`}>
                    <Icon name={getTypeIcon(transaction.type)} size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.materialName}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.timestamp.toLocaleDateString('ru-RU')} в {transaction.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      {transaction.type === 'incoming' ? '+' : '-'}{transaction.quantity} шт
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
