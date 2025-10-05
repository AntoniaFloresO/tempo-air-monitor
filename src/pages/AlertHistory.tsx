import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, MapPin, Filter, Download, X } from 'lucide-react';
import { RiskLevel } from '@/types/air-quality';

interface Alert {
  id: string;
  timestamp: Date;
  location: string;
  coords: [number, number];
  riskLevel: RiskLevel;
  aqi: number;
  pollutant: string;
  message: string;
  resolved: boolean;
}

// Datos de ejemplo
const mockAlerts: Alert[] = [
  {
    id: '1',
    timestamp: new Date('2025-10-04T10:30:00'),
    location: 'Los Angeles, CA',
    coords: [-118.2437, 34.0522],
    riskLevel: 'unhealthy',
    aqi: 165,
    pollutant: 'NO₂',
    message: 'Elevated nitrogen dioxide levels detected. Avoid outdoor activities.',
    resolved: false,
  },
  {
    id: '2',
    timestamp: new Date('2025-10-03T14:15:00'),
    location: 'Houston, TX',
    coords: [-95.3698, 29.7604],
    riskLevel: 'moderate',
    aqi: 85,
    pollutant: 'O₃',
    message: 'Moderate ozone levels. Sensitive individuals should limit exposure.',
    resolved: true,
  },
  {
    id: '3',
    timestamp: new Date('2025-10-03T08:45:00'),
    location: 'Phoenix, AZ',
    coords: [-112.0740, 33.4484],
    riskLevel: 'very-unhealthy',
    aqi: 225,
    pollutant: 'PM2.5',
    message: 'Very unhealthy air quality. Staying indoors is recommended.',
    resolved: true,
  },
  {
    id: '4',
    timestamp: new Date('2025-10-02T16:20:00'),
    location: 'New York, NY',
    coords: [-74.0060, 40.7128],
    riskLevel: 'moderate',
    aqi: 95,
    pollutant: 'NO₂',
    message: 'Moderate air quality. Continuous monitoring recommended.',
    resolved: true,
  },
  {
    id: '5',
    timestamp: new Date('2025-10-02T11:00:00'),
    location: 'Denver, CO',
    coords: [-104.9903, 39.7392],
    riskLevel: 'unhealthy',
    aqi: 155,
    pollutant: 'O₃',
    message: 'Unhealthy ozone levels. Sensitive groups should avoid prolonged exposure.',
    resolved: true,
  },
  {
    id: '6',
    timestamp: new Date('2025-10-01T13:30:00'),
    location: 'Seattle, WA',
    coords: [-122.3321, 47.6062],
    riskLevel: 'good',
    aqi: 45,
    pollutant: 'NO₂',
    message: 'Good air quality. Normal conditions.',
    resolved: true,
  },
];

interface AQIRange {
  min: number;
  max: number;
}

