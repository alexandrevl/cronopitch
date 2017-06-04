   // Set the date we're counting down to
   //var countDownDate = new Date("Jun 3, 2017 15:37:25").getTime();
   var timer = null;
   var countDownDate = null;
   var fontSizeTimer = "30vw";
   var fontSizeInfo = "10vw";
   var minutesLeft = 0;
   $(function() {
       $("#resetTime").hide();
       $("#setTime").click(function() {
           prepareTimer();
       });
       $("#resetTime").click(function() {
           resetTimer();
       });
       countDownDateCookie = readCookie('time');
       if (countDownDateCookie != null) {
           var now = new Date();
           if (countDownDateCookie > now.getTime()) {
               countDownDate = countDownDateCookie;
               setTimer(countDownDateCookie);
           }
       }
       $(window).keydown(function(e) {
           switch (e.keyCode) {
               case 27:
                   if (timer != null) {
                       resetTimer();
                   }
                   return;
               case 32:
                   if (countDownDate == null) {
                       prepareTimer();
                   } else {
                       if (timer == null) {
                           resumeTimer();
                       } else {
                           pauseTimer();
                       }
                   }
                   return;
           }
       });
   });
   var blinkTimer = null;

   function pauseTimer() {
       if (timer != null) {
           clearInterval(timer);
           timer = null;
           blinkTimer = setInterval(function() {
               $("#displayTimer").fadeOut(500, function() {
                   $(this).fadeIn(500);
                   setTimeCookie(new Date().getTime() + distance + 1000);
               });
           }, 500);
           createCookie('timerPaused', true, 7);
       }
   }
   var isResumed = false;

   function resumeTimer() {
       eraseCookie('timerPaused');
       clearInterval(blinkTimer);
       var countDownDate = new Date().getTime() + distance;
       isResumed = true;
       setTimeCookie(countDownDate);
       setTimer(countDownDate);
   }

   function prepareTimer() {
       if (timer != null) {
           clearInterval(timer);
       }
       minutesLeft = $("#time").find(":selected").val();
       countDownDate = new Date().getTime() + (60000 * minutesLeft + 1000);
       //countDownDate = new Date().getTime() + (15000);
       setTimeCookie(countDownDate);
       setTimer(countDownDate);
   }

   function resetTimer() {
       if (timer != null) {
           clearInterval(timer);
           clearInterval(blinkTimer);
           timer = null;
           eraseCookie('time');
           eraseCookie('timerPaused');
           $("body").css("background-color", "#FFFFFF");
           $("#setTime").show();
           $("#time").show();
           $("#advanced").show();
           $("#resetTime").hide();
           $("#displayTimer").css("font-size", fontSizeInfo);
           $("#displayTimer").text("Set your timer");
           countDownDate = null;
       }
   }
   var distance = 0;

   function setTimer(countDownDate) {
       //console.log('Teste entrada');
       $("#advanced").hide();
       $("#setTime").hide();
       $("#time").hide();
       if (!isResumed) {
           $("#displayTimer").text(minutesLeft + ":00");
       } else {
           isResumed = false;
       }
       $("#displayTimer").css("font-size", fontSizeTimer);
       $("#resetTime").show();
       // Update the count down every 1 second
       timer = setInterval(function() {

           // Get todays date and time
           var now = new Date().getTime();

           // Find the distance between now an the count down date
           distance = countDownDate - now;

           // Time calculations for days, hours, minutes and seconds
           var days = Math.floor(distance / (1000 * 60 * 60 * 24));
           var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
           var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
           var seconds = Math.floor((distance % (1000 * 60)) / 1000);
           if (seconds < 10) {
               seconds = "0" + seconds;
           }

           // Display the result in the element with id="displayTimer"
           if (hours > 0) {
               $("#displayTimer").text(hours + ":" + minutes + ":" + seconds);
           } else {
               $("#displayTimer").text(minutes + ":" + seconds);
               if (minutes == 0 && seconds <= 10) {
                   $("body").css("background-color", "#FF0000");
                   $("#displayTimer").css("color", "#FFFFFF");
               }
           }


           // If the count down is finished, write some text 
           if (distance < 0) {
               clearInterval(timer);
               $("#displayTimer").css({ 'color': '#000000', 'font-size': fontSizeInfo });
               $("body").css("background-color", "#FFFFFF");
               document.getElementById("displayTimer").innerHTML = "FINISHED";
           }
           var isPaused = readCookie('timerPaused');
           if (isPaused) {
               pauseTimer();
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
       //console.log(name + "=" + value + expires + "; path=/");
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

   function setTimeCookie(countDownDate) {
       createCookie('time', countDownDate, 7);
   }