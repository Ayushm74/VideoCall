export const COIN_PACKAGES = [
  {
    id: 1,
    coins: 100,
    price: 99,
    bonus: 0,
    popular: false,
  },
  {
    id: 2,
    coins: 300,
    price: 249,
    bonus: 10,
    popular: true,
  },
  {
    id: 3,
    coins: 700,
    price: 499,
    bonus: 20,
    popular: false,
  },
  {
    id: 4,
    coins: 1500,
    price: 999,
    bonus: 30,
    popular: false,
  },
];

export const GIFT_ANIMATIONS = {
  float: 'gift-float',
  bounce: 'coin-bounce',
  pulse: 'live-pulse',
  wiggle: 'animate-wiggle',
  drive: 'animate-slide-in-right',
  sparkle: 'animate-ping',
  explode: 'animate-pulse',
  shine: 'animate-bounce',
};

export const CALL_STATUS = {
  ACTIVE: 'active',
  ENDED: 'ended',
  DECLINED: 'declined',
} as const;

export const TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  CALL: 'call',
  GIFT: 'gift',
} as const;
