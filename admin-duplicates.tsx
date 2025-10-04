import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

interface DuplicateGroup {
  primaryPerformer: any;
  duplicates: any[];
  reason: string;
  confidence: number;
}

interface MergeReport {
  merged: number;
  deleted: number;
  errors: string[];
  details: { from: string; to: string; reason: string }[];
}

export default function AdminDuplicates() {
  const [selectedTab, setSelectedTab] = useState("scan");
  const queryClient = useQueryClient();

  // Fetch duplicate performers
  const { data: duplicatesData, isLoading: isScanning, refetch: scanDuplicates } = useQuery({
    queryKey: ["/api/admin/duplicates/scan"],
    enabled: selectedTab === "scan"
  });

  // Fetch deduplication report
  const { data: reportData, isLoading: isGeneratingReport } = useQuery({
    queryKey: ["/api/admin/duplicates/report"],
    enabled: selectedTab === "report"
  });

  // Merge performers mutation
  const mergeMutation = useMutation({
    mutationFn: async ({ primaryId, duplicateId }: { primaryId: number; duplicateId: number }) => {
      return apiRequest("/api/admin/duplicates/merge", {
        method: "POST",
        body: { primaryId, duplicateId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/duplicates/scan"] });
    }
  });

  // Delete performer mutation
  const deleteMutation = useMutation({
    mutationFn: async (performerId: number) => {
      return apiRequest(`/api/admin/duplicates/delete/${performerId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/duplicates/scan"] });
    }
  });

  // Auto-merge mutation
  const autoMergeMutation = useMutation({
    mutationFn: async (minConfidence: number = 90) => {
      return apiRequest("/api/admin/duplicates/auto-merge", {
        method: "POST",
        body: { minConfidence }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/duplicates/scan"] });
    }
  });

  const duplicates: DuplicateGroup[] = duplicatesData?.duplicates || [];
  const highConfidence = duplicates.filter(d => d.confidence >= 90);
  const mediumConfidence = duplicates.filter(d => d.confidence >= 70 && d.confidence < 90);
  const lowConfidence = duplicates.filter(d => d.confidence >= 50 && d.confidence < 70);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
    if (confidence >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Low Risk</Badge>;
  };

  const handleMerge = async (primaryId: number, duplicateId: number) => {
    if (confirm("Are you sure you want to merge these performers? This action cannot be undone.")) {
      await mergeMutation.mutateAsync({ primaryId, duplicateId });
    }
  };

  const handleDelete = async (performerId: number, performerName: string) => {
    if (confirm(`Are you sure you want to delete ${performerName}? This will remove all associated data and cannot be undone.`)) {
      await deleteMutation.mutateAsync(performerId);
    }
  };

  const handleAutoMerge = async () => {
    if (confirm(`Auto-merge ${highConfidence.length} high-confidence duplicates? This action cannot be undone.`)) {
      await autoMergeMutation.mutateAsync(90);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performer Deduplication</h1>
        <p className="text-gray-600">Manage duplicate performer entries in the database</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">Scan & Merge</TabsTrigger>
          <TabsTrigger value="report">Full Report</TabsTrigger>
          <TabsTrigger value="auto">Auto Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Duplicate Performers</h2>
            <div className="space-x-2">
              <Button 
                onClick={() => scanDuplicates()} 
                disabled={isScanning}
                variant="outline"
              >
                {isScanning ? "Scanning..." : "Refresh Scan"}
              </Button>
            </div>
          </div>

          {duplicates.length === 0 && !isScanning && (
            <Alert>
              <AlertDescription>
                ✅ No duplicate performers found. Database is clean!
              </AlertDescription>
            </Alert>
          )}

          {highConfidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">High Confidence Duplicates ({highConfidence.length})</CardTitle>
                <CardDescription>
                  These are very likely to be duplicates and safe for automatic merging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {highConfidence.map((group, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{group.primaryPerformer.name}</h3>
                        <p className="text-sm text-gray-600">{group.reason} • {group.confidence}% confidence</p>
                      </div>
                      {getConfidenceBadge(group.confidence)}
                    </div>
                    <div className="space-y-2">
                      {group.duplicates.map((duplicate) => (
                        <div key={duplicate.id} className="flex items-center justify-between bg-white rounded p-3">
                          <div>
                            <p className="font-medium">{duplicate.name}</p>
                            <p className="text-sm text-gray-500">ID: {duplicate.id} • {duplicate.notableFor}</p>
                          </div>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleMerge(group.primaryPerformer.id, duplicate.id)}
                              disabled={mergeMutation.isPending}
                            >
                              Merge
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(duplicate.id, duplicate.name)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {mediumConfidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-700">Medium Confidence Duplicates ({mediumConfidence.length})</CardTitle>
                <CardDescription>
                  These may be duplicates but require manual review before merging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mediumConfidence.map((group, index) => (
                  <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{group.primaryPerformer.name}</h3>
                        <p className="text-sm text-gray-600">{group.reason} • {group.confidence}% confidence</p>
                      </div>
                      {getConfidenceBadge(group.confidence)}
                    </div>
                    <div className="space-y-2">
                      {group.duplicates.map((duplicate) => (
                        <div key={duplicate.id} className="flex items-center justify-between bg-white rounded p-3">
                          <div>
                            <p className="font-medium">{duplicate.name}</p>
                            <p className="text-sm text-gray-500">ID: {duplicate.id} • {duplicate.notableFor}</p>
                          </div>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMerge(group.primaryPerformer.id, duplicate.id)}
                              disabled={mergeMutation.isPending}
                            >
                              Merge
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(duplicate.id, duplicate.name)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {lowConfidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Low Confidence Duplicates ({lowConfidence.length})</CardTitle>
                <CardDescription>
                  These require careful investigation before taking any action.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lowConfidence.map((group, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{group.primaryPerformer.name}</h3>
                        <p className="text-sm text-gray-600">{group.reason} • {group.confidence}% confidence</p>
                      </div>
                      {getConfidenceBadge(group.confidence)}
                    </div>
                    <div className="space-y-2">
                      {group.duplicates.map((duplicate) => (
                        <div key={duplicate.id} className="flex items-center justify-between bg-white rounded p-3">
                          <div>
                            <p className="font-medium">{duplicate.name}</p>
                            <p className="text-sm text-gray-500">ID: {duplicate.id} • {duplicate.notableFor}</p>
                          </div>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMerge(group.primaryPerformer.id, duplicate.id)}
                              disabled={mergeMutation.isPending}
                            >
                              Merge
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(duplicate.id, duplicate.name)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deduplication Report</CardTitle>
              <CardDescription>Comprehensive analysis of duplicate performers</CardDescription>
            </CardHeader>
            <CardContent>
              {isGeneratingReport ? (
                <div className="text-center py-8">
                  <p>Generating comprehensive report...</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                  {reportData?.report || "No report available"}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatic Actions</CardTitle>
              <CardDescription>Bulk operations for managing duplicates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Auto-Merge High Confidence</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatically merge all duplicates with 90%+ confidence. 
                    Currently: {highConfidence.length} candidates
                  </p>
                  <Button 
                    onClick={handleAutoMerge}
                    disabled={autoMergeMutation.isPending || highConfidence.length === 0}
                    className="w-full"
                  >
                    {autoMergeMutation.isPending ? "Processing..." : `Auto-Merge ${highConfidence.length} Duplicates`}
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Groups:</span>
                      <span className="font-medium">{duplicates.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Confidence:</span>
                      <span className="font-medium text-red-600">{highConfidence.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Confidence:</span>
                      <span className="font-medium text-yellow-600">{mediumConfidence.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Confidence:</span>
                      <span className="font-medium text-blue-600">{lowConfidence.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {autoMergeMutation.data && (
                <Alert>
                  <AlertDescription>
                    ✅ Auto-merge completed: {autoMergeMutation.data.merged} performers merged, {autoMergeMutation.data.errors.length} errors
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}