# Spellensite — Project Plan

## Overzicht
Een kleurrijke web applicatie met **Boter Kaas en Eieren** en **toegangsbeheer**.
Gebruikers kunnen inloggen, spelen tegen de AI of een andere speler, en hun statistieken bekijken.
Gebouwd met **Vue 3 + Node.js**, gehost op **Azure**.

---

## Functionaliteiten

### Authenticatie & Toegangsbeheer
- Gebruikersregistratie (email + wachtwoord)
- Inloggen / uitloggen met JWT tokens
- Twee rollen: `admin` en `gebruiker`
- Beveiligde routes (alleen toegankelijk na inloggen)

### Spel — Boter Kaas en Eieren
- Speelmodus kiezen:
  - **Vs AI** — minimax algoritme (onverslaanbaar op moeilijk)
  - **Vs speler** — twee spelers op hetzelfde apparaat
- Visuele terugkoppeling bij winst / gelijkspel
- Potje opslaan naar gebruikershistorie na afloop

### Statistieken per gebruiker
- Winst / verlies / gelijkspel teller
- Spelgeschiedenis (datum, tegenstander, uitkomst)
- Eigen statistiekenpagina na inloggen

### Admin-panel
- Gebruikers bekijken, blokkeren en verwijderen
- Rollen toewijzen (admin / gebruiker)
- Spelactiviteit en gebruiksstatistieken inzien
- Scores van gebruikers resetten

### Design
- Kleurrijk en speels thema
- Responsive (mobiel + desktop)
- Consistente huisstijl met vrolijke kleuren

---

## Tech Stack

| Laag       | Technologie                          |
|------------|--------------------------------------|
| Frontend   | Vue 3 + Vue Router + Pinia           |
| Backend    | Node.js + Express                    |
| Database   | Azure Cosmos DB (NoSQL) of PostgreSQL|
| Auth       | JWT (JSON Web Tokens) + bcrypt       |
| AI (spel)  | Minimax algoritme (pure JavaScript)  |
| Hosting    | Azure App Service + Static Web Apps  |
| CI/CD      | GitHub Actions → Azure               |

---

## Projectstructuur

```
spellensite/
├── client/                     # Vue.js frontend
│   ├── src/
│   │   ├── views/
│   │   │   ├── HomeView.vue    # Landingspagina
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── GameView.vue    # BKE spel
│   │   │   ├── StatsView.vue   # Eigen statistieken
│   │   │   └── AdminView.vue   # Admin-panel
│   │   ├── components/
│   │   │   ├── GameBoard.vue   # 3x3 speelbord
│   │   │   ├── ModeSelector.vue
│   │   │   └── NavBar.vue
│   │   ├── stores/
│   │   │   ├── auth.js         # Pinia: gebruiker & JWT
│   │   │   └── game.js         # Pinia: spelstatus
│   │   └── router/index.js
│   └── public/
├── server/                     # Node.js backend
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── game.js             # /api/game/*
│   │   └── users.js            # /api/users/* (admin)
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verificatie
│   │   └── adminMiddleware.js  # Rol-check
│   ├── models/
│   │   ├── User.js
│   │   └── GameResult.js
│   └── controllers/
│       ├── authController.js
│       ├── gameController.js
│       └── userController.js
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD naar Azure
└── PLAN.md
```

---

## API Endpoints

### Auth
| Methode | Endpoint             | Beschrijving               |
|---------|----------------------|----------------------------|
| POST    | /api/auth/register   | Nieuwe gebruiker aanmaken  |
| POST    | /api/auth/login      | Inloggen, JWT teruggeven   |
| GET     | /api/auth/me         | Huidig ingelogde gebruiker |

### Spel
| Methode | Endpoint             | Beschrijving               |
|---------|----------------------|----------------------------|
| POST    | /api/game/result     | Spelresultaat opslaan      |
| GET     | /api/game/history    | Spelgeschiedenis gebruiker |
| GET     | /api/game/stats      | Win/verlies/gelijkspel     |

### Gebruikers (admin only)
| Methode | Endpoint             | Beschrijving               |
|---------|----------------------|----------------------------|
| GET     | /api/users           | Alle gebruikers ophalen    |
| PUT     | /api/users/:id/role  | Rol wijzigen               |
| DELETE  | /api/users/:id       | Gebruiker verwijderen      |
| POST    | /api/users/:id/block | Gebruiker blokkeren        |
| DELETE  | /api/users/:id/score | Score resetten             |

### Admin statistieken
| Methode | Endpoint             | Beschrijving               |
|---------|----------------------|----------------------------|
| GET     | /api/admin/stats     | Totale spelactiviteit      |

---

## Azure Infrastructuur

```
Azure Subscription (MSDN)
├── Resource Group:   rg-spellensite
├── App Service Plan: asp-spellensite (B1)
├── App Service:      api-spellensite      ← Node.js backend
├── Static Web App:   stw-spellensite      ← Vue.js frontend
└── Azure Database:   db-spellensite       ← PostgreSQL / Cosmos DB
```

---

## Fases

### Fase 1 — Fundament
- [ ] Project scaffolding (Vue 3 via Vite + Node.js/Express)
- [ ] Database schema opzetten (User, GameResult)
- [ ] Registreren en inloggen (JWT + bcrypt)
- [ ] Basisrouting frontend (Vue Router + beveiligde routes)

### Fase 2 — Spel
- [ ] 3x3 speelbord component bouwen (GameBoard.vue)
- [ ] Spellogica (winnaar detectie, gelijkspel)
- [ ] AI tegenstander (minimax algoritme)
- [ ] Twee-speler modus
- [ ] Spelresultaat opslaan via API

### Fase 3 — Statistieken & Admin
- [ ] Statistiekenpagina per gebruiker
- [ ] Admin-panel: gebruikersbeheer
- [ ] Admin-panel: rollen toewijzen
- [ ] Admin-panel: spelstatistieken + score reset

### Fase 4 — Azure Deploy
- [ ] Azure resources aanmaken via CLI
- [ ] Environment variables instellen
- [ ] GitHub Actions CI/CD pipeline
- [ ] Eerste live deploy

### Fase 5 — Afwerking
- [ ] Kleurrijk en speels design uitwerken
- [ ] Responsive styling (mobiel)
- [ ] Input validatie en foutafhandeling
- [ ] Testen
