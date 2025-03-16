import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const Dashboard = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is authenticated
  const { data: user, isLoading: authChecking } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (!authChecking && !user) {
      setLocation("/admin/login");
    }
  }, [user, authChecking, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      setLocation("/admin/login");
    },
  });

  if (authChecking) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Noe Display" }}>
            Admin Dashboard
          </h1>
          <Button variant="outline" onClick={() => logoutMutation.mutate()}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="events">
          <TabsList className="mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px]">
                  <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
                  {/* Event management content */}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speakers">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px]">
                  <h2 className="text-xl font-semibold mb-4">Manage Speakers</h2>
                  {/* Speaker management content */}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px]">
                  <h2 className="text-xl font-semibold mb-4">Manage Blogs</h2>
                  {/* Blog management content */}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px]">
                  <h2 className="text-xl font-semibold mb-4">Manage Sponsors</h2>
                  {/* Sponsor management content */}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
