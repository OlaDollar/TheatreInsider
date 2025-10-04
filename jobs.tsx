import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign, TrendingUp, BookOpen, Video, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface TheatreJobRole {
  id: string;
  title: string;
  category: 'creative' | 'technical' | 'production' | 'business' | 'performance';
  briefDescription: string;
  keyResponsibilities: string[];
  typicalEmployers: string[];
  salaryRange: {
    uk: string;
    us: string;
  };
  careerPath: string[];
  requiredSkills: string[];
  qualifications: string[];
  interviewQuestions: string[];
  videoTopics: string[];
  industryContacts: string[];
}

export default function Jobs() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: jobs, isLoading } = useQuery<TheatreJobRole[]>({
    queryKey: ["/api/jobs", selectedCategory],
  });

  const categories = [
    { id: "all", name: "All Roles", color: "bg-purple-600" },
    { id: "creative", name: "Creative", color: "bg-amber-600" },
    { id: "technical", name: "Technical", color: "bg-blue-600" },
    { id: "production", name: "Production", color: "bg-green-600" },
    { id: "business", name: "Business", color: "bg-red-600" },
    { id: "performance", name: "Performance", color: "bg-pink-600" }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
              Theatre Careers
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Discover your path in the world of theatre with our comprehensive career guides, 
              inspired by John Caird's Theatre Craft and industry expertise
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-purple-800/50 px-4 py-2 rounded-full">
                <BookOpen className="w-4 h-4" />
                <span>Career Guides</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-800/50 px-4 py-2 rounded-full">
                <Video className="w-4 h-4" />
                <span>Interview Insights</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-800/50 px-4 py-2 rounded-full">
                <MessageSquare className="w-4 h-4" />
                <span>Industry Contacts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? `${category.color} text-white` : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs?.map((job) => (
            <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={`${categories.find(c => c.id === job.category)?.color || 'bg-gray-600'} text-white`}
                  >
                    {job.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>{job.careerPath.length} levels</span>
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-purple-600 transition-colors">
                  <Link href={`/job/${job.id}`}>
                    <a>{job.title}</a>
                  </Link>
                </CardTitle>
                <p className="text-gray-600 line-clamp-2">{job.briefDescription}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Key Responsibilities Preview */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Responsibilities</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.keyResponsibilities.slice(0, 3).map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="line-clamp-1">{responsibility}</span>
                        </li>
                      ))}
                      {job.keyResponsibilities.length > 3 && (
                        <li className="text-purple-600 text-xs">
                          +{job.keyResponsibilities.length - 3} more responsibilities
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Salary Range */}
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">
                      UK: {job.salaryRange.uk}
                    </span>
                  </div>

                  {/* Career Path */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">
                      {job.careerPath[0]} → {job.careerPath[job.careerPath.length - 1]}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Link href={`/job/${job.id}`}>
                      <Button size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Guide
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Video className="w-4 h-4 mr-2" />
                      Interviews
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Career Guide Teaser */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 to-amber-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Career Guides Coming Soon
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our comprehensive "How to Become" series will include detailed career guides for each role, 
                featuring step-by-step instructions, industry insights, and practical advice from leading 
                theatre professionals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">15,000+ Words</h3>
                  <p className="text-sm text-gray-600">Comprehensive career guides</p>
                </div>
                <div className="text-center">
                  <Video className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Video Interviews</h3>
                  <p className="text-sm text-gray-600">Industry professionals share insights</p>
                </div>
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Direct Access</h3>
                  <p className="text-sm text-gray-600">Connect with industry contacts</p>
                </div>
              </div>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Clock className="w-4 h-4 mr-2" />
                Get Notified When Available
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}