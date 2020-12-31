// ===================================
//  Maow_Journal.js
// ===================================

/*:
* @author Maow
* @plugindesc Journal system, let your player unlock pages progressively.
 * 
 * @param	wrapLength
 * @type	number
 * @desc	How many characters before the contents of an entry will wrap on the next word.
 * @default	48
 * 
 * @param	scrollSpeed
 * @type	number
 * @desc	How fast to scroll an entry when the player presses the up and down keys.
 * @default 3
 * 
 * @help
 * -----------------------------------
 *  Terms of Use
 * -----------------------------------
 * 1. Do not try to claim this as your own work.
 * 2. Attribution is not required, but it is preferred.
 * 3. Free-use for commercial and noncommercial projects.
 * -----------------------------------
 *  Calls
 * -----------------------------------
 * Journal.getEntries() 			- Returns a dictionary of the journal entries.
 * Journal.getEntry(id) 			- Returns a single entry with the id of the 'id' param if it exists.
 * Journal.getName(id) 				- Returns the name of an entry.
 * Journal.getContent(id) 			- Returns the contents of an entry.
 * Journal.getId(index) 			- Returns the ID of an entry based on its index.
 * Journal.setName(id, name) 		- Sets the name of an entry.
 * Journal.setContent(id, content) 	- Sets the contents of an entry.
 * -----------------------------------
 *  Plugin Commands
 * -----------------------------------
 * All commands for this plugin start with 'Journal'
 * You can use quotation marks for text and the newline character (\n) to split said text.
 * ====
 * open 						- Opens the journal, displaying any visible entries.
 * new <id> "Name" "Content" 	- Creates a new journal entry, visible by default.
 * delete <id> 					- Deletes a journal entry if it exists.
 */

var Journal = Journal || {};

