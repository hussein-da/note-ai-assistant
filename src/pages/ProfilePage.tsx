
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);

  useEffect(() => {
    // This will be replaced with actual Supabase auth check once integrated
    const checkAuth = () => {
      // Simulate fetching profile data
      setTimeout(() => {
        setName("John Doe");
        setEmail("john.doe@example.com");
        setIsLoadingProfile(false);
      }, 500);
    };
    
    checkAuth();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This will be replaced with actual Supabase profile update once integrated
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This will be replaced with actual Supabase password update once integrated
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-meeting-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and password</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <Card 
              className={`cursor-pointer ${!isPasswordUpdate ? 'border-meeting-primary' : ''}`}
              onClick={() => setIsPasswordUpdate(false)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-meeting-primary" />
                <span className="font-medium">Profile Information</span>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer ${isPasswordUpdate ? 'border-meeting-primary' : ''}`}
              onClick={() => setIsPasswordUpdate(true)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-meeting-primary" />
                <span className="font-medium">Change Password</span>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{isPasswordUpdate ? "Change Password" : "Profile Information"}</CardTitle>
            </CardHeader>
            <CardContent>
              {!isPasswordUpdate ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled
                    />
                    <p className="text-xs text-gray-500">Email address cannot be changed</p>
                  </div>
                  <Button type="submit" className="bg-meeting-primary hover:bg-meeting-secondary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-meeting-primary hover:bg-meeting-secondary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
