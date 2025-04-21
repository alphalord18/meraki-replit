import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { completeRegistration } from "@/services/registrationService";
import type { 
  Event, 
  EventCategory, 
  EventCategoryLink, 
  EventWithCategories,
  ParticipantFormData,
  School
} from "@/types/registration";

// Define schemas based on the PostgreSQL database structure
const schoolSchema = z.object({
  school_name: z
    .string()
    .min(3, "School name must be at least 3 characters")
    .max(100, "School name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s'.&-]+$/,
      "School name can only contain letters, numbers, spaces, and basic punctuation",
    ),

  address: z
    .string()
    .min(10, "Please provide a complete school address")
    .max(200, "Address must not exceed 200 characters"),

  coordinator_name: z
    .string()
    .min(3, "Coordinator name must be at least 3 characters")
    .max(50, "Coordinator name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'.]+$/,
      "Coordinator name can only contain letters and basic punctuation",
    ),

  coordinator_email: z
    .string()
    .email("Invalid email address")
    .refine((email) => email.includes("."), "Email must contain a domain"),

  coordinator_phone: z
    .string()
    .regex(
      /^\+?[0-9]{10,12}$/,
      "Phone number must be 10-12 digits, optionally starting with +",
    ),
});

const participantSchema = z.object({
  participant_name: z
    .string()
    .min(3, "Participant name must be at least 3 characters")
    .max(50, "Participant name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'.]+$/,
      "Participant name can only contain letters and basic punctuation",
    ),
  class: z
    .number()
    .int()
    .refine(val => val >= 1 && val <= 12, {
      message: "Please select a class between 1 and 12",
    }),
  event_id: z
    .number()
    .int()
    .positive("Please select an event"),
  category_id: z
    .number()
    .int()
    .positive("Please select a category"),
  slot: z
    .number()
    .int()
    .min(1, "Slot number must be at least 1"),
});

