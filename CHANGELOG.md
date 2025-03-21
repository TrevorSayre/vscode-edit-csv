# Change Log

## [Unreleased]

## 0.2.5

- added option `fontSizeInPx` to set the font size in the webview (or to sync it with the editor)
- moved ui options (read/write/preview) into one panel
	- replaced options `writeOptionsAppearance`, `readOptionsAppearance`, `previewOptionsAppearance` with `optionsBarAppearance`
- `trim` feature now only shows `unsaved changes` when at least one cell changed

## 0.2.4

- added option to fix the first X rows (`fixFirstXRows`)
- added option to disable borders (`disableBorders`)
	- this and `has header` option are mutually exclusive
		- `has header` has priority
- fixed issue where enabled initial state of `has header` would trigger `has changes` indicator

## 0.2.3

- added option to retain/store quote information from parsing
	- changed papaparse
- fixed issue where enabling `has header` option and then moving column will only move data but not the header data
- fixed issue where all empty fields first line was not recognized as csv row
- fixed issue where quote all fields will not quote all empty field rows
- fixed issue where the initial value of read option `has header` would keep undo items (header row)
	- we now clear the undo stack after we set the initial value for read option `has header` and
	- `reset data` will now correctly re-apply the `has header` value
- after applying `has header` read option the undo/redo stack is cleared!
	- it's just too complicated to get this 100% right

## 0.2.2

- added `ctrl+f`find shortcut for windows/linux

## 0.2.1

- fixed issue where empty `Read options > Comment` would cause all rows to be comments (#14)

## 0.2.0

- replaced built-in vs code find widget with custom find widget
	- tries to stay close to the vs code find widget
	- some key features
		- async search
		- options (match case, trim cell value, regex, ...)
		- move widget
- removed all node_modules production dependencies
	- we now use the `thirdParty` folder for this

## 0.1.5

- added `unsaved changes` indicator (`*`) to the editor title and icon to ui
- `Read options` panel now shows a `⇥` as detected delimiter if a tab was detected
- when expanding rows initially we now show the `unsaved changes` indicator

## 0.1.4

- added option to specify initial max column width `initialColumnWidth` (disabled by default)
	- use 0 or a negative number to disable the option (to use auto column size)
- fixed issue where new lines inside a cell are collapsed when the option `enableWrapping` was disabled

## 0.1.3

- added option for cell content wrapping (fixes issue #7)
- switched to custom/own version of handsontable (6.2.2, to keep MIT license)

## 0.1.2

- trim feature now also trims header row (probably better)
- column names now start with 1 (probably better)
- the `has header` option now ignores rows with comments
- fixed bad behavior where disabling `has header` option would insert additional rows (when one deleted rows and the original row index was larger than the current row count)
	- in this case the header row is now inserted as the last row
	- else the header row is inserted at the index where we got it
- fixed some issues where `has header` option and only rows with comments throws
- fixed issue where column headers (via has header option) was not always correctly displayed (the default A, B, C, ... columns were displayed)
- fixed issue where a comment not in the first column would visually indicate the row as a comment row


## 0.1.1

- fixed issue where rendering was really really slow because of comment cell/row highlighting (tested with 100.000 rows ~ 12MB)
- changed comment row handling so that comments are not longer treated like normal csv
	- this also resolves issues where comments with `,` are not properly handled (imported/exported)
	- monkeypatched papaparse so comment rows are parsed as plain text and also exported as plain text

## 0.1.0

- added feature to hide and show rows with comments
- added context menu to insert/remove rows/columns at arbitrary positions
- added context menu options alignment
- fixed issue where sorting and comment highlighting was not synced
- fixed issue where deleting a sorted column would not reset sorting

## 0.0.12

- fixed critical bug where files with more than \~1MB are not properly loaded and saved
	- saved files were corrupted (content of the first \~1MB was repeated after the first \~1MB until the file size was reached)
- added button to trim whitespace (leading and trailing) in all cells
	- prior versions will **trim by default** (on initial render and after cell editing)!

## 0.0.11

- fixed row header width issue for large files
- fixed issue where large files causes the editor to hang
	- handsontable virtual renderer is now used with small initial table size
	- switched from inlining the csv data into the webview html to `webview.postMessage`
- fixed issue where commands relying on `webview.postMessage` were not working (`edit-csv.apply` and `edit-csv.applyAndSave`)

## 0.0.10

- fixed issue on windows where fontawesome icons are not loaded
- fixed issue where adding a column adds two instead of one

## 0.0.9

- Initial release