import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createSubscription } from "@/services/subscription";
import { CheckCircle2, Music, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

const subscriptionFormSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  birthdate: z.string().refine((date) => {
    try {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    } catch {
      return false;
    }
  }, "Invalid date format"),
  plan: z.enum(["monthly", "quarterly", "biannual"]).default("monthly"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      birthdate: "",
      plan: "monthly",
    },
  });

  const calculatePrice = (plan: string) => {
    switch (plan) {
      case "monthly":
        return "$9.99/month";
      case "quarterly":
        return "$24.99/3 months (save 16%)";
      case "biannual":
        return "$49.99/6 months (save 30%)";
      default:
        return "$9.99/month";
    }
  };

  const handleSubmit = async (values: SubscriptionFormValues) => {
    setIsSubmitting(true);
    try {
      await createSubscription("premium");
      setIsSuccess(true);
      toast.success(`Thank you for subscribing to Spotify Premium! Your ${values.plan} plan is now active.`);
      
      // Reset form
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[90vh] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isSuccess ? "Thank You!" : "Upgrade to Premium"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSuccess 
              ? "Thanks for choosing Spotify Premium!" 
              : "Get unlimited, ad-free music with exclusive features."}
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-5 animate-fade-in">
            <CheckCircle2 className="h-20 w-20 text-emerald-500 animate-scale-in" />
            <p className="text-center text-lg">
              Your premium subscription has been activated. Enjoy ad-free music, offline listening, and much more!
            </p>
            <div className="mt-4 space-y-4 w-full">
              <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <h3 className="font-medium mb-2">What's included in your subscription:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Ad-free music listening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Download songs for offline listening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Higher audio quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Unlimited skips</span>
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => onOpenChange(false)} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Start Listening
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-center font-semibold text-lg">Choose Your Plan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`border-2 hover:shadow-lg transition-all duration-200 cursor-pointer hover-scale ${form.watch("plan") === "monthly" ? "border-emerald-500" : "border-zinc-700"}`}
                    onClick={() => form.setValue("plan", "monthly")}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-center mb-2">
                        <Music className="h-10 w-10 text-emerald-500" />
                      </div>
                      <CardTitle className="text-center text-base">Monthly</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-2">
                      <p className="text-2xl font-bold">$9.99</p>
                      <p className="text-sm text-zinc-400">per month</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-emerald-500 accent-emerald-500"
                        checked={form.watch("plan") === "monthly"}
                        onChange={() => form.setValue("plan", "monthly")}
                      />
                    </CardFooter>
                  </Card>
                  
                  <Card className={`border-2 hover:shadow-lg transition-all duration-200 cursor-pointer hover-scale ${form.watch("plan") === "quarterly" ? "border-emerald-500" : "border-zinc-700"}`}
                    onClick={() => form.setValue("plan", "quarterly")}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-center mb-2">
                        <Crown className="h-10 w-10 text-emerald-500" />
                      </div>
                      <CardTitle className="text-center text-base">Quarterly</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-2">
                      <p className="text-2xl font-bold">$24.99</p>
                      <p className="text-sm text-zinc-400">3 months (save 16%)</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-emerald-500 accent-emerald-500"
                        checked={form.watch("plan") === "quarterly"}
                        onChange={() => form.setValue("plan", "quarterly")}
                      />
                    </CardFooter>
                  </Card>
                  
                  <Card className={`border-2 hover:shadow-lg transition-all duration-200 cursor-pointer hover-scale ${form.watch("plan") === "biannual" ? "border-emerald-500" : "border-zinc-700"}`}
                    onClick={() => form.setValue("plan", "biannual")}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-center mb-2">
                        <Sparkles className="h-10 w-10 text-emerald-500" />
                      </div>
                      <CardTitle className="text-center text-base">Biannual</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-2">
                      <p className="text-2xl font-bold">$49.99</p>
                      <p className="text-sm text-zinc-400">6 months (save 30%)</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-emerald-500 accent-emerald-500"
                        checked={form.watch("plan") === "biannual"}
                        onChange={() => form.setValue("plan", "biannual")}
                      />
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-zinc-700">
                <h3 className="text-center font-semibold text-lg">Your Information</h3>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field}
                          className="bg-zinc-800 border-zinc-700 focus:border-emerald-500" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(123) 456-7890" 
                            {...field} 
                            className="bg-zinc-800 border-zinc-700 focus:border-emerald-500"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="johndoe@example.com" 
                            type="email" 
                            {...field}
                            className="bg-zinc-800 border-zinc-700 focus:border-emerald-500" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          className="bg-zinc-800 border-zinc-700 focus:border-emerald-500" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <h3 className="font-semibold mb-2">Selected Plan: {calculatePrice(form.watch("plan"))}</h3>
                <p className="text-sm text-zinc-400">
                  By subscribing, you agree to Spotify's Terms and Conditions. You can cancel anytime.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-full transition-all duration-200 transform hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Processing...
                  </span> : 
                  "Subscribe Now"
                }
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionForm; 