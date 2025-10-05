import api from './api';

interface TestResult {
  name: string;
  status: 'success' | 'error';
  message: string;
}

export async function testApiConnection(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log('🧪 Iniciando tests de conectividad API...');
  
  // Test 1: Lista de ciudades
  try {
    console.log('Testing: Lista de ciudades...');
    const citiesData = await api.getCities();
    if (citiesData.cities && citiesData.cities.length > 0) {
      results.push({
        name: 'Lista de ciudades',
        status: 'success',
        message: `✅ Encontradas ${citiesData.cities.length} ciudades`
      });
    } else {
      results.push({
        name: 'Lista de ciudades',
        status: 'error',
        message: '❌ No se encontraron ciudades'
      });
    }
  } catch (error) {
    results.push({
      name: 'Lista de ciudades',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 2: Datos de Los Angeles
  try {
    console.log('Testing: Datos de Los Angeles...');
    const laData = await api.getCityData('los_angeles');
    if (laData.cells && laData.cells.length >= 100) {
      results.push({
        name: 'Datos de Los Angeles',
        status: 'success',
        message: `✅ ${laData.cells.length} puntos de datos cargados`
      });
    } else {
      results.push({
        name: 'Datos de Los Angeles',
        status: 'error',
        message: '❌ Datos insuficientes'
      });
    }
  } catch (error) {
    results.push({
      name: 'Datos de Los Angeles',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 3: GeoJSON de Chicago
  try {
    console.log('Testing: GeoJSON de Chicago...');
    const chicagoGeoJson = await api.getCityGeoJSON('chicago');
    if (chicagoGeoJson.type === 'FeatureCollection' && chicagoGeoJson.features.length >= 100) {
      results.push({
        name: 'GeoJSON de Chicago',
        status: 'success',
        message: `✅ ${chicagoGeoJson.features.length} features GeoJSON`
      });
    } else {
      results.push({
        name: 'GeoJSON de Chicago',
        status: 'error',
        message: '❌ GeoJSON inválido'
      });
    }
  } catch (error) {
    results.push({
      name: 'GeoJSON de Chicago',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 4: Comparación de ciudades
  try {
    console.log('Testing: Comparación ciudades...');
    const comparison = await api.compareCities(['los_angeles', 'chicago']);
    if (comparison.ranking && comparison.ranking.length === 2) {
      results.push({
        name: 'Comparación ciudades',
        status: 'success',
        message: `✅ Comparación exitosa de ${comparison.ranking.length} ciudades`
      });
    } else {
      results.push({
        name: 'Comparación ciudades',
        status: 'error',
        message: '❌ Error en comparación'
      });
    }
  } catch (error) {
    results.push({
      name: 'Comparación ciudades',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  console.log('🏁 Tests completados');
  return results;
}

// Función helper para ejecutar desde la consola del navegador
export function runApiTests() {
  testApiConnection().then(results => {
    console.table(results);
    return results;
  });
}