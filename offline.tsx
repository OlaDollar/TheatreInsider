import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff, RefreshCw, Book, Puzzle } from "lucide-react";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-gray-500" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            No internet connection detected. Don't worry - you can still access some content.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Offline Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Available Offline:</h3>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Book className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">Saved Articles</p>
                <p className="text-sm text-blue-700">Previously read articles are cached</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Puzzle className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-purple-900">Theatre Crosswords</p>
                <p className="text-sm text-purple-700">Puzzles work without internet</p>
              </div>
            </div>
          </div>

          {/* Retry Button */}
          <Button 
            onClick={handleRetry} 
            className="w-full mt-6"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          {/* Connection Status */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Connection will restore automatically when available
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}