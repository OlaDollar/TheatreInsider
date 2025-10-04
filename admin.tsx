import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Admin() {
  const [manualContent, setManualContent] = useState({
    title: "",
    content: "",
    contentType: "news",
    region: "uk",
    venue: ""
  });

  const { toast } = useToast();

  const scraperSummary = useQuery({
    queryKey: ["/api/admin/scraper-summary"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const scraperLogs = useQuery({
    queryKey: ["/api/admin/scraper-logs"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const generateDailyContent = useMutation({
    mutationFn: () => apiRequest("POST", "/api/content/generate-daily", {}),
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Generated ${data.articles} articles and ${data.reviews} reviews`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    },
  });

  const aggregateContent = useMutation({
    mutationFn: () => apiRequest("POST", "/api/content/aggregate", {}),
    onSuccess: (data) => {
      toast({
        title: "Content Aggregated!",
        description: `Processed ${data.processed} items, published ${data.published} articles`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to aggregate content",
        variant: "destructive",
      });
    },
  });

  const runArtsScraper = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/scraper/arts-education", {}),
    onSuccess: () => {
      toast({
        title: "Arts Education Scraper Started",
        description: "The scraper is running and will update the database with new information.",
      });
      scraperSummary.refetch();
      scraperLogs.refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to run arts education scraper",
        variant: "destructive",
      });
    },
  });

  const runAwardsScraper = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/scraper/awards-ceremony", {}),
    onSuccess: () => {
      toast({
        title: "Awards Ceremony Scraper Started",
        description: "The scraper is running and will update the database with new information.",
      });
      scraperSummary.refetch();
      scraperLogs.refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to run awards ceremony scraper",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'add': return 'default';
      case 'update': return 'secondary';
      case 'archived': return 'destructive';
      case 'validation_failed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-burgundy-900">Admin Panel</h1>
      </div>

      <Tabs defaultValue="scrapers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scrapers">Scraper Monitoring</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>

        <TabsContent value="scrapers" className="space-y-6">
          {/* Scraper Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scraperSummary.data && Object.entries(scraperSummary.data).map(([scraperName, stats]: [string, any]) => (
              <Card key={scraperName}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize">{scraperName.replace('-', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Actions:</span>
                      <span className="font-semibold">{stats.total}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Added:</span>
                      <span className="font-semibold">{stats.adds}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>Updated:</span>
                      <span className="font-semibold">{stats.updates}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Archived:</span>
                      <span className="font-semibold">{stats.archived}</span>
                    </div>
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Failed:</span>
                      <span className="font-semibold">{stats.validationFailed}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Last run: {stats.lastRun ? formatDate(stats.lastRun) : 'Never'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Manual Scraper Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Scraper Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => runArtsScraper.mutate()}
                  disabled={runArtsScraper.isPending}
                >
                  {runArtsScraper.isPending ? "Running..." : "Run Arts Education Scraper"}
                </Button>
                <Button
                  onClick={() => runAwardsScraper.mutate()}
                  disabled={runAwardsScraper.isPending}
                  variant="outline"
                >
                  {runAwardsScraper.isPending ? "Running..." : "Run Awards Scraper"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scraper Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Scraper Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {scraperLogs.data && scraperLogs.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scraper</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scraperLogs.data.slice(0, 20).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="capitalize">{log.scraperName.replace('-', ' ')}</TableCell>
                        <TableCell>
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{log.entityName}</TableCell>
                        <TableCell>
                          {log.validationStatus && (
                            <Badge variant={log.validationStatus === 'valid' ? 'default' : 'destructive'}>
                              {log.validationStatus}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{formatDate(log.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">No scraper logs found. Run a scraper to see activity here.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Content Generation */}
            <Card>
              <CardHeader>
                <CardTitle>AI Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => generateDailyContent.mutate()}
                    disabled={generateDailyContent.isPending}
                    className="w-full"
                  >
                    {generateDailyContent.isPending ? "Generating..." : "Generate Daily Content"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Creates daily articles and reviews using AI based on current theatre trends.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Aggregation */}
            <Card>
              <CardHeader>
                <CardTitle>Content Aggregation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => aggregateContent.mutate()}
                    disabled={aggregateContent.isPending}
                    className="w-full"
                  >
                    {aggregateContent.isPending ? "Aggregating..." : "Aggregate RSS Feeds"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Pulls latest content from theatre news sources and processes them.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Content Scheduler:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">RSS Feeds:</span>
                    <Badge variant="default">Monitoring</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Validation:</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}