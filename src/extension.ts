import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'typescript', pattern: '**/*.{ts,tsx}' },
        new CustomCompletionItemProvider(),
        '/', '*', '@' // Trigger characters
    );

    context.subscriptions.push(disposable);
}

class CustomCompletionItemProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionList | null> {
        // Get the default completion items
        const defaultItems = await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position
        );

        if (!defaultItems) {
            return null;
        }

        // Filter out @radix-ui items
        const filteredItems = defaultItems.items.filter(item => {
            const label = typeof item.label === 'string' ? item.label : item.label.label;
            const detail = item.detail || '';
            const documentation = typeof item.documentation === 'string' ? item.documentation : item.documentation?.value || '';
            
            return !label.includes('@radix-ui') && 
                   !detail.includes('@radix-ui') && 
                   !documentation.includes('@radix-ui');
        });

        return new vscode.CompletionList(filteredItems, false);
    }
}

export function deactivate() {}