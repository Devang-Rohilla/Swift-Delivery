import React, { useState } from 'react';

// --- INLINE SVG ICONS (Replacing lucide-react) ---
const IconSvg = ({ children, className = "w-5 h-5", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const Sun = ({ className, size }) => <IconSvg className={className} size={size}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></IconSvg>;
const CloudRain = ({ className, size }) => <IconSvg className={className} size={size}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6M8 14v6M12 16v6" /></IconSvg>;
const Wind = ({ className, size }) => <IconSvg className={className} size={size}><path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 9.5A2.5 2.5 0 1 1 15 14H2M10.8 4.4A2 2 0 1 1 12 8H2" /></IconSvg>;
const Cloud = ({ className, size }) => <IconSvg className={className} size={size}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></IconSvg>;
const Bike = ({ className, size }) => <IconSvg className={className} size={size}><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" /></IconSvg>;
const Activity = ({ className, size }) => <IconSvg className={className} size={size}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></IconSvg>;
const MapPin = ({ className, size }) => <IconSvg className={className} size={size}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></IconSvg>;
const Navigation = ({ className, size }) => <IconSvg className={className} size={size}><polygon points="3 11 22 2 13 21 11 13 3 11" /></IconSvg>;
const Pizza = ({ className, size }) => <IconSvg className={className} size={size}><path d="M15 11h.01M11 15h.01M16 16h.01M2 16l20 6-6-20A20 20 0 0 0 2 16Z" /></IconSvg>;
const Car = ({ className, size }) => <IconSvg className={className} size={size}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></IconSvg>;
const MapIcon = ({ className, size }) => <IconSvg className={className} size={size}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></IconSvg>;
const AlertCircle = ({ className, size }) => <IconSvg className={className} size={size}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></IconSvg>;
const Timer = ({ className, size }) => <IconSvg className={className} size={size}><line x1="10" y1="2" x2="14" y2="2" /><line x1="12" y1="14" x2="15" y2="11" /><circle cx="12" cy="14" r="8" /></IconSvg>;

const WEATHER_ICONS = {
  Sunny: <Sun className="w-5 h-5 text-yellow-500" />,
  Stormy: <CloudRain className="w-5 h-5 text-gray-700" />,
  Sandstorms: <Wind className="w-5 h-5 text-yellow-700" />,
  Cloudy: <Cloud className="w-5 h-5 text-gray-500" />,
  Fog: <Cloud className="w-5 h-5 text-gray-300" />,
  Windy: <Wind className="w-5 h-5 text-teal-500" />
};

const INITIAL_FORM_STATE = {
  Restaurant_latitude: '',
  Restaurant_longitude: '',
  Delivery_location_latitude: '',
  Delivery_location_longitude: '',
  Weatherconditions: 'Sunny',
  Road_traffic_density: 'Medium',
  Vehicle_condition: 1,
  Type_of_order: 'Snack ',
  Type_of_vehicle: 'motorcycle ',
  multiple_deliveries: 0,
  Festival: 'No',
  City: 'Metropolitian',
  distance_km: ''
};

const SAMPLE_DATA = {
  Restaurant_latitude: 22.75,
  Restaurant_longitude: 75.89,
  Delivery_location_latitude: 22.80,
  Delivery_location_longitude: 75.93,
  Weatherconditions: 'Sunny',
  Road_traffic_density: 'Medium',
  Vehicle_condition: 2,
  Type_of_order: 'Meal ',
  Type_of_vehicle: 'motorcycle ',
  multiple_deliveries: 0,
  Festival: 'No',
  City: 'Metropolitian',
  distance_km: 5.4
};

// Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(2));
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadSampleData = () => {
    setFormData(SAMPLE_DATA);
    setError(null);
    setPrediction(null);
  };

  const computeDistance = () => {
    const { Restaurant_latitude, Restaurant_longitude, Delivery_location_latitude, Delivery_location_longitude } = formData;
    if (Restaurant_latitude && Restaurant_longitude && Delivery_location_latitude && Delivery_location_longitude) {
      const dist = calculateDistance(
        parseFloat(Restaurant_latitude), parseFloat(Restaurant_longitude),
        parseFloat(Delivery_location_latitude), parseFloat(Delivery_location_longitude)
      );
      setFormData(prev => ({ ...prev, distance_km: dist }));
    } else {
      setError("Please fill in all latitude and longitude fields first.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    const payload = {
      ...formData,
      Restaurant_latitude: parseFloat(formData.Restaurant_latitude),
      Restaurant_longitude: parseFloat(formData.Restaurant_longitude),
      Delivery_location_latitude: parseFloat(formData.Delivery_location_latitude),
      Delivery_location_longitude: parseFloat(formData.Delivery_location_longitude),
      Vehicle_condition: parseInt(formData.Vehicle_condition),
      multiple_deliveries: parseInt(formData.multiple_deliveries),
      distance_km: parseFloat(formData.distance_km)
    };

    try {
      const response = await fetch('https://swift-delivery-noxo.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // If FastAPI returns a 422 Validation Error, this catches it and reads the details
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Validation Error:", errorData);
        throw new Error(`Backend Error ${response.status}: Check console for details.`);
      }

      const data = await response.json();
      console.log("SUCCESS! Backend returned:", data); // <-- PRESS F12 TO SEE THIS IN BROWSER

      // --- ROBUST PARSING ---
      // This checks common ways ML APIs return data. 
      // Replace 'data.your_custom_key' if your backend returns a different name!
      let rawTime = data.prediction || data.result || data.estimated_time || data;
      
      // If the model returned an array like [25.4], extract the first item
      if (Array.isArray(rawTime)) {
        rawTime = rawTime[0];
      } else if (typeof rawTime === 'object' && rawTime !== null) {
        // If it's still an object, grab the very first value inside it
        rawTime = Object.values(rawTime)[0];
      }

      const predictedTime = parseFloat(rawTime);

      if (isNaN(predictedTime)) {
         throw new Error("Could not extract a valid number from the backend response.");
      }

      setPrediction({
        time: predictedTime.toFixed(1),
        status: predictedTime < 25 ? 'lightning' : predictedTime > 45 ? 'delayed' : 'normal'
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to connect to the prediction service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans selection:bg-amber-200">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Bike size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Swift Delivery AI</h1>
              <p className="text-sm text-slate-500 font-medium">ETA Prediction Engine</p>
            </div>
          </div>
          <button
            onClick={loadSampleData}
            className="px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2"
          >
            <Activity size={16} /> Load Sample Order
          </button>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-6">
            <form id="prediction-form" onSubmit={handleSubmit} className="space-y-6">

              {/* Card 1: Location & Distance */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <MapPin className="text-orange-500 w-5 h-5" /> Location Coordinates
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">Restaurant <span className="w-2 h-2 rounded-full bg-slate-400"></span></p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Latitude</label>
                        <input type="number" step="any" name="Restaurant_latitude" value={formData.Restaurant_latitude} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="22.75" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Longitude</label>
                        <input type="number" step="any" name="Restaurant_longitude" value={formData.Restaurant_longitude} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="75.89" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <p className="text-sm font-semibold text-orange-700 flex items-center gap-2">Delivery Drop <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span></p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Latitude</label>
                        <input type="number" step="any" name="Delivery_location_latitude" value={formData.Delivery_location_latitude} onChange={handleChange} required className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="22.80" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Longitude</label>
                        <input type="number" step="any" name="Delivery_location_longitude" value={formData.Delivery_location_longitude} onChange={handleChange} required className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="75.93" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Distance (km)</label>
                    <div className="flex items-center gap-4">
                      <input type="range" name="distance_km" min="0" max="50" step="0.1" value={formData.distance_km || 0} onChange={handleChange} className="flex-1 accent-orange-500" />
                      <input type="number" step="any" name="distance_km" value={formData.distance_km} onChange={handleChange} required className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0.0" />
                    </div>
                  </div>
                  <button type="button" onClick={computeDistance} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Navigation size={16} /> Compute
                  </button>
                </div>
              </div>

              {/* Card 2: Environment & Traffic */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <Cloud className="text-slate-400 w-5 h-5" /> Environment & Context
                </h2>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weather</label>
                    <div className="relative">
                      <select name="Weatherconditions" value={formData.Weatherconditions} onChange={handleChange} className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                        {['Sunny', 'Stormy', 'Sandstorms', 'Cloudy', 'Fog', 'Windy'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <div className="absolute left-3 top-2.5 pointer-events-none">{WEATHER_ICONS[formData.Weatherconditions]}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Traffic Density</label>
                    <select name="Road_traffic_density" value={formData.Road_traffic_density} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                      {['Low', 'Medium', 'High', 'Jam'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City Type</label>
                    <select name="City" value={formData.City} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                      {['Urban', 'Metropolitian', 'Semi-Urban'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 3: Fleet & Order */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <Pizza className="text-orange-400 w-5 h-5" /> Order & Fleet Details
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Vehicle Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'motorcycle ', icon: <Bike size={18} />, label: 'Motorcycle' },
                          { id: 'scooter ', icon: <Car size={18} />, label: 'Scooter' },
                          { id: 'electric_scooter ', icon: <Activity size={18} />, label: 'E-Scooter' },
                          { id: 'bicycle ', icon: <MapIcon size={18} />, label: 'Bicycle' }
                        ].map(v => (
                          <label key={v.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${formData.Type_of_vehicle === v.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <input type="radio" name="Type_of_vehicle" value={v.id} checked={formData.Type_of_vehicle === v.id} onChange={handleChange} className="hidden" />
                            {v.icon} <span className="text-xs font-medium">{v.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Condition (0-3)</label>
                      <input type="range" name="Vehicle_condition" min="0" max="3" step="1" value={formData.Vehicle_condition} onChange={handleChange} className="w-full accent-orange-500" />
                      <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                        <span>Poor</span><span>Avg</span><span>Good</span><span>Excel</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Order Category</label>
                      <select name="Type_of_order" value={formData.Type_of_order} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                        {['Snack ', 'Drinks ', 'Buffet ', 'Meal '].map(o => <option key={o} value={o}>{o.trim()}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Multiple Deliveries</label>
                        <select name="multiple_deliveries" value={formData.multiple_deliveries} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                          {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Festival Day?</label>
                        <select name="Festival" value={formData.Festival} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Results & Predict Button */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col h-full min-h-[400px]">
              <div className="absolute top-0 right-0 p-32 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="mb-auto z-10">
                <h3 className="text-slate-400 text-sm font-medium mb-1">AI Prediction Engine</h3>
                <p className="text-xl font-semibold mb-8">Estimated Delivery Time</p>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
                      <Bike className="text-orange-500 w-6 h-6" />
                    </div>
                    <p className="text-slate-400 text-sm animate-pulse">Computing ML Model...</p>
                  </div>
                ) : prediction ? (
                  <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-500">
                    <div className="relative">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" className="stroke-slate-800" strokeWidth="12" fill="none" />
                        <circle cx="96" cy="96" r="88" className="stroke-orange-500 transition-all duration-1000 ease-out" strokeWidth="12" fill="none" strokeDasharray="552" strokeDashoffset={552 - (552 * Math.min(prediction.time, 60)) / 60} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">
                          {prediction.time}
                        </span>
                        <span className="text-sm text-slate-400 mt-1">minutes</span>
                      </div>
                    </div>

                    <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      prediction.status === 'lightning' ? 'bg-emerald-500/20 text-emerald-400' :
                      prediction.status === 'delayed' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {prediction.status === 'lightning' ? '⚡ Lightning Fast' : prediction.status === 'delayed' ? '🐢 High Delay Potential' : '🕒 Standard Delivery'}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                    <Timer size={48} className="mb-4 text-slate-500" />
                    <p className="text-sm">Enter details and predict to see ETA</p>
                  </div>
                )}
              </div>

              {/* Route Stepper Simulation */}
              {prediction && !loading && (
                <div className="mt-8 pt-6 border-t border-slate-800 z-10 relative">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2 px-1">
                    <span>Restaurant</span>
                    <span>En Route</span>
                    <span>Doorstep</span>
                  </div>
                  <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full w-full animate-[progress_2s_ease-out_forwards]" style={{ '--tw-enter-opacity': '0' }}></div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                form="prediction-form"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none z-10 flex items-center justify-center gap-2"
              >
                {loading ? 'Predicting ETA...' : 'Predict ETA'} <Navigation className={loading ? 'animate-spin' : ''} size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}