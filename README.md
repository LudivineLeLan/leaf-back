# Leaf - Backend

API REST pour l'application Leaf, une bibliothèque personnelle de livres et mangas.

## Stack technique

- **Node.js** avec Express
- **PostgreSQL** avec Sequelize ORM
- **JWT** pour l'authentification
- **node-cron** pour les notifications automatiques
- **Google Books API** pour les données de livres

## Prérequis

- Node.js v20+
- PostgreSQL
- Une clé API Google Books

## Installation

```bash
npm install
```

## Configuration

Crée un fichier `.env` à la racine :

```env
PORT=3000
DB_URL=postgres://user:password@localhost:5432/leaf
JWT_SECRET=ton_secret
GOOGLE_BOOKS_API_KEY=ta_clé
```

## Base de données

```bash
# Créer les tables
node src/migrations/create-tables.js

# Insérer les données de test
node src/migrations/seed-tables.js
```

## Lancer le serveur

```bash
npm run dev
```

## Routes principales

### Auth
- `POST /auth/register` — Créer un compte
- `POST /auth/login` — Se connecter
- `POST /auth/logout` — Se déconnecter
- `GET /auth/me` — Profil utilisateur connecté

### Livres
- `GET /books/search?q=` — Rechercher dans Google Books
- `POST /books/import` — Importer un livre
- `GET /books/id/:bookId` — Détail d'un livre

### Bibliothèque
- `GET /library` — Tous les livres de l'utilisateur
- `GET /library/overview` — Livres groupés par série
- `POST /library/:bookId` — Ajouter un livre
- `PUT /library/:bookId` — Mettre à jour le statut
- `DELETE /library/:bookId` — Retirer un livre

### Séries
- `GET /serie/:id` — Détail d'une série avec tous les tomes
- `PATCH /serie/:id` — Mettre à jour le nombre de tomes

### Auteurs
- `GET /authors/:authorId` — Détail d'un auteur avec ses livres

### Suivi
- `GET /follows` — Séries et auteurs suivis
- `POST /follows/serie/:serieId` — Suivre une série
- `DELETE /follows/serie/:serieId` — Ne plus suivre une série
- `POST /follows/author/:authorId` — Suivre un auteur
- `DELETE /follows/author/:authorId` — Ne plus suivre un auteur

### Notifications
- `GET /notifications` — Toutes les notifications
- `GET /notifications/unread` — Nombre de notifications non lues
- `PUT /notifications/read` — Marquer comme lues
- `POST /notifications/check` — Déclencher une vérification manuelle

### Stats
- `GET /stats` — Statistiques de lecture

## Fonctionnalités clés

### Détection automatique de séries
Lors de l'import d'un livre, le titre est analysé pour détecter s'il fait partie d'une série. Les patterns détectés incluent "Tome X", "Vol. X", "T01", etc.

### Notifications de nouvelles parutions
Un job cron tourne toutes les 24h et vérifie via Google Books si de nouveaux livres ont été publiés pour les séries et auteurs suivis par les utilisateurs.

### Données communautaires
Le nombre de tomes d'une série peut être renseigné par n'importe quel utilisateur et bénéficie à toute la communauté.