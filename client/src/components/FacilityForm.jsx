import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FacilityForm({ facility, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [services, setServices] = useState("");

  useEffect(() => {
    if (facility) {
      setName(facility.name);
      setLocation(facility.location);
      setContactNumber(facility.contactNumber);
      setServices(facility.services.join(", "));
    }
  }, [facility]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const facilityData = {
      name,
      location,
      contactNumber,
      services: services.split(",").map((s) => s.trim()),
    };
    onSubmit(facilityData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Facility Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="services">Services (comma-separated)</Label>
        <Input
          id="services"
          value={services}
          onChange={(e) => setServices(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{facility ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
