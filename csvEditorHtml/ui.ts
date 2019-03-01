

type GridSettings = import("../node_modules/handsontable/handsontable").GridSettings

/* --- common helpers --- */


/**
 * displayed or hides the read options
 * @param shouldCollapse 
 */
function toggleReadOptions(shouldCollapse: boolean) {
	const el = _getById('read-options-icon')
	const content = _getById('read-options-content') //the wrapper



	if (shouldCollapse !== undefined) {
		_setCollapsed(shouldCollapse, el, content)

		_setReadOptionCollapsedVsState(shouldCollapse)
		return
	}

	_toggleCollapse(el, content, _setReadOptionCollapsedVsState)
}

/**
 * displayed or hides the write options
 * @param shouldCollapse 
 */
function toggleWriteOptions(shouldCollapse: boolean) {
	const el = _getById('write-options-icon')
	const content = _getById('write-options-content') //the wrapper

	if (vscode) {
		const lastState = _getVsState()
		vscode.setState({
			...lastState,
			writeOptionIsCollapsed: shouldCollapse
		})
	}

	if (shouldCollapse !== undefined) {
		_setCollapsed(shouldCollapse, el, content)

		_setWriteOptionCollapsedVsState(shouldCollapse)
		return
	}

	_toggleCollapse(el, content, _setWriteOptionCollapsedVsState)
}

/**
 * displayed or hides the preview
 * @param shouldCollapse 
 */
function togglePreview(shouldCollapse: boolean) {
	const el = _getById('preview-icon')
	const content = _getById('preview-content') //the wrapper

	if (vscode) {
		const lastState = _getVsState()
		vscode.setState({
			...lastState,
			previewIsCollapsed: shouldCollapse
		})
	}

	if (shouldCollapse !== undefined) {
		_setCollapsed(shouldCollapse, el, content)

		_setPreviewCollapsedVsState(shouldCollapse)
		return
	}

	_toggleCollapse(el, content, _setPreviewCollapsedVsState)
}

function _toggleCollapse(el: HTMLElement, wrapper: HTMLElement, afterToggled?: (isCollapsed: boolean) => void) {

	if (el.classList.contains('fa-chevron-right')) {
		//expand
		_setCollapsed(false, el, wrapper)

		if (afterToggled) afterToggled(false)
		return
	}

	//collapse
	_setCollapsed(true, el, wrapper)

	if (afterToggled) afterToggled(true)
}

function _setCollapsed(shouldCollapsed: boolean, el: HTMLElement, wrapper: HTMLElement) {

	if (shouldCollapsed) {
		el.classList.remove('fa-chevron-down')
		el.classList.add('fa-chevron-right')
		// el.classList.replace( 'fa-chevron-down','fa-chevron-right')
		wrapper.style.display = 'none'
		return
	}

	el.classList.add('fa-chevron-down')
	el.classList.remove('fa-chevron-right')

	// el.classList.replace('fa-chevron-right', 'fa-chevron-down')

	wrapper.style.display = 'block'
}


/* --- read options --- */
/**
 * 
 * @param fromUndo true: only update col headers, do not change the table data (will be done by undo/redo), false: normal
 */
function applyHasHeader(fromUndo = false) {
	const el = _getById('has-header') as HTMLInputElement //or defaultCsvReadOptions._hasHeader
	const data = getFirstRow()

	if (data.length === 0) {
		return
	}
	
	if (!hot) throw new Error('table was null')

	const elWrite = _getById('has-header-write') as HTMLInputElement //or defaultCsvWriteOptions.header

	if (el.checked) {

		//this checked state is set from csvReadOptions._hasHeader

		//use header row from data
		hot.updateSettings({
			colHeaders: data.map((col, index) => defaultColHeaderFunc(index, col))
		}, false)

		if (fromUndo) return

		headerRow = data

		hot.alter('remove_row', 0);

		elWrite.checked = true
		defaultCsvReadOptions._hasHeader = true
		return
	}

	//use default headers
	hot.updateSettings({
		colHeaders: defaultColHeaderFunc as any
	}, false)

	if (fromUndo) return

	hot.alter('insert_row', 0)
	hot.populateFromArray(0, 0, [headerRow])

	elWrite.checked = false
	defaultCsvReadOptions._hasHeader = false

}
function setDelimiterString() {
	const el = _getById('delimiter-string') as HTMLInputElement
	defaultCsvReadOptions.delimiter = el.value
}

