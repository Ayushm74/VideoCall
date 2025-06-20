import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { GIFT_ANIMATIONS } from '@/lib/constants';
import type { Gift } from '@shared/schema';

interface GiftCatalogProps {
  hostId?: number;
  onGiftSent?: (gift: Gift) => void;
}

export function GiftCatalog({ hostId, onGiftSent }: GiftCatalogProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ['/api/gifts'],
  });

  const sendGiftMutation = useMutation({
    mutationFn: async (gift: Gift) => {
      if (!currentUser) throw new Error('Not authenticated');
      
      // Deduct coins from user
      await apiRequest('POST', `/api/user/${currentUser.id}/coins`, {
        amount: -gift.coinCost,
        transactionType: 'gift'
      });

      return gift;
    },
    onSuccess: (gift) => {
      toast({
        title: 'Gift Sent! 🎉',
        description: `You sent a ${gift.name} ${gift.emoji}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      onGiftSent?.(gift);
      setSelectedGift(null);
    },
    onError: () => {
      toast({
        title: 'Failed to send gift',
        description: 'Please check your coin balance',
        variant: 'destructive',
      });
    },
  });

  const handleGiftSelect = (gift: Gift) => {
    if (!currentUser) {
      toast({
        title: 'Please login first',
        variant: 'destructive',
      });
      return;
    }

    if ((currentUser.coinBalance || 0) < gift.coinCost) {
      toast({
        title: 'Insufficient coins',
        description: 'Please recharge your wallet',
        variant: 'destructive',
      });
      return;
    }

    setSelectedGift(gift);
  };

  const confirmSendGift = () => {
    if (selectedGift) {
      sendGiftMutation.mutate(selectedGift);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-muted rounded mx-auto mb-2" />
              <div className="h-4 bg-muted rounded mb-1" />
              <div className="h-3 bg-muted rounded w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {gifts.map((gift: Gift) => {
          const animationClass = GIFT_ANIMATIONS[gift.animation as keyof typeof GIFT_ANIMATIONS] || '';
          
          return (
            <Card 
              key={gift.id} 
              className="hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => handleGiftSelect(gift)}
            >
              <CardContent className="p-4 text-center">
                <div className={`text-4xl mb-2 group-hover:${animationClass}`}>
                  {gift.emoji}
                </div>
                <div className="text-sm font-semibold mb-1 truncate">{gift.name}</div>
                <div className="text-accent text-xs flex items-center justify-center">
                  <span className="font-bold">{gift.coinCost}</span>
                  <span className="ml-1">coins</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gift confirmation modal */}
      {selectedGift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">{selectedGift.emoji}</div>
              <h3 className="text-xl font-bold mb-2">Send {selectedGift.name}?</h3>
              <p className="text-muted-foreground mb-4">
                This will cost {selectedGift.coinCost} coins
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedGift(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSendGift}
                  disabled={sendGiftMutation.isPending}
                  className="flex-1 primary-gradient"
                >
                  {sendGiftMutation.isPending ? 'Sending...' : 'Send Gift'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
