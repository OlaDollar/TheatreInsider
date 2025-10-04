import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log("Contact form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get in touch with our editorial team. We'd love to hear from you about story tips, 
          feedback, or partnership opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-theatre-dark" style={{ fontFamily: 'Playfair Display, serif' }}>
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-theatre-primary hover:bg-purple-700 text-white"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-theatre-dark flex items-center">
                <Mail className="mr-2 theatre-primary" size={20} />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">editorial@theatrespotlight.co.uk</p>
              <p className="text-gray-600">press@theatrespotlight.co.uk</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-theatre-dark flex items-center">
                <Phone className="mr-2 theatre-primary" size={20} />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">+44 20 7123 4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-theatre-dark flex items-center">
                <MapPin className="mr-2 theatre-primary" size={20} />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Theatre Spotlight<br />
                123 West End Lane<br />
                London WC1A 1AA<br />
                United Kingdom
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-theatre-dark">
                Editorial Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                We welcome story tips, press releases, and news about theatre productions.
              </p>
              <p className="text-gray-600 text-sm">
                For press ticket requests, please contact our editorial team at least 
                2 weeks before opening night.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
