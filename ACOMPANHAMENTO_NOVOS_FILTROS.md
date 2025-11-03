# 🔍 Novos Filtros - Acompanhamento Especial

## ✅ Implementação Completa

### Novos Filtros Adicionados

1. **Falência/Recuperação**

    - Opções:
        - Todos
        - Falência declarada
        - Em Recuperação Judicial
    - Parâmetro API: `falenciarecuperacao`

2. **Embargos**
    - Opções:
        - Todos
        - SIM (S)
        - NÃO (N)
    - Parâmetro API: `flembargos`

### Botão Download CSV

-   **Novo botão**: "Baixar CSV"
-   **Cor**: Verde (bg-green-600)
-   **Ícone**: Download
-   **Funcionalidade**: Baixa os resultados filtrados em formato CSV
-   **Parâmetro**: `download=csv`

## 📁 Arquivos Modificados

### 1. src/pages/app/AcompanhamentoEspecial.tsx

**Adicionado:**

-   Novos campos de filtro na interface
-   Função `handleDownloadCsv()`
-   Botão "Baixar CSV" na seção de ações
-   Parâmetros `falenciarecuperacao` e `flembargos` na chamada da API
-   Import do ícone `Download`

**Estado atualizado:**

```typescript
const [filters, setFilters] = useState<AcompanhamentoFilterState>({
    numformatado: '',
    comarca: '',
    vlprocesso_min: '',
    vlprocesso_max: '',
    indicio: ' ',
    falenciarecuperacao: '', // NOVO
    flembargos: '', // NOVO
});
```

**Função de download:**

```typescript
const handleDownloadCsv = () => {
    fetchProcessos(page, sortOrder, 'csv');
};
```

### 2. src/pages/app/types/acompanhamento.types.ts

**Interface atualizada:**

```typescript
export interface AcompanhamentoFilterState {
    numformatado: string;
    comarca: string;
    vlprocesso_min: string;
    vlprocesso_max: string;
    indicio: string;
    falenciarecuperacao: string; // NOVO
    flembargos: string; // NOVO
}
```

## 🎨 Layout dos Filtros

Grid responsivo com 8 campos:

1. Número do Processo
2. Comarca
3. Valor Mínimo
4. Valor Máximo
5. Indício Patrimonial
6. **Falência/Recuperação** (NOVO)
7. **Embargos** (NOVO)
8. RECC (Switch)

## 🔧 Chamada da API

```typescript
const response = await api.get('/consultarecc', {
    params: {
        page: currentPage,
        per_page: 25,
        download: downloadFormat, // 'csv' para download
        order: order,
        orderby: 'somavlcdas',
        numformatado: filters.numformatado || undefined,
        indicio: filters.indicio || undefined,
        AE: acompanhamentoEspecial ? true : undefined,
        comarca: filters.comarca || undefined,
        vlprocesso_min: filters.vlprocesso_min || undefined,
        vlprocesso_max: filters.vlprocesso_max || undefined,
        falenciarecuperacao: filters.falenciarecuperacao || undefined, // NOVO
        flembargos: filters.flembargos || undefined, // NOVO
    },
    headers: {
        Authorization: `Bearer ${token}`,
    },
    responseType: downloadFormat ? 'blob' : 'json',
});
```

## 🎯 Funcionalidades

### Filtros

-   ✅ Filtrar por Falência declarada ou Recuperação Judicial
-   ✅ Filtrar por processos com ou sem Embargos
-   ✅ Combinação com outros filtros existentes
-   ✅ Limpeza de todos os filtros incluindo os novos

### Download CSV

-   ✅ Botão dedicado para download
-   ✅ Respeita todos os filtros aplicados
-   ✅ Download automático do arquivo
-   ✅ Nome do arquivo: `processos.csv`
-   ✅ Feedback visual durante o download

## 💡 Como Usar

### Filtrar por Falência/Recuperação

1. Selecione uma opção no campo "Falência/Recuperação"
2. Clique em "Pesquisar"
3. Resultados filtrados serão exibidos

### Filtrar por Embargos

1. Selecione "SIM" ou "NÃO" no campo "Embargos"
2. Clique em "Pesquisar"
3. Resultados filtrados serão exibidos

### Baixar CSV

1. Aplique os filtros desejados
2. Clique no botão "Baixar CSV" (verde)
3. O arquivo será baixado automaticamente

## ✨ Resultado

Página de Acompanhamento Especial agora possui:

-   2 novos filtros para refinar buscas
-   Botão de download CSV para exportar resultados
-   Interface consistente com o resto do sistema
-   Funcionalidade completa e testada

---

**Data:** 03/11/2025  
**Status:** ✅ Completo  
**Arquivos modificados:** 2
