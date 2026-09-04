export type TabType =
  | 'dashboard'
  | 'live-hud'
  | 'fog-visibility'
  | 'crossing-and-ai-delay'
  | 'route-profile'
  | 'maintenance'
  | 'what-if-and-sos';

export interface PilotProfile {
  name: string;
  id: string;
  designation: string;
  division: string;
  locoNumber: string;
  locoClass: string;
  rakeLength: string;
  tonnage: string;
  bapPressure: number; // bar
  mrpPressure: number; // bar
  tractionVoltage: number; // kV
  batteryState: number; // %
}

export interface ForwardHorizonItem {
  id: string;
  title: string;
  subtitle: string;
  distance: string;
  eta: string;
  type: 'curve' | 'signal' | 'crossing' | 'train';
  badgeColor: string;
  speedLimit?: string;
}

export interface RestrictionItem {
  dist: string;
  title: string;
  subtitle: string;
  details: string;
  speedBadge: string;
  speedColor: 'secondary' | 'primary' | 'error' | 'tertiary';
  etaImpact: string;
  icon: string;
}

export interface WhatIfPreset {
  id: string;
  name: string;
  sub: string;
  minutes: number;
  eta: string;
  delta: string;
  desc: string;
  colorType: 'error' | 'secondary' | 'tertiary';
}

export interface StationDelayPrediction {
  id: string;
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledTime: string;
  predictedTime: string;
  delayMinutes: number;
  platform: string;
  confidence: number;
  cause: string;
  recoveryPossibleMinutes: number;
  trackType: string;
  status: 'critical' | 'moderate' | 'nominal' | 'recovering';
}

export interface MaintenanceSubsystem {
  id: string;
  name: string;
  category: 'traction' | 'pneumatics' | 'electrical' | 'bogie' | 'safety';
  status: 'nominal' | 'caution' | 'warning';
  currentValue: string;
  defaultValue: string;
  unit: string;
  healthPercent: number;
  isDefaultCalibrated: boolean;
  lastInspected: string;
  description: string;
}

export interface DiagnosticCheckItem {
  id: string;
  title: string;
  system: string;
  passed: boolean;
  defaultSpec: string;
  liveReading: string;
}

export type HealthWarningLevel = 'NORMAL' | 'CAUTION' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';

export type DegradationStage =
  | 'NORMAL'
  | 'ABNORMAL_DETECTED'
  | 'DEGRADATION_DETECTED'
  | 'FAILURE_RISK_INCREASING'
  | 'CRITICAL_INSPECTION_REQUIRED';

export interface PredictiveHealthComponent {
  id: string;
  category:
    | 'wheel'
    | 'bearing'
    | 'brake'
    | 'coupler'
    | 'coach'
    | 'electrical'
    | 'signalling'
    | 'motor'
    | 'oil'
    | 'vibration'
    | 'tilt';
  name: string;
  location: string; // e.g. "Coach 7, Bogie 2, Axle 4" or "Loco WAP-7 Bogie 1"
  icon: string;
  currentReading: string;
  normalThreshold: string;
  trendText: string; // e.g. "+4°C / 10 min"
  warningLevel: HealthWarningLevel;
  stage: DegradationStage;
  healthPercent: number;
  failureRisk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  estimatedRiskWindow: string; // e.g. "Next 100–200 km"
  confidence: number; // e.g. 89%
  actionRequired: string;
  isSimulatedAnomaly?: boolean;
  // Multi-factor inputs
  aiFactors: {
    vibrationPattern: string; // e.g. "Harmonic defect tone @ 142 Hz (BPFI)"
    rateOfChange: string;
    previousMaintenance: string;
    componentAgeKm: string;
    previousFailures: string;
    trainSpeedLoad: string;
    routeConditionImpact: string;
    weatherImpact: string;
  };
}

export interface PredictiveHealthAlert {
  id: string;
  componentId: string;
  componentName: string;
  location: string;
  warningLevel: HealthWarningLevel;
  stage: DegradationStage;
  temperatureReading?: string;
  vibrationReading?: string;
  failureRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  action: string;
  timestamp: string;
}

export interface HealthOperationalImpact {
  decision: 'halt_inspection' | 'speed_restriction_30' | 'proceed_caution' | 'nominal';
  decisionTitle: string;
  description: string;
  locoDelayMinutes: number;
  affectedTrains: {
    trainNo: string;
    name: string;
    impactMinutes: number;
    delayType: string;
  }[];
  stationEtaImpacts: {
    stationCode: string;
    stationName: string;
    revisedDelayMins: number;
    revisedEta: string;
  }[];
  accidentRiskMitigated: string;
}

export type FogWarningLevel = 'NORMAL' | 'REDUCED' | 'LOW' | 'VERY_LOW' | 'CRITICAL';
export type VisibilityTrend = 'improving' | 'stable' | 'worsening';

export interface FogThresholdRule {
  id: string;
  minDistanceM: number;
  maxDistanceM: number;
  level: FogWarningLevel;
  label: string;
  badgeColor: string;
  speedCeilingKmh: number;
  detonatorRequired: boolean;
  whistleProtocol: string;
}

export interface RealtimeVisibilityMetrics {
  visibilityMeters: number;
  visibilityKmText: string;
  warningLevel: FogWarningLevel;
  fogDensity: 'None' | 'Light' | 'Moderate' | 'Dense' | 'Thick Radiation Fog';
  relativeHumidity: number; // %
  temperatureC: number; // °C
  dewPointC: number; // °C
  windSpeedKmh: number; // km/h
  weatherCondition: string;
  trend: VisibilityTrend;
  timestamp: string;
}

export interface EarlyFogWarning {
  active: boolean;
  title: string;
  visibilityMeters: number;
  trend: VisibilityTrend;
  locationAheadKm: number;
  landmark: string;
  expectedDurationMin: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  speedRecommendationKmh: number;
  advisoryText: string;
}

export interface RouteVisibilityPoint {
  distanceLabel: string; // e.g. "NOW", "5 KM", "10 KM", "15 KM", "20 KM"
  distanceKm: number;
  visibilityMeters: number;
  warningLevel: FogWarningLevel;
  trend: VisibilityTrend;
  landmark: string;
  statusBadge: string;
}

export interface FogSafetyCompoundHazard {
  id: string;
  title: string;
  hazardType: 'signal' | 'curve' | 'level_crossing' | 'speed_restriction' | 'train_ahead' | 'opposing_train' | 'station_junction';
  distanceMeters: number;
  distanceKmText: string;
  visibilityMeters: number;
  currentTrainSpeedKmh: number;
  stoppingDistanceRequiredMeters: number;
  sightlineDeficitMeters: number; // stoppingDistance - visibility (if positive, hazard cannot stop in sightline!)
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  targetEntity: string;
  targetAspect?: string;
  prescribedOperatingProcedure: string;
  fogSignalPostStatus: string;
  fsdBeepArmed: boolean;
}

export interface AiFogImpactPrediction {
  scheduledEta: string;
  aiDynamicEta: string;
  fogImpactMinutes: number;
  congestionImpactMinutes: number;
  ghatImpactMinutes: number;
  totalDriftMinutes: number;
  confidencePercent: number;
  speedCapAppliedKmh: number;
  causalChain: {
    step: number;
    title: string;
    description: string;
    delayContribution: string;
  }[];
}
