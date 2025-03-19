"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  BellRing,
  Shield,
  Truck,
  ChevronsUpDown,
  Plus,
  Package,
  Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ModeToggle from "@/components/shared/theme-toggle";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    orderUpdates: true,
    newCustomers: true,
    lowStock: true,
    promotions: false,
    security: true,
    newsletter: false,
  });

  const toggleNotification = (key: keyof typeof notificationsEnabled) => {
    setNotificationsEnabled((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background ">
      <div className="space-y-8 mt-8">
        <div className="flex flex-col space-y-2">
          <h1 className="font-bold text-3xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-5 h-auto p-1 w-full max-w-3xl mb-4">
            <TabsTrigger value="account" className="py-2">
              Account
            </TabsTrigger>
            <TabsTrigger value="store" className="py-2">
              Store
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-2">
              Notifications
            </TabsTrigger>

            <TabsTrigger value="security" className="py-2">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-8">
                  <div className="flex flex-col items-center md:items-start pb-6 mb-6 border-b md:pb-0 md:mb-0 md:border-b-0 md:border-r md:pr-8">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://i.pravatar.cc/150?img=33" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-500">Administrator</Badge>
                        <span className="text-sm text-muted-foreground">
                          This account has full admin permissions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience with the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="utc">UTC</option>
                      <option value="est">Eastern Time (ET)</option>
                      <option value="cst">Central Time (CT)</option>
                      <option value="mst">Mountain Time (MT)</option>
                      <option value="pst">Pacific Time (PT)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select
                      id="dateFormat"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center border h-fit p-2 rounded-md md:mt-8">
                    <p>Preffered theme</p>
                    <ModeToggle />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Update your store details and business information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="EcomAdmin Store" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input id="storeEmail" defaultValue="store@ecomadmin.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input id="storePhone" defaultValue="+1 (555) 987-6543" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    defaultValue="123 Main Street, Suite 100&#10;San Francisco, CA 94105&#10;United States"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="jpy">JPY (¥)</option>
                    <option value="cad">CAD (C$)</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Update Store</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Settings</CardTitle>
                <CardDescription>
                  Configure your shipping options and delivery methods.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg">
                  <div className="border-b p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Standard Shipping</h4>
                        <p className="text-sm text-muted-foreground">
                          3-5 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge>Active</Badge>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-b p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Express Shipping</h4>
                        <p className="text-sm text-muted-foreground">
                          1-2 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge>Active</Badge>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">International Shipping</h4>
                        <p className="text-sm text-muted-foreground">
                          7-14 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">Inactive</Badge>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shipping Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BellRing className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Order Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new orders and status changes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={notificationsEnabled.orderUpdates}
                        onChange={() => toggleNotification("orderUpdates")}
                      />
                      <span className="text-sm font-medium">
                        {notificationsEnabled.orderUpdates ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">New Customers</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when new customers register
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={notificationsEnabled.newCustomers}
                        onChange={() => toggleNotification("newCustomers")}
                      />
                      <span className="text-sm font-medium">
                        {notificationsEnabled.newCustomers ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Low Stock Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when products are running low
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={notificationsEnabled.lowStock}
                        onChange={() => toggleNotification("lowStock")}
                      />
                      <span className="text-sm font-medium">
                        {notificationsEnabled.lowStock ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Promotions and Offers</h4>
                        <p className="text-sm text-muted-foreground">
                          Updates about marketing campaigns and offers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={notificationsEnabled.promotions}
                        onChange={() => toggleNotification("promotions")}
                      />
                      <span className="text-sm font-medium">
                        {notificationsEnabled.promotions ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Security Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Important notifications about your account security
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={notificationsEnabled.security}
                        onChange={() => toggleNotification("security")}
                      />
                      <span className="text-sm font-medium">
                        {notificationsEnabled.security ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Newsletter</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive our weekly newsletter with updates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={notificationsEnabled.newsletter}
                        onChange={() => toggleNotification("newsletter")}
                      />
                      <span className="text-sm font-medium">
                        {notificationsEnabled.newsletter ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Secure your account with two-factor authentication.
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Recovery Codes</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate backup codes to use when you don&apos;t have
                      access to your authentication app.
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Permissions</CardTitle>
                <CardDescription>
                  Manage access permissions for your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <div>
                    <h4 className="font-medium">API Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow API access to your account data
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked
                    />
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <h4 className="font-medium">Third-Party Integrations</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow third-party services to access your account
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked
                    />
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <h4 className="font-medium">Data Collection</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect anonymized usage data
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Disabled</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Permissions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
