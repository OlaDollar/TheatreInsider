import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, GraduationCap, Phone, Globe, Award } from "lucide-react";
import { useState } from "react";

interface ArtsEducationSchool {
  id: number;
  name: string;
  shortName: string;
  city: string;
  country: string;
  region: string;
  foundedYear: number;
  ranking: number;
  website: string;
  address?: string;
  phone?: string;
  notableAlumni: string[];
  admissionOverview: string;
  description?: string;
  facilities: string[];
}

interface Course {
  id: number;
  courseName: string;
  courseType: string;
  duration: string;
  startDates: string[];
  applicationDeadline: string;
  audititionRequired: boolean;
  courseFee: number;
  currency: string;
  intakeNumber: number;
  certificateAwarded: string;
  courseDescription: string;
}

export default function ArtsEducation() {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const { data: schools = [], isLoading: schoolsLoading } = useQuery<ArtsEducationSchool[]>({
    queryKey: ["/api/arts-education/schools", selectedCountry],
    queryFn: async () => {
      const params = selectedCountry !== "all" ? `?country=${selectedCountry}` : "";
      const response = await fetch(`/api/arts-education/schools${params}`);
      if (!response.ok) throw new Error("Failed to fetch schools");
      return response.json();
    },
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/arts-education/schools", selectedSchool, "courses"],
    queryFn: async () => {
      if (!selectedSchool) return [];
      const response = await fetch(`/api/arts-education/schools/${selectedSchool}/courses`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
    enabled: !!selectedSchool,
  });

  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["/api/arts-education/schools", selectedSchool, "teachers"],
    queryFn: async () => {
      if (!selectedSchool) return [];
      const response = await fetch(`/api/arts-education/schools/${selectedSchool}/teachers`);
      if (!response.ok) throw new Error("Failed to fetch teachers");
      return response.json();
    },
    enabled: !!selectedSchool,
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Arts Education Schools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the world's premier performing arts institutions. From RADA to Juilliard, 
            explore admission requirements, course details, and faculty information.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex justify-center">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="US">United States</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Schools Grid */}
        {schoolsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {schools.map((school) => (
              <Card 
                key={school.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedSchool === school.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedSchool(selectedSchool === school.id ? null : school.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="mb-2">
                      #{school.ranking} Ranked
                    </Badge>
                    <Badge variant="outline">
                      {school.country}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{school.shortName}</CardTitle>
                  <CardDescription className="text-sm font-medium text-gray-700">
                    {school.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {school.city}, {school.country}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Founded {school.foundedYear}
                    </div>
                    {school.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    <div className="pt-2">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {school.admissionOverview}
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 font-medium">Notable Alumni:</p>
                      <p className="text-xs text-gray-600">
                        {school.notableAlumni.slice(0, 3).join(', ')}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Selected School Details */}
        {selectedSchool && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {schools.find(s => s.id === selectedSchool)?.name} - Detailed Information
            </h2>
            
            {/* Courses Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Available Courses
              </h3>
              {coursesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.courseName}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{course.courseType}</Badge>
                          <Badge variant="outline">{course.duration}</Badge>
                          <Badge variant="outline">{course.certificateAwarded}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Fee:</span>
                              <p>{formatCurrency(course.courseFee, course.currency)}/year</p>
                            </div>
                            <div>
                              <span className="font-medium">Intake:</span>
                              <p>{course.intakeNumber} students</p>
                            </div>
                            <div>
                              <span className="font-medium">Start Date:</span>
                              <p>{course.startDates.join(', ')}</p>
                            </div>
                            <div>
                              <span className="font-medium">Deadline:</span>
                              <p>{course.applicationDeadline}</p>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-sm">Audition Required:</span>
                            <p className="text-sm">{course.audititionRequired ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{course.courseDescription}</p>
                          </div>
                          <Button 
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => window.open(schools.find(s => s.id === selectedSchool)?.website, '_blank')}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No course information available</p>
              )}
            </div>

            {/* Faculty Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Faculty & Staff
              </h3>
              {teachersLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : teachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teachers.map((teacher: any) => (
                    <Card key={teacher.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{teacher.name}</h4>
                          <p className="text-sm text-gray-600">{teacher.title}</p>
                          <p className="text-sm">{teacher.specialization?.join(', ')}</p>
                          <p className="text-xs text-gray-500">{teacher.experience}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No faculty information available</p>
              )}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Performing Arts Journey?
          </h2>
          <p className="text-lg mb-6">
            Explore application requirements, compare courses, and connect with admissions teams.
          </p>
          <Button variant="secondary" size="lg">
            Download Our Complete Guide
          </Button>
        </div>
      </div>
    </div>
  );
}