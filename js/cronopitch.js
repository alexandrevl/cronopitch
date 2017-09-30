var timer = null;
var countDownDate = null;
var minutesLeft = 0;
var isPaused = false;

var configDefault = {
    'title': 'Default',
    'fontColorInverted': '#FFFFFF',
    'bgColorInverted': '#000000',
    'fontColorDefault': '#000000',
    'bgColorDefault': '#FFFFFF',
    'fontColorAlert': '#FFFFFF',
    'bgColorAlert': '#FF0000',
    'secondsAlert': 10,
    'showMsgEnd': true,
    'continuous': false,
    'msgEnd': "Time's up",
    //'imgTimer': 'https://www.labbs.com.br/wp-content/uploads/2017/05/Ativo-1.png'
    //'imgTimer': 'http://static1.squarespace.com/static/5747177ee321402733fd16cd/t/57477e5f07eaa01bd1a504ac/1496683053127'
    'imgTimer': null,
    'presets': []
}
var config = null;
var isShowAdvanced = false;

function readDeviceOrientation() {
    if (Math.abs(window.orientation) >= 0) {
        if (Math.abs(window.orientation) === 90) {
            // Landscape
            if (timer != null) {
                $("#displayTimer").show();
                $("#controls").show();
                $("#turnScreen").hide();
            } else {
                $("#welcomeCard").show();
                $("#turnScreen").hide();
            }
        } else {
            // Portrait
            if (timer != null) {
                $("#displayTimer").hide();
                $("#controls").hide();
                $("#turnScreen").show();
            } else {
                $("#welcomeCard").hide();
                $("#turnScreen").show();
            }
        }
    }
}

