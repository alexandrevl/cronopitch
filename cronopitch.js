   // Set the date we're counting down to
   //var countDownDate = new Date("Jun 3, 2017 15:37:25").getTime();
   var timer = null;
   var countDownDate = null;
   var fontSize = 450;
   var minutesLeft = 0;
   $(function() {
       $("#setTime").click(function() {
           if (timer != null) {
               clearInterval(timer);
           }
           minutesLeft = $("#time").find(":selected").val();
           countDownDate = new Date().getTime() + (60000 * minutesLeft);
           setTimeCookie(countDownDate);
           setTimer(countDownDate);
       });
       $("#resetTime").click(function() {
           if (timer != null) {
               clearInterval(timer);
           }
           countDownDate = new Date().getTime();
           setTimeCookie(countDownDate);
           $("#setTime").show();
           $("#time").show();
           $("#resetTime").hide();
           $("#demo").css("font-size", "100");
           $("#demo").text("Set your timer");
       });
       var countDownDateCookie = readCookie('cronopitch');
       if (countDownDateCookie != null) {
           var now = new Date();
           if (countDownDateCookie > now.getTime()) {
               setTimer(countDownDateCookie);
           }
       }
   });

   function setTimer(countDownDate) {
       $("#demo").text(minutesLeft + ":00");
       $("#demo").css("font-size", fontSize);
       $("#setTime").hide();
       $("#time").hide();
       $("#resetTime").show();
       // Update the count down every 1 second
       timer = setInterval(function() {

           // Get todays date and time
           var now = new Date().getTime();

           // Find the distance between now an the count down date
           var distance = countDownDate - now;

           // Time calculations for days, hours, minutes and seconds
           var days = Math.floor(distance / (1000 * 60 * 60 * 24));
           var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
           var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
           var seconds = Math.floor((distance % (1000 * 60)) / 1000);
           if (seconds < 10) {
               seconds = "0" + seconds;
           }

           // Display the result in the element with id="demo"
           // document.getElementById("demo").innerHTML = days + "d " + hours + "h " +
           //     minutes + "m " + seconds + "s ";
           if (hours > 0) {
               $("#demo").text(hours + ":" + minutes + ":" + seconds);
           } else {
               $("#demo").text(minutes + ":" + seconds);
           }

           // If the count down is finished, write some text 
           if (distance < 0) {
               clearInterval(timer);
               $("#demo").css("font-size", "200");
               document.getElementById("demo").innerHTML = "FINISHED";
           }
       }, 100);
   }

   function createCookie(name, value, days) {
       var expires = "";
       if (days) {
           var date = new Date();
           date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
           expires = "; expires=" + date.toUTCString();
       }
       document.cookie = name + "=" + value + expires + "; path=/";
   }

   function readCookie(name) {
       var nameEQ = name + "=";
       var ca = document.cookie.split(';');
       for (var i = 0; i < ca.length; i++) {
           var c = ca[i];
           while (c.charAt(0) == ' ') c = c.substring(1, c.length);
           if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
       }
       return null;
   }

   function eraseCookie(name) {
       createCookie(name, "", -1);
   }

   function setTimeCookie(minutes) {
       createCookie('cronopitch', minutes, 7);
   }