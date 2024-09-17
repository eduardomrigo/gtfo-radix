import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Função para verificar se o arquivo components.json (ShadCN) está presente
function isShadcnActive(): boolean {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return false;
  }

  // Caminho para o arquivo components.json
  const componentsJsonPath = path.join(workspaceFolders[0].uri.fsPath, 'components.json');
  
  // Verificar se o arquivo components.json existe
  return fs.existsSync(componentsJsonPath);
}

// Função de ativação da extensão
export function activate(context: vscode.ExtensionContext) {
  console.log('A extensão Block Radix foi ativada!');

  // Verificar se o ShadCN está ativo (com base na existência de components.json)
  const shadcnActive = isShadcnActive();
  
  if (shadcnActive) {
    console.log('Shadcn/ui está ativo, removendo sugestões de @radix-ui.');

    // Registrar um provider para interceptar as sugestões de IntelliSense
    const provider = vscode.languages.registerCompletionItemProvider(
      ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'],
      {
        provideCompletionItems(document, position, token, context) {
          // Usar o IntelliSense padrão para obter as sugestões
          const completionList = vscode.languages.getLanguages().then(languages => {
            // Filtrar para remover qualquer sugestão que envolva '@radix-ui'
            const filteredItems = languages.filter((item: string) => !item.includes('@radix-ui'));

            // Mapear as sugestões filtradas para CompletionItem[]
            const completionItems = filteredItems.map((item: string) => {
              return new vscode.CompletionItem(item, vscode.CompletionItemKind.Module);
            });

            return completionItems;
          });

          return completionList;
        }
      },
      '.' // Ativar quando o usuário digitar um ponto, comum em auto-imports
    );

    // Adicionar o provider ao contexto da extensão
    context.subscriptions.push(provider);
  } else {
    console.log('Shadcn/ui não está ativo. Nenhuma ação necessária.');
  }
}

// Função de desativação da extensão (opcional)
export function deactivate() {}
