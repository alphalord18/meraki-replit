// Registration types matching the PostgreSQL schema
export interface School {
  school_id: string;
  school_name: string;
  address: string;
  coordinator_name: string;
  coordinator_email: string;
  coordinator_phone: string;
}

export interface EventCategory {
  category_id: number;
  category_name: string;
  min_class: number;
  max_class: number;
}

export interface Event {
  event_id: number;
  event_name: string;
}

export interface EventCategoryLink {
  id: number;
  event_id: number;
  category_id: number;
  max_participants: number;
}

export interface Participant {
  s_no?: number; // Optional as it's auto-generated
  school_id: string;
  event_id: number;
  participant_name: string;
  class: number;
  slot: number;
}

// Types for form state management
export interface EventWithCategories extends Event {
  categories: EventCategoryLink[];
  categoryDetails?: EventCategory[]; // To store the full category details
}

export interface ParticipantFormData {
  event_id: number;
  participant_name: string;
  class: number;
  slot: number;
}

export interface RegistrationFormData {
  school: Omit<School, 'school_id'>;
  participants: ParticipantFormData[];
}