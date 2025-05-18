
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Bell, Settings, User, Moon, Sun, AlertTriangle } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const Profile = () => {
  const { user, updateUserProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    timezone: user?.timezone || "UTC",
  });
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: user?.notificationPreferences?.email || true,
    push: user?.notificationPreferences?.push || true,
    deadlines: user?.notificationPreferences?.deadlines || true,
    activities: user?.notificationPreferences?.activities || true,
  });
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };
  
  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [field]: value,
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileData({
          ...profileData,
          avatarUrl: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveProfile = () => {
    updateUserProfile({
      name: profileData.name,
      bio: profileData.bio,
      phone: profileData.phone,
      avatarUrl: profileData.avatarUrl,
      timezone: profileData.timezone,
      notificationPreferences: notificationPrefs,
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      navigate("/login");
    }
  };
  
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part?.[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '';
  };

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} variant="ghost" size="icon">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">{getInitials(profileData.name)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-center block">Profile Picture</Label>
                    <Input 
                      id="avatar" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 w-full md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={profileData.email}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Write a little about yourself"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={profileData.timezone} 
                        onValueChange={(value) => handleInputChange('timezone', value)}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={saveProfile}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={notificationPrefs.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications"
                    checked={notificationPrefs.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Categories</h3>
                  
                  <div className="pl-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="deadline-notifications" className="text-sm">
                        Deadlines & Due Dates
                      </Label>
                      <Switch 
                        id="deadline-notifications"
                        checked={notificationPrefs.deadlines}
                        onCheckedChange={(checked) => handleNotificationChange('deadlines', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="activity-notifications" className="text-sm">
                        Course Activities & Updates
                      </Label>
                      <Switch 
                        id="activity-notifications"
                        checked={notificationPrefs.activities}
                        onCheckedChange={(checked) => handleNotificationChange('activities', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={saveProfile}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-destructive flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Delete Account
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount}>
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
