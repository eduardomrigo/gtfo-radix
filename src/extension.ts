import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'typescript', pattern: '**/*.{ts,tsx}' },
        new CustomCompletionItemProvider(),
        '.' 
    );

    context.subscriptions.push(disposable);
}

class CustomCompletionItemProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        return this.getFilteredCompletionItems(document, position);
    }

    private getFilteredCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completionItems: vscode.CompletionItem[] = [];

        return completionItems.filter(item => {
            if (item instanceof vscode.CompletionItem) {
                const label = item.label as string;
                return !label.includes('@radix-ui');
            }
            return true;
        });
    }
}

export function deactivate() {}
