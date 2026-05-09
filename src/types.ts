export type DiseaseType = 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Healthy';

export interface Diagnosis {
  id: string;
  timestamp: number;
  imageUrl: string;
  cropName: string;
  diseaseName: string;
  diseaseType: DiseaseType;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  symptoms: string[];
  treatment: string[];
  preventiveMeasures: string[];
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface Outbreak {
  id: string;
  diseaseName: string;
  diseaseType: DiseaseType;
  location: {
    lat: number;
    lng: number;
  };
  intensity: number; // 0 to 1
  reportedAt: number;
  cropType: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'Farmer' | 'Expert' | 'Admin';
  farmLocation?: {
    lat: number;
    lng: number;
  };
  language: string;
}
