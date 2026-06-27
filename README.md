# Produits Front

Application frontend Angular pour la gestion des produits avec tableau de bord admin.

## Stack

- **Frontend** : Angular 21 (standalone)
- **UI** : Bootstrap 5 · ngx-toastr
- **Graphiques** : Chart.js 4
- **Auth** : `@auth0/angular-jwt` (décodage JWT côté client)
- **CI/CD** : GitHub Actions (build, tests, image Docker GHCR, GitOps)
- **Container runtime** : image Docker servant des fichiers statiques
- **Déploiement** : ArgoCD + Helm (repo `deployment_k8s`)
- **Routage (Option A)** : même domaine
  - `/` → frontend
  - `/api/*` → backend (produit-back)
  - `/users/*` → backend (authentification-service)

## Fonctionnalités

| Page | Route | Rôle requis | Description |
|---|---|---|---|
| Produits | `/produits` | Public | Liste des produits |
| Ajouter produit | `/add-produit` | ADMIN | Formulaire création |
| Modifier produit | `/updateProduit/:id` | Connecté | Formulaire édition |
| Recherche par nom | `/rechercheParNom` | Public | Recherche libre |
| Recherche par catégorie | `/rechercheParCategorie` | Public | Filtrage |
| Catégories | `/listeCategories` | Public | Gestion des catégories |
| Connexion | `/login` | — | Formulaire login |
| Inscription | `/register` | — | Création de compte |
| Vérification email | `/verifEmail` | — | Activation du compte |
| **Tableau de bord** | `/admin/dashboard` | **ADMIN** | Statistiques de connexion + graphiques |
| Gestion sessions | `/admin/users` | ADMIN | Révocation des sessions utilisateurs |

## Tableau de bord admin

La page `/admin/dashboard` affiche en temps réel :

- **4 KPI cards** : connexions du jour, réussies, échouées, taux de succès
- **Bar chart** : répartition des connexions par heure (aujourd'hui)
- **Line chart** : tendance sur les 7 derniers jours (réussies vs échouées)
- **Table** : 20 dernières tentatives de connexion (username, IP, statut, raison, horodatage)

Les données proviennent de l'endpoint `GET /users/api/admin/stats/dashboard` (authentification-service).

## Prérequis

- Node.js **20+**
- npm
- (optionnel) Docker
- (optionnel) Kubernetes + ArgoCD + Helm

## Configuration des environnements

Le projet utilise les fichiers Angular standards :

- `src/environments/environment.development.ts` (dev local)
- `src/environments/environment.ts` (build production)

### Dev (localhost)

```typescript
export const environment = {
  apiURL: 'http://localhost:8081/api/produit',
  apiURLCategorie: 'http://localhost:8081/api/categorie',
  apiURLImage: 'http://localhost:8081/api/image',
  apiURLAuth: 'http://localhost:8080/users',
};
```

### Production (Option A — même domaine)

```typescript
export const environment = {
  apiURL: '/api/produit',
  apiURLCategorie: '/api/categorie',
  apiURLImage: '/api/image',
  apiURLAuth: '/users',
};
```

Nécessite un reverse-proxy / Ingress qui route `/api` vers `produit-back` et `/users` vers `authentification-service`.

## Lancer en local (mode dev)

Installer les dépendances :

```bash
npm install
```

Lancer l'application :

```bash
npm start
```

Ouvrir `http://localhost:4200`

## Tests

```bash
npm test -- --watch=false
```

## Build

```bash
npm run build -- --configuration production
```

Les artefacts sont générés dans `dist/`.

## Docker

Le `Dockerfile` :

- compile l'app (stage `builder`)
- sert les fichiers statiques avec `serve`
- écoute sur le **port 80** (aligné avec le chart Helm)

```bash
# Build
docker build -t produits-front:local .

# Run
docker run --rm -p 8088:80 produits-front:local
```

Ouvrir `http://localhost:8088`

## CI/CD (GitHub Actions)

Workflow : `.github/workflows/deploy.yaml`

- **PR → `develop`** : build + tests + docker build (sans push)
- **Push → `main`** : push image `dev-<sha>` sur GHCR + mise à jour GitOps DEV
- **Push → `prod`** : push image `prod-<sha>` + mise à jour GitOps PROD

## GitOps / ArgoCD / Helm

### Chart Helm

Chart : `deployment_k8s/charts/produits-front`

- Deployment + Service
- Ingress (activable via values)

### Values d'environnement

- Dev : `deployment_k8s/apps/produits_front/values-dev.yaml`
- Prod : `deployment_k8s/apps/produits_front/values-prod.yaml`

Le pipeline GitOps met à jour `image.tag` (ex: `dev-<sha>` / `prod-<sha>`).

## Minikube (local) — accès via Ingress

L'Ingress NGINX DEV est exposé en **NodePort** :

- HTTP : `30080`
- HTTPS : `30443`

```bash
# Récupérer l'IP Minikube
minikube ip
# Exemple : 192.168.49.2
```

Ajouter dans `C:\Windows\System32\drivers\etc\hosts` :

```
192.168.49.2 produits.dev.bestech.com
```

Ouvrir `http://produits.dev.bestech.com:30080`

## Structure du code

```
src/app/
├── admin-dashboard/          # Tableau de bord admin (Chart.js)
│   ├── admin-dashboard.ts
│   ├── admin-dashboard.html
│   └── admin-dashboard.css
├── admin-users/              # Gestion des sessions utilisateurs
├── add-produit/
├── update-produit/
├── liste-categories/
├── update-categorie/
├── produits/
├── recherche-par-nom/
├── recherche-par-categorie/
├── login/
├── register/
├── verif-email/
├── forbidden/
├── model/
│   ├── user.model.ts
│   ├── produit.model.ts
│   ├── categorie.model.ts
│   ├── image.model.ts
│   └── stats.model.ts        # DTOs statistiques dashboard
├── services/
│   ├── auth-service.ts       # Login, JWT, refresh, stats admin
│   ├── produit-service.ts
│   └── token-interceptor.ts  # Injection Bearer + refresh auto sur 401
├── app.routes.ts
├── app.ts
├── app.html                  # Navbar responsive (liens admin conditionnels)
└── produit-guard.ts          # Guard ADMIN
```

## Dépannage

### L'app appelle encore localhost en prod

Vérifier que le build importe bien `environment` (pas `environment.development`) :

```typescript
import { environment } from '../../environments/environment';
```

### Le tableau de bord ne s'affiche pas

- Vérifier que le token JWT contient bien le rôle `ADMIN`
- Vérifier que l'`authentification-service` est démarré
- Ouvrir la console navigateur : vérifier les appels vers `/users/api/admin/stats/dashboard`
