import React, { useState, useEffect } from "react";
import { facilitiesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import FacilityForm from "@/components/FacilityForm";

export default function ManageFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilitiesAPI.getAll();
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setError("Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await facilitiesAPI.delete(id);
        fetchFacilities();
      } catch (error) {
        console.error("Error deleting facility:", error);
        setError("Failed to delete facility");
      }
    }
  };

  const handleFormSubmit = async (facilityData) => {
    try {
      if (selectedFacility) {
        await facilitiesAPI.update(selectedFacility._id, facilityData);
      } else {
        await facilitiesAPI.create(facilityData);
      }
      fetchFacilities();
      setIsFormOpen(false);
      setSelectedFacility(null);
    } catch (error) {
      console.error("Error submitting facility form:", error);
      setError("Failed to save facility");
    }
  };

  const openFormForCreate = () => {
    setSelectedFacility(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (facility) => {
    setSelectedFacility(facility);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedFacility(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading facilities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Facilities</h1>
            <p className="text-gray-600 mt-1">
              Add, edit, or remove healthcare facilities
            </p>
          </div>
          <Link to="/staff/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {isFormOpen ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedFacility ? "Edit Facility" : "Add New Facility"}</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityForm
                facility={selectedFacility}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4">
              <Button onClick={openFormForCreate}>Add New Facility</Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>All Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {facilities.map((facility) => (
                        <tr key={facility._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{facility.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{facility.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{facility.contactNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" onClick={() => openFormForEdit(facility)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(facility._id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
