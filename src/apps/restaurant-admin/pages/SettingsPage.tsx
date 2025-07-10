import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Clock, 
  Bell, 
  Palette,
  MapPin,
  Phone,
  Mail,
  Save,
  Upload
} from 'lucide-react';
import { useTenant } from '@/shared/contexts/tenant-context';
import { AdminNavigation } from '../components/AdminNavigation';

const SettingsPage = () => {
  const { tenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para as configurações
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: tenant?.settings.restaurantName || 'Quentinhas Express',
    description: 'Deliciosas quentinhas caseiras feitas com carinho',
    phone: '(11) 99999-9999',
    email: 'contato@quentinhas-express.com',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    deliveryRadius: '5',
    deliveryFee: '5.00',
    minimumOrder: '15.00'
  });

  const [operationSettings, setOperationSettings] = useState({
    isOpen: true,
    openTime: '11:00',
    closeTime: '22:00',
    acceptOrders: true,
    autoConfirmOrders: false,
    preparationTime: '30'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    soundNotifications: true,
    desktopNotifications: true
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configurações salvas:', {
        restaurant: restaurantSettings,
        operation: operationSettings,
        notifications: notificationSettings
      });
      // Aqui seria feita a integração com o backend
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AdminNavigation currentView="settings" />

      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">Gerencie as configurações do seu restaurante</p>
            </div>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="restaurant">Restaurante</TabsTrigger>
            <TabsTrigger value="operation">Funcionamento</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>

          {/* Configurações do Restaurante */}
          <TabsContent value="restaurant">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="h-5 w-5" />
                    <span>Informações Básicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="restaurant-name">Nome do Restaurante</Label>
                      <Input
                        id="restaurant-name"
                        value={restaurantSettings.name}
                        onChange={(e) => setRestaurantSettings(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="restaurant-phone">Telefone</Label>
                      <Input
                        id="restaurant-phone"
                        value={restaurantSettings.phone}
                        onChange={(e) => setRestaurantSettings(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="restaurant-description">Descrição</Label>
                    <Textarea
                      id="restaurant-description"
                      value={restaurantSettings.description}
                      onChange={(e) => setRestaurantSettings(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="restaurant-address">Endereço</Label>
                    <Input
                      id="restaurant-address"
                      value={restaurantSettings.address}
                      onChange={(e) => setRestaurantSettings(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="delivery-radius">Raio de Entrega (km)</Label>
                      <Input
                        id="delivery-radius"
                        type="number"
                        value={restaurantSettings.deliveryRadius}
                        onChange={(e) => setRestaurantSettings(prev => ({
                          ...prev,
                          deliveryRadius: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery-fee">Taxa de Entrega (R$)</Label>
                      <Input
                        id="delivery-fee"
                        type="number"
                        step="0.01"
                        value={restaurantSettings.deliveryFee}
                        onChange={(e) => setRestaurantSettings(prev => ({
                          ...prev,
                          deliveryFee: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimum-order">Pedido Mínimo (R$)</Label>
                      <Input
                        id="minimum-order"
                        type="number"
                        step="0.01"
                        value={restaurantSettings.minimumOrder}
                        onChange={(e) => setRestaurantSettings(prev => ({
                          ...prev,
                          minimumOrder: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações de Funcionamento */}
          <TabsContent value="operation">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Horário de Funcionamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Status do Restaurante</Label>
                      <p className="text-sm text-muted-foreground">
                        {operationSettings.isOpen ? 'Aberto para pedidos' : 'Fechado'}
                      </p>
                    </div>
                    <Switch
                      checked={operationSettings.isOpen}
                      onCheckedChange={(checked) => setOperationSettings(prev => ({
                        ...prev,
                        isOpen: checked
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="open-time">Horário de Abertura</Label>
                      <Input
                        id="open-time"
                        type="time"
                        value={operationSettings.openTime}
                        onChange={(e) => setOperationSettings(prev => ({
                          ...prev,
                          openTime: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="close-time">Horário de Fechamento</Label>
                      <Input
                        id="close-time"
                        type="time"
                        value={operationSettings.closeTime}
                        onChange={(e) => setOperationSettings(prev => ({
                          ...prev,
                          closeTime: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="preparation-time">Tempo de Preparo (minutos)</Label>
                    <Input
                      id="preparation-time"
                      type="number"
                      value={operationSettings.preparationTime}
                      onChange={(e) => setOperationSettings(prev => ({
                        ...prev,
                        preparationTime: e.target.value
                      }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Aceitar Novos Pedidos</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que clientes façam novos pedidos
                        </p>
                      </div>
                      <Switch
                        checked={operationSettings.acceptOrders}
                        onCheckedChange={(checked) => setOperationSettings(prev => ({
                          ...prev,
                          acceptOrders: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Confirmação Automática</Label>
                        <p className="text-sm text-muted-foreground">
                          Confirmar pedidos automaticamente após o pagamento
                        </p>
                      </div>
                      <Switch
                        checked={operationSettings.autoConfirmOrders}
                        onCheckedChange={(checked) => setOperationSettings(prev => ({
                          ...prev,
                          autoConfirmOrders: checked
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações de Notificações */}
          <TabsContent value="notifications">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notificações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber emails sobre novos pedidos e atualizações
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          emailNotifications: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações por SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber SMS sobre pedidos urgentes
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          smsNotifications: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sons de Notificação</Label>
                        <p className="text-sm text-muted-foreground">
                          Tocar som quando novos pedidos chegarem
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.soundNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          soundNotifications: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações do Navegador</Label>
                        <p className="text-sm text-muted-foreground">
                          Mostrar notificações do navegador para novos pedidos
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.desktopNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          desktopNotifications: checked
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações de Aparência */}
          <TabsContent value="appearance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Aparência da Loja</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Logo do Restaurante</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      <img 
                        src={tenant?.theme.logo || '/assets/logo-quentinhas.jpg'} 
                        alt="Logo atual" 
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar Logo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Cor Primária</Label>
                      <div className="mt-2 flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: '#ef4444' }}
                        />
                        <Input
                          type="color"
                          value="#ef4444"
                          className="w-16 h-8 p-0 border-0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Cor Secundária</Label>
                      <div className="mt-2 flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: '#f97316' }}
                        />
                        <Input
                          type="color"
                          value="#f97316"
                          className="w-16 h-8 p-0 border-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                    <p><strong>Nota:</strong> As alterações de aparência serão aplicadas tanto no painel administrativo quanto na loja online dos clientes.</p>
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

export default SettingsPage;