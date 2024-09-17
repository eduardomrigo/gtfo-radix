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
	async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.CompletionContext
	): Promise<vscode.CompletionItem[] | null> {
		const defaultItems = await vscode.commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			document.uri,
			position
		);

		if (!defaultItems) {
			return null;
		}

		const filteredItems = defaultItems.items.filter(item => {
			const label = typeof item.label === 'string' ? item.label : item.label.label;
			return !label.includes('@radix-ui');
		});

		return filteredItems;
	}
}

export function deactivate() { }