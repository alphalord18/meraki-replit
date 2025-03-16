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

const registrationSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolAddress: z.string().min(1, "School address is required"),
  coordinatorName: z.string().min(1, "Coordinator name is required"),
  coordinatorEmail: z.string().email("Invalid email address"),
  coordinatorPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  selectedEvents: z.array(z.string()).min(1, "Select at least one event"),
  participants: z.array(z.object({
    eventId: z.string(),
    name: z.string().min(1, "Participant name is required"),
    grade: z.string().min(1, "Grade is required"),
  })),
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

      await addDoc(collection(db, "registrations"), {
        ...data,
        eventParticipants,
        createdAt: new Date().toISOString(),
        status: "pending",
      });

      toast({
        title: "Registration successful",
        description: "We will contact you shortly with further details.",
      });
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
    const newEvents = selectedEvents.includes(eventId)
      ? selectedEvents.filter(id => id !== eventId)
      : [...selectedEvents, eventId];
    setSelectedEvents(newEvents);
    form.setValue("selectedEvents", newEvents);
  };

  const handleParticipantAdd = (eventId: string) => {
    const newParticipant = { eventId, name: "", grade: "" };
    setParticipants([...participants, newParticipant]);
    form.setValue("participants", [...participants, newParticipant]);
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
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Select Events</h3>
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
                                    placeholder="Grade"
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
                      onClick={() => setCurrentStep((prev) => prev + 1)}
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