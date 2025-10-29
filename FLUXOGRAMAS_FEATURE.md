# 📊 Feature: Visualizador de Fluxogramas

## ✅ Implementação Completa

### Funcionalidades

-   ✅ **Menu Fluxogramas** adicionado em todos os sidebars
-   ✅ **Listagem de PDFs** disponíveis na pasta assets
-   ✅ **Visualizador integrado** com iframe
-   ✅ **Controles de zoom** (50% - 200%)
-   ✅ **Download de PDFs**
-   ✅ **Navegação** entre fluxogramas
-   ✅ **Responsivo** e com dark mode

## 📁 Arquivos Criados

### Páginas

1. **src/pages/app/Fluxogramas.tsx**

    - Listagem de fluxogramas em cards
    - Grid responsivo
    - Links para visualização

2. **src/pages/app/FluxogramaViewer.tsx**
    - Visualizador de PDF integrado
    - Controles de zoom
    - Botão de download
    - Navegação de volta

### Configuração

3. **src/vite-env.d.ts**

    - Declaração de tipos para arquivos PDF
    - Suporte TypeScript para imports de PDF

4. **vite.config.ts** (atualizado)
    - Adicionado `assetsInclude: ['**/*.pdf']`
    - Permite importar PDFs como assets

## 🗺️ Rotas Adicionadas

### Todas as rotas criadas para cada perfil:

-   **Administrador:**

    -   `/fluxogramas` - Listagem
    -   `/fluxogramas/:id` - Visualizador

-   **Chefia:**

    -   `/chefia/fluxogramas`
    -   `/chefia/fluxogramas/:id`

-   **Procurador:**

    -   `/procurador/fluxogramas`
    -   `/procurador/fluxogramas/:id`

-   **Assessor:**

    -   `/assessor/fluxogramas`
    -   `/assessor/fluxogramas/:id`

-   **Estagiário:**
    -   `/estagiario/fluxogramas`
    -   `/estagiario/fluxogramas/:id`

## 🎨 Sidebars Atualizados

Todos os sidebars foram atualizados com o novo menu:

-   ✅ **Sidebar.tsx** (Administrador)
-   ✅ **SidebarChefia.tsx**
-   ✅ **SidebarProcurador.tsx**
-   ✅ **SidebarAssessor.tsx**
-   ✅ **SidebarEstagiario.tsx**

### Ícone Utilizado

-   **Workflow** (lucide-react)
-   Representa fluxogramas e processos

## 📄 PDFs Disponíveis

Atualmente na pasta `src/assets`:

1. **Fluxograma NGD.pdf**

    - ID: `ngd`
    - Título: "Fluxograma NGD"

2. **Fluxograma NGD constrição frustrada.pdf**
    - ID: `ngd-constricao`
    - Título: "Fluxograma NGD - Constrição Frustrada"

## 🚀 Como Adicionar Novos Fluxogramas

### 1. Adicionar o PDF

Coloque o arquivo PDF na pasta `src/assets/`

### 2. Atualizar Fluxogramas.tsx

```typescript
const fluxogramas: FluxogramaItem[] = [
    // ... fluxogramas existentes
    {
        id: 'novo-fluxograma',
        title: 'Título do Novo Fluxograma',
        filename: 'nome-do-arquivo.pdf',
    },
];
```

### 3. Atualizar FluxogramaViewer.tsx

```typescript
import novoFluxograma from '@/assets/nome-do-arquivo.pdf';

const fluxogramas: Record<string, FluxogramaData> = {
    // ... fluxogramas existentes
    'novo-fluxograma': {
        title: 'Título do Novo Fluxograma',
        file: novoFluxograma,
    },
};
```

## 🎯 Características

### Interface

-   **Cards visuais** com ícone de documento
-   **Hover effects** para melhor UX
-   **Grid responsivo** (1-3 colunas)
-   **Cores consistentes** com o tema do sistema

### Visualizador

-   **Iframe integrado** para exibição do PDF
-   **Controles de zoom** com botões +/-
-   **Indicador de zoom** atual
-   **Botão de download** com ícone
-   **Botão voltar** para navegação
-   **Layout responsivo** e adaptativo

### Segurança

-   **Rotas protegidas** por perfil de usuário
-   **Validação** de fluxograma existente
-   **Tratamento de erros** 404

## 💡 Benefícios

### Para Usuários

-   ✅ **Acesso rápido** aos fluxogramas
-   ✅ **Visualização integrada** no sistema
-   ✅ **Não precisa baixar** para visualizar
-   ✅ **Zoom ajustável** para melhor leitura
-   ✅ **Download disponível** quando necessário

### Para Desenvolvedores

-   ✅ **Fácil adicionar** novos fluxogramas
-   ✅ **Código modular** e reutilizável
-   ✅ **TypeScript** totalmente tipado
-   ✅ **Consistente** com o resto do sistema

## 🔧 Tecnologias Utilizadas

-   **React Router** - Navegação
-   **Lucide React** - Ícones
-   **Tailwind CSS** - Estilização
-   **TypeScript** - Tipagem
-   **Vite** - Build e assets
-   **Iframe** - Visualização de PDF

## ✨ Resultado

Menu "Fluxogramas" totalmente funcional e integrado ao sistema, permitindo visualização e download de PDFs de forma profissional e consistente com o design do sistema.

---

**Data:** 29/10/2025  
**Status:** ✅ Completo  
**Arquivos criados:** 3  
**Arquivos modificados:** 11  
**Rotas adicionadas:** 10
