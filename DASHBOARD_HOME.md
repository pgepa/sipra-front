# 🎨 Dashboards Home - Documentação

## ✨ O que foi criado

Dashboards profissionais e modernos para as páginas **Home** e **HomeChefia** com integração à API `/cards`.

---

## 📦 Componentes Criados

### **1. StatCard** (`src/components/dashboard/StatCard.tsx`)

Componente reutilizável para exibir estatísticas em cards.

#### Props:

```typescript
interface StatCardProps {
    title: string; // Título do card
    value: string | number; // Valor a ser exibido
    icon: LucideIcon; // Ícone do Lucide
    iconColor?: string; // Cor do ícone
    iconBgColor?: string; // Cor de fundo do ícone
    trend?: {
        // Tendência (opcional)
        value: number;
        isPositive: boolean;
    };
    loading?: boolean; // Estado de carregamento
}
```

#### Características:

-   ✅ **Formatação automática** de valores
-   ✅ **Formatação monetária** para valores grandes
-   ✅ **Dark mode** completo
-   ✅ **Hover effects** suaves
-   ✅ **Loading state** com skeleton
-   ✅ **Trend indicators** (opcional)

---

## 🏠 Páginas Refatoradas

### **Home** (`src/pages/app/Home.tsx`)

Dashboard geral do sistema.

#### Características:

-   ✅ **6 cards estatísticos** com dados da API
-   ✅ **Ícones coloridos** por categoria
-   ✅ **Grid responsivo** (1 col mobile → 3 cols desktop)
-   ✅ **Loading state** com spinner
-   ✅ **Error handling** com mensagem amigável
-   ✅ **Logo no header**
-   ✅ **Footer informativo**

#### Cards Exibidos:

1. **Qtd. EFs Ativas** - Azul (FileText)
2. **Qtd. Demandas Abertas** - Laranja (AlertCircle)
3. **Qtd. CDAs Ativas** - Roxo (FolderOpen)
4. **Soma Valor CDAs Ativas** - Verde (DollarSign)
5. **Soma Valor Pagamentos** - Esmeralda (TrendingUp)
6. **Soma Valor Repasse** - Ciano (Wallet)

---

### **HomeChefia** (`src/pages/app/HomeChefia.tsx`)

Dashboard executivo para chefia.

#### Características:

-   ✅ **6 cards estatísticos** (mesmos da Home)
-   ✅ **2 cards de resumo** adicionais
-   ✅ **Badge de chefia** no logo
-   ✅ **Resumo Financeiro** (valores consolidados)
-   ✅ **Resumo Operacional** (métricas consolidadas)
-   ✅ **Design diferenciado** para perfil executivo

#### Cards Adicionais:

**Resumo Financeiro:**

-   Total em CDAs Ativas
-   Total Pagamentos
-   Total Repasses

**Resumo Operacional:**

-   Execuções Fiscais Ativas
-   Demandas Abertas
-   CDAs Ativas

---

## 🎨 Sistema de Cores

### Cards por Categoria:

| Categoria        | Cor       | Ícone       | Uso                  |
| ---------------- | --------- | ----------- | -------------------- |
| **EFs Ativas**   | Azul      | FileText    | Execuções Fiscais    |
| **Demandas**     | Laranja   | AlertCircle | Demandas Abertas     |
| **CDAs (Qtd)**   | Roxo      | FolderOpen  | Quantidade de CDAs   |
| **CDAs (Valor)** | Verde     | DollarSign  | Valor Total          |
| **Pagamentos**   | Esmeralda | TrendingUp  | Pagamentos Recebidos |
| **Repasses**     | Ciano     | Wallet      | Repasses Realizados  |

### Gradientes:

**Home:**

-   Footer: Violeta → Indigo

**HomeChefia:**

-   Resumo Financeiro: Verde → Esmeralda
-   Resumo Operacional: Violeta → Indigo
-   Footer: Indigo → Violeta

---

## 🔌 Integração com API

### Endpoint:

```
GET /cards
```

### Headers:

```typescript
Authorization: Bearer {token}
```

### Resposta Esperada:

```json
[
    {
        "card": "Qtd. EFs Ativas",
        "valor": "31867"
    },
    {
        "card": "Qtd. Demandas Abertas",
        "valor": "2360"
    },
    {
        "card": "Qtd. CDAs Ativas",
        "valor": "3448610"
    },
    {
        "card": "Soma Valor CDAs Ativas",
        "valor": "44715219779.63"
    },
    {
        "card": "Soma Valor Pagamentos",
        "valor": "186657909.84"
    },
    {
        "card": "Soma Valor Repasse",
        "valor": "11725359.51"
    }
]
```

### Formatação Automática:

**Valores Numéricos:**

```typescript
31867 → "31.867"
3448610 → "3.448.610"
```

**Valores Monetários (> 1.000.000):**

```typescript
44715219779.63 → "R$ 44.715.219.779,63"
186657909.84 → "R$ 186.657.909,84"
11725359.51 → "R$ 11.725.359,51"
```

---

## 📱 Responsividade

### Breakpoints:

