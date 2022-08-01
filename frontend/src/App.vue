
<script setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref } from 'vue'; 
//  make a connection to the socket server
const socket = io('http://localhost:3000');

//states
const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisplay = ref('');


onBeforeMount(() => {
  // socket.emit('findAllChats', {}, (response) => {
  //   messages.value = response;
  // });

  //
  socket.on('message', (message) => {
    messages.value.push(message);
  });

  socket.on('typing', ({ name, isTyping }) => {
    if (isTyping)
    {
      typingDisplay.value = name + ' is typing...';
    }
    else
    {
      typingDisplay.value = '';
    }
  });
});

const join = () => {
  socket.emit('join', {name: name.value}, () => {
    joined.value = true;
  })
}

const sendMessage = () => {
  socket.emit('createChat', {text: messageText.value}, () => {
    messageText.value = '';
  })
}

// define if the user is typing it's emitting this value but after 
// a couple of seconds when they stop typing it's gonna emit isTyping is false.

// const emitTyping = () => {
//   socket.emit('typing', { isTyping: true });
//    timeout = setTimeout(() => {
//      socket.emit('typing', { isTyping: false });
//   }, 2000);
//  };

// var typing = false;

var timeout = undefined;

function timeoutFunction(){
  socket.emit('typing', { isTyping: false });
}

function emitTyping(){

    socket.emit('typing', { isTyping: true });
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000);

}

</script>
<template>
 <div class="chat">
    <div v-if="!joined" >
      <form @submit.prevent="join">
        <label> What's your name? </label>
          <input v-model="name"/>
            <button type="submit">Send</button>
      </form>
    </div>
  <div class="chat-container" v-else>
  <div class="messagee-container">
    <div v-for="message in messages" :key = "message">
      [{{ message.sender }}]: {{ message.text }}
    </div>
  </div>

  <div v-if="typingDisplay"> {{ typingDisplay }} </div>

  <hr/>
  
  <div class="message-input">
    <form @submit.prevent="sendMessage">
      <label>Message: </label>
      <input  v-model= "messageText" @input="emitTyping"/>

      <button type="submit">Send</button>
    </form>
  </div>

  </div>
 </div>
 
</template>

<style>

@font-face {
  font-family: 'Georama';
  src: url('./assets/Georama.ttf');
}

@font-face {
  font-family: 'Georama';
  src: url('./assets/Georama.ttf');
  font-weight: bold;
}

* {
  box-sizing: border-box;
}

html {
  font-family: 'Georama', sans-serif;
}

body {
  margin: 0;
}

.chat {
  padding : 20px;
  height: 100vh;
  
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messagee-container {
  flex: 1;
}

button {
  border: 0;
  background: #2a60ff;
  color: white;
  cursor: pointer;
  padding: 1rem;
}

input {
  border: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
}
</style>



