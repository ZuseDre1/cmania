// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let timeout: NodeJS.Timer | undefined = undefined;
	console.log('Congratulations, your extension "cmania" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cmania.cm', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from colormania!');
		let activeEditor = vscode.window.activeTextEditor;
		//////////////////////////////////////////////////////////////////////////////////

		const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
			borderWidth: '1px',
			borderStyle: 'solid',
			overviewRulerColor: 'blue',
			overviewRulerLane: vscode.OverviewRulerLane.Right,
			light: {
				// this color will be used in light color themes
				borderColor: 'green'
			},
			dark: {
				// this color will be used in dark color themes
				borderColor: 'green'
			}
		});
		//////////////////////////////////////////////////////////////////////////////////

		function updateDecorations() {
			if (!activeEditor) {
				return;
			}
			const regEx = /\d+/g;
			const text = activeEditor.document.getText();
			const smallNumbers: vscode.DecorationOptions[] = [];
			const largeNumbers: vscode.DecorationOptions[] = [];
			let match;
			while ((match = regEx.exec(text))) {
				const startPos = activeEditor.document.positionAt(match.index);
				const endPos = activeEditor.document.positionAt(match.index + match[0].length);
				const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
				if (match[0].length < 3) {
					smallNumbers.push(decoration);
				} else {
					largeNumbers.push(decoration);
				}
			}
			activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
		}
		//////////////////////////////////////////////////////////////////////////////////

		function triggerUpdateDecorations() {
			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined;
			}
			timeout = setTimeout(updateDecorations, 500);
		}
		//////////////////////////////////////////////////////////////////////////////////
		 
		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor;
			if (editor) {
				triggerUpdateDecorations();
			}
		}, null, context.subscriptions);

		vscode.workspace.onDidChangeTextDocument(event => {
			if (activeEditor && event.document === activeEditor.document) {
				triggerUpdateDecorations();
			}
		}, null, context.subscriptions);
		//////////////////////////////////////////////////////////////////////////////////

		if (activeEditor) {
			triggerUpdateDecorations();
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
