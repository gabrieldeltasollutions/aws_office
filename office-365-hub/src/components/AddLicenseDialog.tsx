import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { License } from "@/pages/Index";

interface AddLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (license: Omit<License, "id">) => void;
}

export const AddLicenseDialog = ({ open, onOpenChange, onAdd }: AddLicenseDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && email.trim() && key.trim()) {
      onAdd({
        name: name.trim(),
        email: email.trim(),
        key: key.trim(),
        users: [],
        maxUsers: 5,
      });
      
      setName("");
      setEmail("");
      setKey("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Licença</DialogTitle>
            <DialogDescription>
              Cadastre uma nova licença Office 365. Cada licença pode ter até 5 usuários.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Licença</Label>
              <Input
                id="name"
                placeholder="Ex: Microsoft 365 Business Standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail do Domínio Microsoft 365</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.onmicrosoft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key">Chave da Licença</Label>
              <Input
                id="key"
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Licença
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
