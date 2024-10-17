export interface Promotion {
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  images: string[];
  features: string[];
  amenities: string[];
  detailedInformation: string[];
  pricingPlans: PricingPlan[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  developerInfo: DeveloperInfo;
  constructionProgress: ConstructionProgress[];
  nearbyPlaces: NearbyPlace[];
  contact: {
    phone: string;
    email: string;
    address: string;
    mapLink: string;
  };
}

interface PricingPlan {
  type: string;
  price: string;
  features: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface Testimonial {
  name: string;
  source: string;
  feedback: string;
}

interface DeveloperInfo {
  name: string;
  logo: string;
  description: string;
}

interface ConstructionProgress {
  stage: string;
  completion: number;
}

interface NearbyPlace {
  name: string;
  distance: string;
  category: string;
}
