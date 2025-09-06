import React from 'react';
import { MapPin, Clock, DollarSign, Star, Calendar, Plane, Car, Hotel, Utensils } from 'lucide-react';

export interface ItineraryData {
  title?: string;
  destination?: string;
  duration?: string;
  budget?: string;
  rating?: number;
  description?: string;
  days?: Array<{
    day: number;
    title?: string;
    activities?: Array<{
      time?: string;
      activity: string;
      location?: string;
      cost?: string;
      notes?: string;
      type?: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'transport';
    }>;
  }>;
  summary?: {
    totalCost?: string;
    totalDays?: number;
    highlights?: string[];
    tips?: string[];
  };
}

interface ItineraryProps {
  data: ItineraryData | null;
  isLoading?: boolean;
}

const Itinerary: React.FC<ItineraryProps> = ({ data, isLoading = false }) => {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5" />;
      case 'hotel':
        return <Hotel className="w-5 h-5" />;
      case 'restaurant':
        return <Utensils className="w-5 h-5" />;
      case 'transport':
        return <Car className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type?: string) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-100 text-blue-600';
      case 'hotel':
        return 'bg-purple-100 text-purple-600';
      case 'restaurant':
        return 'bg-orange-100 text-orange-600';
      case 'transport':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/50 overflow-y-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Your Itinerary is Empty</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Start a conversation with the AI to generate a personalized travel plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/50 overflow-y-auto">
      <div className="p-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
            {data.title || 'Your Travel Itinerary'}
          </h2>
          
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 mb-4">
            {data.destination && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{data.destination}</span>
              </div>
            )}
            {data.duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>{data.duration}</span>
              </div>
            )}
            {data.budget && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                <span>{data.budget}</span>
              </div>
            )}
            {data.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{data.rating}/5 Stars</span>
              </div>
            )}
          </div>

          {data.description && (
            <p className="text-gray-700 bg-gray-50 rounded-xl p-4 text-sm leading-relaxed border border-gray-200/80">
              {data.description}
            </p>
          )}
        </header>

        {data.days && data.days.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3">
              Daily Schedule
            </h3>
            
            <div className="relative pl-8">
              <div className="absolute left-3 top-2 h-full w-0.5 bg-gray-200/80 rounded"></div>
              
              {data.days.map((day, dayIndex) => (
                <div key={dayIndex} className="relative mb-8">
                  <div className="absolute left-3 top-2 -ml-[7px] h-4 w-4 rounded-full bg-blue-600 border-4 border-white"></div>
                  <div className="pl-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-4">
                      {day.title || `Day ${day.day}`}
                    </h4>
                    
                    {day.activities && day.activities.length > 0 && (
                      <div className="space-y-4">
                        {day.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <div className="flex items-start space-x-4">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-gray-800">
                                    {activity.activity}
                                  </p>
                                  {activity.time && (
                                    <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                                      {activity.time}
                                    </span>
                                  )}
                                </div>
                                
                                {activity.location && (
                                  <p className="text-sm text-gray-600 flex items-center mt-1">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    {activity.location}
                                  </p>
                                )}
                                
                                {activity.cost && (
                                  <p className="text-sm text-green-700 flex items-center mt-1">
                                    <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                                    {activity.cost}
                                  </p>
                                )}
                                
                                {activity.notes && (
                                  <p className="text-sm text-gray-500 italic mt-2 bg-gray-50 p-2 rounded-lg">
                                    {activity.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.summary && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200/80">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Trip Summary
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              {data.summary.totalCost && (
                <div className="flex items-center bg-white/80 p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 mr-3 text-green-500" />
                  <div>
                    <span className="text-gray-500">Total Budget</span>
                    <p className="font-semibold text-gray-800">{data.summary.totalCost}</p>
                  </div>
                </div>
              )}
              {data.summary.totalDays && (
                <div className="flex items-center bg-white/80 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <span className="text-gray-500">Duration</span>
                    <p className="font-semibold text-gray-800">{data.summary.totalDays} days</p>
                  </div>
                </div>
              )}
            </div>

            {data.summary.highlights && data.summary.highlights.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Trip Highlights:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {data.summary.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-4 h-4 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.summary.tips && data.summary.tips.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Travel Tips:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {data.summary.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <Plane className="w-4 h-4 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
