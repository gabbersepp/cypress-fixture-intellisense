import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import { getFixturesPath } from '../../extension';
import { afterEach } from 'mocha';

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

		async function createFile() {
			
			const ws = vscode.workspace.workspaceFolders;
			if (!ws || ws.length === 0) {
				throw new Error("fail");
			}

			const fp = getFixturesPath() as string;
			const fixtureName = new Date().getTime().toString() + "test_new.json";
			const fn = path.join(fp, fixtureName);
			
			fs.writeFileSync(fn, "dummy");
			return fn;
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

			test("suggestions should be filtered 2", async () => {
				await setup("route1.js");
				const pos = new vscode.Position(1, 60);
				const result = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, pos);
				const casted = result as vscode.CompletionList;
				assert.equal(casted.items.length, 2);
				casted.items.forEach(item => {
					assert.equal((item.insertText as string).indexOf("test") > -1, true);
				});
			}).timeout(20000);

			suite("newly created file", () => {
				let fileName: string;

				afterEach(() => {
					fs.unlinkSync(fileName);
				});

				test("suggestions should include newly created files", async () => {
					await setup("route1.js");
					fileName = await createFile();
					// wait until filewatcher has acted
					await new Promise(resolve => setTimeout(resolve, 2000));
					const pos = new vscode.Position(1, 60);
					const result = await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, pos);
					const casted = result as vscode.CompletionList;
	
					const item = casted.items.find(item => (item.insertText as string).indexOf("_new") > -1);
					assert.equal(!!item, true);
				}).timeout(20000);
			});
		});
	});
});
