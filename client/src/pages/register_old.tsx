import { useState } from "react";
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

const events = [
  { id: "poetry_slam", name: "Poetry Slam Championship", maxParticipants: 2 },
  { id: "debate", name: "Literary Debate Competition", maxParticipants: 2 },
  { id: "storytelling", name: "Storytelling Contest", maxParticipants: 1 },
];

const registrationSchema = z.object({
  schoolName: z
    .string()
    .min(3, "School name must be at least 3 characters")
    .max(100, "School name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s'.&-]+$/,
      "School name can only contain letters, numbers, spaces, and basic punctuation",
    ),

  schoolAddress: z
    .string()
    .min(10, "Please provide a complete school address")
    .max(200, "Address must not exceed 200 characters"),

  coordinatorName: z
    .string()
    .min(3, "Coordinator name must be at least 3 characters")
    .max(50, "Coordinator name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'.]+$/,
      "Coordinator name can only contain letters and basic punctuation",
    ),

  coordinatorEmail: z
    .string()
    .email("Invalid email address")
    .refine((email) => email.includes("."), "Email must contain a domain"),

  coordinatorPhone: z
    .string()
    .regex(
      /^\+?[0-9]{10,12}$/,
      "Phone number must be 10-12 digits, optionally starting with +",
    ),

  selectedEvents: z
    .array(z.string())
    .min(1, "Select at least one event")
    .max(3, "Maximum 3 events can be selected"),

  participants: z
    .array(
      z.object({
        eventId: z.string(),
        name: z
          .string()
          .min(3, "Participant name must be at least 3 characters")
          .max(50, "Participant name must not exceed 50 characters")
          .regex(
            /^[a-zA-Z\s'.]+$/,
            "Participant name can only contain letters and basic punctuation",
          ),
        grade: z
          .string()
          .regex(/^([6-9]|1[0-2])$/, "Grade must be between 6 and 12"),
      }),
    )
    .refine((participants) => {
      // Check if we have exact number of participants for each event
      const eventCounts = participants.reduce(
        (acc, p) => {
          acc[p.eventId] = (acc[p.eventId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      for (const eventId of Object.keys(eventCounts)) {
        const event = events.find((e) => e.id === eventId);
        if (!event || eventCounts[eventId] !== event.maxParticipants) {
          return false;
        }
      }
      return true;
    }, "Please add the exact number of required participants for each event"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

const formSteps = [
  {
    title: "School Information",
    fields: ["schoolName", "schoolAddress"] as const,
  },
  {
    title: "Coordinator Details",
    fields: [
      "coordinatorName",
      "coordinatorEmail",
      "coordinatorPhone",
    ] as const,
  },
  {
    title: "Event Selection",
    fields: ["selectedEvents"] as const,
  },
  {
    title: "Participant Details",
    fields: ["participants"] as const,
  },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [participants, setParticipants] = useState<
    Array<{ eventId: string; name: string; grade: string }>
  >([]);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      schoolName: "",
      schoolAddress: "",
      coordinatorName: "",
      coordinatorEmail: "",
      coordinatorPhone: "",
      selectedEvents: [],
      participants: [],
    },
  });

  const onSubmit = async (formData: RegistrationData) => {
    const isValid = await validateStep(true);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const registrationData = {
        schoolName: formData.schoolName,
        schoolAddress: formData.schoolAddress,
        coordinatorName: formData.coordinatorName,
        coordinatorEmail: formData.coordinatorEmail,
        coordinatorPhone: formData.coordinatorPhone,
        registrationId: `REG-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        status: "pending",
        createdAt: new Date().toISOString(),
        events: selectedEvents.map(eventId => ({ 
          eventId, 
          participants: participants.filter(p => p.eventId === eventId),
        })),
      };

      const { error } = await supabase
        .from('registrations')
        .insert(registrationData);
        
      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: `Your registration ID is ${registrationData.registrationId}`,
      });

      form.reset();
      setSelectedEvents([]);
      setParticipants([]);
      setCurrentStep(0);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateParticipants = () => {
    let isValid = true;

    // Check if we have any events selected
    if (selectedEvents.length === 0) {
      toast({
        variant: "destructive",
        title: "No Events Selected",
        description: "Please go back and select at least one event.",
      });
      return false;
    }

    // Validate each event's participants
    for (const eventId of selectedEvents) {
      const event = events.find((e) => e.id === eventId);
      if (!event) continue;

      const eventParticipants = participants.filter((p) => p.eventId === eventId);

      // Check if we have the right number of participants
      if (eventParticipants.length !== event.maxParticipants) {
        toast({
          variant: "destructive",
          title: "Incomplete Participants",
          description: `${event.name} requires exactly ${event.maxParticipants} participants.`,
        });
        return false;
      }

      // Check if all participants have valid details
      for (const participant of eventParticipants) {
        if (!participant.name || participant.name.trim() === '') {
          toast({
            variant: "destructive",
            title: "Missing Information",
            description: `Please enter a name for all ${event.name} participants.`,
          });
          return false;
        }

        if (!participant.grade || !/^([6-9]|1[0-2])$/.test(participant.grade)) {
          toast({
            variant: "destructive",
            title: "Invalid Grade",
            description: `Please enter a valid grade (6-12) for all ${event.name} participants.`,
          });
          return false;
        }

        if (!/^[a-zA-Z\s'.]+$/.test(participant.name)) {
          toast({
            variant: "destructive",
            title: "Invalid Name Format",
            description: `Participant names can only contain letters and basic punctuation.`,
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleEventSelect = (eventId: string) => {
    if (selectedEvents.length >= 3 && !selectedEvents.includes(eventId)) {
      toast({
        variant: "destructive",
        title: "Maximum events reached",
        description: "You can only select up to 3 events.",
      });
      return;
    }

    // Check if we're selecting or deselecting
    const isSelecting = !selectedEvents.includes(eventId);

    const newEvents = isSelecting
      ? [...selectedEvents, eventId]
      : selectedEvents.filter((id) => id !== eventId);

    setSelectedEvents(newEvents);
    form.setValue("selectedEvents", newEvents);

    // Handle participant management
    if (isSelecting) {
      // Add empty participant slots for the new event
      const event = events.find((e) => e.id === eventId);
      if (event) {
        const newParticipantsForEvent = Array(event.maxParticipants)
          .fill(null)
          .map(() => ({ eventId, name: "", grade: "" }));

        setParticipants([...participants, ...newParticipantsForEvent]);
        form.setValue("participants", [...participants, ...newParticipantsForEvent]);
      }
    } else {
      // Remove participants for deselected event
      const newParticipants = participants.filter((p) => p.eventId !== eventId);
      setParticipants(newParticipants);
      form.setValue("participants", newParticipants);
    }
  };

  const updateParticipant = (index: number, field: 'name' | 'grade', value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };

  const validateStep = async (isSubmit = false) => {
    switch (currentStep) {
      case 0:
        return await form.trigger(["schoolName", "schoolAddress"]);
      case 1:
        return await form.trigger([
          "coordinatorName",
          "coordinatorEmail",
          "coordinatorPhone",
        ]);
      case 2:
        if (selectedEvents.length === 0) {
          toast({
            variant: "destructive",
            title: "Events Required",
            description: "Please select at least one event.",
          });
          return false;
        }
        return await form.trigger(["selectedEvents"]);
      case 3:
        return validateParticipants();
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

  // Group participants by event ID for better organization
  const participantsByEvent = selectedEvents.map(eventId => {
    const event = events.find(e => e.id === eventId);
    const eventParticipants = participants.filter(p => p.eventId === eventId);
    return { eventId, event, participants: eventParticipants };
  });

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
                        {currentStep === 0 && <h2 className="font-semibold text-xl text-[#2E4A7D]">School Details</h2>}
                        <FormField
                          control={form.control}
                          name="schoolName"
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
                          name="schoolAddress"
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
                        {currentStep === 1 && <h2 className="font-semibold text-xl text-[#2E4A7D]">Coordinator Details</h2>}
                        <FormField
                          control={form.control}
                          name="coordinatorName"
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
                          name="coordinatorEmail"
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
                          name="coordinatorPhone"
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
                        {currentStep === 2 && <h2 className="font-semibold text-xl text-[#2E4A7D]">Event Selection</h2>}
                        <h3 className="font-semibold">Select Events (Max 3)</h3>
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={event.id}
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => handleEventSelect(event.id)}
                              className="w-4 h-4"
                            />
                            <label htmlFor={event.id}>
                              {event.name} (Requires {event.maxParticipants}{" "}
                              {event.maxParticipants === 1 ? "participant" : "participants"})
                            </label>
                          </div>
                        ))}
                        {form.formState.errors.selectedEvents && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.selectedEvents.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-8">
                        {currentStep === 3 && <h2 className="font-semibold text-xl text-[#2E4A7D]">Participant Details</h2>}
                        {participantsByEvent.map((eventGroup) => (
                          <div key={eventGroup.eventId} className="space-y-6 pb-4 border-b">
                            <h3 className="font-semibold text-lg">{eventGroup.event?.name}</h3>
                            <p className="text-sm text-gray-500">
                              Requires {eventGroup.event?.maxParticipants}{" "}
                              {eventGroup.event?.maxParticipants === 1 ? "participant" : "participants"}
                            </p>

                            {eventGroup.participants.map((participant, pIndex) => {
                              // Find the overall index in the full participants array
                              const globalIndex = participants.findIndex(
                                p => p.eventId === participant.eventId && 
                                p === participant
                              );

                              return (
                                <div key={pIndex} className="space-y-4 p-4 bg-gray-50 rounded-md">
                                  <h4 className="font-medium">
                                    Participant {pIndex + 1}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Input
                                      placeholder="Name"
                                      value={participant.name}
                                      onChange={(e) => updateParticipant(globalIndex, 'name', e.target.value)}
                                    />
                                    <Input
                                      placeholder="Grade (6-12)"
                                      value={participant.grade}
                                      onChange={(e) => updateParticipant(globalIndex, 'grade', e.target.value)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}

                        {selectedEvents.length === 0 && (
                          <p className="text-center text-gray-500">
                            Please go back and select at least one event.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between pt-6">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < formSteps.length - 1 ? (
                    <Button
                      type="button"
                      className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white ml-auto"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button" // Changed from type="submit"
                      className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white ml-auto"
                      disabled={isSubmitting}
                      onClick={async () => {
                        const isValid = await validateStep();
                        if (isValid) {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
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
