import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [name, setName] = useState(user?.full_name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      return;
    }
    
    await updateProfile(name);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    } else {
      setPasswordError("");
    }
    
    // Note: Password update functionality would be implemented here
    // It's more complex with Supabase and requires additional setup
    // This is a placeholder for future implementation
  };

  if (!user) {
    return null; // This should be covered by ProtectedRoute
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
                      value={user.email}
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
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
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
                  <p className="text-sm text-gray-500 mt-2">
                    Note: Password change functionality is not fully implemented yet.
                  </p>
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
