const button= document.querySelector('#button2');
const input2 =  document.querySelector('#input-data1');


const sendData = (event) => {
    event.preventDefault();
    const filterUrl =  input2.value.indexOf('&') != -1 ? input2.value.slice(0,input2.value.indexOf('&')) : input2.value; 
    const url = new URL(filterUrl).searchParams.get("v");
    fetch('/randomCommentView', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({urlname: url.toString()})
      })
      .then(function(res){
          console.log(res)
          if(res.ok) {
              window.location.replace("http://localhost:3000/getComment");
          }
       })
      .catch(function(error){ console.log(error)});
}

button.addEventListener('click', function(event){
    sendData(event);
});

input2.addEventListener('keypress', function (event) {
    
    var key =  event.charCode || event.keyCode;
    key == 13 ? sendData(event) : null;
 
});