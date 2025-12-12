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
import { User } from "@/pages/Index";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (user: Omit<User, "id">) => void;
  availableSlots: number;
}

export const AddUserDialog = ({ 
  open, 
  onOpenChange, 
  onAdd,
  availableSlots 
}: AddUserDialogProps) => {
  const [name, setName] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const emailDomain = "@deltasollutions.com.br";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && emailPrefix.trim()) {
      onAdd({
        name: name.trim(),
        email: emailPrefix.trim() + emailDomain,
      });

      setName("");
      setEmailPrefix("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>
              Atribua um novo usuário a esta licença. {availableSlots} {availableSlots === 1 ? 'vaga disponível' : 'vagas disponíveis'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome Completo</Label>
              <Input
                id="user-name"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-email">Email Delta</Label>
              <div className="flex items-center gap-1">
                <Input
                  id="user-email"
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
            
            {/* Senhas do usuário removidas do formulário de criação */}
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
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