const registrationSchema = z.object({
  school: schoolSchema,
  participants: z.array(participantSchema)
    .min(1, "At least one participant is required"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

const formSteps = [
  {
    title: "School Information",
    fields: ["school.school_name", "school.address"] as const,
  },
  {
    title: "Coordinator Details",
    fields: [
      "school.coordinator_name",
      "school.coordinator_email",
      "school.coordinator_phone",
    ] as const,
  },
  {
    title: "Events Selection",
    fields: ["selectedEvents"] as const,
  },
  {
    title: "Participants Details",
    fields: ["participants"] as const,
  },
];

// Generate a unique school ID that fits within the VARCHAR(10) limit
const generateSchoolId = (): string => {
  const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const timestamp = Date.now().toString().slice(-4);
  return `S${timestamp}${randomPart}`;
};

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<EventWithCategories[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [participants, setParticipants] = useState<ParticipantFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      school: {
        school_name: "",
        address: "",
        coordinator_name: "",
        coordinator_email: "",
        coordinator_phone: "",
      },
      participants: [],
    },
  });

  // Fetch events and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*');
        
        if (eventsError) throw eventsError;
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('event_categories')
          .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // Fetch event-category links
        const { data: linksData, error: linksError } = await supabase
          .from('event_category_link')
          .select('*');
        
        if (linksError) throw linksError;
        
        // Map events with their categories
        const eventsWithCategories = eventsData.map((event: Event) => {
          const eventLinks = linksData.filter((link: EventCategoryLink) => 
            link.event_id === event.event_id
          );
          
          const categoryDetails = eventLinks.map((link: EventCategoryLink) => 
            categoriesData.find((cat: EventCategory) => cat.category_id === link.category_id)
          ).filter(Boolean) as EventCategory[];
          
          return {
            ...event,
            categories: eventLinks,
            categoryDetails
          };
        });
        
        setEvents(eventsWithCategories);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events and categories. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const onSubmit = async (formData: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // Validate that all participants have valid information
      const invalidParticipants = participants.filter(p => 
        !p.participant_name || p.class === 0
      );
      
      if (invalidParticipants.length > 0) {
        toast({
          variant: "destructive",
          title: "Incomplete Participant Details",
          description: "Please fill in name and class for all participants.",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Process the participant data to ensure class is valid
      const participantData = participants.map(participant => ({
        event_id: participant.event_id,
        category_id: participant.category_id,
        participant_name: participant.participant_name,
        class: participant.class > 0 ? participant.class : 1, // Ensure class is never 0 
        slot: participant.slot
      }));
      
      console.log("Submitting participants:", participantData);
      
      // Use our registration service to complete the registration
      const { school, participants: registeredParticipants } = await completeRegistration(
        formData.school,
        participantData
      );
      
      toast({
        title: "Registration Successful!",
        description: `Your school ID is ${school.school_id}. Please keep this for your records.`,
      });

      form.reset();
      setParticipants([]);
      setSelectedEventIds([]);
      setCurrentStep(0);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEventSelection = (eventId: number) => {
    setSelectedEventIds(prev => {
      if (prev.includes(eventId)) {
        // Remove event and its participants
        setParticipants(prevParticipants => 
          prevParticipants.filter(p => p.event_id !== eventId)
        );
        return prev.filter(id => id !== eventId);
      } else {
        // Add event
        return [...prev, eventId];
      }
    });
  };

  const addParticipantForEvent = (eventId: number, categoryId: number) => {
    const event = events.find(e => e.event_id === eventId);
    if (!event) return;

    // Find the selected category
    const eventCategoryLink = event.categories.find(link => 
      link.category_id === categoryId
    );
    
    if (!eventCategoryLink) return;

    // Find existing participants for this event and category
    const existingParticipantsForEventCategory = participants.filter(p => 
      p.event_id === eventId && p.category_id === categoryId
    );

    // Check if we've reached max participants for this category
    if (existingParticipantsForEventCategory.length >= eventCategoryLink.max_participants) {
      toast({
        variant: "destructive",
        title: "Maximum Participants Reached",
        description: `You can only add up to ${eventCategoryLink.max_participants} participants for this event category.`,
      });
      return;
    }

    // Get category details
    const category = event.categoryDetails?.find(cat => cat.category_id === categoryId);
    if (!category) return;

    // Get the next slot number
    const nextSlot = existingParticipantsForEventCategory.length + 1;

    // Add a new participant - class left empty (0) for user selection
    const newParticipant: ParticipantFormData = {
      event_id: eventId,
      category_id: categoryId,
      participant_name: "",
      class: 0, // Default to empty/0 so user must select a class
      slot: nextSlot
    };

    setParticipants(prev => [...prev, newParticipant]);
    
    // Update form value
    const updatedParticipants = [...participants, newParticipant];
    form.setValue("participants", updatedParticipants);
  };
  
  // Auto-add minimum participants for a category
  const initializeParticipantsForCategory = (eventId: number, categoryId: number) => {
    const event = events.find(e => e.event_id === eventId);
    if (!event) return;

    // Find the category link to get minimum participants required
    const eventCategoryLink = event.categories.find(link => 
      link.category_id === categoryId
    );
    
    if (!eventCategoryLink) return;
    
    // Find category details for class limits
    const category = event.categoryDetails?.find(cat => cat.category_id === categoryId);
    if (!category) return;

    // For this implementation, we'll use the max_participants as our required minimum
    // since there's no min_participants field in the schema
    const minParticipants = Math.max(1, eventCategoryLink.max_participants);
    
    // Check if we already have participants for this event/category
    const existingParticipantsCount = participants.filter(p => 
      p.event_id === eventId && p.category_id === categoryId
    ).length;
    
    if (existingParticipantsCount > 0) return; // Already initialized
    
    // Create new participants - classes will be left empty (0) for user selection
    const newParticipants = Array.from({ length: minParticipants }).map((_, index) => ({
      event_id: eventId,
      category_id: categoryId,
      participant_name: "",
      class: 0, // Default to empty/0 so user must select a class
      slot: index + 1
    }));
    
    // Add to state and form
    setParticipants(prev => [...prev, ...newParticipants]);
    form.setValue("participants", [...participants, ...newParticipants]);
  };

  const updateParticipant = (index: number, field: keyof ParticipantFormData, value: any) => {
    const newParticipants = [...participants];
    newParticipants[index] = { 
      ...newParticipants[index], 
      [field]: field === 'event_id' || field === 'category_id' || field === 'class' || field === 'slot' 
        ? parseInt(value, 10) 
        : value 
    };
    
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };

  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    
    // Renumber slots for remaining participants with the same event_id and category_id
    const removedParticipant = participants[index];
    
    const updatedParticipants = newParticipants.map((p, i) => {
      if (p.event_id === removedParticipant.event_id && 
          p.category_id === removedParticipant.category_id) {
        // Count how many participants of this event/category come before this one
        const precedingCount = newParticipants
          .filter((p2, i2) => 
            i2 < i && 
            p2.event_id === removedParticipant.event_id && 
            p2.category_id === removedParticipant.category_id
          ).length;
        
        return {
          ...p,
          slot: precedingCount + 1
        };
      }
      return p;
    });
    
    setParticipants(updatedParticipants);
    form.setValue("participants", updatedParticipants);
  };

  const validateStep = async () => {
    switch (currentStep) {
      case 0:
        return await form.trigger(["school.school_name", "school.address"]);
      case 1:
        return await form.trigger([
          "school.coordinator_name",
          "school.coordinator_email",
          "school.coordinator_phone",
        ]);
      case 2:
        if (selectedEventIds.length === 0) {
          toast({
            variant: "destructive",
            title: "Events Required",
            description: "Please select at least one event.",
          });
          return false;
        }
        return true;
      case 3:
        // Make sure we have filled participants for at least one category per selected event
        const filledParticipantsByEvent = new Map<number, boolean>();
        
        // Initialize map with all selected events as false (not having filled participants yet)
        selectedEventIds.forEach(eventId => {
          filledParticipantsByEvent.set(eventId, false);
        });
        
        // Check if we have filled participants for each selected event
        for (const participant of participants) {
          // Skip unfilled participants
          if (!participant.participant_name || participant.class === 0) {
            continue;
          }
          
          // If this is a participant for a selected event, mark it as having filled participants
          if (selectedEventIds.includes(participant.event_id)) {
            filledParticipantsByEvent.set(participant.event_id, true);
          }
        }
        
        // Check if any selected event doesn't have filled participants
        const missingEvents: string[] = [];
        filledParticipantsByEvent.forEach((hasFilledParticipants, eventId) => {
          if (!hasFilledParticipants) {
            const event = events.find(e => e.event_id === eventId);
            if (event) {
              missingEvents.push(event.event_name);
            }
          }
        });
        
        if (missingEvents.length > 0) {
          toast({
            variant: "destructive",
            title: "Missing Participants",
            description: `Please add and fill participant details for the following events: ${missingEvents.join(", ")}`,
          });
          return false;
        }
        
        // Check if we have any participants at all
        if (participants.length === 0) {
          toast({
            variant: "destructive",
            title: "Participants Required",
            description: "Please add at least one participant.",
          });
          return false;
        }
        
        return await form.trigger(["participants"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Group participants by event and category for better organization
  const groupedParticipants = participants.reduce((groups, participant) => {
    const key = `${participant.event_id}-${participant.category_id}`;
    if (!groups[key]) {
      groups[key] = {
        event: events.find(e => e.event_id === participant.event_id),
        category: categories.find(c => c.category_id === participant.category_id),
        participants: []
      };
    }
    groups[key].participants.push(participant);
    return groups;
  }, {} as Record<string, { event: EventWithCategories | undefined, category: EventCategory | undefined, participants: ParticipantFormData[] }>);

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4">
        <h1
          className="text-5xl font-bold mb-12 text-center"
          style={{ fontFamily: "Noe Display" }}
        >
          School Registration
        </h1>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {formSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`text-sm ${
                      index <= currentStep ? "text-[#2E4A7D]" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-[#2E4A7D] h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentStep + 1) / formSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {currentStep === 0 && (
                        <>
                          <h2 className="font-semibold text-xl text-[#2E4A7D]">School Details</h2>
                          <FormField
                            control={form.control}
                            name="school.school_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="school.address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {currentStep === 1 && (
                        <>
                          <h2 className="font-semibold text-xl text-[#2E4A7D]">Coordinator Details</h2>
                          <FormField
                            control={form.control}
                            name="school.coordinator_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Coordinator Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="school.coordinator_email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="school.coordinator_phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    {...field}
                                    placeholder="+91XXXXXXXXXX"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <h2 className="font-semibold text-xl text-[#2E4A7D]">Select Events</h2>
                          <p className="text-sm text-gray-600 mb-4">
                            Choose one or more events for your school to participate in.
                          </p>
                          
                          <div className="space-y-4">
                            {events.map((event) => (
                              <div key={event.event_id} className="border p-4 rounded-md">
                                <div className="flex items-center space-x-3 mb-3">
                                  <Checkbox 
                                    id={`event-${event.event_id}`}
                                    checked={selectedEventIds.includes(event.event_id)} 
                                    onCheckedChange={() => toggleEventSelection(event.event_id)}
                                  />
                                  <label 
                                    htmlFor={`event-${event.event_id}`}
                                    className="font-medium cursor-pointer"
                                  >
                                    {event.event_name}
                                  </label>
                                </div>
                                
                                {event.categoryDetails && (
                                  <div className="ml-7 text-sm text-gray-600">
                                    <p className="mb-1">Available Categories:</p>
                                    <ul className="list-disc ml-5 space-y-1">
                                      {event.categoryDetails.map((category) => (
                                        <li key={category.category_id}>
                                          {category.category_name} (Classes {category.min_class}-{category.max_class})
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <h2 className="font-semibold text-xl text-[#2E4A7D]">Participant Details</h2>
                          
                          {selectedEventIds.length === 0 ? (
                            <p className="text-yellow-600">Please go back and select events first.</p>
                          ) : (
                            <>
                              {selectedEventIds.map((eventId) => {
                                const event = events.find(e => e.event_id === eventId);
                                if (!event) return null;
                                
                                return (
                                  <div key={eventId} className="border p-5 rounded-lg space-y-4 bg-gray-50">
                                    <h3 className="font-semibold text-lg text-[#2E4A7D]">{event.event_name}</h3>
                                    
                                    {/* Category selection */}
                                    <div className="bg-white p-4 rounded-md shadow-sm">
                                      <h4 className="font-medium text-sm mb-3">Add participants:</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {event.categoryDetails?.map((category) => (
                                          <div key={category.category_id} className="border p-3 rounded">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="font-medium text-sm">
                                                {category.category_name}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                Classes {category.min_class}-{category.max_class}
                                              </span>
                                            </div>
                                            
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                // Auto-initialize if this is the first time
                                                if (participants.filter(p => 
                                                  p.event_id === eventId && 
                                                  p.category_id === category.category_id
                                                ).length === 0) {
                                                  initializeParticipantsForCategory(eventId, category.category_id);
                                                } else {
                                                  // Add additional participant
                                                  addParticipantForEvent(eventId, category.category_id);
                                                }
                                              }}
                                              className="w-full mt-1"
                                              disabled={
                                                // Disable if participants already maxed out
                                                participants.filter(p => 
                                                  p.event_id === eventId && 
                                                  p.category_id === category.category_id
                                                ).length >= (
                                                  // Find the event category link to get max participants
                                                  event.categories.find(link => 
                                                    link.category_id === category.category_id
                                                  )?.max_participants || 0
                                                )
                                              }
                                            >
                                              {participants.filter(p => 
                                                p.event_id === eventId && 
                                                p.category_id === category.category_id
                                              ).length === 0 
                                                ? "Select Category" 
                                                : "Add Participant"
                                              }
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Display participants grouped by category */}
                                    {event.categoryDetails?.map(category => {
                                      const key = `${eventId}-${category.category_id}`;
                                      const group = groupedParticipants[key];
                                      
                                      if (!group || group.participants.length === 0) return null;
                                      
                                      return (
                                        <div key={key} className="mt-4">
                                          <div className="flex justify-between items-center bg-white p-2 rounded mb-3">
                                            <h4 className="font-medium text-md">
                                              {category.category_name} Participants
                                            </h4>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                // Remove all participants for this category
                                                const updatedParticipants = participants.filter(
                                                  p => !(p.event_id === eventId && p.category_id === category.category_id)
                                                );
                                                setParticipants(updatedParticipants);
                                                form.setValue("participants", updatedParticipants);
                                              }}
                                              className="text-red-500 h-8"
                                            >
                                              Remove Category
                                            </Button>
                                          </div>
                                          
                                          <div className="space-y-4">
                                            {group.participants.map((participant, pIndex) => {
                                              // Find index in the overall participants array
                                              const globalIndex = participants.findIndex(p => 
                                                p.event_id === participant.event_id && 
                                                p.category_id === participant.category_id && 
                                                p.slot === participant.slot
                                              );
                                              
                                              if (globalIndex === -1) return null;
                                              
                                              return (
                                                <div key={pIndex} className="bg-white p-4 rounded-md shadow-sm border">
                                                  <div className="flex justify-between items-center mb-3">
                                                    <h5 className="font-medium">Participant {participant.slot}</h5>
                                                    {/* No individual participant remove buttons as per requirement */}
                                                  </div>
                                                  
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                      <FormLabel>Name</FormLabel>
                                                      <Input
                                                        value={participant.participant_name}
                                                        onChange={(e) =>
                                                          updateParticipant(globalIndex, "participant_name", e.target.value)
                                                        }
                                                        className="mt-1"
                                                      />
                                                      {form.formState.errors.participants?.[globalIndex]?.participant_name && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                          {String(form.formState.errors.participants?.[globalIndex]?.participant_name?.message || "")}
                                                        </p>
                                                      )}
                                                    </div>
                                                    <div>
                                                      <FormLabel>Class</FormLabel>
                                                      <Select
                                                        value={participant.class.toString()}
                                                        onValueChange={(value) =>
                                                          updateParticipant(globalIndex, "class", value)
                                                        }
                                                      >
                                                        <SelectTrigger>
                                                          <SelectValue placeholder="Select class" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {Array.from(
                                                            { length: category.max_class - category.min_class + 1 },
                                                            (_, i) => category.min_class + i
                                                          ).map((classNum) => (
                                                            <SelectItem
                                                              key={classNum}
                                                              value={classNum.toString()}
                                                            >
                                                              Class {classNum}
                                                            </SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                      {form.formState.errors.participants?.[globalIndex]?.class && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                          {String(form.formState.errors.participants?.[globalIndex]?.class?.message || "")}
                                                        </p>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                              
                              {participants.length === 0 && (
                                <div className="bg-yellow-50 p-4 rounded-md text-center">
                                  <p className="text-yellow-700">
                                    Please add at least one participant from any of the selected events and categories.
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between pt-4">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        Previous
                      </Button>
                    )}
                    
                    {currentStep < formSteps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className={currentStep === 0 ? "w-full" : "ml-auto"}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="ml-auto"
                        disabled={isSubmitting || participants.length === 0}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
