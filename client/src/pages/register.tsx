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
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const registrationSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  principalName: z.string().min(1, "Principal name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  participantCount: z.string().min(1, "Number of participants is required"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

const formSteps = [
  {
    title: "School Information",
    fields: ["schoolName", "principalName"] as const,
  },
  {
    title: "Contact Details",
    fields: ["email", "phone"] as const,
  },
  {
    title: "Additional Information",
    fields: ["address", "participantCount"] as const,
  },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      schoolName: "",
      principalName: "",
      email: "",
      phone: "",
      address: "",
      participantCount: "",
    },
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "registrations"), {
        ...data,
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

  const currentFields = formSteps[currentStep].fields;

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
                    {currentFields.map((field) => (
                      <FormField
                        key={field}
                        control={form.control}
                        name={field}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              {field.replace(/([A-Z])/g, " $1").trim()}
                            </FormLabel>
                            <FormControl>
                              <Input {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
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
