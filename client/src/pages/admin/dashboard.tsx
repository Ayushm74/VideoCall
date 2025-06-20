import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Video, 
  TrendingUp, 
  Flag, 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+5.2%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Active Hosts",
      value: "85",
      change: "+12",
      icon: Video,
      color: "text-green-400"
    },
    {
      title: "Revenue",
      value: "₹1.2L",
      change: "+18.5%",
      icon: TrendingUp,
      color: "text-purple-400"
    },
    {
      title: "Reports",
      value: "23",
      change: "-3",
      icon: Flag,
      color: "text-red-400"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Rahul Kumar",
      action: "Coin Purchase",
      amount: "₹249",
      time: "2 min ago",
      status: "success"
    },
    {
      id: 2,
      user: "Priya Sharma",
      action: "Host Payout",
      amount: "₹1,800",
      time: "1 hour ago",
      status: "pending"
    },
    {
      id: 3,
      user: "Anonymous",
      action: "Report Submitted",
      amount: "-",
      time: "3 hours ago",
      status: "review"
    },
    {
      id: 4,
      user: "Amit Singh",
      action: "Video Call",
      amount: "₹350",
      time: "4 hours ago",
      status: "success"
    },
    {
      id: 5,
      user: "Kavya Reddy",
      action: "Gift Purchase",
      amount: "₹150",
      time: "6 hours ago",
      status: "success"
    }
  ];

  const pendingHosts = [
    {
      id: 1,
      name: "Sneha Patel",
      email: "sneha.p@email.com",
      applied: "2 days ago",
      documents: "Complete"
    },
    {
      id: 2,
      name: "Riya Gupta",
      email: "riya.g@email.com",
      applied: "3 days ago",
      documents: "Pending"
    },
    {
      id: 3,
      name: "Meera Shah",
      email: "meera.s@email.com",
      applied: "5 days ago",
      documents: "Complete"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'review':
        return <Badge variant="destructive">Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, hosts, and platform operations
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="primary-gradient">
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-muted/30`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search activity..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-3 font-semibold">User</th>
                      <th className="text-left pb-3 font-semibold">Action</th>
                      <th className="text-left pb-3 font-semibold">Amount</th>
                      <th className="text-left pb-3 font-semibold">Time</th>
                      <th className="text-left pb-3 font-semibold">Status</th>
                      <th className="text-left pb-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="border-b border-border/50">
                        <td className="py-3 font-medium">{activity.user}</td>
                        <td className="py-3 text-muted-foreground">{activity.action}</td>
                        <td className="py-3">{activity.amount}</td>
                        <td className="py-3 text-muted-foreground">{activity.time}</td>
                        <td className="py-3">{getStatusBadge(activity.status)}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pending Host Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pending Hosts</span>
                <Badge variant="secondary">{pendingHosts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingHosts.map((host) => (
                  <div key={host.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{host.name}</h4>
                        <p className="text-sm text-muted-foreground">{host.email}</p>
                      </div>
                      <Badge variant={host.documents === 'Complete' ? 'default' : 'secondary'}>
                        {host.documents}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Applied {host.applied}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Ban className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <Users className="w-6 h-6 mb-1" />
                <span>Manage Users</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col">
                <Video className="w-6 h-6 mb-1" />
                <span>Host Management</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col">
                <Flag className="w-6 h-6 mb-1" />
                <span>Handle Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
