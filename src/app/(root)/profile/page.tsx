"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { FormEvent } from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const handleChange = (e: FormEvent) => {
    console.log(e);
  };
  return (
    <div className="">
      <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
      <p className="text-muted-foreground mb-6">
        Manage your personal information and preferences.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Image
                src={user?.imageUrl || "/Placeholder.png"}
                width={80}
                height={80}
                alt="User Avatar"
                className="rounded-full"
              />
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={user?.fullName || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.emailAddresses[0].emailAddress || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={user?.phoneNumbers[0]?.phoneNumber || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Manage your shipping addresses.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-muted-foreground">
                    123 Main Street
                  </p>
                  <p className="text-sm text-muted-foreground">Apt 4B</p>
                  <p className="text-sm text-muted-foreground">
                    New York, NY 10001
                  </p>
                </div>
                <Badge>Default</Badge>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Work</p>
                  <p className="text-sm text-muted-foreground">
                    456 Office Plaza
                  </p>
                  <p className="text-sm text-muted-foreground">Suite 200</p>
                  <p className="text-sm text-muted-foreground">
                    New York, NY 10002
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Add New Address</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