**Mobile (< 640px):**

-   Grid: 1 coluna
-   Cards: largura total
-   Logo: 16x16
-   Título: text-2xl

**Tablet (640px - 1024px):**

-   Grid: 2 colunas
-   Cards: 50% largura
-   Logo: 16x16
-   Título: text-3xl

**Desktop (> 1024px):**

-   Grid: 3 colunas
-   Cards: 33% largura
-   Logo: 16x16
-   Título: text-3xl

---

## 🎯 Estados da Interface

### **Loading State**

```typescript
<GridLoader size={16} color="#7c3aed" />
```

-   Spinner centralizado
-   Cor violeta (#7c3aed)
-   Tela cheia

### **Error State**

```typescript
<div>
    <img src={logo} opacity={0.5} />
    <p className="text-red-600">{error}</p>
</div>
```

-   Logo opaco
-   Mensagem de erro em vermelho
-   Centralizado

### **Success State**

-   Cards com dados
-   Animações suaves
-   Hover effects

---

## 🔧 Customização

### Adicionar novo card:

```typescript
// 1. Adicionar no backend (retorno da API)
{
    "card": "Novo Card",
    "valor": "12345"
}

// 2. Adicionar ícone (opcional)
const getCardIcon = (cardName: string) => {
    if (name.includes('novo')) return NovoIcon;
    // ...
};

// 3. Adicionar cores (opcional)
const getCardColors = (cardName: string) => {
    if (name.includes('novo')) {
        return {
            iconColor: 'text-pink-600 dark:text-pink-400',
            iconBgColor: 'bg-pink-100 dark:bg-pink-900/30',
        };
    }
    // ...
};
```

### Adicionar trend (tendência):

```typescript
<StatCard
    title="Meu Card"
    value="12345"
    icon={Icon}
    trend={{
        value: 5.2, // Percentual
        isPositive: true, // true = ↑ verde, false = ↓ vermelho
    }}
/>
```

---

## 🚀 Melhorias Futuras

### Sugestões:

1. **Gráficos:**

    - Adicionar gráficos de linha/barra
    - Histórico de valores
    - Comparação mensal

2. **Filtros:**

    - Filtro por período
    - Filtro por tipo de débito
    - Exportar dados

3. **Atualização Automática:**

    - Polling a cada X minutos
    - WebSocket para dados em tempo real
    - Indicador de última atualização

4. **Drill-down:**

    - Click no card para ver detalhes
    - Modal com informações expandidas
    - Links para páginas relacionadas

5. **Comparações:**
    - Comparar com período anterior
    - Metas vs Realizado
    - Indicadores de performance

---

## 📊 Exemplo de Uso

### Home:

```typescript
import { Home } from '@/pages/app/Home';

// Rota: /home
<Route path="/home" element={<Home />} />;
```

### HomeChefia:

```typescript
import { HomeChefia } from '@/pages/app/HomeChefia';

// Rota: /homechefia
<Route path="/homechefia" element={<HomeChefia />} />;
```

---

## 🎨 Preview Visual

### Home:

```
┌─────────────────────────────────────────────────┐
│ [Logo] Dashboard Geral                          │
│        Visão geral do sistema de dívida ativa   │
└─────────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ [📄] EFs │ │ [⚠️] Dem │ │ [📁] CDAs│
│  31.867  │ │  2.360   │ │ 3.448.610│
└──────────┘ └──────────┘ └──────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ [💰] Val │ │ [📈] Pag │ │ [💳] Rep │
│ R$ 44.7B │ │ R$ 186.6M│ │ R$ 11.7M │
└──────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────────────────┐
│ [⚡] Sistema de Informação da Dívida Ativa      │
│     Procuradoria Geral do Estado do Pará        │
└─────────────────────────────────────────────────┘
```

### HomeChefia:

```
┌─────────────────────────────────────────────────┐
│ [Logo+🛡️] Dashboard Chefia                      │
│           Visão executiva do sistema            │
└─────────────────────────────────────────────────┘

[6 Cards Estatísticos - mesmo layout da Home]

┌─────────────────────┐ ┌─────────────────────┐
│ 💰 Resumo Financeiro│ │ ⚡ Resumo Operacional│
│ • Total CDAs        │ │ • EFs Ativas        │
│ • Pagamentos        │ │ • Demandas          │
│ • Repasses          │ │ • CDAs              │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────────────────────────────────┐
│ [🛡️] Painel Executivo - Chefia                  │
│     Procuradoria Geral do Estado do Pará        │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementação

-   [x] Componente StatCard criado
-   [x] Tipos TypeScript definidos
-   [x] Home refatorada
-   [x] HomeChefia refatorada
-   [x] Integração com API /cards
-   [x] Loading states
-   [x] Error handling
-   [x] Dark mode completo
-   [x] Responsividade
-   [x] Formatação de valores
-   [x] Ícones coloridos
-   [x] Documentação completa

---

**Data:** 14/10/2025  
**Status:** ✅ Completo  
**Páginas:** 2 (Home, HomeChefia)  
**Componentes:** 1 (StatCard)  
**API:** /cards
