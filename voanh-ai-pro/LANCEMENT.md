# 🚀 VOANH AI PRO - Guide de Lancement Complet

## ⚡ Démarrage Rapide (5 minutes)

### Prérequis
- Node.js 18+ installé
- npm ou pnpm
- Un éditeur de code (VS Code recommandé)

### Étapes d'Installation

```bash
# 1. Se placer dans le dossier du projet
cd voanh-ai-pro

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur : **http://localhost:5173**

---

## 📁 Structure du Projet

```
voanh-ai-pro/
├── src/
│   ├── main.tsx          # Point d'entrée React
│   ├── App.tsx           # Composant principal
│   ├── index.css         # Styles globaux + Tailwind
│   ├── components/       # Composants UI
│   │   ├── Sidebar.tsx
│   │   ├── Chat.tsx
│   │   ├── AgentCard.tsx
│   │   └── Marketplace.tsx
│   ├── stores/           # Zustand stores
│   │   ├── chatStore.ts
│   │   ├── agentStore.ts
│   │   └── memoryStore.ts
│   ├── services/         # Services API
│   │   ├── mistral.ts    # API Mistral Free Tier
│   │   ├── indexedDB.ts  # Base de données locale
│   │   └── tools.ts      # Système de tools/plugins
│   ├── types/            # Types TypeScript
│   └── utils/            # Utilitaires
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔧 Commandes Disponibles

```bash
# Développement
npm run dev              # Lance le serveur de dev avec hot-reload

# Production
npm run build            # Compile pour la production
npm run preview          # Prévisualise le build en local

# Type checking
npx tsc --noEmit         # Vérifie les types sans compiler
```

---

## 🎨 Personnalisation du Design

### Couleurs (dans `src/index.css`)

```css
:root {
  --color-electric-blue: #3B82F6;   /* Bleu électrique */
  --color-neon-purple: #8B5CF6;     /* Violet néon */
  --color-turquoise: #2DD4BF;       /* Turquoise */
  --color-dark-bg: #0F172A;         /* Fond sombre */
  --color-card-bg: #1E293B;         /* Fond cartes */
}
```

### Thèmes Disponibles

Modifiez le gradient dans `body` pour changer l'ambiance :

```css
/* Cyberpunk */
background: linear-gradient(135deg, #0F172A 0%, #1a1a2e 100%);

/* Océan */
background: linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%);

/* Néon Night */
background: linear-gradient(135deg, #1a0a2e 0%, #16213e 100%);
```

---

## 🤖 Configuration API Mistral

Créez un fichier `.env` à la racine :

```env
VITE_MISTRAL_API_KEY=votre_clé_api_mistral
VITE_MISTRAL_BASE_URL=https://api.mistral.ai/v1
```

### Modèles Supportés (Free Tier)

- `mistral-free` (Mistral Free Tier officiel)
- `open-mistral-7b`
- `open-mixtral-8x7b`
- `mistral-small-latest`

Exemple d'appel API (`src/services/mistral.ts`) :

```typescript
import { openai } from '@ai-sdk/openai'

export async function chatWithMistral(messages: Message[]) {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7
    })
  })
  
  return response.json()
}
```

---

## 💾 IndexedDB - Mémoire Locale

Le projet utilise `idb` pour stocker localement :

- Historique des conversations
- Agents personnalisés
- Mémoire globale
- Settings utilisateur
- Plugins marketplace

### Schéma de la Base de Données

```typescript
const DB_NAME = 'voanh-ai-pro'
const DB_VERSION = 1

const stores = {
  chats: { keyPath: 'id', autoIncrement: true },
  agents: { keyPath: 'id', autoIncrement: true },
  memory: { keyPath: 'key' },
  settings: { keyPath: 'key' },
  plugins: { keyPath: 'id', autoIncrement: true }
}
```

---

## 🧩 Système de Multi-Agents

### Création d'un Agent Personnalisé

```typescript
// src/stores/agentStore.ts
import { create } from 'zustand'

interface Agent {
  id: string
  name: string
  role: string
  systemPrompt: string
  specialty: string[]
  avatar?: string
}

interface AgentStore {
  agents: Agent[]
  activeAgent: Agent | null
  addAgent: (agent: Agent) => void
  setActiveAgent: (agent: Agent) => void
  removeAgent: (id: string) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  activeAgent: null,
  addAgent: (agent) => set((state) => ({ 
    agents: [...state.agents, agent] 
  })),
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  removeAgent: (id) => set((state) => ({
    agents: state.agents.filter(a => a.id !== id)
  }))
}))
```

### Agents Pré-définis (20+)

| Agent | Rôle | Spécialité |
|-------|------|------------|
| CodeMaster | Développeur Senior | Architecture, Clean Code |
| DataWizard | Data Scientist | ML, Stats, Visualisation |
| SecurityGuru | Expert Cybersécurité | Pentest, Audit |
| DevOpsPro | Ingénieur DevOps | CI/CD, Cloud, Docker |
| UXDesigner | Designer UX/UI | Wireframes, Prototypes |
| ContentCreator | Rédacteur | SEO, Copywriting |
| BusinessAnalyst | Analyste Business | Stratégie, KPIs |
| LegalAdvisor | Conseiller Juridique | Droit, Compliance |
| ... | ... | ... |

