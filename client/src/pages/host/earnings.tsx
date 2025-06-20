import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Calendar,
  Download,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';

export default function Earnings() {
  const monthlyEarnings = [
    { month: 'Jan', amount: 15200, calls: 45 },
    { month: 'Feb', amount: 18750, calls: 52 },
    { month: 'Mar', amount: 22100, calls: 61 },
    { month: 'Apr', amount: 19800, calls: 58 },
    { month: 'May', amount: 25400, calls: 67 },
    { month: 'Jun', amount: 28900, calls: 74 },
  ];

  const currentMonth = monthlyEarnings[monthlyEarnings.length - 1];
  const previousMonth = monthlyEarnings[monthlyEarnings.length - 2];
  const growthPercentage = ((currentMonth.amount - previousMonth.amount) / previousMonth.amount * 100).toFixed(1);

  const payoutRequests = [
    { id: 1, amount: 15000, date: '2024-06-01', status: 'completed' },
    { id: 2, amount: 12500, date: '2024-05-15', status: 'completed' },
    { id: 3, amount: 8750, date: '2024-05-01', status: 'pending' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings & Payouts</h1>
            <p className="text-muted-foreground">
              Track your income and manage payouts
            </p>
          </div>
          <Button className="primary-gradient">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">This Month</h3>
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2">₹{currentMonth.amount.toLocaleString()}</div>
              <div className="flex items-center text-sm opacity-90">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{growthPercentage}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Calls</h3>
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold mb-2">{currentMonth.calls}</div>
              <div className="text-sm text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Avg. per Call</h3>
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-2">
                ₹{Math.round(currentMonth.amount / currentMonth.calls)}
              </div>
              <div className="text-sm text-muted-foreground">Average earnings</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pending Payout</h3>
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-2">₹8,750</div>
              <div className="text-sm text-muted-foreground">Ready to withdraw</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Earnings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end justify-between space-x-2">
                {monthlyEarnings.map((month, index) => {
                  const maxAmount = Math.max(...monthlyEarnings.map(m => m.amount));
                  const height = (month.amount / maxAmount) * 100;
                  
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="text-sm font-semibold mb-1">
                        ₹{(month.amount / 1000).toFixed(1)}k
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        {month.month}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payout Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Payout History</span>
                <Button size="sm" className="gold-gradient text-accent-foreground">
                  Request Payout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutRequests.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-semibold">₹{payout.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{payout.date}</div>
                    </div>
                    {getStatusBadge(payout.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">89%</div>
                <div className="text-sm text-muted-foreground">Call Accept Rate</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">12m 45s</div>
                <div className="text-sm text-muted-foreground">Avg. Call Duration</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">4.9</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
