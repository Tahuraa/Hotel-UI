import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut, 
  Users, 
  ClipboardList, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { logoutUser, getAllBookings, updateBookingStatus, getHousekeepingTasks } from '../lib/mock';
import { useToast } from '../hooks/use-toast';

const StaffDashboard = ({ user, setUser }) => {
  const [bookings, setBookings] = useState([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const allBookings = getAllBookings();
      const tasks = getHousekeepingTasks();
      
      setBookings(allBookings);
      setHousekeepingTasks(tasks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleUpdateBooking = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    toast({
      title: "Status Updated",
      description: `Booking status changed to ${newStatus}`,
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todayBookings = bookings.filter(booking => 
    new Date(booking.checkIn).toDateString() === new Date().toDateString()
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Staff Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {housekeepingTasks.filter(t => t.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">48</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
            <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
                <CardDescription>
                  Manage customer bookings and room assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 8).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{booking.guestName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Room {booking.roomNumber} • {booking.roomType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateBooking(booking.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateBooking(booking.id, 'cancelled')}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateBooking(booking.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="housekeeping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Housekeeping Tasks
                </CardTitle>
                <CardDescription>
                  Track room cleaning and maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {housekeepingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                      <div className="flex items-center gap-4">
                        {task.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-amber-500" />
                        ) : task.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">Room {task.roomNumber}</h3>
                          <p className="text-sm text-gray-600">{task.task}</p>
                          <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDashboard;