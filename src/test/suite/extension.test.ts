import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test("extension should be loaded", () => {
		const extension = vscode.extensions.getExtension("josefbiehler.cypress-fixture-intellisense");
		
		if (typeof extension === "undefined") {
			assert.fail("extension is undefined");
			return;
		}

		assert.equal(extension.isActive, true);
	});

	suite("suggestions", () => {
		let document: vscode.TextDocument;

		async function setup(fileToOpen: string) {
			const file = await vscode.workspace.findFiles(`**/${fileToOpen}`);
			document = await vscode.workspace.openTextDocument(file[0]);
			await vscode.window.showTextDocument(document);
		}

		suite("fixture", () => {
			test("suggestion should be enabled", async () => {
				await setup("file1.ts");
				const pos = new vscode.Position(0, 12);
				const result = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, pos);
				const casted = result as vscode.CompletionList;
				assert.equal(casted.items.length, 3);
			}).timeout(20000);
	
			test("suggestions should be filtered", async () => {
				await setup("file2.js");
				const pos = new vscode.Position(0, 16);
				const result = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, pos);
				const casted = result as vscode.CompletionList;
				assert.equal(casted.items.length, 2);
				casted.items.forEach(item => {
					assert.equal((item.insertText as string).indexOf("test") > -1, true);
				});
			}).timeout(20000);
		});

		suite("route", () => {
			test("suggestion should be enabled", async () => {
				await setup("route1.js");
				const pos = new vscode.Position(0, 37);
				const result = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, pos);
				const casted = result as vscode.CompletionList;
				assert.equal(casted.items.length, 3);
			}).timeout(20000);
	
			test("suggestions should be filtered", async () => {
				await setup("route1.js");
				const pos = new vscode.Position(0, 41);
				const result = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, pos);
				const casted = result as vscode.CompletionList;
				assert.equal(casted.items.length, 2);
				casted.items.forEach(item => {
					assert.equal((item.insertText as string).indexOf("test") > -1, true);
				});
			}).timeout(20000);
		});
	});
});
