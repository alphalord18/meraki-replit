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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
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
    .min(1, "Class must be at least 1")
    .max(12, "Class must not exceed 12"),
  event_id: z
    .number()
    .int()
    .positive("Please select an event"),
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
    title: "Event Registration",
    fields: ["participants"] as const,
  },
];

// Generate a unique school ID
const generateSchoolId = (): string => {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `SCH${timestamp}${randomPart}`;
};

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<EventWithCategories[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
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
      // Generate a unique school ID
      const school_id = generateSchoolId();
      
      // Create the school record
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({
          school_id,
          school_name: formData.school.school_name,
          address: formData.school.address,
          coordinator_name: formData.school.coordinator_name,
          coordinator_email: formData.school.coordinator_email,
          coordinator_phone: formData.school.coordinator_phone
        })
        .select()
        .single();
      
      if (schoolError) throw schoolError;
      
      // Map participants to include school_id
      const participantsToInsert = formData.participants.map(participant => ({
        school_id,
        event_id: participant.event_id,
        participant_name: participant.participant_name,
        class: participant.class,
        slot: participant.slot
      }));
      
      // Insert all participants
      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantsToInsert);
      
      if (participantsError) throw participantsError;
      
      toast({
        title: "Registration Successful!",
        description: `Your school ID is ${school_id}. Please keep this for your records.`,
      });

      form.reset();
      setParticipants([]);
      setSelectedEventId(null);
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

  const handleEventChange = (eventId: string) => {
    const eventIdNumber = parseInt(eventId, 10);
    setSelectedEventId(eventIdNumber);

    // Find the selected event
    const selectedEvent = events.find(event => event.event_id === eventIdNumber);
    if (!selectedEvent) return;

    // Get max participants for this event
    const maxParticipants = selectedEvent.categories.reduce((max, link) => {
      return Math.max(max, link.max_participants);
    }, 0);

    // Reset participants for this event
    const newParticipants = Array(maxParticipants)
      .fill(null)
      .map((_, index) => ({
        event_id: eventIdNumber,
        participant_name: "",
        class: 6, // Default class
        slot: index + 1
      }));

    setParticipants(newParticipants);
    form.setValue('participants', newParticipants);
  };

  const updateParticipant = (index: number, field: keyof ParticipantFormData, value: any) => {
    const newParticipants = [...participants];
    newParticipants[index] = { 
      ...newParticipants[index], 
      [field]: field === 'event_id' || field === 'class' || field === 'slot' 
        ? parseInt(value, 10) 
        : value 
    };
    
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
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
        if (participants.length === 0) {
          toast({
            variant: "destructive",
            title: "Participants Required",
            description: "Please select an event and add participants.",
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

            {isLoading ? (
              <div className="text-center py-10">
                <p>Loading events data...</p>
              </div>
            ) : (
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
                        <div className="space-y-4">
                          <h2 className="font-semibold text-xl text-[#2E4A7D]">Event & Participant Registration</h2>
                          
                          {/* Event Selection */}
                          <div className="mb-6">
                            <FormLabel>Select Event</FormLabel>
                            <Select
                              value={selectedEventId?.toString() || ""}
                              onValueChange={handleEventChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select an event" />
                              </SelectTrigger>
                              <SelectContent>
                                {events.map((event) => (
                                  <SelectItem key={event.event_id} value={event.event_id.toString()}>
                                    {event.event_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Display event categories if an event is selected */}
                          {selectedEventId && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-md">
                              <h3 className="font-medium text-sm mb-2">Event Categories:</h3>
                              <ul className="text-sm text-gray-600">
                                {events
                                  .find(e => e.event_id === selectedEventId)
                                  ?.categoryDetails
                                  ?.map((cat, idx) => (
                                    <li key={idx}>• {cat.category_name} (Classes {cat.min_class}-{cat.max_class})</li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* Participant Details */}
                          {selectedEventId && participants.length > 0 && (
                            <div className="space-y-4">
                              <h3 className="font-medium text-lg">
                                Participant Details
                              </h3>
                              {participants.map((participant, index) => (
                                <div key={index} className="border p-4 rounded-md">
                                  <h4 className="text-sm font-medium mb-2">Participant {index + 1}</h4>
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <FormLabel>Name</FormLabel>
                                      <Input
                                        value={participant.participant_name}
                                        onChange={(e) =>
                                          updateParticipant(index, "participant_name", e.target.value)
                                        }
                                      />
                                      {form.formState.errors.participants?.[index]?.participant_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {String(form.formState.errors.participants?.[index]?.participant_name?.message || "")}
                                        </p>
                                      )}
                                    </div>
                                    <div>
                                      <FormLabel>Class (1-12)</FormLabel>
                                      <Input
                                        type="number"
                                        min={1}
                                        max={12}
                                        value={participant.class || ""}
                                        onChange={(e) =>
                                          updateParticipant(index, "class", e.target.value)
                                        }
                                      />
                                      {form.formState.errors.participants?.[index]?.class && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {String(form.formState.errors.participants?.[index]?.class?.message || "")}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;