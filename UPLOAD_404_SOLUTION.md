# 🔴 Erro 404 - Rota de Upload não encontrada

## ❌ Problema Atual

```
URL: https://sida.pge.pa.gov.br/api/upload/sefa
Status: 404 NOT FOUND
```

**Significado:** A rota `/upload/sefa` não está implementada no backend.

---

## ✅ Verificações Necessárias

### **1. Confirmar se a rota existe no backend**

Pergunte ao desenvolvedor do backend:

```python
# A rota está implementada?
@app.route('/upload/sefa', methods=['POST'])
def upload_sefa():
    # código aqui
    pass
```

### **2. Verificar rotas disponíveis**

Teste outras rotas de upload para ver se funcionam:

```bash
# Testar SEMAS
curl -X POST https://sida.pge.pa.gov.br/api/upload/semas \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@arquivo.csv"

# Testar ADEPARA
curl -X POST https://sida.pge.pa.gov.br/api/upload/adepara \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@arquivo.csv"

# Testar CENPROT
curl -X POST https://sida.pge.pa.gov.br/api/upload/cenprot \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@arquivo.csv"
```

### **3. Verificar padrão de URL**

O frontend está usando o padrão correto:

| Página  | Endpoint Frontend | URL Final                                       |
| ------- | ----------------- | ----------------------------------------------- |
| SEFA    | `/upload/sefa`    | `https://sida.pge.pa.gov.br/api/upload/sefa`    |
| SEMAS   | `/upload/semas`   | `https://sida.pge.pa.gov.br/api/upload/semas`   |
| ADEPARA | `/upload/adepara` | `https://sida.pge.pa.gov.br/api/upload/adepara` |
| CENPROT | `/upload/cenprot` | `https://sida.pge.pa.gov.br/api/upload/cenprot` |

---

## 🔧 Possíveis Causas

### **Causa 1: Rota não implementada**

A rota `/upload/sefa` simplesmente não existe no backend.

**Solução:** Implementar a rota no backend.

### **Causa 2: Nome da rota diferente**

A rota pode ter outro nome, como:

-   `/sefa/upload`
-   `/upload/sefaz`
-   `/uploads/sefa`
-   `/api/sefa`

**Solução:** Verificar documentação da API ou código do backend.

### **Causa 3: Método HTTP incorreto**

A rota existe mas aceita outro método (GET, PUT, etc).

**Solução:** Verificar qual método a rota aceita.

### **Causa 4: Autenticação falhando**

A rota existe mas está retornando 404 por falha de autenticação.

**Solução:** Verificar se o token está válido.

---

## 🚀 Implementação Backend (Flask)

Se a rota não existe, aqui está um exemplo de implementação:

```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configurações
UPLOAD_FOLDER = '/path/to/uploads/sefa'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
MAX_CONTENT_LENGTH = None  # Sem limite

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload/sefa', methods=['POST'])
def upload_sefa():
    # Verificar autenticação
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Token não fornecido'}), 401

    # Verificar se há arquivo
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400

    file = request.files['file']

    # Verificar se arquivo foi selecionado
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

    # Verificar extensão
    if not allowed_file(file.filename):
        return jsonify({'error': 'Formato de arquivo não permitido'}), 400

    # Salvar arquivo
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Processar arquivo (importar dados, etc)
    try:
        # Sua lógica de processamento aqui
        # process_sefa_file(filepath)

        return jsonify({
            'message': 'Arquivo enviado com sucesso',
            'filename': filename,
            'size': os.path.getsize(filepath)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

---

## 🔍 Debug no Frontend

Para ajudar a identificar o problema, vou adicionar logs no componente UploadFile:

```typescript
// Em UploadFile.tsx
const handleUpload = async () => {
    console.log('🔍 Debug Upload:');
    console.log('Endpoint:', endpoint);
    console.log('Base URL:', api.defaults.baseURL);
    console.log('URL Final:', `${api.defaults.baseURL}${endpoint}`);
    console.log('Arquivo:', selectedFile?.name);
    console.log('Token:', token ? 'Presente' : 'Ausente');

    // ... resto do código
};
```

---

## 📋 Checklist de Verificação

### Backend

-   [ ] A rota `/upload/sefa` está implementada?
-   [ ] A rota aceita método POST?
-   [ ] A rota aceita `multipart/form-data`?
-   [ ] A rota verifica autenticação?
-   [ ] A rota retorna status 200 em sucesso?
-   [ ] CORS está configurado?

### Frontend

-   [ ] O endpoint está correto (`/upload/sefa`)?
-   [ ] O token está sendo enviado?
-   [ ] O arquivo está sendo anexado corretamente?
-   [ ] O Content-Type está correto?

### Rede

-   [ ] O servidor está acessível?
-   [ ] Não há firewall bloqueando?
-   [ ] O SSL/HTTPS está funcionando?

---

## 🧪 Testes Manuais

### Teste 1: Verificar se servidor está online

```bash
curl https://sida.pge.pa.gov.br/api/health
```

### Teste 2: Listar rotas disponíveis

```bash
# Se o backend tiver endpoint de documentação
curl https://sida.pge.pa.gov.br/api/routes
```

### Teste 3: Testar upload com curl

```bash
curl -X POST https://sida.pge.pa.gov.br/api/upload/sefa \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@/caminho/para/arquivo.csv" \
  -v
```

**Resposta esperada (sucesso):**

```json
{
    "message": "Arquivo enviado com sucesso",
    "filename": "arquivo.csv"
}
```

**Resposta atual (erro):**

```html
404 NOT FOUND
```

---

## 📞 Próximos Passos

1. **Contatar desenvolvedor do backend** para:

    - Confirmar se a rota `/upload/sefa` existe
    - Verificar logs do servidor
    - Implementar a rota se não existir

2. **Testar outras rotas de upload:**

    - Ir em "Upload SEMAS" e testar
    - Se funcionar, o problema é específico da rota SEFA
    - Se não funcionar, o problema é geral

3. **Verificar documentação da API:**
    - Pode haver um endpoint diferente para SEFA
    - Pode haver parâmetros adicionais necessários

---

## 📚 Informações Úteis

### Rotas de Upload no Frontend

Todas seguem o mesmo padrão:

```typescript
// UploadSefa.tsx
endpoint = '/upload/sefa';

// UploadSemas.tsx
endpoint = '/upload/semas';

// UploadAdepara.tsx
endpoint = '/upload/adepara';

// UploadCenprot.tsx
endpoint = '/upload/cenprot';

// UploadJucepaPj.tsx
endpoint = '/upload/jucepapj';

// UploadJucepaVinculo.tsx
endpoint = '/upload/jucepavinculo';

// UploadDetranRenach.tsx
endpoint = '/upload/detranrenach';

// UploadDetranSidet.tsx
endpoint = '/upload/detransidet';

// UploadDetranVeiculo.tsx
endpoint = '/upload/detranveiculo';

// UploadDetranModelo.tsx
endpoint = '/upload/detranmodelo';
```

### URL Base

```env
VITE_API_URL="http://10.96.0.61:5000"
```

Em produção: `https://sida.pge.pa.gov.br/api`

---

**Status:** 🔴 Bloqueado - Aguardando implementação/correção no backend  
**Prioridade:** Alta  
**Impacto:** Upload SEFA não funciona  
**Responsável:** Equipe Backend
