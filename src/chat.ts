///<reference path="../typings/socket.io/socket.io.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
import io = require("socket.io");
import $ = require("jquery");

class Chat {
	guid: String;
	color: any;
	socket: any;
	chatJazz: any;
	constructor(guid: String, color: any) { 	
		this.guid = guid;
		this.color = color;
		this.socket = io.connect(); //How can this be.. better?
		//var chat = this;
		
		this.socket.on('chat message', data => {
			var sender;
			console.log(data);
			if (typeof data.nick != 'undefined') {
				sender = data.nick;
			} else {
				sender = data.guid.substring(0, 5);
			}
						
			var li = "<li><span style='color:" + data.color + ";'>" + sender + "</span>: " + data.msg + "</li>";
			//$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
			$('#messages').append(li);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});
		
		this.socket.on('error', msg => {
			var li = "<li><span style='color: #4e0f1a;'>" + msg + "</span></li>";
			//$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
			$('#messages').append(li);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});
		
		this.socket.on('info', msg => {
			//this.appendInfo(msg);
			var li = "<li><span style='color: #796817;'>" + msg + "</span></li>";
			//$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
			$('#messages').append(li);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});
		
		this.socket.on('death', data => {
			var ballsDroppedOrdinality = this.ordinalSuffixOf(data.ballsDropped);
			var li = "<li><span style='color:" + data.color + ";'>" + data.guid.substring(0, 5) + "</span> dropped their ball for the " + ballsDroppedOrdinality + " time!" + "</li>";
			$('#messages').append(li);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});

		$('form').submit(() => {
			if ($('#m').val() != "") {
				if ($('#m').val().substring(0, 1) == "/") {
					this.handleChatCommand($('#m').val());
					$('#m').val('');
					$('#m').blur();
				} else {
					this.socket.emit('chat message', { 'guid': guid, 'msg': $('#m').val(), 'color': color });
					$('#m').val('');
					$('#m').blur();
				}
			} 
			// else {
			
			// $('#m').blur();
			// }
			// if ($('#m').is(":focus")
			return false;
		});
		
		
		$(document).keydown( e => {
			if (!$(e.target).is('input')) {
				var prevent = true;
				// Update the state of the attached control to "true"
				switch (e.keyCode) {
					case 13:
					case 191:
						$('#m').focus();
						break;
					default:
						break;
				}
			}
		});
		
		
		this.chatJazz = new Audio('StandardJazzBars.mp3');
		//this.chatJazz.play();
		this.appendInfo("Hit up some jazz with /jazzmeup");
	}
	
	handleChatCommand(command: String) { 
		var tokens = command.split(" ");
		var chatCommand = tokens[0].substring(1, tokens[0].length);
		
		switch (chatCommand) {
			case "nick":
				var nick = tokens[1];
				console.log(nick);
				if (nick) {
					if (nick.length < 15) {
						this.socket.emit('nick change', this.guid, nick);
						break;
					}
				} 
				this.socket.emit('error', "Invalid nickname (must be between 1 and 15 characters)");
				break;
			case "ihatejazz":
				this.chatJazz.pause();
				this.chatJazz.currentTime = 0;
				this.appendInfo("That's not cool, but suit yourself (start music with /jazzmeup)");
				break;
			case "jazzmeup":
				this.chatJazz.play();
				break;
			default:
				this.socket.emit('error', "Invalid command");
				break;		
		}
		console.log(chatCommand);
	}
	
	appendInfo(msg: String) {
		var li = "<li><span style='color: #796817;'>" + msg + "</span></li>";
		//$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
		$('#messages').append(li);
		$('#messages').scrollTop($('#messages')[0].scrollHeight);
	}
	
	ordinalSuffixOf(i: number) {
		var j = i % 10,
			k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	}
	
	addMessage(guid: String) {
		
	}	
		
	playerJoined(guid: String) {
		
	}
	
	playerLeft(guid: String) {
		
	}	
}

//Export class
export = Chat;