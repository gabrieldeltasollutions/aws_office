import { useState, useEffect } from "react";
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
import { User } from "@/pages/Index";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  user: User | null;
}

export const EditUserDialog = ({ 
  open, 
  onOpenChange, 
  onEdit,
  user 
}: EditUserDialogProps) => {
  const [name, setName] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const emailDomain = "@deltasollutions.com.br";

  useEffect(() => {
    if (user) {
      setName(user.name);
      // Extrair o prefixo do email (remover o domínio)
      const prefix = user.email.replace(emailDomain, "");
      setEmailPrefix(prefix);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && emailPrefix.trim() && user) {
      onEdit({
        ...user,
        name: name.trim(),
        email: emailPrefix.trim() + emailDomain,
      });

      onOpenChange(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name">Nome Completo</Label>
              <Input
                id="edit-user-name"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-user-email">Email Delta</Label>
              <div className="flex items-center gap-1">
                <Input
                  id="edit-user-email"
                  type="text"
                  placeholder="joao.silva"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  required
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {emailDomain}
                </span>
              </div>
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
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
