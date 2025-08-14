import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Bed, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Calendar,
  LogOut,
  Bell,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import { mockAnalytics, mockUsers, mockBookings, mockFeedback, logoutUser } from '../mock';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = ({ user, setUser }) => {
  const { toast } = useToast();

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
      duration: 3000,
    });
  };

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 }
  ];

  const staffMembers = mockUsers.filter(u => u.role === 'staff');
  const guestCount = mockUsers.filter(u => u.role === 'guest').length;
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                StayEase Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">Monitor hotel performance and manage operations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600">+12% from last period</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Occupancy Rate</CardTitle>
              <Bed className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{mockAnalytics.occupancyRate}%</div>
              <p className="text-xs text-blue-600">Above industry average</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{mockAnalytics.totalBookings}</div>
              <p className="text-xs text-amber-600">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{mockAnalytics.averageRating}</div>
              <p className="text-xs text-purple-600">Guest satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-green-100">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-purple-100">
              Staff
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-amber-100">
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.month}</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                          <Progress 
                            value={(item.revenue / 70000) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-bold text-green-600">
                            ${item.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Type Performance */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Room Type Bookings
                  </CardTitle>
                  <CardDescription>Booking distribution by room type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.roomTypeBookings.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                          <Progress 
                            value={(item.count / 150) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-bold text-blue-600">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Peak Hours */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Peak Booking Hours
                  </CardTitle>
                  <CardDescription>Busiest times for new bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.peakHours.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.hour}</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                          <Progress 
                            value={(item.bookings / 25) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-bold text-amber-600">
                            {item.bookings} bookings
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Occupancy Overview */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Occupancy Overview
                  </CardTitle>
                  <CardDescription>Current hotel status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Occupancy</span>
                        <span className="text-sm font-bold">{mockAnalytics.occupancyRate}%</span>
                      </div>
                      <Progress value={mockAnalytics.occupancyRate} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {mockBookings.filter(b => b.status === 'confirmed').length}
                        </p>
                        <p className="text-sm text-green-700">Active Bookings</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{guestCount}</p>
                        <p className="text-sm text-blue-700">Total Guests</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Management Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid gap-6">
              {mockBookings.map((booking) => (
                <Card key={booking.id} className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                        <CardDescription>Guest ID: {booking.guestId}</CardDescription>
                      </div>
                      <Badge className={`${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-semibold">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-green-600">${booking.totalAmount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Staff Management Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffMembers.map((staff) => (
                <Card key={staff.id} className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                    <CardDescription className="capitalize">{staff.department} Department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Role:</span>
                        <Badge variant="secondary">{staff.role}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Performance:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span className="text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid gap-6">
              {mockFeedback.map((feedback) => (
                <Card key={feedback.id} className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Guest Feedback</CardTitle>
                        <CardDescription>
                          {new Date(feedback.timestamp).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < feedback.rating 
                                ? 'text-amber-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 italic">"{feedback.comment}"</p>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="secondary">{feedback.category}</Badge>
                      <Badge className="bg-green-100 text-green-700">
                        {feedback.rating}/5 Stars
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;