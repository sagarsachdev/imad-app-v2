// counter code
/* var button = document.getElementById('counter');
button.onclick = function(){
    
    //Create a request
    var request = new XMLHttpRequest();
    
    // Capture the response and store it in the variable
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            //Take some action
            if(request.status === 200)
            {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }    
        //Not done yet 
    };
    
    //Make the request
    request.open('GET','http://sagarsachdev.imad.hasura-app.io/counter',true);
    request.send(null);
};
*/
// submit username/password to login
var submit = document.getElementById('submit_btn'); 
submit.onclick = function(){
   //Create a request
    var request = new XMLHttpRequest();
    
    // Capture the response and store it in the variable
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            //Take some action
            if(request.status === 200)
            {
                 //Capture a list of names and render it as a list
               /*   var names = request.responseText;
                  names = JSON.parse(names);
                  var list = '';
                  for(var i=0;i<names.length;i++)
                  {
                      list += '<li>'+names[i]+'</li>';
                  }
                  var ul = document.getElementById('namelist');
                  ul.innerHTML = list;  */
                  
                  console.log("user logged in");
                  alert("Logged in successfully!");
            }else if(request.status === 403){
                alert("Username/password is incorrect!");
            }else if(request.status === 500){
                alert("Sorry, Something went wrong on thw server!");
            }
        }    
        //Not done yet 
    };
//    var nameInput = document.getElementById('name');
//    var name = nameInput.value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    //Make the request
    //request.open('GET','http://sagarsachdev.imad.hasura-app.io/submit-name?name=' + name,true);
    //request.send(null);
    request.open('POST','http://sagarsachdev.imad.hasura-app.io/login',true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username:username, password:password}));
    
};