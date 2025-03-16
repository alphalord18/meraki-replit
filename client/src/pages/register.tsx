import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore"; // ✅ Import addDoc

const events = [
  { id: "poetry_slam", name: "Poetry Slam Championship", maxParticipants: 2 },
  { id: "debate", name: "Literary Debate Competition", maxParticipants: 2 },
  { id: "storytelling", name: "Storytelling Contest", maxParticipants: 1 },
];

const registrationSchema = z.object({
  schoolName: z.string().min(3, "School name must be at least 3 characters"),
  schoolAddress: z.string().min(10, "Provide a complete school address"),
  coordinatorName: z.string().min(3, "Coordinator name is required"),
  coordinatorEmail: z.string().email("Invalid email"),
  coordinatorPhone: z.string().regex(/^\+?[0-9]{10,12}$/, "Invalid phone number"),
  selectedEvents: z.array(z.string()).min(1, "Select at least one event").max(3, "Max 3 events"),
  participants: z
    .array(
      z.object({
        eventId: z.string(),
        name: z.string().min(3, "Participant name is required"),
        grade: z.string().regex(/^([6-9]|1[0-2])$/, "Grade must be between 6 and 12"),
      })
    )
    .refine((participants) => {
      const countByEvent = participants.reduce((acc, p) => {
        acc[p.eventId] = (acc[p.eventId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.keys(countByEvent).every((eventId) => {
        const event = events.find((e) => e.id === eventId);
        return event ? countByEvent[eventId] === event.maxParticipants : false;
      });
    }, "Each event must have the required number of participants"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

const formSteps = [
  { title: "School Info", fields: ["schoolName", "schoolAddress"] as const },
  { title: "Coordinator Details", fields: ["coordinatorName", "coordinatorEmail", "coordinatorPhone"] as const },
  { title: "Event Selection", fields: ["selectedEvents"] as const },
  { title: "Participants", fields: ["participants"] as const },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const handleEventSelect = (eventId: string) => {
    const newEvents = selectedEvents.includes(eventId)
      ? selectedEvents.filter((id) => id !== eventId)
      : [...selectedEvents, eventId];

    setSelectedEvents(newEvents);
    form.setValue("selectedEvents", newEvents);

    // ✅ Correctly update participants
    form.setValue(
      "participants",
      form.getValues("participants").filter((p) => newEvents.includes(p.eventId))
    );

    // ✅ Ensure correct number of participants for each event
    newEvents.forEach((eventId) => {
      const event = events.find((e) => e.id === eventId)!;
      const currentParticipants = form.getValues("participants").filter((p) => p.eventId === eventId);

      while (currentParticipants.length < event.maxParticipants) {
        append({ eventId, name: "", grade: "" });
        currentParticipants.push({ eventId, name: "", grade: "" });
      }
    });
  };

  const validateStep = async () => {
    return await form.trigger(formSteps[currentStep].fields);
  };

  const handleNext = async () => {
    if (await validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmit = async (data: RegistrationData) => {
    if (!(await validateStep())) return;

    try {
      const registrationId = `REG-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

      // ✅ Use `data` instead of `registrationData`
      const docRef = await addDoc(collection(db, "registrations"), data);

      toast({ title: "Success!", description: `Your registration ID is ${registrationId}` });
      form.reset();
      setSelectedEvents([]);
      setCurrentStep(0);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to register" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">School Registration</h1>

        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {currentStep === 0 && (
                  <>
                    <Input label="School Name" {...form.register("schoolName")} />
                    <Input label="School Address" {...form.register("schoolAddress")} />
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <Input label="Coordinator Name" {...form.register("coordinatorName")} />
                    <Input label="Email" type="email" {...form.register("coordinatorEmail")} />
                    <Input label="Phone" type="tel" {...form.register("coordinatorPhone")} />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h3 className="font-semibold">Select Events (Max 3)</h3>
                    {events.map((event) => (
                      <label key={event.id} className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedEvents.includes(event.id)} onChange={() => handleEventSelect(event.id)} />
                        {event.name} (Max {event.maxParticipants})
                      </label>
                    ))}
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h3 className="font-semibold">Participants</h3>
                    {fields.map((participant, index) => (
                      <div key={participant.id} className="grid grid-cols-2 gap-4">
                        <Input placeholder="Name" {...form.register(`participants.${index}.name`)} />
                        <Input placeholder="Grade (6-12)" {...form.register(`participants.${index}.grade`)} />
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
              {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>}
              {currentStep < formSteps.length - 1 ? <Button onClick={handleNext}>Next</Button> : <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
