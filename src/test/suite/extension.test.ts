import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

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

	test.only("suggestion should be enabled", async (done) => {
		
		const file = await vscode.workspace.findFiles("**/file1.js");
		const testDocument = await vscode.workspace.openTextDocument(file[0]);
		const testEditor = await vscode.window.showTextDocument(testDocument);
		const pos = new vscode.Position(0, 12);

		vscode.commands.executeCommand("vscode.executeCompletionItemProvider", testDocument.uri, pos).then(() => {
			done();
		});
	}).timeout(20000);
});
