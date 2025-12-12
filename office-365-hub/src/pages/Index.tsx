import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LicenseCard } from "@/components/LicenseCard";
import { AddLicenseDialog } from "@/components/AddLicenseDialog";
import { StatsCards } from "@/components/StatsCards";
import { apiService, License, User, Stats } from "@/services/api";
import { toast } from "sonner";

export type { User, License };

const Index = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLicenses: 0,
    totalUsers: 0,
    availableSlots: 0,
    usagePercentage: 0,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [licensesData, statsData] = await Promise.all([
        apiService.getLicenses(),
        apiService.getStats(),
      ]);
      setLicenses(licensesData);
      setStats(statsData);
    } catch (error) {
      toast.error("Erro ao carregar dados: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const addLicense = async (license: Omit<License, "id">) => {
    try {
      const newLicense = await apiService.createLicense(license);
      setLicenses([...licenses, newLicense]);
      await loadData(); // Recarregar stats
      toast.success("Licença adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar licença: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    }
  };

  const updateLicense = async (licenseId: string, updatedLicense: License) => {
    try {
      // Atualiza o estado local com a licença já retornada pelas chamadas de add/remove user
      setLicenses((prev) => prev.map((l) => (l.id === licenseId ? updatedLicense : l)));

      // Recarrega apenas as estatísticas para atualizar os cards
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (error) {
      toast.error("Erro ao atualizar licença: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    }
  };

  const deleteLicense = async (licenseId: string) => {
    try {
      await apiService.deleteLicense(licenseId);
      setLicenses(licenses.filter(l => l.id !== licenseId));
      await loadData(); // Recarregar stats
      toast.success("Licença excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir licença: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Gerenciamento Office 365
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Controle de licenças e usuários
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Licença
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <>
            <StatsCards 
              totalLicenses={stats.totalLicenses}
              totalUsers={stats.totalUsers}
              availableSlots={stats.availableSlots}
              usagePercentage={stats.usagePercentage}
            />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Licenças Ativas
          </h2>
          
          {licenses.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhuma licença cadastrada ainda
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeira licença
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {licenses.map((license) => (
                <LicenseCard
                  key={license.id}
                  license={license}
                  onUpdate={updateLicense}
                  onDelete={deleteLicense}
                />
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </main>

      <AddLicenseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addLicense}
      />
    </div>
  );
};

export default Index;