(function() {
	'use strict';

	const params = PluginManager.parameters('Maow_Journal');
	const param_wrapLength = Number(params['wrapLength']);
	const param_scrollSpeed = Number(params['scrollSpeed']);

	const entries = {};
	let currentEntry = undefined;

	function openJournal() {
		SceneManager.push(Scene_MenuJournal);
	}

	function newEntry(id, name, content) {
		if (id != '') {
			entries[id] = {
				name: name,
				content: content,
			}
		}
	}

	function deleteEntry(id) {
		if (id in entries) {
			delete entries[id];	
		}
	}

	// -----------------------
	//  Scenes
	// -----------------------

	// -----------
	//  Scene_MenuJournal

	function Scene_MenuJournal() {
		this.initialize.apply(this, arguments);
	}

	Scene_MenuJournal.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_MenuJournal.prototype.constructor = Scene_MenuJournal;

	Scene_MenuJournal.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	}

	Scene_MenuJournal.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createEntriesWindow();
	}

	Scene_MenuJournal.prototype.start = function() {
		Scene_MenuBase.prototype.start.call(this);
		currentEntry = undefined;
		this._entriesWindow.refresh();
	}

	Scene_MenuJournal.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(1);
		this._helpWindow.setText('Journal');
		this.addWindow(this._helpWindow);
	}

	Scene_MenuJournal.prototype.createEntriesWindow = function() {
		const y = this._helpWindow.height;
		this._entriesWindow = new Window_JournalEntries(0, y, Graphics.boxWidth, Graphics.boxHeight - y);
		this._entriesWindow.show();
		this._entriesWindow.select(0);
		this._entriesWindow.activate();
		this._entriesWindow.setHandler('ok', this.commandOpenEntry.bind(this));
		this._entriesWindow.setHandler('cancel', this.popScene.bind(this))
		this.addWindow(this._entriesWindow);
	}

	Scene_MenuJournal.prototype.commandOpenEntry = function() {
		if (currentEntry) {
			SceneManager.push(Scene_MenuJournalEntry);
		}
	}

	// -----------
	//  Scene_MenuJournalEntry

	function Scene_MenuJournalEntry() {
		this.initialize.apply(this, arguments);
	}

	Scene_MenuJournalEntry.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_MenuJournalEntry.prototype.constructor = Scene_MenuJournalEntry;

	Scene_MenuJournalEntry.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	}

	Scene_MenuJournalEntry.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createEntryWindow();
	}

	Scene_MenuJournalEntry.prototype.start = function() {
		Scene_MenuBase.prototype.start.call(this);
	}

	Scene_MenuJournalEntry.prototype.update = function() {
		Scene_MenuBase.prototype.update.call(this);
		if (Input.isTriggered('cancel')) {
			this.popScene();
		}
	}

	Scene_MenuJournalEntry.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(1);
		this._helpWindow.setText(currentEntry.name);
		this.addWindow(this._helpWindow);
	}

	Scene_MenuJournalEntry.prototype.createEntryWindow = function() {
		const y = this._helpWindow.height;
		this._entryWindow = new Window_JournalEntry(0, y, Graphics.boxWidth, Graphics.boxHeight - y);
		this.addWindow(this._entryWindow);
	}

	// -----------------------
	//  Windows
	// -----------------------

	// -----------
	//  Window_JournalEntries

	function Window_JournalEntries() {
		this.initialize.apply(this, arguments);
	}

	Window_JournalEntries.prototype = Object.create(Window_Selectable.prototype);
	Window_JournalEntries.prototype.constructor = Window_JournalEntries;

	Window_JournalEntries.prototype.initialize = function(x, y, width, height) {
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this.activate();
	}

	Window_JournalEntries.prototype.select = function(index) {
		const entry = Object.values(entries)[index];
		if (entry) {
			currentEntry = entry;
			Window_Selectable.prototype.select.call(this, index);
		}
	}

	Window_JournalEntries.prototype.maxItems = function() {
		return getObjectSize(entries);
	}

	Window_JournalEntries.prototype.maxVisibleItems = function() {
		return 15;
	}

	Window_JournalEntries.prototype.drawItem = function(index) {
		const rect = this.itemRectForText(index);
		const entry = Object.values(entries)[index];
		if (entry) {
			this.drawText(entry.name, rect.x, rect.y, Graphics.boxWidth);
		}
	}

	// -----------
	//  Window_JournalEntry

	function Window_JournalEntry() {
		this.initialize.apply(this, arguments);	
	}

	Window_JournalEntry.prototype = Object.create(Window_Base.prototype);
	Window_JournalEntry.prototype.constructor = Window_JournalEntry;

	Window_JournalEntry.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.activate();
		this.refresh();
	}
	
	Window_JournalEntry.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.scrollUp(Input.isPressed('up'));
		this.scrollDown(Input.isPressed('down'));
	}

	Window_JournalEntry.prototype.refresh = function() {
		this.drawTextEx(wrap(currentEntry.content, param_wrapLength), this.textPadding(), 1);
	}

	Window_JournalEntry.prototype.scrollUp = function(wrap) {
		if (wrap) this.origin.y -= param_scrollSpeed;
	}

	Window_JournalEntry.prototype.scrollDown = function(wrap) {
		if (wrap) this.origin.y += param_scrollSpeed;
	}

	// -----------------------
	//  Calls
	// -----------------------

	Journal.getEntries = function() {
		return entries;
	}

	Journal.getEntry = function(id) {
		return entries[id];
	}

	Journal.getName = function(id) {
		return entries[id].name;
	}

	Journal.getContent = function(id) {
		return entries[id].content;
	}

	Journal.getId = function(index) {
		return Object.values(entries)[index].id;	
	}

	Journal.setName = function(id, name) {
		entries[id].name = name;
	}

	Journal.setContent = function(id, content) {
		entries[id].content = content;	
	}

	// -----------------------
	//  Hooks
	// -----------------------

	// -----------
	//  Game_Interpreter

	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(command, args);
		args = getArgs(args);
		if (command.toLowerCase() === 'journal' && args.length > 0) {
			switch(args[0]) {
				case 'open':
					openJournal();
					break;
				case 'new':
					if (args.length === 4) {
						newEntry(args[1], args[2], args[3]);	
					}
					break;
				case 'delete':
					if (args.length === 2) {
						deleteEntry(args[1]);	
					}
					break;
			}
		}
	}

	// -----------------------
	//  Utils
	// -----------------------

	function getArgs(args) {
		const argsString = args.join(' ');
		return splitArgs(fixNewlines(argsString));	
	}

	function splitArgs(s) {
		const regex = /"([^"]*)"|(\S+)/g;
		return (s.match(regex) || []).map(m => m.replace(regex, '$1$2'));
	}

	function fixNewlines(s) {
		return s.replace(/\\n*/g, '\n');
	}

	function getObjectSize(o) {
		return Object.keys(o).length;
	}

	const wrap = (s, max) => {
		const words = s.replace(/[\r\n]+/g, ' ').split(' ');
		let len = 0;
		return words.reduce((result, word) => {
		  if (len + word.length >= max) {
			len = word.length;
			return result + `\n${word}`;
		  } else {
			len += word.length + (result ? 1 : 0);
			return result ? result + ` ${word}` : `${word}`;
		  }
		}, '');
	  }
})();