function setCommentString() {
	const el = _getById('comment-string') as HTMLInputElement
	defaultCsvReadOptions.comments = el.value === '' ? false : el.value
}

function setQuoteCharString() {
	const el = _getById('quote-char-string') as HTMLInputElement
	defaultCsvReadOptions.quoteChar = el.value
}

function setEscapeCharString() {
	const el = _getById('escape-char-string') as HTMLInputElement
	defaultCsvReadOptions.escapeChar = el.value
}

function setSkipEmptyLines() {
	// const el = _getById('skip-empty-lines')
	// if (el) {
	// 	//currently disabled...
	// 	csvReadOptions.skipEmptyLines = el.checked
	// }
}

/**
 * sets the read delimiter programmatically
 * @param {string} delimiter 
 */
function setReadDelimiter(delimiter: string) {
	const el = _getById('delimiter-string') as HTMLInputElement
	el.value = delimiter
	defaultCsvReadOptions.delimiter = delimiter
}

/* --- write options --- */


function setHasHeaderWrite() {
	const el = _getById('has-header-write') as HTMLInputElement
	defaultCsvWriteOptions.header = el.checked
}

function setDelimiterStringWrite() {
	const el = _getById('delimiter-string-write') as HTMLInputElement
	defaultCsvWriteOptions.delimiter = el.value
}

function setCommentStringWrite() {
	const el = _getById('comment-string-write') as HTMLInputElement
	defaultCsvWriteOptions.comments = el.value === '' ? false : el.value
}

function setQuoteCharStringWrite() {
	const el = _getById('quote-char-string-write') as HTMLInputElement
	defaultCsvWriteOptions.quoteChar = el.value
}

function setEscapeCharStringWrite() {
	const el = _getById('escape-char-string-write') as HTMLInputElement
	defaultCsvWriteOptions.escapeChar = el.value
}

function setQuoteAllFieldsWrite() {
	const el = _getById('quote-all-fields-write') as HTMLInputElement
	defaultCsvWriteOptions.quoteAllFields = el.checked
}

/**
 * NOT USED CURRENTLY (ui is hidden)
 */
function setNewLineWrite() {
	const el = _getById('newline-select-write') as HTMLInputElement

	if (el.value === '') {
		defaultCsvWriteOptions.newline = newLineFromInput
	}
	else if (el.value === 'lf') {
		defaultCsvWriteOptions.newline = '\n'
	}
	else if (el.value === 'lf') {
		defaultCsvWriteOptions.newline = '\r\n'
	}
}

/**
 * sets the write delimiter programmatically
 * @param {string} delimiter 
 */
function setWriteDelimiter(delimiter: string) {
	const el = _getById('delimiter-string-write') as HTMLInputElement
	el.value = delimiter
	defaultCsvWriteOptions.delimiter = delimiter
}


/* --- preview --- */

/**
 * updates the preview
 */
function generateCsvPreview() {
	const value = getDataAsCsv(defaultCsvReadOptions, defaultCsvWriteOptions)

	const el = _getById('csv-preview') as HTMLTextAreaElement
	el.value = value

	//open preview
	togglePreview(false)
}

function copyPreviewToClipboard() {

	generateCsvPreview()

	const el = _getById('csv-preview') as HTMLTextAreaElement

	postCopyToClipboard(el.value)

}


/* --- other --- */

/**
 * ensures that all rows inside data have the same length
 * this also trims all cell values
 * @param data 
 * @param csvReadConfig 
 */