---

## 🔌 Système de Tools/Plugins

### Architecture des Tools

```typescript
// src/services/tools.ts
interface Tool {
  id: string
  name: string
  description: string
  icon: string
  execute: (params: any) => Promise<any>
  permissions: string[]
}

// Exemple : Tool de recherche web
const webSearchTool: Tool = {
  id: 'web-search',
  name: 'Recherche Web',
  description: 'Recherche des informations sur internet',
  icon: '🌐',
  execute: async (query: string) => {
    // Implémentation recherche
  },
  permissions: ['internet']
}
```

### Tools Intégrés

1. **Web Search** - Recherche internet
2. **Code Executor** - Exécution de code sécurisé
3. **File Manager** - Gestion de fichiers
4. **Image Generator** - Génération d'images
5. **Data Analyzer** - Analyse de données
6. **API Caller** - Appels API externes
7. **Scheduler** - Tâches planifiées
8. **Memory Search** - Recherche dans la mémoire

---

## 🛒 Marketplace de Plugins

### Format d'un Plugin

```json
{
  "id": "plugin-unique-id",
  "name": "Mon Plugin Awesome",
  "version": "1.0.0",
  "author": "Votre Nom",
  "description": "Description du plugin",
  "category": "productivity",
  "price": 0,
  "downloadUrl": "https://...",
  "icon": "🚀",
  "permissions": ["storage", "network"],
  "rating": 4.8,
  "downloads": 1250
}
```

### Catégories de Plugins

- 🛠️ **Development** - Outils dev, snippets, templates
- 📊 **Data & Analytics** - Visualisation, reporting
- 🎨 **Design** - Assets, générateurs, palettes
- 📝 **Productivity** - Notes, tâches, calendrier
- 🔒 **Security** - Audit, chiffrement, VPN
- 🌐 **Integration** - Connecteurs APIs tierces

---

## 💰 Fonctionnalités Premium Monétisables

### Version Gratuite (Core)
- ✅ Chat illimité avec Mistral Free Tier
- ✅ 20 agents de base
- ✅ Mémoire locale illimitée
- ✅ Export/Import des données
- ✅ 5 tools intégrés

### Version Pro ($19/mois)
- 🌟 Multi-agent swarms (collaboration)
- 🌟 Debugger visuel des tools
- 🌟 50+ agents premium
- 🌟 50+ tools avancés
- 🌟 Synchronisation cloud
- 🌟 Priority support

### Version Business ($99/mois)
- 🏢 Tout illimité Pro
- 🏢 Dashboard analytics
- 🏢 SSO & gestion d'équipe
- 🏢 API access
- 🏢 Custom branding
- 🏢 On-premise option

---

## 📅 Roadmap de Développement

### Phase 1 (J1-30) : Foundation
- [x] Setup projet Vite + React + TS
- [x] UI de base avec Tailwind
- [ ] Intégration API Mistral
- [ ] Système de chat complet
- [ ] 20 agents pré-définis
- [ ] IndexedDB pour la persistance

### Phase 2 (J31-60) : Features Avancées
- [ ] Multi-agent swarms
- [ ] 10 tools intégrés
- [ ] Marketplace P2P
- [ ] Export/Import JSON
- [ ] Animations premium
- [ ] Mode offline

### Phase 3 (J61-90) : Monétisation
- [ ] Système de paiement Stripe
- [ ] Dashboard premium
- [ ] Analytics utilisateurs
- [ ] Enterprise features
- [ ] Documentation complète
- [ ] Launch officiel

---

## 🎯 Tips de Performance

1. **Lazy Loading** - Charger les composants à la demande
2. **Memoization** - Utiliser `React.memo` et `useMemo`
3. **Virtual Scrolling** - Pour les longues listes de messages
4. **Service Worker** - Cache des assets statiques
5. **Compression** - Gzip/Brotli pour le build

---

## 🔐 Sécurité & Confidentialité

- ✅ Toutes les données restent locales (IndexedDB)
- ✅ Clé API Mistral stockée côté client uniquement
- ✅ Pas de tracking ni analytics tiers
- ✅ Chiffrement optionnel des conversations
- ✅ Export complet des données (GDPR compliant)

---

## 📞 Support & Contribution

- 📧 Email: support@voanh-ai.pro
- 💬 Discord: [lien à venir]
- 🐛 GitHub Issues: [lien à venir]
- 📚 Documentation: docs.voanh-ai.pro

---

## 🌟 Prochaines Étapes

1. **Maintenant** : Copiez ce guide et exécutez `npm install && npm run dev`
2. **Aujourd'hui** : Personnalisez le design et testez le chat
3. **Cette semaine** : Intégrez l'API Mistral réelle
4. **Ce mois** : Déployez les 20 agents et la mémoire
5. **Mois prochain** : Lancez la marketplace beta

---

**VOANH AI PRO** - Intelligence Artificielle Multi-Agents 100% Gratuite

*Propulsé par Mistral Free Tier • Local-First • Open Mind*
