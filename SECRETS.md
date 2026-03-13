# GitHub Secrets instellen

Voeg deze secrets toe in je GitHub repository onder:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret naam                        | Waarde                                  |
|------------------------------------|------------------------------------------|
| `AZURE_WEBAPP_PUBLISH_PROFILE`     | (zie hieronder)                         |
| `AZURE_STATIC_WEB_APPS_API_TOKEN`  | `cd684938cb9cd1f9478a8ea5f70fa6964ed1660fa7070a3ca28e2dd8db9b3cb102-332231fe-aa5e-4c6c-93a2-2e8da9cab023003273204a6fa103` |

## AZURE_WEBAPP_PUBLISH_PROFILE ophalen

Run dit commando en kopieer de volledige XML output als secret:

```bash
az webapp deployment list-publishing-profiles \
  --name api-spellensite \
  --resource-group rg-spellensite \
  --xml
```

## Lokaal ontwikkelen

Maak een `.env` bestand aan in de `server/` map:

```
PORT=3000
CLIENT_URL=http://localhost:5173
MONGODB_URI=<jouw lokale of Cosmos DB connection string>
JWT_SECRET=<willekeurige lange string>
JWT_EXPIRES_IN=7d
```

Maak een `.env` bestand aan in de `client/` map:

```
VITE_API_URL=http://localhost:3000/api
```
