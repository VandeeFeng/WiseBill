import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { useAuthor } from "@/lib/AuthorContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function AuthorKeyInput() {
  const { authorKey, setAuthorKey, clearAuthorKey, isValidatingKey } = useAuthor();
  const [inputKey, setInputKey] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setKeyError(null);
      const isValid = await setAuthorKey(inputKey.trim());
      
      if (isValid) {
        toast({
          title: "Author Key Set",
          description: "Your key has been set. Data will be fetched using this key."
        });
        setInputKey("");
      } else {
        setKeyError("Invalid author key. Please try again.");
        toast({
          title: "Invalid Key",
          description: "The author key you entered is invalid.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {authorKey ? <Unlock className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-red-500" />}
          Author Key
        </CardTitle>
        <CardDescription>
          {authorKey 
            ? "Real data is being displayed. You can clear the key to view sample data." 
            : "Enter an author key to view real data. Currently showing sample data."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!authorKey ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter author key"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setKeyError(null);
                }}
                className={cn("flex-1", keyError && "border-red-500")}
                disabled={isValidatingKey}
              />
              <Button 
                type="submit" 
                disabled={!inputKey.trim() || isValidatingKey}
              >
                {isValidatingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {keyError && (
              <p className="text-sm text-red-500 mt-1">{keyError}</p>
            )}
          </form>
        ) : (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Author key is set
            </div>
            <Button variant="outline" size="sm" onClick={clearAuthorKey}>
              Clear Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 