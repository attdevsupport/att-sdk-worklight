
/* JavaScript content from js/filebrowse.js in folder common */


var root = null;
// File System root variable
var currentDir = null;
// Current DirectoryEntry listed
var parentDir = null;
// Parent of the current directory

var activeItem = null;
// The clicked item
var activeItemType = null;
// d-directory, f-file
var clipboardItem = null;
// file or directory for copy or move
var clipboardAction = null;
// c-copy, m-move


function readLocalFileSystem() {
	getFileSystem();
	clickItemAction();
}

/* get the root file system */
function getFileSystem() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {// success get file system
		root = fileSystem.root;
		listDir(root);
	}, function(evt) {
		console.log("File System Error: " + evt.target.error.code);
	});
}

/* show the content of a directory */
function listDir(directoryEntry) {
	if (!directoryEntry.isDirectory)
		console.log('listDir incorrect type');
	// show loading message
	currentDir = directoryEntry;
	// set current directory
	/*directoryEntry.getParent(function(par) {// success get parent
		parentDir = par;
		// set parent directory
		if ((parentDir.name == 'sdcard' && currentDir.name != 'sdcard')
				|| parentDir.name != 'sdcard')
			$('#backBtn').show();
	}, function(error) {// error get parent
		console.log('Get parent error: ' + error.code);
	});*/

	var directoryReader = directoryEntry.createReader();
	directoryReader.readEntries(function(entries) {
		var dirContent = $('#dirContent');
		dirContent.empty();
		

		var dirArr = new Array();
		var fileArr = new Array();
		for ( var i = 0; i < entries.length; ++i) {// sort entries
			var entry = entries[i];
			if (entry.isDirectory && entry.name[0] != '.')
				dirArr.push(entry);
			else if (entry.isFile && entry.name[0] != '.')
				fileArr.push(entry);
		}

		var sortedArr = fileArr;//dirArr.concat(fileArr);
		// sorted entries
		var uiBlock = [ 'a', 'b', 'c', 'd' ];
		var isFileExist;
		isFileExist = false;
		for ( var i = 0; i < sortedArr.length; ++i) {// show directories
			var entry = sortedArr[i];
			var blockLetter = uiBlock[i % 4];
			if (entry.isDirectory)
				dirContent.append('<div class="k-' + blockLetter
						+ '"><div class="folder"><br><p>' + entry.name
						+ '</p></div></div><br>');
			else if (entry.isFile) {
				var fType = entry.name.split('.').pop();
				if (fType === "amr" || fType === "wav")
				{
					isFileExist = true;
					dirContent.append('<div class="k-'
							+ blockLetter + '"><div class="file"><br><p>'
							+ entry.name + '</p></div></div>');
				}
			}
		}
		if(isFileExist == false)
		{
			dirContent.append('<div class="message"><br><p><center>No File Exist</center></p></div></div>');
		}
		// hide loading message
	}, function(error) {
		console.log('listDir readEntries error: ' + error.code);
	});
}

/* read from file */
function readFile(fileEntry) {
	if (!fileEntry.isFile)
		console.log('readFile incorrect type');
	// show loading message

	fileEntry.file(function(file) {
		$("#pagePort").load("speech.html");
		//window.location.href = "speech.html";
		window.localStorage.speechFilePath = file.fullPath;
		//show( "speech","fileBrowser");
		// hide loading message

	}, function(error) {
		console.log(evt.target.error.code);
	});
}

/* open item */
function openItem(type) {
	if (type == 'd') {
		listDir(activeItem);
	} else if (type == 'f') {
		readFile(activeItem);
	}
}

/* get active item  */
function getActiveItem(name, type) {
	if (type == 'd' && currentDir != null) {
		currentDir.getDirectory(name, {
			create : false
		}, function(dir) {// success find directory
			activeItem = dir;
			activeItemType = type;
		}, function(error) {// error find directory
			console.log('Unable to find directory: ' + error.code);
		});
	} else if (type == 'f' && currentDir != null) {
		currentDir.getFile(name, {
			create : false
		}, function(file) {// success find file
			activeItem = file;
			activeItemType = type;
            openItem(activeItemType);
		}, function(error) {// error find file
			console.log('Unable to find file: ' + error.code);
		});
	}
}

/* get clipboard item for copy or move */
function getClipboardItem(action) {
	if (activeItem != null) {
		clipboardItem = activeItem;
		clipboardAction = action;
	}
}

/* click actions */
function clickItemAction() {
	var folders = $('.folder');
	var files = $('.file');
	var backBtn = $('#backBtn');
	var homeBtn = $('#homeBtn');
	/* menu buttons */
	var menuDialog = $('#menuOptions');
	var openBtn = $('#openBtn');
	var copyBtn = $('#copyBtn');
	var moveBtn = $('#moveBtn');
	var pasteBtn = $('#pasteBtn');
	var deleteBtn = $('#deleteBtn');

	folders.live('click', function() {
		var name = $(this).text();
		getActiveItem(name, 'd');
		
		$('#menu').trigger('click');
		// menu dialog box
	});

	files.live('click', function() {
		var name = $(this).text();
		getActiveItem(name, 'f');
		//$('#menu').trigger('click');
		// menu dialog box
		// paste button always disabled for files
		//pasteBtn.button('disable');
		//pasteBtn.button('refresh');
	});
	backBtn.click(function() {// go one level up
		if (parentDir != null)
			listDir(parentDir);
	});

	homeBtn.click(function() {// go to root
		if (root != null) {
			listDir(root);
		}
		/*else{
		 $.mobile.loadPage('speech.html');

		 }*/
	});

	openBtn.click(function() {
		openItem(activeItemType);
		menuDialog.dialog('close');
	});

	copyBtn.click(function() {
		getClipboardItem('c');
		menuDialog.dialog('close');
		pasteBtn.button('enable');
		pasteBtn.button('refresh');
	});

	moveBtn.click(function() {
		getClipboardItem('m');
		menuDialog.dialog('close');
		pasteBtn.button('enable');
		pasteBtn.button('refresh');
	});

	pasteBtn.click(function() {
		if (clipboardItem != null && clipboardAction != null) {
			if (clipboardAction == 'c') {// copy item
				console.log('copy: ' + clipboardItem.name + ' to: ' + activeItem.name);
				clipboardItem.copyTo(activeItem, clipboardItem.name, function(fileCopy) {
					console.log('copy success! ' + fileCopy.name);
					openBtn.trigger('click');
				}, function(error) {
					console.log('copy error: ' + error.code);
				});
			} else if (clipboardAction == 'm') {// move item
				console.log('move: ' + clipboardItem.name + ' to: ' + activeItem.name);
				clipboardItem.moveTo(activeItem, clipboardItem.name, function(fileCopy) {
					console.log('move success! ' + fileCopy.name);
					openBtn.trigger('click');
				}, function(error) {
					console.log('move error: ' + error.code);
				});
			}
		}
	});

	deleteBtn.click(function() {
		if (activeItem != null && activeItemType != null) {
			if (activeItemType == 'd') {
				activeItem.removeRecursively(function() {
					console.log('removed recursively with success');
					menuDialog.dialog('close');
					listDir(currentDir);
				}, function(error) {
					console.log('remove recursively error: ' + error.code);
				});
			} else if (activeItemType == 'f') {
				activeItem.remove(function() {
					console.log('removed recursively with success');
					menuDialog.dialog('close');
					listDir(currentDir);
				}, function(error) {
					console.log('remove recursively error: ' + error.code);
				});
			}
		}
	});
}
