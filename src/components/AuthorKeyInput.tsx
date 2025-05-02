import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock } from "lucide-react";
import { useAuthor } from "@/lib/AuthorContext";

export function AuthorKeyInput() {
  const { authorKey, setAuthorKey, clearAuthorKey } = useAuthor();
  const [inputKey, setInputKey] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setAuthorKey(inputKey.trim());
      setInputKey("");
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
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="password"
              placeholder="Enter author key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputKey.trim()}>Apply</Button>
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