function _normalizeDataArray(data: string[][], csvReadConfig: CsvReadOptions, fillString = '') {

	
	const maxCols = data.reduce((prev, curr) => curr.length > prev ? curr.length : prev, 0)

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		if (row.length < maxCols) {
			row.push(...Array.from(Array(maxCols - row.length), (p, index) => fillString))
		}

		//handsontable trims cell values as soon as we finish editing it
		//we could disable this in the settings (trimWhitespace) but this is ok for now
		for (let j = 0; j < row.length; j++) {

			if (row[j] === null || row[j] === undefined) continue

			row[j] = row[j].trim()
		}

	}

}

/**
 * display the given data in the handson table
 * if we have rows this sets the 
 * @see headerRow and enables the has header option
 * if we have data we convert it to match a rectangle (every row must have the same number of columns / cells)
 * @param {string[][]} data array with the rows or null to just destroy the old table
 */
function displayData(data: string[][] | null, csvReadConfig: CsvReadOptions) {

	if (data === null) {
		if (hot) {
			hot.getInstance().destroy()
			hot = null
		}
		return
	}

	_normalizeDataArray(data, csvReadConfig)

	if (data.length > 0) {
		headerRow = data[0]
	}

	const container = csvEditorDiv

	if (hot) {
		hot.destroy()
		hot = null
	}

	//@ts-ignore
	hot = new Handsontable(container, {
		data,
		rowHeaders: function (row: number) { //the visual row index
			let text = (row + 1).toString()

			if (data.length === 1) {
				return `${text} <span class="remove-row clickable" onclick="removeRow(${row})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`
			}

			return `${text} <span class="remove-row clickable" onclick="removeRow(${row})"><i class="fas fa-trash"></i></span>`
			//why we would always disallow to remove first row?
			// return row !== 0
			// 	? `${text} <span class="remove-row clickable" onclick="removeRow(${row})"><i class="fas fa-trash"></i></span>`
			// 	: `${text} <span class="remove-row clickable" onclick="removeRow(${row})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`
		} as any,
		fillHandle: false,
		colHeaders: defaultColHeaderFunc as any,
		currentColClassName: 'foo',
		currentRowClassName: 'foo',
		//plugins
		comments: false,
		manualRowMove: true,
		manualRowResize: true,
		manualColumnMove: true,
		manualColumnResize: true,
		columnSorting: true,

		outsideClickDeselects: false, //keep selection

		cells: highlightCsvComments 
		? function(row, col) {
			var cellProperties: GridSettings = {};
			cellProperties.renderer = 'commentValueRenderer' //is registered in util

			if (row === undefined || row === null) return cellProperties
			if (col === undefined || col === null) return cellProperties

			//@ts-ignore
			const _hot = this.instance as Handsontable
			// const tableData = _hot.getData() //this is slooooooow, getDataAtCell is much faster

			//we should always have 1 col
			const firstCellVal = _hot.getDataAtCell(row, 0) //tableData[row][0]

			if (firstCellVal === null) return cellProperties
			
			if (typeof csvReadConfig.comments === 'string' && firstCellVal.trim().startsWith(csvReadConfig.comments)) {
				//@ts-ignore
				cellProperties._isComment = true
			} else {
				//@ts-ignore
				cellProperties._isComment = false
			}
			
			return cellProperties
		}
		: undefined,

		//not fully working... we would handle already comment cells
		// beforeChange: function (changes) {

		// 	if (!changes || changes.length !== 1) return

		// 	console.log(changes)
			
		// 	const rowIndex = changes[0][0]
		// 	const colIndex = changes[0][1] as number
		// 	const oldVal = changes[0][2]
		// 	const newVal = changes[0][3]

		// 	if (oldVal === newVal) return //user only started editing then canceled
			
		// 	if (typeof csvReadConfig.comments === 'string' && colIndex === 0 && newVal.trim().startsWith(csvReadConfig.comments)) {
		// 		//this is now a merged comment row
		// 		const _tmp = transformIntoCommentRow(rowIndex, csvReadConfig)
		// 		changes[0][3] =  _tmp
		// 		console.log(_tmp)
		// 	}
			
		// },

		//TODO see https://github.com/handsontable/handsontable/issues/3328
		//only working because first argument is actually the old size, which is a bug
		beforeColumnResize: function (oldSize, newSize, isDoubleClick) { //after change but before render

			//allColSizes is not always up to date... only set on window resize... when the bug is fixed we need to change this...

			// if (allColSizes.length > 0 && isDoubleClick) {
				// const oldSize = allColSizes[currentColumn]

				if (oldSize === newSize) {
					//e.g. we have a large column and the auto size is too large...
					if (initialConfig) {
						return initialConfig.doubleClickColumnHandleForcedWith
					}
				}
			// }
		},
		enterMoves: function (event: KeyboardEvent) {

			if (!hot) throw new Error('table was null')

			const selection = hot.getSelected()
			const _default = {
				row: 1,
				col: 0
			}

			if (!initialConfig || initialConfig.lastRowEnterBehavior !== 'createRow') return _default

			if (!selection || selection.length === 0) return _default

			if (selection.length > 1) return _default

			const rowCount = hot.countRows()

			//see https://handsontable.com/docs/3.0.0/Core.html#getSelected
			//[startRow, startCol, endRow, endCol].
			const selected = selection[0]
			if (selected[0] !== selected[2] || selected[0] !== rowCount - 1) return _default

			if (event.key.toLowerCase() === 'enter' && event.shiftKey === false) {
				addRow(false)
			}
			return _default
		},
		tabMoves: function (event: KeyboardEvent) {

			if (!hot) throw new Error('table was null')

			const selection = hot.getSelected()
			const _default = {
				row: 0,
				col: 1
			}

			// console.log(initialConfig.lastColumnTabBehavior);

			if (!initialConfig || initialConfig.lastColumnTabBehavior !== 'createColumn') return _default

			if (!selection || selection.length === 0) return _default

			if (selection.length > 1) return _default

			const colCount = hot.countCols()

			//see https://handsontable.com/docs/3.0.0/Core.html#getSelected
			//[startRow, startCol, endRow, endCol]
			const selected = selection[0]
			if (selected[1] !== selected[3] || selected[1] !== colCount - 1) return _default

			if (event.key.toLowerCase() === 'tab' && event.shiftKey === false) {
				addColumn(false)
			}
			return _default
		},

		afterBeginEditing: function () {

			if (!initialConfig || !initialConfig.selectTextAfterBeginEditCell) return

			const textarea = document.getElementsByClassName("handsontableInput")
			if (!textarea || textarea.length === 0 || textarea.length > 1) return

			const el = textarea.item(0) as HTMLTextAreaElement | null
			if (!el) return

			el.setSelectionRange(0, el.value.length)
		},
		// data -> [[1, 2, 3], [4, 5, 6]]
		//coords -> [{startRow: 0, startCol: 0, endRow: 1, endCol: 2}]
		beforeCopy: function (data, coords) {
			//we could change data to 1 element array containing the finished data? log to console then step until we get to SheetClip.stringify
			// console.log('data');
		},
		afterUndo: function (action: any) {
			if (action.actionType === 'remove_row' && action.index === 0) { //first row cannot be removed normally so it must be the header row option
				//remove header row
				defaultCsvReadOptions._hasHeader = false
				const el = _getById('has-header') as HTMLInputElement
				const elWrite = _getById('has-header-write') as HTMLInputElement
				el.checked = false
				elWrite.checked = false

				applyHasHeader(true)
			}

		},
		beforeRedo: function (action: any) {
			if (action.actionType === 'remove_row' && action.index === 0) { //first row cannot be removed normally so it must be the header row option
				//we re insert header row

				defaultCsvReadOptions._hasHeader = false
				const el = _getById('has-header') as HTMLInputElement
				const elWrite = _getById('has-header-write') as HTMLInputElement
				el.checked = true
				elWrite.checked = true

				applyHasHeader(true)
			}
		},

		afterColumnMove: function (aa, bbb) {

			if (!hot) throw new Error('table was null')

			//TODO NOT WORKING??
			hot.updateSettings({
				colHeaders: defaultColHeaderFunc as any
			}, false)
		}
	})

	//@ts-ignore
	Handsontable.dom.addEvent(window as any, 'resize', throttle(onResizeGrid, 200))


	const settingsApplied = checkIfHasHeaderReadOptionIsAvailable()

	//if we have only 1 row and header is enabled by default...this would be an error (we cannot display something)

	if (settingsApplied === true && defaultCsvReadOptions._hasHeader === true) { //this must be applied else we get duplicate first row
		applyHasHeader()
	}

	//make sure we see something (right size)...
	onResizeGrid()
}

