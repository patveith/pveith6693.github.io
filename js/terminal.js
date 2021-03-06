var Terminal = {};

function Node (value) {
  this.value = value;
  this.next = null;
  this.prev = null;
};

function HistoryList(){
  this.length = 0;
  this.head = null;
  this.tail = null;
  this.curr = null;
};

HistoryList.prototype = {
  add: function(value){
    //Don't store empty commands
    if(value == ""){
      return null;
    }
    var node = new Node(value);

    if(this.length){
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }else{
      this.head = node;
      this.tail = node;
    }

    this.length++;

    return node;
  },
  getPrev: function(){
    if(this.head == null){
      return null;
    }else if(this.curr == null){
      this.curr = this.tail;
      return this.curr.value;
    }else if(this.curr.prev == null){
      return this.curr.value;
    }else {
      this.curr = this.curr.prev;
      return this.curr.value;
    }
    return;
  },
  getNext: function(){
    if(this.curr == null){
      return null;
    }else if(this.curr.next == null){
      return this.curr.value;
    }else {
      this.curr = this.curr.next;
      return this.curr.value;
    }
  }
};

Terminal = {
  cmdCount: 0,
  name: "patrick@veith:~$ ",
  newLine: "\npatrick@veith:~$ ",
  termId: "term-input",
  histList: new HistoryList(),
  initialize: function () {
    //Displays the first prompt and brings into focus
    terminalElement = document.getElementById(Terminal.termId);
    terminalElement.value = Terminal.name;
    terminalElement.focus();
    //Slides modals in from the left
    $('.modal').prop('class', 'modal fade').addClass("left");
    //Sends backspace, uparrow, and downarrow to readInput function
    $("textarea").on("keydown", function (e) {
      if (e.keyCode == 8 ||
          e.keyCode == 40 ||
          e.keyCode == 38 ||
          e.keyCode == 37) {
        Terminal.Input.readInput(e);
      }
    });
  },
  Input: {
    enterCode: 13,
    backspaceCode: 8,
    downArrow: 40,
    upArrow: 38,
    leftArrow: 37,
    getTextArea: function(){
      return document.getElementById(Terminal.termId);
    },
    moveUnlessPrompt: function(event){
      var arr = Terminal.Input.getTextArea().value.split(Terminal.name);
      if(arr[arr.length-1] == ""){
        event.preventDefault();
      }
    },
    getPreviousInputUp: function(){
      var prev = Terminal.histList.getPrev();
      //Checks if history list is null
      if(prev == null){
        return;
      }
      //Appends the previous history command to the terminal
      terminalElement = Terminal.Input.getTextArea();
      var arr = terminalElement.value.split(Terminal.newLine);
      arr[Terminal.cmdCount] = prev;
      if(arr.length == 1){
        terminalElement.value = "patrick@veith:~$ " + arr;
      }else{
        terminalElement.value = arr.join("\npatrick@veith:~$ ");
      }
    },
    getPreviousInputDown: function(){
      var next = Terminal.histList.getNext();
      //Checks if history list is null
      if(next == null){
        return;
      }
      //Appends the next history command to the terminal
      terminalElement = Terminal.Input.getTextArea();
      var arr = terminalElement.value.split(Terminal.newLine);
      arr[Terminal.cmdCount] = next;
      if(arr.length == 1){
        terminalElement.value = "patrick@veith:~$ " + arr;
      }else{
        terminalElement.value = arr.join("\npatrick@veith:~$ ");
      }
    },
    readInput: function(event){
      if (event.keyCode == Terminal.Input.enterCode) {
        //Determines command and returns after executing
        var cmd = Terminal.Input.interpretInput(Terminal.Input.getTextArea().value);
        //Adds command to history and clears curr node
        Terminal.histList.add(cmd);
        Terminal.histList.curr = null;
        //Adds prompt to terminal
        if(cmd == Terminal.Commands.clear){
          terminalElement.value = terminalElement.value + Terminal.name;
        }else{
          terminalElement.value = terminalElement.value + Terminal.newLine;
          Terminal.cmdCount++;
        }
        //Prevents line break from occuring
        event.preventDefault();
        //Scrolls textarea down as commands are entered
        terminalElement.scrollTop = terminalElement.scrollHeight;
      }else if(event.keyCode == Terminal.Input.backspaceCode ||
        event.keyCode == Terminal.Input.leftArrow){
        Terminal.Input.moveUnlessPrompt(event);
      }else if(event.keyCode == Terminal.Input.upArrow){
        //Stops cursor from moving up
        event.preventDefault();
        Terminal.Input.getPreviousInputUp();
      }else if(event.keyCode == Terminal.Input.downArrow){
        //Stops cursor from moving down
        event.preventDefault();
        Terminal.Input.getPreviousInputDown();
      }
    },
    interpretInput: function(text){
      var arr = text.split(Terminal.newLine);
      var cmd = arr[Terminal.cmdCount];
      if(Terminal.cmdCount == 0){
        cmd = arr[Terminal.cmdCount].split(" ")[1]
      }
      switch (cmd) {
        case Terminal.Commands.help:
          Terminal.Commands.helpCommand();
          alert(cmd);
          break;
        case Terminal.Commands.ls:
          Terminal.Commands.listCommand();
          break;
        case Terminal.Commands.education:
          Terminal.Commands.educationScript();
          break;
        case Terminal.Commands.contact:
          Terminal.Commands.contactScript();
          break;
        case Terminal.Commands.resume:
          Terminal.Commands.resumeScript();
          break;
        case Terminal.Commands.projects:
          Terminal.Commands.projectScript();
        case Terminal.Commands.photos:
          Terminal.Commands.photoScript();
        case Terminal.Commands.clear:
          Terminal.Commands.clearCommand();
          break;
        default:
          Terminal.Commands.notRecognizedCommand(cmd);
      }
      return cmd;
    }
  },
  Commands: {
    help: "help",
    ls: "ls",
    clear: "clear",
    education: "./education.sh",
    contact: "./contact.sh",
    resume: "./resume.sh",
    projects: "./projects.sh",
    photos: "./photos.sh",
    list: ["contact.sh\t", "projects.sh\n", "education.sh\t", "resume.sh\n", "photos.sh"],
    helpCommand: function(){
      //TODO lots of things related to help
    },
    listCommand: function(){
      var terminalElement = Terminal.Input.getTextArea();
      terminalElement.value = terminalElement.value + "\n" + Terminal.Commands.list.join("");
    },
    clearCommand: function(){
      var terminalElement = Terminal.Input.getTextArea();
      terminalElement.value = "";
      Terminal.cmdCount = 0;
    },
    notRecognizedCommand: function(cmd){
      if(cmd == ""){
        return;
      }
      var terminalElement = Terminal.Input.getTextArea();
      terminalElement.value = terminalElement.value +  "\nbash: " + cmd + ": command not found";
    },
    educationScript: function(){
      $("#education").modal();
    },
    contactScript: function(){
      $("#contact").modal();
    },
    resumeScript: function(){
      $("#resume").modal();
    },
    projectScript: function(){
      $("#projects").modal();
    },
    photoScript: function(){
      $("#photos").modal();
    }
  }
};
