import cleanSkyLAApi from './cleanSkyLAApi';

interface TestResult {
  name: string;
  status: 'success' | 'error';
  message: string;
}

export async function testCleanSkyLAApi(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log('🧪 Iniciando tests de conectividad CleanSky LA API...');
  
  // Test 1: API Info
  try {
    console.log('Testing: API Info...');
    const apiInfo = await cleanSkyLAApi.getApiInfo();
    if (apiInfo.name && apiInfo.version) {
      results.push({
        name: 'API Info',
        status: 'success',
        message: `✅ ${apiInfo.name} v${apiInfo.version} disponible`
      });
    } else {
      results.push({
        name: 'API Info',
        status: 'error',
        message: '❌ Información de API incompleta'
      });
    }
  } catch (error) {
    results.push({
      name: 'API Info',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 2: Health Check
  try {
    console.log('Testing: Health Check...');
    const health = await cleanSkyLAApi.getHealth();
    if (health.status === 'ok') {
      results.push({
        name: 'Health Check',
        status: 'success',
        message: `✅ API saludable - ${health.data_sources ? Object.keys(health.data_sources).length : 0} fuentes de datos`
      });
    } else {
      results.push({
        name: 'Health Check',
        status: 'error',
        message: '❌ API no saludable'
      });
    }
  } catch (error) {
    results.push({
      name: 'Health Check',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 3: Datos más recientes
  try {
    console.log('Testing: Datos más recientes...');
    const latest = await cleanSkyLAApi.getLatest();
    if (latest.cells && latest.cells.length > 0) {
      results.push({
        name: 'Datos más recientes',
        status: 'success',
        message: `✅ ${latest.cells.length} celdas de datos cargadas`
      });
    } else {
      results.push({
        name: 'Datos más recientes',
        status: 'error',
        message: '❌ No hay datos disponibles'
      });
    }
  } catch (error) {
    results.push({
      name: 'Datos más recientes',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 4: Lista de ciudades (adaptador)
  try {
    console.log('Testing: Lista de ciudades...');
    const cities = await cleanSkyLAApi.getCities();
    const activeCities = cities.cities.filter(c => c.has_data);
    results.push({
      name: 'Lista de ciudades',
      status: 'success',
      message: `✅ ${cities.cities.length} ciudades total, ${activeCities.length} con datos`
    });
  } catch (error) {
    results.push({
      name: 'Lista de ciudades',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 5: Datos GeoJSON de Los Angeles
  try {
    console.log('Testing: Datos GeoJSON de Los Angeles...');
    const geoJson = await cleanSkyLAApi.getCityGeoJSON('los_angeles');
    if (geoJson.type === 'FeatureCollection' && geoJson.features.length > 0) {
      results.push({
        name: 'Datos GeoJSON',
        status: 'success',
        message: `✅ ${geoJson.features.length} features GeoJSON para Los Angeles`
      });
    } else {
      results.push({
        name: 'Datos GeoJSON',
        status: 'error',
        message: '❌ GeoJSON inválido'
      });
    }
  } catch (error) {
    results.push({
      name: 'Datos GeoJSON',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  // Test 6: Comparación de ciudades
  try {
    console.log('Testing: Comparación de ciudades...');
    const comparison = await cleanSkyLAApi.compareCities(['los_angeles']);
    if (comparison.ranking && comparison.ranking.length > 0) {
      results.push({
        name: 'Comparación de ciudades',
        status: 'success',
        message: `✅ Comparación exitosa - Risk Score promedio: ${comparison.ranking[0].avg_risk_score.toFixed(1)}`
      });
    } else {
      results.push({
        name: 'Comparación de ciudades',
        status: 'error',
        message: '❌ Error en comparación'
      });
    }
  } catch (error) {
    results.push({
      name: 'Comparación de ciudades',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  console.log('🏁 Tests de CleanSky LA API completados');
  return results;
}

// Función helper para ejecutar desde la consola del navegador
export function runCleanSkyLAApiTests() {
  testCleanSkyLAApi().then(results => {
    console.table(results);
    return results;
  });
}

// Hacer disponible globalmente para testing
if (typeof window !== 'undefined') {
  (window as any).testCleanSkyLAApi = testCleanSkyLAApi;
  (window as any).runCleanSkyLAApiTests = runCleanSkyLAApiTests;
}