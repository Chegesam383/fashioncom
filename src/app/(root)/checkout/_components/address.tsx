"use client";
import { useState, useId, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  type: string;
}

const sampleAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    street: "123 Main St",
    city: "New York, NY 10001",
    type: "Home",
  },
  {
    id: "2",
    name: "John Doe",
    street: "456 Office Ave",
    city: "New York, NY 10002",
    type: "Office",
  },
];

interface AddressSelectionProps {
  onSelect: (address: string) => void;
}

const AddressSelection = ({ onSelect }: AddressSelectionProps) => {
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const radioId = useId();
  const inputId = useId();
  const [selectedValue, setSelectedValue] = useState(sampleAddresses[0].id);
  const [showNewAddressForm] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showNewAddressForm && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNewAddressForm]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>
          Add the address and contact information of your order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-6 mb-6">
            <h4 className="text-xl font-semibold">Contact information</h4>
            <div className="flex flex-col md:flex-row w-full gap-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
          <h4 className="text-xl font-semibold">Shipping address</h4>
          <RadioGroup
            className="gap-4"
            value={selectedValue}
            onValueChange={(value) => {
              setSelectedValue(value);
              if (value !== "new") {
                onSelect(value);
              }
            }}
          >
            {sampleAddresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={address.id}
                  id={`${radioId}-${address.id}`}
                  className="mt-1"
                />
                <div className="grid grow gap-1">
                  <Label
                    htmlFor={`${radioId}-${address.id}`}
                    className="flex items-center  gap-2"
                  >
                    <span>{address.type}</span>
                  </Label>
                  <p className="text-sm ">{address.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-start space-x-3">
              <RadioGroupItem
                value="new"
                id={`${radioId}-new`}
                className="mt-1"
              />
              <div className="grid grow gap-1">
                <Label
                  htmlFor={`${radioId}-new`}
                  className="flex items-center gap-2"
                >
                  <span>Add New Address</span>
                </Label>

                <div
                  role="region"
                  id={inputId}
                  aria-labelledby={`${radioId}-new`}
                  className="grid transition-all duration-200 ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
                  data-state={
                    selectedValue === "new" ? "expanded" : "collapsed"
                  }
                >
                  <div className="overflow-hidden">
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          ref={nameInputRef}
                          id="name"
                          placeholder="Enter your full name"
                          disabled={selectedValue !== "new"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          placeholder="Enter street address"
                          disabled={selectedValue !== "new"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Enter city"
                            disabled={selectedValue !== "new"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Address Type</Label>
                          <Input
                            id="type"
                            placeholder="e.g., Home, Office"
                            disabled={selectedValue !== "new"}
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => onSelect("new")}
                      >
                        Save & Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSelection;