//not needed really now because of bug in handson table, see https://github.com/handsontable/handsontable/issues/3328
//just used to check if we have columns
var allColSizes = []
/**
 * updates the handson table to fill available space (will trigger scrollbars)
 */
function onResizeGrid() {

	if (!hot) return

	const widthString = getComputedStyle(csvEditorWrapper).width

	if (!widthString) {
		_error(`could not resize table, width string was null`)
		return
	}

	const width = parseInt(widthString.substring(0, widthString.length - 2))

	const heightString = getComputedStyle(csvEditorWrapper).height

	if (!heightString) {
		_error(`could not resize table, height string was null`)
		return
	}

	const height = parseInt(heightString.substring(0, heightString.length - 2))

	hot.updateSettings({
		width: width,
		height: height,
	}, false)

	//get all col sizes
	allColSizes = []
	for (let i = 0; i < hot.countCols(); i++) {
		allColSizes.push(hot.getColWidth(i))
	}

}

/**
 * generates the default html wrapper code for the given column name
 * we add a delete icon
 * @param {number} colIndex the physical column index (user could have moved cols so visual  first col is not the physical second) use https://handsontable.com/docs/6.2.2/RecordTranslator.html to translate
 * 	call like hot.toVisualColumn(colIndex)
 * @param {string | undefined | null} colName 
 */