const AlertHistory = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [aqiRange, setAqiRange] = useState<AQIRange>({ min: 0, max: 500 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const aqiRanges = [
    { label: '0-50 (Good)', min: 0, max: 50, color: 'bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20' },
    { label: '51-100 (Moderate)', min: 51, max: 100, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20' },
    { label: '101-150 (Unhealthy for Sensitive)', min: 101, max: 150, color: 'bg-orange-500/10 text-orange-700 border-orange-500/30 hover:bg-orange-500/20' },
    { label: '151-200 (Unhealthy)', min: 151, max: 200, color: 'bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20' },
    { label: '201-300 (Very Unhealthy)', min: 201, max: 300, color: 'bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20' },
    { label: '301-500 (Hazardous)', min: 301, max: 500, color: 'bg-purple-700/10 text-purple-900 border-purple-700/30 hover:bg-purple-700/20' },
  ];

  const getRiskColor = (level: RiskLevel) => {
    const colors = {
      good: 'bg-green-500/10 text-green-700 border-green-500/20',
      moderate: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      unhealthy: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      'very-unhealthy': 'bg-red-500/10 text-red-700 border-red-500/20',
      hazardous: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    };
    return colors[level];
  };

  const getRiskLabel = (level: RiskLevel) => {
    const labels = {
      good: 'Good',
      moderate: 'Moderate',
      unhealthy: 'Unhealthy',
      'very-unhealthy': 'Very Unhealthy',
      hazardous: 'Hazardous',
    };
    return labels[level];
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    if (aqi <= 200) return 'text-red-600';
    return 'text-purple-600';
  };

  const filteredAlerts = mockAlerts.filter((alert) => {
    // Filter by status
    if (filter === 'active' && alert.resolved) return false;
    if (filter === 'resolved' && !alert.resolved) return false;
    
    // Filter by AQI range
    if (alert.aqi < aqiRange.min || alert.aqi > aqiRange.max) return false;
    
    return true;
  });

  const activeAlertsCount = mockAlerts.filter(a => !a.resolved).length;
  const resolvedAlertsCount = mockAlerts.filter(a => a.resolved).length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleResetFilters = () => {
    setAqiRange({ min: 0, max: 500 });
    setSelectedRange(null);
  };

  const handleRangeSelect = (min: number, max: number, label: string) => {
    setAqiRange({ min, max });
    setSelectedRange(label);
  };

  const isFilterActive = aqiRange.min !== 0 || aqiRange.max !== 500;

  const exportToCSV = () => {
    // Sort alerts by timestamp (most recent first)
    const sortedAlerts = [...filteredAlerts].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    // CSV headers
    const headers = ['Date & Time', 'Location', 'Coordinates', 'AQI', 'Risk Level', 'Pollutant', 'Status', 'Message'];
    
    // Convert alerts to CSV rows
    const rows = sortedAlerts.map(alert => [
      formatDate(alert.timestamp),
      alert.location,
      `"${alert.coords[0]}, ${alert.coords[1]}"`,
      alert.aqi,
      getRiskLabel(alert.riskLevel),
      alert.pollutant,
      alert.resolved ? 'Resolved' : 'Active',
      `"${alert.message}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const filename = `tempo_alerts_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Header with fade */}
      <div className="relative">
        <div className="pt-24 pb-12 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-900/40">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Air Quality Monitoring</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Alert History
                </span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Complete tracking of all air quality alerts detected by TEMPO
              </p>
            </motion.div>
          </div>
        </div>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      {/* Main Content with fade */}
      <div className="relative">
        {/* Fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="container mx-auto px-4 py-12 bg-slate-950/60">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/70">
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{mockAlerts.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-orange-400/20 backdrop-blur-sm hover:border-orange-400/40 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">{activeAlertsCount}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-green-400/20 backdrop-blur-sm hover:border-green-400/40 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Resolved Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{resolvedAlertsCount}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full sm:w-auto">
                    <TabsList className="bg-slate-800/50 border border-cyan-400/20">
                      <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                        All ({mockAlerts.length})
                      </TabsTrigger>
                      <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                        Active ({activeAlertsCount})
                      </TabsTrigger>
                      <TabsTrigger value="resolved" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                        Resolved ({resolvedAlertsCount})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant={showFilters ? "default" : "outline"} 
                      size="sm" 
                      className={showFilters ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400" : "border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4" />
                      Filter AQI
                      {isFilterActive && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-white/20">
                          1
                        </Badge>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 flex items-center gap-2"
                      onClick={exportToCSV}
                      disabled={filteredAlerts.length === 0}
                    >
                      <Download className="w-4 h-4" />
                      Export
                      {filteredAlerts.length > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-cyan-500/20">
                          {filteredAlerts.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AQI Range Filter */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">Filter by AQI Range</CardTitle>
                      {isFilterActive && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleResetFilters}
                          className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
                        >
                          <X className="w-4 h-4" />
                          Reset
                        </Button>
                      )}
                    </div>
                    <CardDescription className="text-white/60">
                      Select an Air Quality Index range to filter alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {aqiRanges.map((range) => (
                        <Button
                          key={range.label}
                          variant={selectedRange === range.label ? "default" : "outline"}
                          className={`h-auto py-4 px-4 flex flex-col items-start justify-start text-left transition-all ${
                            selectedRange === range.label 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white ring-2 ring-cyan-400' 
                              : `${range.color} border-current`
                          }`}
                          onClick={() => handleRangeSelect(range.min, range.max, range.label)}
                        >
                          <span className="font-bold text-lg mb-1">
                            {range.min}-{range.max}
                          </span>
                          <span className="text-xs font-normal opacity-80">
                            {range.label.split('(')[1]?.replace(')', '') || range.label}
                          </span>
                        </Button>
                      ))}
                    </div>
                    
                    {isFilterActive && (
                      <div className="mt-4 p-3 bg-slate-800/50 border border-cyan-400/20 rounded-lg">
                        <p className="text-sm text-white/70">
                          Showing alerts with AQI between <span className="font-semibold text-cyan-300">{aqiRange.min}</span> and <span className="font-semibold text-cyan-300">{aqiRange.max}</span>
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Alerts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className={`bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all ${!alert.resolved ? 'border-l-4 border-l-orange-400' : ''}`}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="mt-1">
                            {alert.resolved ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-orange-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <CardTitle className="text-lg text-white">{alert.location}</CardTitle>
                              <Badge variant="outline" className={getRiskColor(alert.riskLevel)}>
                                {getRiskLabel(alert.riskLevel)}
                              </Badge>
                              {!alert.resolved && (
                                <Badge variant="destructive" className="text-xs bg-orange-500/20 text-orange-300 border-orange-400/30">
                                  ACTIVE
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-base mb-3 text-white/70">
                              {alert.message}
                            </CardDescription>
                            <div className="flex flex-wrap gap-4 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(alert.timestamp)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {alert.coords[0].toFixed(4)}, {alert.coords[1].toFixed(4)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="text-xs text-white/60 mb-1">
                            Air Quality Index
                          </div>
                          <div className={`text-3xl font-bold ${getAQIColor(alert.aqi)}`}>
                            {alert.aqi}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                          {alert.pollutant}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}

            {filteredAlerts.length === 0 && (
              <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-lg text-white/70">
                    No alerts found with the selected filters
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
        {/* Fade to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      <Footer />
    </div>
  );
};

export default AlertHistory;
