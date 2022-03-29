(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.onload = () => {

    var myModal = new bootstrap.Modal(document.getElementById('myModal'), {})
    myModal.toggle()    

    var usernameForm = document.getElementById("username-form")
    var usernameField = document.getElementById("username")
    var chatBox = document.getElementById("chat-box")
    var form = document.getElementById("message-form")
    var messageField = document.getElementById("message")

    var ws = new WebSocket("ws://localhost:8080")

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    usernameForm.onsubmit = e => {
        var username = usernameField.value
        if (username===""){
                username = "Anonymous"
        }
        var payload = JSON.stringify({msg: `${username} joined the chat`, usr: username})
        ws.send(payload)


        return false
    }

    form.onsubmit = e => {
        var message = messageField.value
        var username = usernameField.value
        var payload = JSON.stringify({msg: message, usr: username})

        ws.send(payload)

        chatBox.innerHTML += `<div class="chat-log__item chat-log__item--own">
        <h3 class="chat-log__author"><small>${formatAMPM(new Date)}</small></h3>
        <div class="chat-log__message"> ${message} </div>
        </div>`
        messageField.value = ''
        window.scrollTo(0, document.body.scrollHeight);
        return false
    }


    ws.onmessage = msg => {
        var data = JSON.parse(msg.data)

        chatBox.innerHTML += `<div class="chat-log__item">
            <h3 class="chat-log__author" style="color:#${data.color}">${data.usr}  <small>${formatAMPM(new Date)}</small></h3>
            <div class="chat-log__message"> ${data.msg} </div>
            </div>`
    
        window.scrollTo(0, document.body.scrollHeight)

        // if (data.msg === undefined) {
        //     null
        // } else {
        
            
        // }
    }

}
},{}]},{},[1]);
