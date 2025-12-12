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
import { License } from "@/pages/Index";

interface EditLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (license: License) => void;
  license: License | null;
}

export const EditLicenseDialog = ({ open, onOpenChange, onEdit, license }: EditLicenseDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [activationPassword, setActivationPassword] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [maxUsers, setMaxUsers] = useState(5);

  useEffect(() => {
    if (license) {
      setName(license.name);
      setEmail(license.email);
      setActivationPassword(license.activationPassword);
      setDefaultPassword(license.defaultPassword);
      setMaxUsers(license.maxUsers);
    }
  }, [license]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && email.trim() && activationPassword.trim() && defaultPassword.trim() && license) {
      onEdit({
        ...license,
        name: name.trim(),
        email: email.trim(),
        activationPassword: activationPassword.trim(),
        defaultPassword: defaultPassword.trim(),
        maxUsers: maxUsers,
      });
      
      onOpenChange(false);
    }
  };

  if (!license) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Licença</DialogTitle>
            <DialogDescription>
              Atualize as informações da licença Office 365.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Licença</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Microsoft 365 Business Standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail do Domínio Microsoft 365</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="admin@empresa.onmicrosoft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-activationPassword">Senha de Ativação</Label>
              <Input
                id="edit-activationPassword"
                type="password"
                placeholder="Senha de ativação"
                value={activationPassword}
                onChange={(e) => setActivationPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-defaultPassword">Senha Padrão (não alterada)</Label>
              <Input
                id="edit-defaultPassword"
                type="password"
                placeholder="Senha padrão"
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-maxUsers">Máximo de Usuários</Label>
              <Input
                id="edit-maxUsers"
                type="number"
                min="1"
                max="50"
                value={maxUsers}
                onChange={(e) => setMaxUsers(parseInt(e.target.value))}
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
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
