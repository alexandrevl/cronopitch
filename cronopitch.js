var timer = null;
var countDownDate = null;
var minutesLeft = 0;
var isPaused = false;

var config = {
    'fontColorInverted': '#FFFFFF',
    'bgColorInverted': '#000000',
    'fontColorDefault': '#000000',
    'bgColorDefault': '#FFFFFF',
    'fontColorAlert': '#FFFFFF',
    'bgColorAlert': '#FF0000',
    'secondsAlert': 10,
    'showMsgEnd': true,
    //'imgTimer': 'https://www.labbs.com.br/wp-content/uploads/2017/05/Ativo-1.png'
    //'imgTimer': 'http://static1.squarespace.com/static/5747177ee321402733fd16cd/t/57477e5f07eaa01bd1a504ac/1496683053127'
    'imgTimer': null
}

$(function() {
    $("#fontColorDefault").val(config.fontColorDefault.replace('#', ''));
    $("#bgColorDefault").val(config.bgColorDefault.replace('#', ''));

    $("#controls").hide();
    $("#showImgTimer").hide();

    $("#saveAdvanced").click(function() {
        if ($("#fontColorDefault").val().length == 6) {
            config.fontColorDefault = '#' + $("#fontColorDefault").val();
            config.bgColorInverted = '#' + $("#fontColorDefault").val();
        }
        if ($("#bgColorDefault").val().length == 6) {
            config.bgColorDefault = '#' + $("#bgColorDefault").val();
            config.fontColorInverted = '#' + $("#bgColorDefault").val();
        }
        if ($("#imgSet").val().length > 0 && $("#showImage").is(':checked')) {
            config.imgTimer = $("#imgSet").val();
        } else {
            config.imgTimer = null;
        }
        $('#config').modal('toggle');
    });

    $("#showImage").click(function() {
        if ($("#showImage").is(':checked')) {
            $("#imgBox").show();
        } else {
            $("#imgBox").hide();
        }
    });

    $("#setTime").click(function() {
        prepareTimer();
    });
    $("#resetTime").click(function() {
        resetTimer();
    });
    $("#play").click(function() {
        resumeTimer();
    });
    $("#pause").click(function() {
        pauseTimer();
    });
    $("#invertColors").click(function() {
        invertColors();
    });
    $("#bg_mask").click(function() {
        resetTimer();
    });
    $("#displayTimer").click(function() {
        if (countDownDate != null) {
            if (timer == null) {
                resumeTimer();
            } else {
                pauseTimer();
            }
        }
    });

    countDownDateCookie = readCookie('time');
    if (countDownDateCookie != null) {
        var now = new Date();
        if (countDownDateCookie > now.getTime()) {
            countDownDate = countDownDateCookie;
            setTimer(countDownDateCookie);
        }
    }
    isPaused = readCookie('timerPaused');
    if (isPaused) {
        var timerPausedTimer = readCookie('timerPausedTime');
        setTimer(new Date().getTime() + parseInt(timerPausedTimer));
    }
    $(window).keydown(function(e) {
        switch (e.keyCode) {
            case 27:
                resetTimer();
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
                if (countDownDate == null && timer == null) {
                    resetTimer();
                }
                return;
        }
    });
});

var blinkTimer = null;
var isInvertedColors = 0;

function invertColors() {
    if (isInvertedColors == 0) {
        $("body").css("background-color", config.bgColorInverted);
        $("#displayTimer").css('color', config.fontColorInverted);
        $("#pause").css("color", config.fontColorInverted);
        $("#play").css("color", config.fontColorInverted);
        $("#resetTime").css("color", config.fontColorInverted);
        $("#invertColors").css("color", config.fontColorInverted);
        isInvertedColors = 1;
    } else {
        $("body").css("background-color", config.bgColorDefault);
        $("#displayTimer").css('color', config.fontColorDefault);
        $("#pause").css("color", config.fontColorDefault);
        $("#play").css("color", config.fontColorDefault);
        $("#resetTime").css("color", config.fontColorDefault);
        $("#invertColors").css("color", config.fontColorDefault);
        isInvertedColors = 0;
    }
    eraseCookie('invertedColors');
    createCookie('invertedColors', isInvertedColors, 7);
}

