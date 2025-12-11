import { Package, Users, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalLicenses: number;
  totalUsers: number;
  availableSlots: number;
  usagePercentage: number;
}

export const StatsCards = ({ 
  totalLicenses, 
  totalUsers, 
  availableSlots, 
  usagePercentage 
}: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-card hover:shadow-card-hover transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Licenças
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-2">
                {totalLicenses}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Usuários Ativos
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-2">
                {totalUsers}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Vagas Disponíveis
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-2">
                {availableSlots}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Taxa de Uso
              </p>
              <h3 className="text-3xl font-bold text-foreground mt-2">
                {usagePercentage}%
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
