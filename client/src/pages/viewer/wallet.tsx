import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Gift, Phone, Plus, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { COIN_PACKAGES } from '@/lib/constants';
import type { Transaction } from '@shared/schema';

export default function Wallet() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/user', currentUser?.id, 'transactions'],
    enabled: !!currentUser,
  });

  const purchaseCoinsMutation = useMutation({
    mutationFn: async (packageId: number) => {
      if (!currentUser) throw new Error('Not authenticated');
      
      const coinPackage = COIN_PACKAGES.find(p => p.id === packageId);
      if (!coinPackage) throw new Error('Invalid package');

      const bonusCoins = Math.floor(coinPackage.coins * (coinPackage.bonus / 100));
      const totalCoins = coinPackage.coins + bonusCoins;

      await apiRequest('POST', `/api/user/${currentUser.id}/coins`, {
        amount: totalCoins,
        transactionType: 'purchase'
      });

      return { packageId, totalCoins, price: coinPackage.price };
    },
    onSuccess: (data) => {
      toast({
        title: 'Coins purchased successfully! 🎉',
        description: `You received ${data.totalCoins} coins`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', currentUser?.id, 'transactions'] });
      setSelectedPackage(null);
    },
    onError: () => {
      toast({
        title: 'Purchase failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const handlePurchase = (packageId: number) => {
    if (!currentUser) {
      toast({
        title: 'Please login first',
        variant: 'destructive',
      });
      return;
    }

    purchaseCoinsMutation.mutate(packageId);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'call':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'gift':
        return <Gift className="w-4 h-4 text-purple-500" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  const formatTransactionAmount = (transaction: Transaction) => {
    const isPositive = (transaction.coinAmount || 0) > 0;
    const amount = Math.abs(transaction.coinAmount || 0);
    return (
      <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
        {isPositive ? '+' : '-'}{amount} coins
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your coins and transactions</p>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 primary-gradient text-white">
          <CardContent className="p-6 text-center">
            <Coins className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
            <div className="text-4xl font-bold mb-2">
              {currentUser?.coinBalance || 0}
            </div>
            <p className="text-white/80">coins available</p>
          </CardContent>
        </Card>

        {/* Coin Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recharge Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COIN_PACKAGES.map((coinPackage) => (
              <Card 
                key={coinPackage.id}
                className={`relative transition-all duration-300 hover:scale-105 cursor-pointer ${
                  coinPackage.popular 
                    ? 'ring-2 ring-accent border-accent' 
                    : 'hover:border-primary'
                }`}
                onClick={() => handlePurchase(coinPackage.id)}
              >
                {coinPackage.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground font-bold">
                      POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6 text-center">
                  <Coins className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{coinPackage.coins} Coins</h3>
                  
                  {coinPackage.bonus > 0 && (
                    <div className="text-sm text-green-400 mb-2 flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{coinPackage.bonus}% Bonus
                    </div>
                  )}
                  
                  <div className="text-3xl font-bold text-accent mb-4">
                    ₹{coinPackage.price}
                  </div>
                  
                  <Button
                    className={`w-full font-semibold ${
                      coinPackage.popular 
                        ? 'gold-gradient text-accent-foreground' 
                        : 'primary-gradient'
                    }`}
                    disabled={purchaseCoinsMutation.isPending}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {purchaseCoinsMutation.isPending ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full" />
                      <div>
                        <div className="h-4 bg-muted rounded w-32 mb-1" />
                        <div className="h-3 bg-muted rounded w-20" />
                      </div>
                    </div>
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-1">
                {transactions.map((transaction: Transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-semibold capitalize">
                          {transaction.description || transaction.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatTransactionAmount(transaction)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by purchasing some coins or making calls
                </p>
                <Button 
                  className="primary-gradient"
                  onClick={() => {
                    const firstPackage = COIN_PACKAGES[1]; // Popular package
                    handlePurchase(firstPackage.id);
                  }}
                >
                  Buy Your First Coins
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
