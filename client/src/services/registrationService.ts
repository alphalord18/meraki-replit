import { supabase } from "@/lib/supabase";
import { 
  Event, 
  EventCategory, 
  EventCategoryLink, 
  EventWithCategories, 
  Participant,
  School 
} from "@/types/registration";

// Generate unique school ID
export const generateSchoolId = (): string => {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `SCH${timestamp}${randomPart}`;
};

// Fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch all event categories
export const fetchEventCategories = async (): Promise<EventCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching event categories:', error);
    throw error;
  }
};

// Fetch category links for an event
export const fetchEventCategoryLinks = async (eventId?: number): Promise<EventCategoryLink[]> => {
  try {
    let query = supabase
      .from('event_category_link')
      .select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching event category links:', error);
    throw error;
  }
};

// Fetch events with their categories
export const fetchEventsWithCategories = async (): Promise<EventWithCategories[]> => {
  try {
    // Fetch all events
    const events = await fetchEvents();
    
    // Fetch all category links
    const allCategoryLinks = await fetchEventCategoryLinks();
    
    // Fetch all categories for detailed info
    const allCategories = await fetchEventCategories();
    
    // Map events with their categories
    const eventsWithCategories = events.map(event => {
      const categories = allCategoryLinks.filter(link => link.event_id === event.event_id);
      
      // Attach category details to each event
      const categoryDetails = categories.map(category => {
        return allCategories.find(cat => cat.category_id === category.category_id);
      }).filter(Boolean) as EventCategory[];
      
      return {
        ...event,
        categories,
        categoryDetails
      };
    });
    
    return eventsWithCategories;
  } catch (error) {
    console.error('Error fetching events with categories:', error);
    throw error;
  }
};

// Register a school
export const registerSchool = async (schoolData: Omit<School, 'school_id'>): Promise<School> => {
  try {
    const school_id = generateSchoolId();
    
    const { data, error } = await supabase
      .from('schools')
      .insert({ ...schoolData, school_id })
      .select()
      .single();

    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error('Error registering school:', error);
    throw error;
  }
};

// Register participants
export const registerParticipants = async (participants: Omit<Participant, 's_no'>[]): Promise<Participant[]> => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .insert(participants)
      .select();

    if (error) throw error;
    return data as Participant[];
  } catch (error) {
    console.error('Error registering participants:', error);
    throw error;
  }
};

// Full registration process
export const completeRegistration = async (
  schoolData: Omit<School, 'school_id'>, 
  participants: Omit<Participant, 'school_id' | 's_no'>[]
): Promise<{ school: School, participants: Participant[] }> => {
  try {
    // Register school first to get the school_id
    const school = await registerSchool(schoolData);
    
    // Add school_id to all participants
    const participantsWithSchoolId = participants.map(participant => ({
      ...participant,
      school_id: school.school_id
    }));
    
    // Register all participants
    const registeredParticipants = await registerParticipants(participantsWithSchoolId);
    
    return {
      school,
      participants: registeredParticipants
    };
  } catch (error) {
    console.error('Error completing registration:', error);
    throw error;
  }
};