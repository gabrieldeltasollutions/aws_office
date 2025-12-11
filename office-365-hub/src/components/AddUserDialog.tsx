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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && email.trim() && password.trim() && defaultPassword.trim()) {
      onAdd({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        defaultPassword: defaultPassword.trim(),
      });
      
      setName("");
      setEmail("");
      setPassword("");
      setDefaultPassword("");
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
              <Input
                id="user-email"
                type="email"
                placeholder="joao.silva@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-password">Senha do usuário</Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Senha do usuário"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-default-password">Senha padrão do usuário</Label>
              <Input
                id="user-default-password"
                type="password"
                placeholder="Senha padrão"
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
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
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
