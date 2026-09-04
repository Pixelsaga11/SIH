export type ScreenTab = 'overview' | 'live-map' | 'train-health' | 'track-and-bridges' | 'ai-prediction';

export type AssetCategory = 'all' | 'track' | 'bridges' | 'loco' | 'ohe';

export interface DispatchSection {
  id: string;
  name: string;
  division: string;
  zone: string;
  activeAnomalies: number;
}

export interface MetricSummary {
  fleetHealth: number;
  trackAnomalies: number;
  bridgesWatch: number;
  urgentWOs: number;
}

export interface AssetDiagnostic {
  id: string;
  category: 'track' | 'bridges' | 'loco' | 'ohe';
  tag: string;
  title: string;
  subtitle: string;
  severityLabel: string;
  severityType: 'defect' | 'caution' | 'warning' | 'monitored';
  section: string;
  riskScore: number;
  riskLabel: string;
  sensorTitle: string;
  sensorDescription: string;
  metrics: Array<{
    label: string;
    value: string;
    highlight?: boolean;
    variant?: 'error' | 'secondary' | 'tertiary' | 'primary';
  }>;
  aiMitigation?: {
    actionTitle: string;
    estRepair: string;
    description: string;
    cascadingDelayLabel: string;
    cascadingDelayValue: string;
  };
  actions: Array<{
    id: string;
    label: string;
    icon: string;
    primary?: boolean;
    variant?: 'primary' | 'secondary' | 'surface' | 'highest';
    doneMessage: string;
  }>;
  imageUrl?: string;
  imageCaptionMetrics?: Array<{
    label: string;
    value: string;
    variant?: 'error' | 'secondary' | 'primary';
    icon: string;
  }>;
  progressGauge?: {
    label: string;
    valueLabel: string;
    percentage: number;
    color: 'error' | 'primary' | 'tertiary';
    subtextLeft?: string;
    subtextRight?: string;
  };
}

export interface Workorder {
  id: string;
  assetId: string;
  assetTitle: string;
  priority: 'EMERGENCY' | 'CRITICAL' | 'MEDIUM' | 'ROUTINE';
  gang: string;
  description: string;
  status: 'PENDING' | 'DISPATCHED' | 'IN_PROGRESS' | 'CLEARED';
  createdAt: string;
  eta: string;
}

export interface TrainLocation {
  id: string;
  number: string;
  name: string;
  type: 'PASSENGER' | 'FREIGHT' | 'INSPECTION';
  speed: number;
  maxPermittedSpeed: number;
  locationKm: number;
  block: string;
  status: 'NOMINAL' | 'SPEED_RESTRICTED' | 'CAUTION_HALT';
  delayMin: number;
}

export interface TrackBlock {
  id: string;
  code: string;
  fromKm: number;
  toKm: number;
  status: 'CLEAR' | 'OCCUPIED' | 'RESTRICTED' | 'BLOCKED';
  tsrKmph?: number;
  trainId?: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  source: string;
  category: 'track' | 'bridges' | 'loco' | 'ohe' | 'system';
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  message: string;
  location: string;
}
