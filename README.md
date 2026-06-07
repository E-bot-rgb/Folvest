# Folvest 📈

En investeringssimulator där användare kan öva på aktiehandel med ett virtuellt startkapital på 100 000 kr — utan finansiell risk.

## Live Demo

> https://folvest-roan.vercel.app/login

## Skärmdumpar
<img width="1279" height="795" alt="Skärmbild 2026-06-07 180710" src="https://github.com/user-attachments/assets/09b6b3b5-93e2-4159-8b08-5fdfd2e57348" />
OBS: "Aktie hittades inte" visas utanför amerikanska börsen öppettider (måndag–fredag 15:30–22:00 svensk tid). Under öppettider hämtas live-priser via Alpha Vantage API.
> 

---

## Tech Stack

| Lager | Teknologi |
|---|---|
| Frontend | React + Vite |
| Backend | ASP.NET Core Web API (C#) |
| Databas | SQL Server + Entity Framework Core |
| Auth | JWT + rollbaserad auktorisering |
| Aktiedata | Alpha Vantage API |
| API-dokumentation | Scalar |

---

## Funktioner

- 🔐 Registrering och inloggning med JWT
- 👤 Två roller: **User** och **Admin**
- 💰 Virtuellt startkapital på 100 000 kr per användare
- 📊 Köp och sälj aktier i realtid via Alpha Vantage
- 📋 Transaktionshistorik med datum, pris och totalt
- 🛡️ Admin-vy med översikt över alla användare och portföljer
- 📱 Responsiv design

---

## Kom igång

### Krav

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB räcker)
- Alpha Vantage API-nyckel (gratis på [alphavantage.co](https://www.alphavantage.co))

### 1. Klona repot

```bash
git clone https://github.com/E-bot-rgb/Folvest.git
cd Folvest
```

### 2. Konfigurera backend

Skapa filen `FolvestAPI/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FolvestDB;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "din-hemliga-nyckel-minst-32-tecken",
    "Issuer": "FolvestAPI",
    "Audience": "FolvestApp"
  },
  "AlphaVantage": {
    "ApiKey": "din-alpha-vantage-nyckel"
  }
}
```

Kör migrations:

```bash
cd FolvestAPI
dotnet ef database update
```

Starta backend:

```bash
dotnet run
```

API körs på `https://localhost:7245` och Scalar på `https://localhost:7245/scalar/v1`

### 3. Konfigurera frontend

```bash
cd FolvestApp
npm install
npm run dev
```

Frontend körs på `http://localhost:5173`

---

## Testanvändare (seed-data)

| Email | Lösenord | Roll |
|---|---|---|
| admin@folvest.com | Admin123! | Admin |
| user@folvest.com | User123! | User |

---

## API-endpoints

| Metod | Endpoint | Beskrivning | Auth |
|---|---|---|---|
| POST | /api/auth/register | Registrera ny användare | Nej |
| POST | /api/auth/login | Logga in, returnerar JWT | Nej |
| GET | /api/portfolio | Hämta din portfölj | Ja |
| POST | /api/portfolio/buy | Köp aktier | Ja |
| POST | /api/portfolio/sell | Sälj aktier | Ja |
| DELETE | /api/portfolio/{id} | Ta bort transaktion | Admin |
| GET | /api/stock/{symbol} | Hämta live-pris för aktie | Ja |
| GET | /api/stock | Hämta alla aktier i DB | Ja |
| GET | /api/admin/users | Hämta alla användare | Admin |

---

## Projektstruktur

```
Folvest/
├── FolvestAPI/              # ASP.NET Core Web API
│   ├── Controllers/         # Auth, Portfolio, Stock, Admin
│   ├── Data/                # AppDbContext
│   ├── DTOs/                # Data Transfer Objects
│   ├── Models/              # User, Portfolio, Stock, Transaction
│   └── appsettings.json
│
└── FolvestApp/              # React + Vite
    └── src/
        ├── api/             # axios-klienter
        ├── components/      # ProtectedRoute
        └── pages/           # Login, Register, Dashboard, Admin
```

---

## Gruppmedlemmar

| Namn | Ansvar |
|---|---|
| [Zebastian] | Backend — API, databas, JWT, Alpha Vantage |
| [Henry] | Frontend — React, UI, routing, design |

---

## Licens

MIT