function pauseTimer() {
    if (timer != null) {
        clearInterval(timer);
        timer = null;
        blinkTimer = setInterval(function() {
            $("#displayTimer").fadeOut(500, function() {
                $(this).fadeIn(500);
            });
        }, 500);
        createCookie('timerPaused', true, 7);
        createCookie('timerPausedTime', distance, 7);
        eraseCookie('time');
        $("#play").show();
        $("#pause").hide();
    }
}
var isResumed = false;

function resumeTimer() {
    eraseCookie('timerPaused');
    clearInterval(blinkTimer);
    countDownDate = new Date().getTime() + distance;
    isResumed = true;
    isPaused = false;
    setTimeCookie(countDownDate);
    setTimer(countDownDate);
    $("#play").hide();
    $("#pause").show();
}

function prepareTimer() {
    if (timer != null) {
        clearInterval(timer);
    }
    isPaused = false;
    minutesLeft = $("#time").find(":selected").val();
    countDownDate = new Date().getTime() + (60000 * minutesLeft + 1000);
    //countDownDate = new Date().getTime() + (15000);
    setTimeCookie(countDownDate);
    setTimer(countDownDate);
}

function resetTimer() {
    clearInterval(timer);
    clearInterval(blinkTimer);
    timer = null;
    eraseCookie('time');
    eraseCookie('timerPaused');
    //eraseCookie('invertedColors');
    $("body").css("background-color", '#FFFFFF');
    $("#controls").hide();
    $("#welcomeCard").show();
    $("#displayTimer").text("");
    $("#displayTimer").fadeIn(1);
    $("#displayTimer").css('color', config.fontColorDefault);
    $("#pause").css("color", config.fontColorDefault);
    $("#play").css("color", config.fontColorDefault);
    $("#resetTime").css("color", config.fontColorDefault);
    $("#invertColors").css("color", config.fontColorDefault);
    $("#showImgTimer").hide();
    $("#displayTimer").css("fontSize", "30vw");
    countDownDate = null;
    hideFrontLayer();
}
var distance = 0;

function setTimer(countDownDate) {
    $("body").css("background-color", config.bgColorDefault);
    $("#displayTimer").css('color', config.fontColorDefault);
    $("#pause").css("color", config.fontColorDefault);
    $("#play").css("color", config.fontColorDefault);
    $("#resetTime").css("color", config.fontColorDefault);
    $("#invertColors").css("color", config.fontColorDefault);
    var invertedColors = parseInt(readCookie('invertedColors'));
    if (invertedColors == 1) {
        isInvertedColors = 0;
        invertColors();
    }
    //console.log('Teste entrada');
    this.countDownDate = countDownDate;
    if (!isResumed) {
        $("#displayTimer").text(minutesLeft + ":00");
    } else {
        isResumed = false;
    }
    $("#controls").show();
    $("#play").hide();
    $("#pause").show();
    $("#welcomeCard").hide();
    if (config.imgTimer != null) {
        $("#displayTimer").css("fontSize", "25vw");
        $('#showImgTimer').show();
        $('#imgTimer').attr('src', config.imgTimer);
    }

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
            if (distance <= config.secondsAlert * 1000 + 900) {
                // var color = "#FF0000";
                // if (seconds % 2 == 0) {
                //     color = "#FF0000";
                // }
                //console.log(color);
                $("body").css("background-color", config.bgColorAlert);
                $("#displayTimer").css("color", config.fontColorAlert);
                $("#pause").css("color", config.fontColorAlert);
                $("#play").css("color", config.fontColorAlert);
                $("#resetTime").css("color", config.fontColorAlert);
                $("#invertColors").hide();
            }
        }


        // If the count down is finished, write some text 
        if (distance < 0) {
            clearInterval(timer);
            $("#displayTimer").text("0:00");
            countDownDate = null;
            timer = null;
            if (config.showMsgEnd) {
                showFrontLayer();
            }
        }
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

function showFrontLayer() {
    //animateRotate(-20);
    $("#bg_mask").css({ visibility: "visible", opacity: 0.0 }).animate({ opacity: 1.0 }, 1000);
    $("#frontlayer").css({ visibility: "visible", opacity: 0.0 }).animate({ opacity: 1.0 }, 1000);
}

function hideFrontLayer() {
    document.getElementById('bg_mask').style.visibility = 'hidden';
    document.getElementById('frontlayer').style.visibility = 'hidden';
}

function animateRotate(angle) {
    // caching the object for performance reasons
    var $elem = $('#bg_mask');

    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({ deg: 0 }).animate({ deg: angle }, {
        duration: 1,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}