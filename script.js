$(document).ready(function(){
  active();
    $('a.read_more').click(function(event){
        if($(this).text() == 'Read More >>'){
          $(this).text('Read Less <<');
        }
        else{
          $(this).text('Read More >>');
        }
        event.preventDefault();
        $(this).siblings('#more_text').toggle();
    });

    function active(){
      var act=$('#active');
      act.css({"text-decoration": "none",
                  "color": "black",
                  "background-color": "white",
                  "font-size": "20px",
                  "border-radius": "30px 0px 0px 30px"
                });
        act.children('img').css('display','block');
        act.parent().next().find('a').addClass("curve-up");
        act.parent().prev().find('a').addClass("curve-down");
    }
}); 

var firebaseConfig = {
  apiKey: "AIzaSyCQAZ7Uv700pNZZ6Qtdb0QRo1Vbo7l3l3Q",
  authDomain: "sac-web-74cbd.firebaseapp.com",
  databaseURL: "https://sac-web-74cbd.firebaseio.com",
  projectId: "sac-web-74cbd",
  storageBucket: "sac-web-74cbd.appspot.com",
  messagingSenderId: "462323702115",
  appId: "1:462323702115:web:f9761999288b9d72cedb56",
  measurementId: "G-Q5JW7TTHM4"
};

//user signin
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  } else { 
  }
});

function loginInUser(){
  var email=$('#inputEmail').val();
  var password=$('#inputPassword').val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  });
}


//To access the data from the firebase database
var feeds = firebase.database().ref().child('feeds');
var id=1;
var sec_content=[];
feeds.on('child_added', snap=>{
  sec_content[id]=snap.child('sec_content').val();
  $('.feeds').prepend('<div class="jumbotron feed" style="padding: 10px 5px">\
  <div class="icon" id="icon'+id+'"></div>\
  <div class="title">'+ snap.child('title').val() +'</div>\
  <div class="info"><span style="margin: 1px 18px">'+ snap.child("date").val() +'</span><span style="margin: 1px 18px">'+ snap.child('aut_name').val() +'</span><span style="margin: 1px 18px">'+ snap.child('tags').val() +'</span></div><br>\
    <div class="content">\
    <p style="font-size: 15px;margin-bottom: 0px;padding: 0px 15px;text-aling:justify">'+ snap.child('first_content').val() +'<span id="sec_content'+id+'"></span>\
      <span  id="read_more'+id+'">\
        <a href="#" style="font-size: 14px;color: #4033FF;" onclick="showSecContent('+id+')">Read More >></a>\
        </span>\
    </p>\
  </div>\
  </div>');
  getImage(id);
  id++;
});
function getImage(id){
  firebase.storage().ref().child('feed'+id+'.jpg').getDownloadURL().then(function(url){
    console.log(id);
    $('#icon'+(id)).css('background-image',"url('"+url+"')");
  });  
}
function showSecContent(contID){
  console.log(contID);
  document.getElementById('sec_content'+contID).textContent=sec_content[contID];
  document.getElementById('read_more'+contID).innerHTML='<a href="#" style="font-size: 14px;color: #4033FF;" onclick="hideSecContent('+contID+')">Read less <<</a>\ ';

}
function hideSecContent(contID){
  console.log(contID);
  document.getElementById('sec_content'+contID).textContent="";
  document.getElementById('read_more'+contID).innerHTML='<a href="#" style="font-size: 14px;color: #4033FF;" onclick="showSecContent('+contID+')">Read more >></a>\ ';
}

function addBlog(){
  var aut_name=document.getElementById('aut_name').value;
  var title=document.getElementById('new_title').value;
  var content=document.getElementById('new_content').value;
  var tags=document.getElementById('new_tags').value;
  var picture=document.getElementById('new_icon').files[0];
    var iconRef = firebase.storage().ref('feed'+id+'.jpg');
    var uploadTask = iconRef.put(picture);
  var postData = {
    aut_name: aut_name,
    title: title,
    first_content: content.substring(0,200),
    sec_content: content.substring(200),
    title: title,
    tags: tags,
    date: Date().substring(4,15),
  };
  var updates = {};
  updates['/feeds/feed'+id] = postData;
  return firebase.database().ref().update(updates);
  document.getElementById('aut_name').value =" ";
  document.getElementById('new_title').value =" ";
  document.getElementById('new_content').value =" ";
  document.getElementById('new_tags').value =" ";
  document.getElementById('new_icon').files[0] =" ";
}


