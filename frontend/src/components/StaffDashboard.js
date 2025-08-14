import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bed, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  LogOut,
  Sparkles,
  Package,
  Bell,
  Calendar
} from 'lucide-react';
import { mockRooms, mockBookings, mockOrders, logoutUser } from '../mock';
import { useToast } from '../hooks/use-toast';

const StaffDashboard = ({ user, setUser }) => {
  const [roomStatuses, setRoomStatuses] = useState(
    mockRooms.reduce((acc, room) => {
      acc[room.id] = {
        cleaningStatus: room.available ? 'clean' : 'needs_cleaning',
        maintenanceStatus: 'good'
      };
      return acc;
    }, {})
  );
  const { toast } = useToast();

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "Have a great day!",
      duration: 3000,
    });
  };

  const updateRoomStatus = (roomId, statusType, newStatus) => {
    setRoomStatuses(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [statusType]: newStatus
      }
    }));
    
    toast({
      title: "Status Updated",
      description: `Room status has been updated successfully`,
      duration: 3000,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'clean': return 'bg-green-100 text-green-700';
      case 'cleaning': return 'bg-blue-100 text-blue-700';
      case 'needs_cleaning': return 'bg-red-100 text-red-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const activeBookings = mockBookings.filter(booking => booking.status === 'confirmed');
  const pendingOrders = mockOrders.filter(order => order.status === 'preparing');

  const roomsNeedingAttention = mockRooms.filter(room => {
    const status = roomStatuses[room.id];
    return status?.cleaningStatus === 'needs_cleaning' || status?.maintenanceStatus === 'maintenance';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                StayEase Staff
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role} • {user.department}</p>
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
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600">Manage hotel operations and guest services</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{activeBookings.length}</div>
              <p className="text-xs text-blue-600">Currently checked in</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{pendingOrders.length}</div>
              <p className="text-xs text-amber-600">Awaiting delivery</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Needs Attention</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{roomsNeedingAttention.length}</div>
              <p className="text-xs text-red-600">Rooms requiring service</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Available Rooms</CardTitle>
              <Bed className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {mockRooms.filter(room => room.available).length}
              </div>
              <p className="text-xs text-green-600">Ready for guests</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="rooms" className="data-[state=active]:bg-blue-100">
              Room Management
            </TabsTrigger>
            <TabsTrigger value="checkins" className="data-[state=active]:bg-green-100">
              Check-ins/Outs
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-100">
              Room Service
            </TabsTrigger>
            <TabsTrigger value="housekeeping" className="data-[state=active]:bg-purple-100">
              Housekeeping
            </TabsTrigger>
          </TabsList>

          {/* Room Management Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRooms.map((room) => {
                const status = roomStatuses[room.id];
                return (
                  <Card key={room.id} className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Room {room.number}</CardTitle>
                          <CardDescription>{room.type}</CardDescription>
                        </div>
                        <Badge className={room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {room.available ? 'Available' : 'Occupied'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Cleaning Status</span>
                          <Badge className={getStatusColor(status?.cleaningStatus)}>
                            {status?.cleaningStatus?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Maintenance</span>
                          <Badge className={getStatusColor(status?.maintenanceStatus)}>
                            {status?.maintenanceStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateRoomStatus(room.id, 'cleaningStatus', 'cleaning')}
                          className="flex-1"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Clean
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateRoomStatus(room.id, 'cleaningStatus', 'clean')}
                          className="flex-1"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Check-ins/Outs Tab */}
          <TabsContent value="checkins" className="space-y-6">
            <div className="grid gap-6">
              {activeBookings.map((booking) => {
                const room = mockRooms.find(r => r.id === booking.roomId);
                return (
                  <Card key={booking.id} className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                          <CardDescription>Room {room?.number} - {room?.type}</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Check In
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Check Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Room Service Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid gap-6">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <CardDescription>Room {order.roomNumber}</CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">
                        <Clock className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-semibold">${item.price}</span>
                        </div>
                      ))}
                      <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Total</span>
                        <span>${order.total}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Package className="h-3 w-3 mr-1" />
                        Prepare Order
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Delivered
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Housekeeping Tab */}
          <TabsContent value="housekeeping" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRooms
                .filter(room => roomStatuses[room.id]?.cleaningStatus === 'needs_cleaning')
                .map((room) => (
                  <Card key={room.id} className="shadow-lg border-0 border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Room {room.number}
                      </CardTitle>
                      <CardDescription>{room.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge className="bg-red-100 text-red-700">
                          Needs Cleaning
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateRoomStatus(room.id, 'cleaningStatus', 'cleaning')}
                            className="flex-1"
                          >
                            <Cleaning className="h-3 w-3 mr-1" />
                            Start Cleaning
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {mockRooms
                .filter(room => roomStatuses[room.id]?.cleaningStatus === 'cleaning')
                .map((room) => (
                  <Card key={room.id} className="shadow-lg border-0 border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Room {room.number}
                      </CardTitle>
                      <CardDescription>{room.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge className="bg-blue-100 text-blue-700">
                          Cleaning in Progress
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => updateRoomStatus(room.id, 'cleaningStatus', 'clean')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark as Clean
                        </Button>
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

export default StaffDashboard;