function defaultColHeaderFunc(colIndex: number, colName: string | undefined | null) {

	let text = getSpreadsheetColumnLabel(colIndex)
	

	//null can also happen if we enable header, add column, disable header, enable header (then the new column have null values)
	if (colName !== undefined && colName !== null) {
		//@ts-ignore
		text = colName
	}

	let visualIndex = colIndex

	if (hot) {
		visualIndex = hot.toVisualColumn(colIndex)

		if (hot.countCols() === 1) {
			return `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`
		}

		return `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})"><i class="fas fa-trash"></i></span>`
	}

	return visualIndex !== 0
		? `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})"><i class="fas fa-trash"></i></span>`
		: `${text} <span class="remove-col clickable" onclick="removeColumn(${visualIndex})" style="visibility: hidden"><i class="fas fa-trash"></i></span>`
}

/**
 * displays or hides the help modal
 * @param isVisible 
 */
function toggleHelpModal(isVisible: boolean) {

	if (isVisible) {
		helModalDiv.classList.add('is-active')
		return
	}

	helModalDiv.classList.remove('is-active')
}

/**
 * displays or hides the ask read again modal
 * @param isVisible 
 */
function toggleAskReadAgainModal(isVisible: boolean) {

	if (isVisible) {
		askReadAgainModalDiv.classList.add('is-active')
		return
	}

	askReadAgainModalDiv.classList.remove('is-active')
}



/**
 * parses and displays the given data (csv)
 * @param {string} content 
 */
function resetData(content: string, csvReadOptions: CsvReadOptions) {
	const _data = parseCsv(content, csvReadOptions)

	displayData(_data, csvReadOptions)

	//might be bigger than the current view
	onResizeGrid()
	toggleAskReadAgainModal(false)
}
