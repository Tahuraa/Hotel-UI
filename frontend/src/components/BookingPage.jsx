import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Bed, 
  Calendar as CalendarIcon,
  Users, 
  Star, 
  Wifi, 
  Tv, 
  Car,
  Coffee,
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { mockRooms, mockBookings } from '../lib/mock';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';

const BookingPage = ({ user }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const availableRooms = mockRooms.filter(room => room.available);

  const getAIRecommendations = async () => {
    setLoadingAI(true);
    // Simulate AI processing
    setTimeout(() => {
      const suggestions = [
        {
          roomId: 'r1',
          reason: 'Based on your preferences for ocean views and luxury amenities',
          confidence: 95
        },
        {
          roomId: 'r2', 
          reason: 'Great value for money with essential amenities',
          confidence: 78
        }
      ];
      setAiSuggestions(suggestions);
      setLoadingAI(false);
      toast({
        title: "AI Recommendations Ready!",
        description: "Found personalized room suggestions for you",
        duration: 3000,
      });
    }, 2000);
  };

  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * days;
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      toast({
        title: "Missing Information",
        description: "Please select dates and a room",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newBooking = {
      id: `b${Date.now()}`,
      guestId: user.id,
      roomId: selectedRoom.id,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      totalAmount: calculateTotal(),
      status: 'confirmed',
      guests: guests,
      specialRequests: specialRequests
    };

    // Add to mock data (in real app, this would be API call)
    mockBookings.push(newBooking);

    toast({
      title: "Booking Confirmed!",
      description: `Your room has been booked successfully`,
      duration: 3000,
    });

    setTimeout(() => {
      navigate('/guest-dashboard');
    }, 1500);
  };

  const isAISuggested = (roomId) => {
    return aiSuggestions.some(suggestion => suggestion.roomId === roomId);
  };

  const getAISuggestion = (roomId) => {
    return aiSuggestions.find(suggestion => suggestion.roomId === roomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/guest-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Bed className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                  Book Your Stay
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showBookingForm ? (
          <>
            {/* Search Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Room</h2>
              
              {/* Date Selection */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date <= checkIn || date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      max="4"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={getAIRecommendations}
                    disabled={loadingAI}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loadingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Suggestions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Suggestions Banner */}
            {aiSuggestions.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">AI-Powered Recommendations</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Our AI has analyzed your preferences and found the perfect rooms for you!
                </p>
              </div>
            )}

            {/* Room Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {availableRooms.map((room) => {
                const suggestion = getAISuggestion(room.id);
                const isRecommended = isAISuggested(room.id);
                
                return (
                  <Card key={room.id} className={`shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                    isRecommended ? 'ring-2 ring-purple-400 bg-gradient-to-br from-purple-50 to-blue-50' : ''
                  }`}>
                    {isRecommended && (
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">AI Recommended ({suggestion.confidence}% match)</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-64">
                        <img 
                          src={room.images[0]} 
                          alt={room.type}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/90 text-gray-900 shadow-lg">
                            <Star className="h-3 w-3 mr-1 text-amber-500 fill-current" />
                            {room.rating}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-xl mb-2">{room.type}</CardTitle>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Room {room.number} • Floor {room.floor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Up to {room.capacity} guests</span>
                          </div>
                        </CardHeader>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 4).map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{room.amenities.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {isRecommended && suggestion && (
                          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-700">
                              <strong>Why AI recommends this:</strong> {suggestion.reason}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-green-600">${room.price}</span>
                            <span className="text-gray-600">/night</span>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowBookingForm(true);
                            }}
                            className={`${
                              isRecommended 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                                : 'bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700'
                            } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                          >
                            Select Room
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          /* Booking Form */
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Complete Your Booking</CardTitle>
                <CardDescription className="text-center">
                  You're booking {selectedRoom?.type} - Room {selectedRoom?.number}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{checkIn ? format(checkIn, "PPP") : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{checkOut ? format(checkOut, "PPP") : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Rate:</span>
                      <span>${selectedRoom?.price}/night</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any special requirements or requests..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1"
                  >
                    Back to Rooms
                  </Button>
                  <Button 
                    onClick={handleBooking}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;