# Produits Front

Application Frontend Angular pour la gestion des produits.

## Stack

- **Frontend**: Angular 21
- **CI/CD**: GitHub Actions (build, tests, image Docker GHCR, GitOps)
- **Container runtime**: image Docker servant des fichiers statiques
- **Déploiement**: ArgoCD + Helm (repo `deployment_k8s`)
- **Routage (Option A)**: même domaine
  - `/` -> frontend
  - `/api/*` -> backend (produit-back)

## Prérequis

- Node.js **20+**
- npm
- (optionnel) Docker
- (optionnel) Kubernetes + ArgoCD + Helm

## Configuration des environnements

Le projet utilise les fichiers Angular standards:

- `src/environments/environment.development.ts` (dev local)
- `src/environments/environment.ts` (build production)

### Dev (localhost)

Les URLs API pointent vers `localhost`.

### Production (Option A - même domaine)

Les URLs API sont relatives:

- `apiURL: /api/produit`
- `apiURLCategorie: /api/categorie`
- `apiURLImage: /api/image`

Cela nécessite un reverse-proxy / Ingress qui route `/api` vers le backend.

## Lancer en local (mode dev)

Installer les dépendances:

```bash
npm ci
```

Lancer l'application:

```bash
npm run start
```

Puis ouvrir:

- `http://localhost:4200/`

## Tests

Lancer les tests en mode CI (sans watch):

```bash
npm test -- --watch=false
```

## Build

Build production:

```bash
npm run build -- --configuration production
```

Les artefacts sont générés dans `dist/`.

## Docker

Le `Dockerfile`:

- compile l'app (stage `builder`)
- sert les fichiers statiques avec `serve`
- écoute sur le **port 80** (aligné avec le chart Helm)

### Build de l'image

```bash
docker build -t produits-front:local .
```

### Run local

```bash
docker run --rm -p 8088:80 produits-front:local
```

Puis ouvrir:

- `http://localhost:8088/`

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/deploy.yaml`

- **PR sur `develop`**: build + tests + docker build (sans push)
- **push sur `main`**: build + push image `dev-*` + GitOps DEV
- **push sur `prod`**: build + push image `prod-*` + GitOps PROD

## GitOps / ArgoCD / Helm

### Chart Helm

Chart: `deployment_k8s/charts/produits-front`

- Deployment + Service
- Ingress (activable via values)

### Values d'environnement

- Dev: `deployment_k8s/apps/produits_front/values-dev.yaml`
- Prod: `deployment_k8s/apps/produits_front/values-prod.yaml`

Le pipeline GitOps met à jour `image.tag` (ex: `dev-<sha>` / `prod-<sha>`).

### Ingress (Option A)

Le chart `produits-front` crée un Ingress (quand `ingress.enabled=true`) qui route:

- `/` -> service `produits-front`
- `/api` -> service `produit-back`

Hosts configurés:

- DEV: `produits.dev.bestech.com`
- PROD: `produits.bestech.com`

## Minikube (local) - accès via Ingress

En local, l'Ingress NGINX DEV est installé via ArgoCD et exposé en **NodePort**:

- HTTP: `30080`
- HTTPS: `30443`

### 1) Récupérer l'IP Minikube

```bash
minikube ip
```

Exemple: `192.168.49.2`

### 2) Ajouter l'entrée DNS locale (Windows)

Ajouter dans `C:\Windows\System32\drivers\etc\hosts`:

```txt
192.168.49.2 produits.dev.bestech.com
```

### 3) Ouvrir l'application

- `http://produits.dev.bestech.com:30080/`

L'API sera accessible via:

- `http://produits.dev.bestech.com:30080/api/...`

## Dépannage rapide

### 1) L'Ingress ne route pas

- vérifier le controller: `kubectl -n ingress-nginx get pods`
- vérifier l'ingress: `kubectl -n dev get ingress`
- vérifier le service backend: `kubectl -n dev get svc`

### 2) L'app appelle encore localhost en prod

Vérifier que le code importe bien:

- `src/environments/environment` (et pas `environment.development`)

