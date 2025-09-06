import React from 'react';
import { MapPin, Clock, Users, DollarSign, Star, Calendar, Plane, Car, Hotel, Utensils } from 'lucide-react';

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
        return <Plane className="w-4 h-4" />;
      case 'hotel':
        return <Hotel className="w-4 h-4" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'transport':
        return <Car className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type?: string) => {
    switch (type) {
      case 'flight':
        return 'text-blue-600 bg-blue-50';
      case 'hotel':
        return 'text-purple-600 bg-purple-50';
      case 'restaurant':
        return 'text-orange-600 bg-orange-50';
      case 'transport':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/50 overflow-y-auto">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Itinerary Yet</h3>
          <p className="text-gray-500 text-sm">
            Start chatting to get a personalized travel itinerary!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            {data.title || 'Your Travel Itinerary'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            {data.destination && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{data.destination}</span>
              </div>
            )}
            {data.duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{data.duration}</span>
              </div>
            )}
            {data.budget && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{data.budget}</span>
              </div>
            )}
            {data.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <span>{data.rating}/5 Stars</span>
              </div>
            )}
          </div>

          {data.description && (
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4 text-sm leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Daily Itinerary */}
        {data.days && data.days.length > 0 && (
          <div className="space-y-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Daily Schedule
            </h3>
            
            {data.days.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {day.day}
                  </div>
                  {day.title || `Day ${day.day}`}
                </h4>
                
                {day.activities && day.activities.length > 0 && (
                  <div className="space-y-3">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 truncate">
                                {activity.activity}
                              </h5>
                              {activity.time && (
                                <span className="text-sm text-gray-500 ml-2">
                                  {activity.time}
                                </span>
                              )}
                            </div>
                            
                            {activity.location && (
                              <p className="text-sm text-gray-600 flex items-center mb-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {activity.location}
                              </p>
                            )}
                            
                            {activity.cost && (
                              <p className="text-sm text-green-600 flex items-center mb-1">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {activity.cost}
                              </p>
                            )}
                            
                            {activity.notes && (
                              <p className="text-sm text-gray-500 italic mt-1">
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
            ))}
          </div>
        )}

        {/* Summary */}
        {data.summary && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Trip Summary
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
              {data.summary.totalCost && (
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">Total Budget: {data.summary.totalCost}</span>
                </div>
              )}
              {data.summary.totalDays && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Duration: {data.summary.totalDays} days</span>
                </div>
              )}
            </div>

            {data.summary.highlights && data.summary.highlights.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Trip Highlights:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {data.summary.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.summary.tips && data.summary.tips.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Travel Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {data.summary.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
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