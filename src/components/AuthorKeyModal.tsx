import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Lock, Unlock } from "lucide-react";
import { useAuthor } from "@/lib/AuthorContext";
import { useToast } from "@/hooks/use-toast";

interface AuthorKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthorKeyModal({ open, onOpenChange }: AuthorKeyModalProps) {
  const { authorKey, setAuthorKey, clearAuthorKey } = useAuthor();
  const [inputKey, setInputKey] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputKey.trim()) {
      setAuthorKey(inputKey.trim());
      toast({
        title: "Author Key Set",
        description: "Your key has been set. Data will be fetched using this key."
      });
      setInputKey("");
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    clearAuthorKey();
    onOpenChange(false);
    toast({
      title: "Key Cleared",
      description: "You are now viewing sample data.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {authorKey ? <Unlock className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-red-500" />}
            Author Key
          </DialogTitle>
          <DialogDescription>
            {authorKey 
              ? "Using stored author key. You can clear it to view sample data." 
              : "Enter your author key to view real data. Currently showing sample data."}
          </DialogDescription>
        </DialogHeader>
        
        {!authorKey ? (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter author key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!inputKey.trim()}>Apply</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="text-sm">
              Author key is set. Data will be fetched using this key.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClear}>
                Clear Key
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 