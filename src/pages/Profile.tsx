
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Bell, Settings, User, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";

const Profile = () => {
  const { user, loading, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || "",
    timezone: user?.timezone || "UTC",
    notificationPreferences: {
      email: user?.notificationPreferences?.email !== false,
      push: user?.notificationPreferences?.push !== false,
      deadlines: user?.notificationPreferences?.deadlines !== false,
      activities: user?.notificationPreferences?.activities !== false
    }
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatarUrl || null);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (key: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: checked
      }
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setProfileData(prev => ({
          ...prev,
          avatarUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveProfile = () => {
    // Update the user profile using the context function
    updateUserProfile({
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio,
      phone: profileData.phone,
      avatarUrl: profileData.avatarUrl,
      timezone: profileData.timezone,
      notificationPreferences: profileData.notificationPreferences
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved."
    });
    
    setIsEditMode(false);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="h-4 w-4 mr-2" /> Preferences
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={previewUrl || profileData.avatarUrl} 
                        alt={profileData.name} 
                      />
                      <AvatarFallback className="text-lg">{getInitials(profileData.name)}</AvatarFallback>
                    </Avatar>
                    {isEditMode && (
                      <div className="flex flex-col items-center">
                        <Label 
                          htmlFor="avatar-upload" 
                          className="cursor-pointer text-sm text-primary hover:underline"
                        >
                          Change profile picture
                        </Label>
                        <Input 
                          id="avatar-upload" 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        readOnly={!isEditMode}
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        readOnly={!isEditMode}
                      />
                    </div>
                    
                    {isEditMode && (
                      <div className="grid gap-3">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    
                    <div className="grid gap-3">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        readOnly={!isEditMode}
                        placeholder={isEditMode ? "Tell us a bit about yourself" : "No bio provided"}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  {isEditMode ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditMode(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and reminders via email
                    </p>
                  </div>
                  <Switch 
                    checked={profileData.notificationPreferences.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get push notifications in your browser
                    </p>
                  </div>
                  <Switch 
                    checked={profileData.notificationPreferences.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Deadline Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notifications about upcoming deadlines
                    </p>
                  </div>
                  <Switch 
                    checked={profileData.notificationPreferences.deadlines}
                    onCheckedChange={(checked) => handleNotificationChange('deadlines', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Activity Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about your scheduled activities
                    </p>
                  </div>
                  <Switch 
                    checked={profileData.notificationPreferences.activities}
                    onCheckedChange={(checked) => handleNotificationChange('activities', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color theme
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="w-24"
                    >
                      <Sun className="h-4 w-4 mr-1" /> Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="w-24"
                    >
                      <Moon className="h-4 w-4 mr-1" /> Dark
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Timezone</h4>
                    <p className="text-sm text-muted-foreground">
                      Set your local timezone for accurate scheduling
                    </p>
                  </div>
                  <div className="w-[180px]">
                    <select
                      name="timezone"
                      value={profileData.timezone}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="CST">CST (Central Standard Time)</option>
                      <option value="MST">MST (Mountain Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
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
