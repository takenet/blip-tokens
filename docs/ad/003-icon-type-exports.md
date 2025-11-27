# AD-003: Gerar tipos para importação de assets em outros projetos

## Status

🔄 **EM REVISÃO** - Proposto em 27/11/2025

## Objetivo
Padronizar o consumo de assets exportados por `blip-tokens` usando nomes de ícones extraídos diretamente do sistema de arquivos, garantindo segurança de tipos e sincronização automática dos nomes com os arquivos SVG disponíveis.

## Contexto
O pacote `blip-tokens` passa a expor arrays e tipos compatíveis com TypeScript para representar os ícones disponíveis nas pastas `assets/icons/outline` e `assets/icons/solid`. Isso evita divergências entre componentes que referenciam ícones e o conjunto real de arquivos SVG.

### Opções de importação
#### Arrays em tempo de execução
```typescript
import { OutlineIcons, SolidIcons, AllIcons } from 'blip-tokens/icons';

// Uso na aplicação
console.log(OutlineIcons);  // ["add", "edit", "delete", ...]
console.log(SolidIcons);    // ["add", "attention", ...]
console.log(AllIcons);      // ["add", "attention", "delete", ...]
```

#### Tipos TypeScript
```typescript
import type { OutlineIcon, SolidIcon, IconName } from 'blip-tokens/icons';

// Nomes de ícones com segurança de tipos
function renderIcon(name: OutlineIcon) {
  // O TypeScript sugere e valida os nomes automaticamente
  return `<icon name="${name}" />`;
}

renderIcon("add");     // ✅ Válido
renderIcon("invalid"); // ❌ Erro do TypeScript
```

#### Funções auxiliares
```typescript
import { isOutlineIcon, isSolidIcon, isValidIcon } from 'blip-tokens/icons';

// Validação em tempo de execução
if (isOutlineIcon("add")) {
  console.log("Este ícone existe no conjunto outline");
}

if (isSolidIcon("attention")) {
  console.log("Este ícone existe no conjunto solid");
}

if (isValidIcon("sparkle-ai")) {
  console.log("Este ícone existe em qualquer conjunto");
}
```

### Contagem de ícones
- **Outline Icons**: 303
- **Solid Icons**: 366
- **Unique Icons**: 587

### Observações
- Os nomes de ícones são extraídos dos nomes dos arquivos (sem a extensão `.svg`).
- Ícones em subpastas (como `solid/flags/`) usam apenas o nome do arquivo.
- Os nomes são ordenados alfabeticamente.
- Os nomes são normalizados para minúsculas; espaços viram hífen. Todos os demais caracteres presentes no nome do arquivo (incluindo acentos, números e pontuação) são preservados nos nomes exportados, sem remoção ou substituição adicional.

## Benefícios
- Segurança de tipos: o TypeScript bloqueia nomes inválidos em tempo de compilação.
- Autocompletar: IDEs sugerem automaticamente os nomes válidos.
- Sempre sincronizado: os nomes vêm diretamente do sistema de arquivos, sem JSON intermediário.
- Sem duplicações: o sistema garante nomes únicos graças ao escaneamento da pasta.
- Validação em runtime: funções auxiliares checam dinamicamente se um nome existe.
- Bundle otimizado: `AllIcons` é pré-computado durante o build para evitar duplicação (~45% menor).

## Exemplos
### Componente React
```tsx
import type { OutlineIcon, SolidIcon } from 'blip-tokens/icons';

interface IconProps {
  name: OutlineIcon | SolidIcon;
  variant: 'outline' | 'solid';
}

export function Icon({ name, variant }: IconProps) {
  const iconData = getIconData(name, variant);
  return <img src={iconData} alt={name} />;
}

// Uso com autocomplete
<Icon name="add" variant="outline" />
<Icon name="attention" variant="solid" />
```

### Seletor dinâmico de ícones
```tsx
import { OutlineIcons, SolidIcons } from 'blip-tokens/icons';
import type { IconName } from 'blip-tokens/icons';
import { useState } from 'react';

export function IconPicker() {
  const [selected, setSelected] = useState<IconName | null>(null);
  
  return (
    <div>
      <h3>Outline Icons ({OutlineIcons.length})</h3>
      <div className="icon-grid">
        {OutlineIcons.map(name => (
          <button key={name} onClick={() => setSelected(name)}>
            {name}
          </button>
        ))}
      </div>
      
      <h3>Solid Icons ({SolidIcons.length})</h3>
      <div className="icon-grid">
        {SolidIcons.map(name => (
          <button key={name} onClick={() => setSelected(name)}>
            {name}
          </button>
        ))}
      </div>
      
      {selected && <p>Selecionado: {selected}</p>}
    </div>
  );
}
```

### Validação de formulário
```typescript
import { isValidIcon } from 'blip-tokens/icons';

function validateIconInput(userInput: string) {
  if (!isValidIcon(userInput)) {
    throw new Error(`"${userInput}" não é um nome de ícone válido`);
  }
  return userInput;
}
```

### Busca e filtragem
```typescript
import { AllIcons } from 'blip-tokens/icons';

function searchIcons(query: string) {
  return AllIcons.filter(name => 
    name.toLowerCase().includes(query.toLowerCase())
  );
}

// Busca por todos os ícones de seta
const arrowIcons = searchIcons('arrow');
// ["arrow-ball-down", "arrow-ball-left", "arrow-down", ...]
```

## Changelog

| Data | Versão | Mudança | Autor |
|------|--------|---------|-------|
| 2025-11-27 | 1.0 | Decisão inicial e implementação | Dev Team |

---

**Última Atualização**: 27 de Novembro de 2025  
**Próxima Revisão**: 27 de Maio de 2026 (6 meses)