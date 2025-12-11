import { useState } from "react";
import { Users, Trash2, UserPlus, Mail, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddUserDialog } from "./AddUserDialog";
import { License, User } from "@/pages/Index";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface LicenseCardProps {
  license: License;
  onUpdate: (licenseId: string, updatedLicense: License) => void;
  onDelete: (licenseId: string) => void;
}

export const LicenseCard = ({ license, onUpdate, onDelete }: LicenseCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [revealedUserId, setRevealedUserId] = useState<string | null>(null);

  const usagePercentage = (license.users.length / license.maxUsers) * 100;
  const availableSlots = license.maxUsers - license.users.length;

  const getStatusColor = () => {
    if (usagePercentage >= 100) return "text-destructive";
    if (usagePercentage >= 80) return "text-warning";
    return "text-accent";
  };

  const getStatusBadge = () => {
    if (usagePercentage >= 100) return <Badge variant="destructive">Completa</Badge>;
    if (usagePercentage >= 80) return <Badge className="bg-warning text-warning-foreground">Quase cheia</Badge>;
    return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
  };

  const addUser = async (user: Omit<User, "id">) => {
    if (license.users.length >= license.maxUsers) {
      toast.error("Licença está cheia");
      return;
    }
    
    try {
      const updatedLicense = await apiService.addUser(license.id, user);
      onUpdate(license.id, updatedLicense);
      toast.success("Usuário adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar usuário: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    }
  };

  const removeUser = async (userId: string) => {
    try {
      const updatedLicense = await apiService.removeUser(license.id, userId);
      onUpdate(license.id, updatedLicense);
      toast.success("Usuário removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover usuário: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    }
  };

  return (
    <>
      <Card className="shadow-card hover:shadow-card-hover transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg">{license.name}</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                {license.email}
              </p>
              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                  <span>Senha: {showPasswords ? (license.activationPassword || '—') : (license.activationPassword ? '••••••••' : '—')}</span>
                  <Button size="sm" variant="outline" onClick={async () => {
                    const admin = window.prompt('Insira senha admin para visualizar as senhas:');
                    if (admin === 'delta123@') {
                      setShowPasswords(true);
                      setTimeout(() => setShowPasswords(false), 10000);
                    } else {
                      toast.error('Senha admin incorreta');
                    }
                  }}>Ver</Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Senha padrão: {showPasswords ? (license.defaultPassword || '—') : (license.defaultPassword ? '••••••••' : '—')}
              </p>
              
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ocupação</span>
              <span className={`font-semibold ${getStatusColor()}`}>
                {license.users.length}/{license.maxUsers} usuários
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-800 text-xs font-medium">
                Disponível: {availableSlots} {availableSlots === 1 ? 'vaga' : 'vagas'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddUserDialogOpen(true)}
                disabled={availableSlots === 0}
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Adicionar
              </Button>
            </div>

            {license.users.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {license.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                        <span>Senha: {revealedUserId === user.id ? (user.password || '—') : (user.password ? '••••••••' : '—')}</span>
                        <span>Padrão: {revealedUserId === user.id ? (user.defaultPassword || '—') : (user.defaultPassword ? '••••••••' : '—')}</span>
                        <Button size="xs" variant="outline" onClick={() => {
                          const admin = window.prompt('Insira senha admin para visualizar as senhas:');
                          if (admin === 'delta123@') {
                            setRevealedUserId(user.id);
                            setTimeout(() => setRevealedUserId(null), 10000);
                          } else {
                            toast.error('Senha admin incorreta');
                          }
                        }}>Ver</Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUser(user.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum usuário atribuído
              </p>
            )}
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Excluir Licença
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a licença "{license.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(license.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAdd={addUser}
        availableSlots={availableSlots}
      />
    </>
  );
};