$(function() {
    // if (window.innerWidth < window.innerHeight) {
    //     $(window).scrollTop(0);
    //     if (timer != null) {
    //         $("#displayTimer").hide();
    //         $("#controls").hide();
    //         $("#turnScreen").show();
    //     } else {
    //         $("#welcomeCard").hide();
    //         $("#turnScreen").show();
    //     }
    // }
    // window.addEventListener('orientationchange', function(event) {
    //     if (window.innerWidth < window.innerHeight) {
    //         $(window).scrollTop(0);
    //         if (timer != null) {
    //             $("#displayTimer").hide();
    //             $("#controls").hide();
    //             $("#turnScreen").show();
    //         } else {
    //             $("#welcomeCard").hide();
    //             $("#turnScreen").show();
    //         }
    //     } else {
    //         if (timer != null) {
    //             $("#displayTimer").show();
    //             $("#controls").show();
    //             $("#turnScreen").hide();
    //         } else {
    //             $("#welcomeCard").show();
    //             $("#turnScreen").hide();
    //         }
    //     }
    // }, false);
    //readDeviceOrientation();
    //window.onorientationchange = readDeviceOrientation;
    ratio = window.innerWidth / window.innerHeight;
    console.log(ratio);
    if (ratio > 1.90) {
        $('#controls').attr('style', 'position:fixed; bottom:2%; left: 50%;transform: translate(-50%, 0) ; opacity: 0.1');
    } else {
        $('#controls').attr('style', 'vertical-align: top; margin-top: 0%; padding-top: 0%; opacity: 0.1; text-align:center');
    }
    $(window).resize(function() {
        ratio = window.innerWidth / window.innerHeight;
        if ($('#controls').is(":visible")) {
            if (ratio > 1.90) {
                $('#controls').attr('style', 'position:fixed; bottom:2%; left: 50%;transform: translate(-50%, 0) ; opacity: 0.1');
            } else {
                $('#controls').attr('style', 'vertical-align: top; margin-top: 0%; padding-top: 0%; opacity: 0.1; text-align:center');
            }
        }
    });

    $("#controls").hover(function() {
        $(this).css({ opacity: 1 });
    }, function() {
        $(this).css({ opacity: 0.2 });
    });

    $(document).bind('touchmove', function(e) {
        e.preventDefault();
    });
    config = JSON.parse(JSON.stringify(configDefault));
    var configCookie = readCookie('config');
    if (configCookie != null) {
        config = JSON.parse(configCookie);
    }
    $("#fontColorDefault").val(config.fontColorDefault);
    $("#bgColorDefault").val(config.bgColorDefault);
    $("#msgEnd").val(config.msgEnd);
    $("#secondsAlert").val(config.secondsAlert);

    $("#controls").hide();
    $("#showImgTimer").hide();

    $("#saveAdvanced").click(function() {
        if ($("#fontColorDefault").val().length == 7) {
            config.fontColorDefault = $("#fontColorDefault").val();
            config.bgColorInverted = $("#fontColorDefault").val();
        }
        if ($("#bgColorDefault").val().length == 7) {
            config.bgColorDefault = $("#bgColorDefault").val();
            config.fontColorInverted = $("#bgColorDefault").val();
        }
        if ($("#continuous").is(':checked')) {
            config.continuous = true;
            config.showMsgEnd = false;
        } else {
            config.continuous = false;
        }
        if ($("#imgSet").val().length > 0 && $("#showImage").is(':checked')) {
            config.imgTimer = $("#imgSet").val();
        } else {
            config.imgTimer = null;
        }
        if ($("#msgEnd").val().length > 0 && $("#showMsgEnd").is(':checked')) {
            config.msgEnd = $("#msgEnd").val();
        } else {
            config.msgEnd = null;
        }
        if ($("#secondsAlert").val() > 0) {
            config.secondsAlert = $("#secondsAlert").val();
        } else {
            config.secondsAlert = null;
        }
        eraseCookie('config');
        createCookie('config', JSON.stringify(config), 30);
        isShowAdvanced = false;
        $('#config').modal('toggle');
        $(window).scrollTop(0);
    });
    $("#closeAdvanced").click(function() {
        $("#fontColorDefault").val(config.fontColorDefault);
        $("#bgColorDefault").val(config.bgColorDefault);
        $("#msgEnd").val(config.msgEnd);
        $("#secondsAlert").val(config.secondsAlert);
        $('#config').modal('toggle');
        isShowAdvanced = false;
        $(window).scrollTop(0);
    });
    $("#advanced").click(function() {
        isShowAdvanced = true;
        if (config.continuous == true) {
            $('#continuous').prop('checked', true);
        } else {
            $('#continuous').prop('checked', false);
            $("#showMsgEnd").prop('disabled', false);
        }
        if (config.showMsgEnd != true) {
            $('#showMsgEnd').prop('checked', false);
            $("#msgEndGroup").hide();
        } else {
            $('#showMsgEnd').prop('checked', true);
            $("#msgEndGroup").show();
        }
        if (config.imgTimer != null) {
            $('#showImage').prop('checked', true);
            $("#imgBox").show();
            $("#imgSet").val(config.imgTimer);
        } else {
            $('#showImage').prop('checked', false);
            $("#imgBox").hide();
            $("#imgSet").val('');
        }
        $("#fontColorDefault").minicolors({
            'value': { color: config.fontColorDefault, opacity: 1 }
        });
        $("#fontColorDefault").val(config.fontColorDefault);
        $("#bgColorDefault").val(config.bgColorDefault);
        $("#msgEnd").val(config.msgEnd);
        $("#secondsAlert").val(config.secondsAlert);
    });
    $("#resetConfig").click(function() {
        config = JSON.parse(JSON.stringify(configDefault));
        eraseCookie('config');
        createCookie('config', JSON.stringify(config), 30);
        $('#config').modal('toggle');
    });

    $("#showImage").click(function() {
        if ($("#showImage").is(':checked')) {
            $("#imgBox").show();
        } else {
            $("#imgBox").hide();
        }
    });
    $("#continuous").click(function() {
        if ($("#continuous").is(':checked')) {
            $('#showMsgEnd').attr('checked', false);
            $("#showMsgEnd").prop('disabled', true);
            $("#msgEndGroup").hide();
        } else {
            $("#showMsgEnd").prop('disabled', false);
            if ($("#showMsgEnd").is(':checked')) {
                $("#msgEndGroup").show();
            } else {
                $("#msgEndGroup").hide();
            }
        }
    });
    $("#showMsgEnd").click(function() {
        if ($("#showMsgEnd").is(':checked')) {
            config.showMsgEnd = true;
            $("#msgEndGroup").show();
        } else {
            config.showMsgEnd = false;
            $("#msgEndGroup").hide();
        }
    });
    $("#time").change(function() {
        if ($(this).val() == -1) {
            $('#custom').modal('toggle');
        }
    });
    $("#saveCustom").click(function() {
        var minutes = parseInt($("#customMinutes").val());
        switch (minutes) {
            case 1:
            case 3:
            case 5:
            case 10:
            case 15:
            case 20:
            case 30:
                break;
            default:
                $("#time").append(new Option($("#customMinutes").val() + ' minutes', minutes));
                break;
        }
        $('#time').val(minutes);
        $('#custom').modal('toggle');
    });
    $("#closeCustom").click(function() {
        $('#time').val("10");
        $('#custom').modal('toggle');
    });
    $("#undoTime").click(function() {
        var minutesLeft = readCookie('minutesLeft');
        if (minutesLeft != null) {
            resetTimer();
            prepareTimer(minutesLeft);
        }
    });
    $("#setTime").click(function() {
        prepareTimer(0);
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
    cookiesTimer();
    $(window).keydown(function(e) {
        switch (e.keyCode) {
            case 73:
                e.preventDefault();
                if (countDownDate != null) {
                    invertColors();
                }
                return;
            case 82:
                e.preventDefault();
                if (countDownDate != null) {
                    prepareTimer(0);
                }
                return;
            case 27:
                e.preventDefault();
                resetTimer();
                return;
            case 32:
                e.preventDefault();
                if (!isShowAdvanced) {
                    if (countDownDate == null) {
                        prepareTimer(0);
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
                }
                return;
        }
    });
    var colpick = $('.color').each(function() {
        $(this).minicolors({
            control: $(this).attr('data-control') || 'hue',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: 'uppercase',
            opacity: false,
            change: function(hex, opacity) {
                if (!hex) return;
                if (opacity) hex += ', ' + opacity;
                try {
                    //console.log(hex);
                } catch (e) {}
                $(this).select();
            },
            theme: 'bootstrap'
        });
    });

    var $inlinehex = $('#inlinecolorhex h3 small');
    $('#inlinecolors').minicolors({
        inline: true,
        theme: 'bootstrap',
        change: function(hex) {
            if (!hex) return;
            $inlinehex.html(hex);
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
        $("#undoTime").css("color", config.fontColorInverted);
        $("#invertColors").css("color", config.fontColorInverted);
        isInvertedColors = 1;
    } else {
        setColorDefault();
        isInvertedColors = 0;
    }
    eraseCookie('invertedColors');
    createCookie('invertedColors', isInvertedColors, 30);
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
        createCookie('timerPaused', true, 30);
        createCookie('timerPausedTime', distance, 30);
        eraseCookie('time');
        $("#play").show();
        $("#pause").hide();
        $(window).scrollTop(0);
    }
}
var isResumed = false;
var continuous = false;

function resumeTimer() {
    eraseCookie('timerPaused');
    clearInterval(blinkTimer);
    if (!continuous) {
        countDownDate = new Date().getTime() + distance;
    } else {
        countDownDate = new Date().getTime() - distance;
    }
    isResumed = true;
    isPaused = false;
    setTimeCookie(countDownDate);
    setTimer(countDownDate);
    $("#play").hide();
    $("#pause").show();
    $(window).scrollTop(0);
}

function cookiesTimer() {
    countDownDateCookie = readCookie('time');
    if (countDownDateCookie != null) {
        var now = new Date();
        if (countDownDateCookie > now.getTime() || config.continuous) {
            countDownDate = countDownDateCookie;
            setTimer(countDownDateCookie);
        }
        isPaused = readCookie('timerPaused');
        if (isPaused) {
            var timerPausedTimer = readCookie('timerPausedTime');
            setTimer(new Date().getTime() + parseInt(timerPausedTimer));
        }
        return true;
    }
    return false;
}

function prepareTimer(minutesLeft) {
    $("#invertColors").show();
    if (timer != null) {
        clearInterval(timer);
    }
    if ($("#time").find(":selected").val() > 0) {
        isPaused = false;
        if (minutesLeft == 0) {
            minutesLeft = $("#time").find(":selected").val();
        }
        //minutesLeft = 5/60;
        countDownDate = new Date().getTime() + (60000 * minutesLeft + 1000);
        //countDownDate = new Date().getTime() + (3000);
        createCookie('minutesLeft', minutesLeft, 30);
        createCookie('time', countDownDate, 30);
        setTimeCookie(countDownDate);
        setTimer(countDownDate);
    }
}

function resetTimer() {
    clearInterval(timer);
    clearInterval(blinkTimer);
    timer = null;
    eraseCookie('time');
    eraseCookie('timerPaused');
    eraseCookie('invertedColors');
    $("#invertColors").show();
    $("#controls").hide();
    $("#welcomeCard").show();
    $("#displayTimer").text("");
    $("#displayTimer").fadeIn(1);
    $("#displayTimer").html('');
    setColorDefault();
    $("#showImgTimer").hide();
    $("body").css("background-color", '#FFFFFF');
    countDownDate = null;
    hideFrontLayer();
}
var distance = 0;

function setColorDefault() {
    $("body").css("background-color", config.bgColorDefault);
    $("#displayTimer").css('color', config.fontColorDefault);
    $("#pause").css("color", config.fontColorDefault);
    $("#play").css("color", config.fontColorDefault);
    $("#resetTime").css("color", config.fontColorDefault);
    $("#undoTime").css("color", config.fontColorDefault);
    $("#invertColors").css("color", config.fontColorDefault);
}

function setTimer(countDownDate) {
    continuous = false;
    $("#displayTimer").css("fontSize", "35vw");
    setColorDefault();
    var invertedColors = parseInt(readCookie('invertedColors'));
    if (invertedColors == 1) {
        isInvertedColors = 0;
        invertColors();
    }

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
        $("#displayTimer").css("fontSize", "29vw");
        $('#showImgTimer').show();
        $('#imgTimer').attr('src', config.imgTimer);
    }

    timer = setInterval(function() {
        $(window).scrollTop(0);
        var now = new Date().getTime();
        distance = countDownDate - now;
        if (distance < 0 && config.continuous == true) {
            continuous = true;
        }
        if (continuous) {
            distance = now - countDownDate;
            //console.log(distance);
            if (distance >= 6000000) {
                resetTimer();
                return;
            }
        }
        //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = hours * 60 + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (!continuous) {
            $("#displayTimer").text(minutes + ":" + seconds);
            if (distance <= config.secondsAlert * 1000 + 900) {
                $("body").css("background-color", config.bgColorAlert);
                $("#displayTimer").css("color", config.fontColorAlert);
                $("#pause").css("color", config.fontColorAlert);
                $("#play").css("color", config.fontColorAlert);
                $("#resetTime").css("color", config.fontColorAlert);
                $("#undoTime").css("color", config.fontColorAlert);
                $("#invertColors").hide();
            }
        } else {
            setColorDefault();
            $("#invertColors").show();
            if (config.imgTimer == null) {
                $("#displayTimer").css("fontSize", "35vw");
            }
            $("#displayTimer").html('<i class="fa fa-plus" aria-hidden="true" style="font-size: 8vw; vertical-align: middle;"></i>' + minutes + ":" + seconds);
        }
        if (distance <= 0) {
            if (config.continuous == false) {
                clearInterval(timer);
                $("#displayTimer").text("0:00");
                countDownDate = null;
                timer = null;
                if (config.showMsgEnd) {
                    showFrontLayer();
                }
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
    createCookie('time', countDownDate, 30);
}

function showFrontLayer() {
    //animateRotate(-20);
    $("#frontlayer").text(config.msgEnd);
    $("#bg_mask").css({ visibility: "visible", opacity: 0.0 }).animate({ opacity: 1.0 }, 100);
    $("#frontlayer").css({ visibility: "visible", opacity: 0.0 }).animate({ opacity: 1.0 }, 100);
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