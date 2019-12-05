import * as vscode from 'vscode';
import * as fs from "fs";
import * as glob from "glob";

let fixtures: string[];

export function activate(context: vscode.ExtensionContext) {
	const ts = vscode.languages.registerCompletionItemProvider(
		{ scheme: "file", language: 'typescript' },
		{
			provideCompletionItems
		}
	);

	const js = vscode.languages.registerCompletionItemProvider(
		{ scheme: "file", language: 'javascript' },
		{
			provideCompletionItems
		}
	);

	context.subscriptions.push(js, ts);
	fixtures = readFixtures();
}

function indexOfGroup(match: RegExpMatchArray, n: number) {
	if (typeof match.index === "undefined") {
		return - 1;
	}

	var ix = 0;
    for (let i = 1; i < n; i++) {
        ix+= match[i].length;
	}
	return ix;
}

function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

	let linePrefix = document.lineAt(position).text.substr(0, position.character);
	var matches = linePrefix.match("(.*\\.fixture\\(\")([^\"\\)]*)(\")?");

	if (!matches) {
		return undefined;
	}

	var fixtureName = matches[2];
	var indexOfFirstQuote = indexOfGroup(matches, 2) - 1;
	
	if (indexOfFirstQuote <= position.character && !matches[3]) { //only trigger if between two quotes
		return fixtures.filter(x => x.indexOf(fixtureName) > -1).map(x => {
			return new vscode.CompletionItem(x, vscode.CompletionItemKind.Method)
		});
	} 

	return undefined;
}

function readFixtures() {
	
	var workspaces = vscode.workspace.workspaceFolders;
	if (typeof workspaces === "undefined") {
		return [];
	}

	var path = workspaces[0].uri.path;

	if (process.platform === "win32") {
		// on windows the path is something like /c:/...
		// so remove this slash
		path = path.replace(/^\//, "");
	}

	let obj = JSON.parse(fs.readFileSync(`${path}/cypress.json`).toString());
	let fixturesFolder = obj.fixturesFolder;
	if (!fixturesFolder) {
		return [];
	}

	let absolutePart = `${path}/${fixturesFolder}/`.replace(/\\/g, "/");

	let files = glob.sync(`${absolutePart}**/*.json`);
	files = files.map(x => x.replace(/\\/g, "/").replace(absolutePart, ""));
	return files;
}