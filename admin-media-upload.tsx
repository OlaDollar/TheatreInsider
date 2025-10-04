import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";

interface UploadSource {
  type: 'local_file' | 'url' | 'server_path' | 'cdn_path';
  source: string;
  headers?: Record<string, string>;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

interface PressPackManifest {
  showTitle: string;
  venue: string;
  region: 'uk' | 'us' | 'both';
  season: string;
  photographer: string;
  copyright: string;
  contactEmail: string;
  files: {
    images: {
      posters: string[];
      production: string[];
      cast: string[];
      backstage: string[];
    };
    videos: {
      trailers: string[];
      behindScenes: string[];
      interviews: string[];
    };
  };
}

interface MediaPreview {
  id: string;
  filename: string;
  size: number;
  type: 'image' | 'video';
  category: 'poster' | 'production' | 'cast' | 'backstage' | 'promotional' | 'trailer';
  thumbnailUrl: string;
  source: string;
  sourceType: 'local_file' | 'url' | 'server_path' | 'cdn_path';
  selected: boolean;
  isDuplicate: boolean;
  duplicateCount?: number;
  metadata: {
    mimeType: string;
    dimensions?: string;
    duration?: string;
  };
}

export default function AdminMediaUpload() {
  const [activeTab, setActiveTab] = useState("single");
  const [sources, setSources] = useState<UploadSource[]>([]);
  const [previews, setPreviews] = useState<MediaPreview[]>([]);
  const [showPreviews, setShowPreviews] = useState(false);
  const [manifest, setManifest] = useState<Partial<PressPackManifest>>({
    region: 'uk',
    files: {
      images: { posters: [], production: [], cast: [], backstage: [] },
      videos: { trailers: [], behindScenes: [], interviews: [] }
    }
  });

  const previewMutation = useMutation({
    mutationFn: async (sources: UploadSource[]) => {
      return apiRequest("/api/media/preview-press-pack", {
        method: "POST",
        body: { sources }
      });
    },
    onSuccess: (data) => {
      setPreviews(data.previews || []);
      setShowPreviews(true);
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { selectedIds: string[]; previews: MediaPreview[]; manifest: PressPackManifest }) => {
      return apiRequest("/api/media/upload-selected", {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      setShowPreviews(false);
      setPreviews([]);
    }
  });

  const manifestMutation = useMutation({
    mutationFn: async (manifestPath: string) => {
      return apiRequest("/api/media/upload-from-manifest", {
        method: "POST",
        body: { manifestPath }
      });
    }
  });

  const addSource = () => {
    setSources(prev => [...prev, { type: 'url', source: '' }]);
  };

  const updateSource = (index: number, field: keyof UploadSource, value: string) => {
    setSources(prev => prev.map((source, i) => 
      i === index ? { ...source, [field]: value } : source
    ));
  };

  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreview = async () => {
    if (sources.length === 0) {
      alert("Please add at least one source");
      return;
    }

    await previewMutation.mutateAsync(sources);
  };

  const handleUpload = async () => {
    if (!manifest.showTitle || !manifest.venue) {
      alert("Please provide show title and venue");
      return;
    }

    const selectedIds = previews.filter(p => p.selected).map(p => p.id);
    if (selectedIds.length === 0) {
      alert("Please select at least one file to upload");
      return;
    }

    await uploadMutation.mutateAsync({
      selectedIds,
      previews,
      manifest: manifest as PressPackManifest
    });
  };

  const toggleFileSelection = (id: string) => {
    setPreviews(prev => prev.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAll = () => {
    setPreviews(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setPreviews(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const deselectDuplicates = () => {
    setPreviews(prev => prev.map(p => 
      p.isDuplicate ? { ...p, selected: false } : p
    ));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleManifestUpload = async (manifestPath: string) => {
    if (!manifestPath.trim()) {
      alert("Please provide manifest file path");
      return;
    }

    await manifestMutation.mutateAsync(manifestPath);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Press Pack Media Upload</h1>
        <p className="text-gray-600">Upload show images and videos from press packs</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Single Upload</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          <TabsTrigger value="manifest">Manifest Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Show Information</CardTitle>
              <CardDescription>Basic details about the production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="showTitle">Show Title</Label>
                  <Input
                    id="showTitle"
                    value={manifest.showTitle || ''}
                    onChange={(e) => setManifest(prev => ({ ...prev, showTitle: e.target.value }))}
                    placeholder="e.g., The Lion King"
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={manifest.venue || ''}
                    onChange={(e) => setManifest(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="e.g., Lyceum Theatre"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select 
                    value={manifest.region} 
                    onValueChange={(value: 'uk' | 'us' | 'both') => 
                      setManifest(prev => ({ ...prev, region: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="us">US</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    value={manifest.season || ''}
                    onChange={(e) => setManifest(prev => ({ ...prev, season: e.target.value }))}
                    placeholder="e.g., 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="photographer">Photographer</Label>
                  <Input
                    id="photographer"
                    value={manifest.photographer || ''}
                    onChange={(e) => setManifest(prev => ({ ...prev, photographer: e.target.value }))}
                    placeholder="e.g., Joan Marcus"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="copyright">Copyright Information</Label>
                <Input
                  id="copyright"
                  value={manifest.copyright || ''}
                  onChange={(e) => setManifest(prev => ({ ...prev, copyright: e.target.value }))}
                  placeholder="e.g., © 2024 Disney Theatrical Productions"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Sources</CardTitle>
              <CardDescription>Add sources for images and videos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sources.map((source, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Source {index + 1}</Badge>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeSource(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Select 
                        value={source.type} 
                        onValueChange={(value) => updateSource(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="url">URL Download</SelectItem>
                          <SelectItem value="server_path">Server Path</SelectItem>
                          <SelectItem value="cdn_path">CDN Path</SelectItem>
                          <SelectItem value="local_file">Local File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label>Source Path/URL</Label>
                      <Input
                        value={source.source}
                        onChange={(e) => updateSource(index, 'source', e.target.value)}
                        placeholder={
                          source.type === 'url' ? 'https://example.com/image.jpg' :
                          source.type === 'server_path' ? '/path/to/files/' :
                          source.type === 'cdn_path' ? 'https://cdn.example.com/files/' :
                          '/local/path/to/file.jpg'
                        }
                      />
                    </div>
                  </div>

                  {source.type === 'url' && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>API Key (optional)</Label>
                        <Input
                          placeholder="Bearer token or API key"
                          onChange={(e) => updateSource(index, 'credentials', JSON.stringify({ apiKey: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Username (optional)</Label>
                        <Input
                          placeholder="Basic auth username"
                          onChange={(e) => {
                            const creds = source.credentials || {};
                            updateSource(index, 'credentials', JSON.stringify({ ...creds, username: e.target.value }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Password (optional)</Label>
                        <Input
                          type="password"
                          placeholder="Basic auth password"
                          onChange={(e) => {
                            const creds = source.credentials || {};
                            updateSource(index, 'credentials', JSON.stringify({ ...creds, password: e.target.value }));
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button onClick={addSource} variant="outline" className="w-full">
                Add Media Source
              </Button>
            </CardContent>
          </Card>

          {!showPreviews ? (
            <div className="flex justify-end space-x-4">
              <Button 
                onClick={handlePreview}
                disabled={previewMutation.isPending}
                variant="outline"
              >
                {previewMutation.isPending ? "Scanning..." : "Preview Files"}
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>File Selection</CardTitle>
                <CardDescription>
                  Review and select files to upload. {previews.filter(p => p.selected).length} of {previews.length} files selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Button size="sm" variant="outline" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={deselectAll}>
                    Deselect All
                  </Button>
                  <Button size="sm" variant="outline" onClick={deselectDuplicates}>
                    Deselect Duplicates
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {previews.map((preview) => (
                    <div 
                      key={preview.id} 
                      className={`border rounded-lg p-3 ${preview.selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} ${preview.isDuplicate ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={preview.selected}
                          onCheckedChange={() => toggleFileSelection(preview.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 min-w-0">
                          {preview.type === 'image' ? (
                            <img 
                              src={preview.thumbnailUrl} 
                              alt={preview.filename}
                              className="w-full h-24 object-cover rounded mb-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/image-placeholder.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">VIDEO</span>
                            </div>
                          )}
                          
                          <p className="text-sm font-medium truncate" title={preview.filename}>
                            {preview.filename}
                          </p>
                          
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {preview.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(preview.size)}
                            </span>
                          </div>

                          {preview.isDuplicate && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              Duplicate {preview.duplicateCount && `(${preview.duplicateCount})`}
                            </Badge>
                          )}

                          {preview.metadata.dimensions && (
                            <p className="text-xs text-gray-500 mt-1">
                              {preview.metadata.dimensions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreviews(false)}
                  >
                    Back to Sources
                  </Button>
                  
                  <Button 
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending || previews.filter(p => p.selected).length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {uploadMutation.isPending ? "Uploading..." : `Upload ${previews.filter(p => p.selected).length} Files`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadMutation.data && (
            <Alert>
              <AlertDescription>
                ✅ Upload completed: {uploadMutation.data.uploadedFiles?.length || 0} files processed
                {uploadMutation.data.errors?.length > 0 && (
                  <div className="mt-2">
                    <strong>Errors:</strong>
                    <ul className="list-disc ml-4">
                      {uploadMutation.data.errors.map((error: string, i: number) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Instructions</CardTitle>
              <CardDescription>Upload multiple shows at once using server paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Bulk Upload Format:</strong><br/>
                  1. Place press pack folders in /uploads/press-packs/<br/>
                  2. Each folder should be named: "ShowTitle_Venue_Season"<br/>
                  3. Include a manifest.json file in each folder<br/>
                  4. Organize media in subfolders: images/, videos/<br/>
                </AlertDescription>
              </Alert>
              
              <div>
                <Label htmlFor="bulkPath">Press Packs Directory</Label>
                <Input
                  id="bulkPath"
                  placeholder="/uploads/press-packs/"
                  defaultValue="/uploads/press-packs/"
                />
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Process Bulk Upload
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manifest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manifest File Upload</CardTitle>
              <CardDescription>Upload using a JSON manifest file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manifestPath">Manifest File Path</Label>
                <Input
                  id="manifestPath"
                  placeholder="/path/to/manifest.json"
                />
              </div>
              
              <Button 
                onClick={() => {
                  const path = (document.getElementById('manifestPath') as HTMLInputElement).value;
                  handleManifestUpload(path);
                }}
                disabled={manifestMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {manifestMutation.isPending ? "Processing..." : "Upload from Manifest"}
              </Button>

              {manifestMutation.data && (
                <Alert>
                  <AlertDescription>
                    ✅ Manifest processed: {manifestMutation.data.uploadedFiles?.length || 0} files uploaded
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6">
                <h4 className="font-medium mb-2">Example Manifest Structure:</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "showTitle": "The Lion King",
  "venue": "Lyceum Theatre",
  "region": "uk",
  "season": "2024",
  "photographer": "Joan Marcus",
  "copyright": "© 2024 Disney Theatrical",
  "contactEmail": "press@disney.com",
  "files": {
    "images": {
      "posters": ["/path/to/poster1.jpg"],
      "production": ["/path/to/scene1.jpg"],
      "cast": ["/path/to/cast.jpg"],
      "backstage": []
    },
    "videos": {
      "trailers": ["/path/to/trailer.mp4"],
      "behindScenes": [],
      "interviews": []
    }
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}