import { useCityList } from '@/hooks/useCityList';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Users } from 'lucide-react';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

export function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  const { activeCities, loading, error, refetch } = useCityList();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm border">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Cargando ciudades...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-red-600">
            ❌ Error: {error}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-sm">Seleccionar Ciudad:</span>
      </div>
      
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="-- Selecciona una ciudad --" />
        </SelectTrigger>
        <SelectContent>
          {activeCities.map(city => (
            <SelectItem key={city.id} value={city.id}>
              <div className="flex items-center justify-between w-full">
                <span>{city.name}</span>
                <div className="flex items-center gap-1 ml-2">
                  <Users className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">
                    {city.population.toLocaleString()}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          📊 {activeCities.length} ciudades con datos disponibles
        </span>
        <Badge variant="secondary" className="text-xs">
          NASA TEMPO
        </Badge>
      </div>
    </div>
  );
}