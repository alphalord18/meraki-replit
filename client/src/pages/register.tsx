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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const events = [
  { id: "poetry_slam", name: "Poetry Slam Championship", maxParticipants: 2 },
  { id: "debate", name: "Literary Debate Competition", maxParticipants: 2 },
  { id: "storytelling", name: "Storytelling Contest", maxParticipants: 1 },
];

// Enhanced validation schema
const registrationSchema = z.object({
  schoolName: z.string()
    .min(3, "School name must be at least 3 characters")
    .max(100, "School name must not exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s'.&-]+$/, "School name can only contain letters, numbers, spaces, and basic punctuation"),

  schoolAddress: z.string()
    .min(10, "Please provide a complete school address")
    .max(200, "Address must not exceed 200 characters"),

  coordinatorName: z.string()
    .min(3, "Coordinator name must be at least 3 characters")
    .max(50, "Coordinator name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s'.]+$/, "Coordinator name can only contain letters and basic punctuation"),

  coordinatorEmail: z.string()
    .email("Invalid email address")
    .refine(email => email.includes('.'), "Email must contain a domain"),

  coordinatorPhone: z.string()
    .regex(/^\+?[0-9]{10,12}$/, "Phone number must be 10-12 digits, optionally starting with +"),

  selectedEvents: z.array(z.string())
    .min(1, "Select at least one event")
    .max(3, "Maximum 3 events can be selected"),

  participants: z.array(
    z.object({
      eventId: z.string(),
      name: z.string()
        .min(3, "Participant name must be at least 3 characters")
        .max(50, "Participant name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s'.]+$/, "Participant name can only contain letters and basic punctuation"),
      grade: z.string()
        .regex(/^([6-9]|1[0-2])$/, "Grade must be between 6 and 12")
    })
  ).refine(participants => {
    const eventCounts = participants.reduce((acc, p) => {
      acc[p.eventId] = (acc[p.eventId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventCounts).every(([eventId, count]) => {
      const event = events.find(e => e.id === eventId);
      return count <= (event?.maxParticipants || 0);
    });
  }, "Maximum number of participants exceeded for one or more events"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

const formSteps = [
  {
    title: "School Information",
    fields: ["schoolName", "schoolAddress"] as const,
  },
  {
    title: "Coordinator Details",
    fields: ["coordinatorName", "coordinatorEmail", "coordinatorPhone"] as const,
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
  const [participants, setParticipants] = useState<Array<{ eventId: string; name: string; grade: string }>>([]);

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

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      const eventParticipants = selectedEvents.reduce((acc, eventId) => {
        const eventParticipants = participants.filter(p => p.eventId === eventId);
        acc[eventId] = eventParticipants;
        return acc;
      }, {} as Record<string, typeof participants>);

      const registrationData = {
        ...data,
        eventParticipants,
        createdAt: new Date().toISOString(),
        status: "pending",
        registrationId: `REG-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
      };

      await addDoc(collection(db, "registrations"), registrationData);

      toast({
        title: "Registration successful",
        description: `Your registration ID is ${registrationData.registrationId}. Please save this for future reference.`,
      });

      // Reset form after successful submission
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

  const handleEventSelect = (eventId: string) => {
    if (selectedEvents.length >= 3 && !selectedEvents.includes(eventId)) {
      toast({
        variant: "destructive",
        title: "Maximum events reached",
        description: "You can only select up to 3 events.",
      });
      return;
    }

    const newEvents = selectedEvents.includes(eventId)
      ? selectedEvents.filter(id => id !== eventId)
      : [...selectedEvents, eventId];

    setSelectedEvents(newEvents);
    form.setValue("selectedEvents", newEvents);

    // Remove participants for deselected event
    if (selectedEvents.includes(eventId) && !newEvents.includes(eventId)) {
      const newParticipants = participants.filter(p => p.eventId !== eventId);
      setParticipants(newParticipants);
      form.setValue("participants", newParticipants);
    }
  };

  const handleParticipantAdd = (eventId: string) => {
    const event = events.find(e => e.id === eventId)!;
    const eventParticipants = participants.filter(p => p.eventId === eventId);

    if (eventParticipants.length >= event.maxParticipants) {
      toast({
        variant: "destructive",
        title: "Maximum participants reached",
        description: `You can only add up to ${event.maxParticipants} participants for ${event.name}.`,
      });
      return;
    }

    const newParticipant = { eventId, name: "", grade: "" };
    setParticipants([...participants, newParticipant]);
    form.setValue("participants", [...participants, newParticipant]);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return form.trigger(["schoolName", "schoolAddress"]);
      case 1:
        return form.trigger(["coordinatorName", "coordinatorEmail", "coordinatorPhone"]);
      case 2:
        return form.trigger(["selectedEvents"]);
      case 3:
        return form.trigger(["participants"]);
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

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                <Input type="tel" {...field} placeholder="+91XXXXXXXXXX" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Select Events (Max 3)</h3>
                        {events.map((event) => (
                          <div key={event.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={event.id}
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => handleEventSelect(event.id)}
                              className="w-4 h-4"
                            />
                            <label htmlFor={event.id}>
                              {event.name} (Max {event.maxParticipants} participants)
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
                      <div className="space-y-6">
                        {selectedEvents.map((eventId) => {
                          const event = events.find(e => e.id === eventId)!;
                          const eventParticipants = participants.filter(p => p.eventId === eventId);

                          return (
                            <div key={eventId} className="space-y-4">
                              <h3 className="font-semibold">{event.name}</h3>
                              {eventParticipants.map((participant, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4">
                                  <Input 
                                    placeholder="Participant Name"
                                    value={participant.name}
                                    onChange={(e) => {
                                      const newParticipants = [...participants];
                                      newParticipants[participants.indexOf(participant)].name = e.target.value;
                                      setParticipants(newParticipants);
                                      form.setValue("participants", newParticipants);
                                    }}
                                  />
                                  <Input 
                                    placeholder="Grade (6-12)"
                                    value={participant.grade}
                                    onChange={(e) => {
                                      const newParticipants = [...participants];
                                      newParticipants[participants.indexOf(participant)].grade = e.target.value;
                                      setParticipants(newParticipants);
                                      form.setValue("participants", newParticipants);
                                    }}
                                  />
                                </div>
                              ))}
                              {eventParticipants.length < event.maxParticipants && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleParticipantAdd(eventId)}
                                >
                                  Add Participant
                                </Button>
                              )}
                            </div>
                          );
                        })}
                        {form.formState.errors.participants && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.participants.message}
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
                      type="submit"
                      className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white ml-auto"
                      disabled={isSubmitting}
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