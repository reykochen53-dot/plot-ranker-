const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1040,
    minHeight: 720,
    title: 'PlotRanker',
    backgroundColor: '#0b1020',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

ipcMain.handle('geocode', async (_event, query, countryCode = '') => {
  const u = new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('format', 'jsonv2');
  u.searchParams.set('limit', '6');
  u.searchParams.set('addressdetails', '1');
  u.searchParams.set('q', String(query || ''));
  if (countryCode) u.searchParams.set('countrycodes', countryCode);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(u, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PlotRanker/1.0 local desktop app',
        'Accept-Language': 'en'
      }
    });
    if (!response.ok) throw new Error(`Geocoder returned ${response.status}`);
    return { ok: true, results: await response.json() };
  } catch (error) {
    return { ok: false, error: error.message };
  } finally {
    clearTimeout(timer);
  }
});

ipcMain.handle('roundabouts', async (_event, lat, lon, radius = 5000) => {
  const query = `[out:json][timeout:20];(way(around:${Math.min(Number(radius)||5000,12000)},${Number(lat)},${Number(lon)})[junction=roundabout];way(around:${Math.min(Number(radius)||5000,12000)},${Number(lat)},${Number(lon)})[highway][junction=circular];);out center tags;`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 22000);
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: query })
    });
    if (!response.ok) throw new Error(`Overpass returned ${response.status}`);
    const json = await response.json();
    return {
      ok: true,
      results: (json.elements || []).map((e) => ({
        id: e.id,
        lat: e.center?.lat,
        lon: e.center?.lon,
        name: e.tags?.name || 'Mapped roundabout'
      })).filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lon))
    };
  } catch (error) {
    return { ok: false, error: error.message, results: [] };
  } finally {
    clearTimeout(timer);
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
