var app = (function app(){
    console.log("hello app JS front side");
    

var start = function(){
   
    var burger = document.getElementById("burger");
    console.log(burger);
    var navList = document.getElementById("nav_main");
    var ul = navList.querySelector("ul");
    console.log(ul);
    
    
    burger.addEventListener("click", function(){
        ul.classList.toggle("activefromburger"); 
    });
    }

window.addEventListener("DOMContentLoaded", start);
}());