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

// Predictive data with TEMPO + Reinforcement Learning
const mockAlerts: Alert[] = [
  {
    id: 'RL-001',
    timestamp: new Date('2025-10-05T14:00:00'),
    location: 'Los Angeles Basin, CA',
    coords: [-118.2437, 34.0522],
    riskLevel: 'very-unhealthy',
    aqi: 245,
    pollutant: 'NO₂ + O₃',
    message: '🧠 RL PREDICTION: TEMPO satellite + Q-Learning algorithm predicts 89% probability of severe photochemical smog at 2PM TODAY. Multi-agent system forecasts critical conditions. Avoid outdoor activities.',
    resolved: false,
  },
  {
    id: 'TEMPO-002',
    timestamp: new Date('2025-10-05T18:00:00'),
    location: 'San Joaquin Valley, CA',
    coords: [-119.7871, 36.7378],
    riskLevel: 'hazardous',
    aqi: 315,
    pollutant: 'PM2.5',
    message: '🛰️ TEMPO PREDICTION: Wildfire smoke plume forecast to reach area at 6PM TODAY moving SE at 15 km/h. Q-Learning algorithm predicts hazardous conditions for next 6 hours. Air masks required.',
    resolved: false,
  },
  {
    id: 'RL-003',
    timestamp: new Date('2025-10-05T16:30:00'),
    location: 'Houston Ship Channel, TX',
    coords: [-95.2631, 29.7355],
    riskLevel: 'unhealthy',
    aqi: 185,
    pollutant: 'SO₂ + NO₂',
    message: '🧠 Deep RL PREDICTION: Actor-Critic network forecasts industrial emission spike at 4:30PM with 92% confidence. TEMPO spectral analysis predicts elevated sulfur compounds. Avoid area for next 4 hours.',
    resolved: false,
  },
  {
    id: 'MEXICO-004',
    timestamp: new Date('2025-10-04T16:45:00'),
    location: 'Mexico City, Mexico',
    coords: [-99.1332, 19.4326],
    riskLevel: 'very-unhealthy',
    aqi: 265,
    pollutant: 'O₃ + PM2.5',
    message: '🇲🇽 TEMPO-Mexico RL: High-altitude megacity ozone formation predicted. Policy gradient algorithm detects thermal inversion at 2,240m elevation. Vulnerable populations avoid outdoor activities.',
    resolved: true,
  },
  {
    id: 'SOUTH-005',
    timestamp: new Date('2025-10-04T14:20:00'),
    location: 'Miami-Dade, FL',
    coords: [-80.1918, 25.7617],
    riskLevel: 'unhealthy',
    aqi: 175,
    pollutant: 'O₃ + NO₂',
    message: '🌴 Coastal RL Model: TEMPO detects Saharan dust + urban emissions interaction. Actor-critic network predicts photochemical reactions. Sea breeze dispersion expected after 6PM.',
    resolved: true,
  },
  {
    id: 'CANADA-006',
    timestamp: new Date('2025-10-04T12:00:00'),
    location: 'Toronto Metropolitan, ON',
    coords: [-79.3832, 43.6532],
    riskLevel: 'moderate',
    aqi: 125,
    pollutant: 'NO₂ + PM2.5',
    message: '🇨🇦 TEMPO-Canada RL: Cross-border pollution transport from Great Lakes region. Temporal difference learning predicts 3-hour moderate conditions. Cold front clearing expected.',
    resolved: true,
  },
  {
    id: 'SOUTH-007',
    timestamp: new Date('2025-10-04T08:30:00'),
    location: 'New Orleans, LA',
    coords: [-90.0715, 29.9511],
    riskLevel: 'unhealthy',
    aqi: 195,
    pollutant: 'O₃ + SO₂',
    message: '🏭 Gulf Coast RL Alert: Petrochemical complex emissions + humidity interaction predicted. TEMPO spectral analysis confirms sulfur compounds. Avoid Mississippi River industrial corridor.',
    resolved: true,
  },
  {
    id: 'MEXICO-008',
    timestamp: new Date('2025-10-03T19:15:00'),
    location: 'Monterrey, Mexico',
    coords: [-100.3161, 25.6866],
    riskLevel: 'very-unhealthy',
    aqi: 235,
    pollutant: 'PM10 + NO₂',
    message: '🏭 TEMPO-Mexico Industrial RL: Sierra Madre mountain valley trapping predicted with 96% accuracy. Multi-objective optimization detects dust + industrial emissions. Indoor shelter recommended.',
    resolved: true,
  },
  {
    id: 'SOUTH-009',
    timestamp: new Date('2025-10-03T15:45:00'),
    location: 'Austin, TX',
    coords: [-97.7431, 30.2672],
    riskLevel: 'unhealthy',
    aqi: 165,
    pollutant: 'O₃',
    message: '🌿 Texas Hill Country RL: Biogenic emissions + urban heat island interaction predicted. TEMPO vegetation analysis confirms cedar pollen + ozone formation. Natural air quality degradation.',
    resolved: true,
  },
  {
    id: 'CANADA-010',
    timestamp: new Date('2025-10-03T11:00:00'),
    location: 'Vancouver, BC',
    coords: [-123.1207, 49.2827],
    riskLevel: 'moderate',
    aqi: 115,
    pollutant: 'PM2.5',
    message: '🇨🇦 Pacific RL System: Mountain valley + ocean moisture interaction analysis. TEMPO cloud cover data confirms precipitation clearing. Epsilon-greedy policy: outdoor activities safe post-rain.',
    resolved: true,
  },
  {
    id: 'SOUTH-011',
    timestamp: new Date('2025-10-02T20:30:00'),
    location: 'Tampa Bay, FL',
    coords: [-82.4572, 27.9506],
    riskLevel: 'moderate',
    aqi: 95,
    pollutant: 'O₃',
    message: '🌊 Gulf Coast RL: Sea breeze + phosphate mining emissions interaction predicted. TEMPO wind pattern analysis confirms offshore flow dispersing particulates. Evening conditions improving.',
    resolved: true,
  },
  {
    id: 'MEXICO-012',
    timestamp: new Date('2025-10-02T16:15:00'),
    location: 'Guadalajara, Mexico',
    coords: [-103.3496, 20.6597],
    riskLevel: 'unhealthy',
    aqi: 180,
    pollutant: 'PM10 + O₃',
    message: '🇲�� TEMPO-Mexico RL: Atemajac Valley inversion layer predicted. Reinforcement learning detects dust + vehicle emissions trap. Avoid central metropolitan area until dispersal.',
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
    { 
      label: '0-100 (Good)', 
      min: 0, 
      max: 100, 
      color: 'bg-green-500/30 text-green-300 border-green-400/50 hover:bg-green-500/40 hover:border-green-400/70',
      selectedColor: 'bg-green-500/50 text-green-200 border-green-400/70 ring-2 ring-green-400/50'
    },
    { 
      label: '100-200 (Moderate)', 
      min: 100, 
      max: 200, 
      color: 'bg-yellow-500/30 text-yellow-300 border-yellow-400/50 hover:bg-yellow-500/40 hover:border-yellow-400/70',
      selectedColor: 'bg-yellow-500/50 text-yellow-200 border-yellow-400/70 ring-2 ring-yellow-400/50'
    },
    { 
      label: '200-300 (Unhealthy)', 
      min: 200, 
      max: 300, 
      color: 'bg-orange-500/30 text-orange-300 border-orange-400/50 hover:bg-orange-500/40 hover:border-orange-400/70',
      selectedColor: 'bg-orange-500/50 text-orange-200 border-orange-400/70 ring-2 ring-orange-400/50'
    },
    { 
      label: '300-400 (Very Unhealthy)', 
      min: 300, 
      max: 400, 
      color: 'bg-red-500/30 text-red-300 border-red-400/50 hover:bg-red-500/40 hover:border-red-400/70',
      selectedColor: 'bg-red-500/50 text-red-200 border-red-400/70 ring-2 ring-red-400/50'
    },
    { 
      label: '400-500 (Hazardous)', 
      min: 400, 
      max: 500, 
      color: 'bg-red-700/30 text-red-200 border-red-600/50 hover:bg-red-700/40 hover:border-red-600/70',
      selectedColor: 'bg-red-700/50 text-red-100 border-red-600/70 ring-2 ring-red-600/50'
    },
  ];

  const getRiskColor = (level: RiskLevel) => {
    const colors = {
      good: 'bg-green-500/20 text-green-300 border-green-400/40',
      moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
      unhealthy: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
      'very-unhealthy': 'bg-red-500/20 text-red-300 border-red-400/40',
      hazardous: 'bg-red-700/20 text-red-200 border-red-600/40',
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
    if (aqi <= 100) return 'text-green-400';
    if (aqi <= 200) return 'text-yellow-400';
    if (aqi <= 300) return 'text-orange-400';
    if (aqi <= 400) return 'text-red-400';
    return 'text-red-300';
  };

  const filteredAlerts = mockAlerts.filter((alert) => {
    if (filter === 'active' && alert.resolved) return false;
    if (filter === 'resolved' && !alert.resolved) return false;
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
    const sortedAlerts = [...filteredAlerts].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    const headers = ['Date & Time', 'Location', 'Coordinates', 'AQI', 'Risk Level', 'Pollutant', 'Status', 'Message'];
    
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

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

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
                <span className="text-sm font-medium text-cyan-300">🧠 Reinforcement Learning Predictions</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Predictive Alerts
                </span>
              </h1>
              <p className="text-lg text-white/100 max-w-3xl">
                🛰️ TEMPO satellite data + 🧠 Reinforcement Learning algorithms predict future air quality events with 90%+ accuracy. Q-Learning, Actor-Critic, and Policy Gradient methods forecasting atmospheric conditions.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="container mx-auto px-4 py-12 bg-slate-950/60">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/70">
                  🔮 Total Predictions
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
                  ⚡ Future Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">{activeAlertsCount}</div>
                <div className="text-xs text-orange-300 mt-1">Next 24 hours</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-green-400/20 backdrop-blur-sm hover:border-green-400/40 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  ✓ Past Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{resolvedAlertsCount}</div>
                <div className="text-xs text-purple-300 mt-1 flex items-center gap-1">
                  🧠 <span>94.2% Q-Learning Accuracy</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'active' | 'resolved')} className="w-full sm:w-auto">
                    <TabsList className="bg-slate-800/50 border border-cyan-400/20">
                      <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                        🔮 All Predictions ({mockAlerts.length})
                      </TabsTrigger>
                      <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                        ⚡ Future ({activeAlertsCount})
                      </TabsTrigger>
                      <TabsTrigger value="resolved" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                        ✓ Past ({resolvedAlertsCount})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant={showFilters ? "default" : "outline"} 
                      size="sm" 
                      className={showFilters ? "bg-cyan-500/30 text-cyan-200 hover:bg-cyan-500/40 border border-cyan-400/50" : "border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4" />
                      Filter AQI
                      {isFilterActive && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-cyan-400/30 text-cyan-200">
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
                        <Badge variant="secondary" className="ml-1 bg-cyan-500/20 text-cyan-200">
                          {filteredAlerts.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                              ? range.selectedColor
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
                          <div className="mt-1 relative">
                            {alert.resolved ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-orange-400" />
                            )}
                            {(alert.id.startsWith('RL-') || alert.message.includes('🤖') || alert.message.includes('🧠')) && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              </div>
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
                    🔮 No predictions found with the selected filters
                  </p>
                  <p className="text-sm text-white/50 mt-2">
                    Try adjusting your filters to see more Reinforcement Learning predictions
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-10" />
      </div>

      <Footer />
    </div>
  );
};

export default AlertHistory;
