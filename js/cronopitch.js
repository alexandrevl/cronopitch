var timer = null;
var countDownDate = null;
var minutesLeft = 0;
var isPaused = false;
var isWriteFB = true;

var idFirebase = Math.floor(Math.random() * (999999 - 0) + 0);
var idClient = Math.floor(Math.random() * (999999999 - 0) + 0);
var distance = 0;
var configDefault = {
  title: "Default",
  fontColorInverted: "#FFFFFF",
  bgColorInverted: "#000000",
  fontColorDefault: "#000000",
  bgColorDefault: "#FFFFFF",
  fontColorAlert: "#FFFFFF",
  bgColorAlert: "#FF0000",
  secondsAlert: 10,
  showMsgEnd: true,
  continuous: false,
  msgEnd: "Time's up",
  //'imgTimer': 'https://www.labbs.com.br/wp-content/uploads/2017/05/Ativo-1.png'
  //'imgTimer': 'http://static1.squarespace.com/static/5747177ee321402733fd16cd/t/57477e5f07eaa01bd1a504ac/1496683053127'
  imgTimer: null,
  idFirebase: idFirebase,
  idClient: idClient,
  presets: [],
};
var playConfigDefault = {
  invertedColors: false,
  minutesLeft: 10,
  time: 0,
  timerPaused: false,
  timerPausedTime: 0,
};
var playConfig = null;
var config = null;
var isShowAdvanced = false;

var dateDiffFb = 0;

// Initialize Firebase
var configFirebase = {
  apiKey: "AIzaSyDKB9w_qIKETeT1Igv3pIAUTSZfq3axo4U",
  authDomain: "punisher-2eafa.firebaseapp.com",
  databaseURL: "https://punisher-2eafa.firebaseio.com",
  projectId: "punisher-2eafa",
  storageBucket: "punisher-2eafa.appspot.com",
  messagingSenderId: "693554201973",
};
firebase.initializeApp(configFirebase);
var database = firebase.database();

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

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value.replace("#", "");
    }
  );
  return vars;
}

$(function () {
  ratio = window.innerWidth / window.innerHeight;
  if (ratio > 1.9) {
    $("#controls").attr(
      "style",
      "position:fixed; bottom:2%; left: 50%;transform: translate(-50%, 0) ; opacity: 0.1"
    );
  } else {
    $("#controls").attr(
      "style",
      "vertical-align: top; margin-top: 0%; padding-top: 0%; opacity: 0.1; text-align:center"
    );
  }
  $(window).resize(function () {
    ratio = window.innerWidth / window.innerHeight;
    if ($("#controls").is(":visible")) {
      if (ratio > 1.9) {
        $("#controls").attr(
          "style",
          "position:fixed; bottom:2%; left: 50%;transform: translate(-50%, 0) ; opacity: 0.1"
        );
      } else {
        $("#controls").attr(
          "style",
          "vertical-align: top; margin-top: 0%; padding-top: 0%; opacity: 0.1; text-align:center"
        );
      }
    }
  });
  $("#ocrAlert").hide();

  $("#controls").hover(
    function () {
      $(this).css({ opacity: 1 });
    },
    function () {
      $(this).css({ opacity: 0.2 });
    }
  );

  $(document).bind("touchmove", function (e) {
    e.preventDefault();
  });

  var isRefresh = null;
  var idFirebaseRemote = getUrlVars()["id"];
  isRefresh = getUrlVars()["refresh"];
  //console.log(idFirebaseRemote);

  playConfig = playConfigDefault;
  var playConfigCookie = readCookie("playConfig");
  if (playConfigCookie != null) {
    try {
      playConfig = JSON.parse(playConfigCookie);
    } catch (error) {
      createCookie("playConfig", JSON.stringify(playConfig), 30);
    }
  }

  config = JSON.parse(JSON.stringify(configDefault));
  var configCookie = readCookie("config");
  if (configCookie != null) {
    config = JSON.parse(configCookie);
    if (
      config.idFirebase != "" &&
      config.idFirebase != 0 &&
      config.idFirebase != null &&
      config.idFirebase != undefined
    ) {
      idFirebase = config.idFirebase;
    }
    //idClient = config.idClient;
  }
  if (
    idFirebaseRemote != null &&
    idFirebaseRemote != "" &&
    idFirebaseRemote != 0 &&
    idFirebaseRemote != undefined
  ) {
    config.idFirebase = idFirebaseRemote;
    configDefault.idFirebase = idFirebaseRemote;
    idFirebase = config.idFirebase;
    //console.log(isRefresh);
    if (isRefresh == undefined) {
      $("#ocrAlert").text("Connected to: " + idFirebase);
      $("#ocrAlert").show();
    }
    //console.log(config);
  } else {
    createCookie("config", JSON.stringify(config), 30);
    createCookie("playConfig", JSON.stringify(playConfig), 30);
  }
  var noSleep = new NoSleep();

  var refFirebase = database.ref("cronopitch/" + idFirebase);
  refFirebase.on("value", (data) => {
    database.ref("/.info/serverTimeOffset").on("value", function (offset) {
      var offsetVal = offset.val() || 0;
      var serverTime = Date.now() + offsetVal;
      dateDiffFb = serverTime - Date.now();
      //console.log(serverTime, dateDiffFb, Date.now(), (Date.now()));
    });
    $("#idFirebase").html("" + idFirebase);
    qrcode.makeCode("https://cronopitch.com/?id=" + idFirebase);
    var lastIdClient = data.val().idClient;
    //console.log(idClient, lastIdClient);
    if (lastIdClient != idClient) {
      isWriteFB = false;
      config = data.val().config;
      resetTimer();
      createCookie("config", JSON.stringify(config), 30);
      playConfig = data.val().playConfig;
      //console.log(data.val());
      createCookie("playConfig", JSON.stringify(playConfig), 30);
      var isCookieTimer = true;
      if (isCookieTimer) {
        var isTicking = cookiesTimer().then((isWriteFB = true));
        //console.log("isTicking ", isTicking);
      } else {
        isWriteFB = true;
      }
    }
  });
  //var refConfig = database.ref('cronopitch/' + idFirebase + '/config');
  //refConfig.set(config);

  $("#fontColorDefault").val(config.fontColorDefault);
  $("#bgColorDefault").val(config.bgColorDefault);
  $("#msgEnd").val(config.msgEnd);
  $("#secondsAlert").val(config.secondsAlert);

  $("#controls").hide();
  $("#showImgTimer").hide();

  $("#saveAdvanced").click(function () {
    if ($("#fontColorDefault").val().length == 7) {
      config.fontColorDefault = $("#fontColorDefault").val();
      config.bgColorInverted = $("#fontColorDefault").val();
    }
    if ($("#bgColorDefault").val().length == 7) {
      config.bgColorDefault = $("#bgColorDefault").val();
      config.fontColorInverted = $("#bgColorDefault").val();
    }
    if ($("#continuous").is(":checked")) {
      config.continuous = true;
      config.showMsgEnd = false;
    } else {
      config.continuous = false;
    }
    if ($("#imgSet").val().length > 0 && $("#showImage").is(":checked")) {
      config.imgTimer = $("#imgSet").val();
    } else {
      config.imgTimer = null;
    }
    if ($("#msgEnd").val().length > 0 && $("#showMsgEnd").is(":checked")) {
      config.msgEnd = $("#msgEnd").val();
    } else {
      config.msgEnd = null;
    }
    if ($("#secondsAlert").val() > 0) {
      config.secondsAlert = $("#secondsAlert").val();
    } else {
      config.secondsAlert = null;
    }
    createCookie("config", JSON.stringify(config), 30);
    isShowAdvanced = false;
    $("#config").modal("toggle");
    $(window).scrollTop(0);
  });
  $("#closeAdvanced").click(function () {
    $("#fontColorDefault").val(config.fontColorDefault);
    $("#bgColorDefault").val(config.bgColorDefault);
    $("#msgEnd").val(config.msgEnd);
    $("#secondsAlert").val(config.secondsAlert);
    $("#config").modal("toggle");
    isShowAdvanced = false;
    $(window).scrollTop(0);
  });
  $("#advanced").click(function () {
    isShowAdvanced = true;
    if (config.continuous == true) {
      $("#continuous").prop("checked", true);
    } else {
      $("#continuous").prop("checked", false);
      $("#showMsgEnd").prop("disabled", false);
    }
    if (config.showMsgEnd != true) {
      $("#showMsgEnd").prop("checked", false);
      $("#msgEndGroup").hide();
    } else {
      $("#showMsgEnd").prop("checked", true);
      $("#msgEndGroup").show();
    }
    if (config.imgTimer != null) {
      $("#showImage").prop("checked", true);
      $("#imgBox").show();
      $("#imgSet").val(config.imgTimer);
    } else {
      $("#showImage").prop("checked", false);
      $("#imgBox").hide();
      $("#imgSet").val("");
    }
    $("#fontColorDefault").minicolors({
      value: { color: config.fontColorDefault, opacity: 1 },
    });
    $("#fontColorDefault").val(config.fontColorDefault);
    $("#bgColorDefault").val(config.bgColorDefault);
    $("#msgEnd").val(config.msgEnd);
    $("#secondsAlert").val(config.secondsAlert);
  });
  $("#resetConfig").click(function () {
    config = JSON.parse(JSON.stringify(configDefault));
    config.idFirebase = idFirebase;
    createCookie("config", JSON.stringify(config), 30);
    $("#config").modal("toggle");
  });

  $("#showImage").click(function () {
    if ($("#showImage").is(":checked")) {
      $("#imgBox").show();
    } else {
      $("#imgBox").hide();
    }
  });
  $("#continuous").click(function () {
    if ($("#continuous").is(":checked")) {
      $("#showMsgEnd").attr("checked", false);
      $("#showMsgEnd").prop("disabled", true);
      $("#msgEndGroup").hide();
    } else {
      $("#showMsgEnd").prop("disabled", false);
      if ($("#showMsgEnd").is(":checked")) {
        $("#msgEndGroup").show();
      } else {
        $("#msgEndGroup").hide();
      }
    }
  });
  $("#connectOCR").click(function () {
    var value = $("#ocrCode").val();
    if (value.length > 0) {
      window.open("https://cronopitch.com/?id=" + $("#ocrCode").val(), "_self");
    }
  });
  $("#refreshCode").click(function () {
    window.open(
      "https://cronopitch.com/?id=" +
        Math.floor(Math.random() * (999999 - 0) + 0) +
        "&refresh=1",
      "_self"
    );
  });
  $("#showMsgEnd").click(function () {
    if ($("#showMsgEnd").is(":checked")) {
      config.showMsgEnd = true;
      $("#msgEndGroup").show();
    } else {
      config.showMsgEnd = false;
      $("#msgEndGroup").hide();
    }
  });
  $("#time").change(function () {
    if ($(this).val() == -1) {
      $("#custom").modal("toggle");
    }
  });
  $("#customMinutes").keyup(function () {
    var minutes = parseInt($(this).val());
    //console.log(minutes);
    if (minutes != 0) {
      if ($(this).val().length == 0) {
        $("#saveCustom").attr("disabled", true);
      } else {
        $("#saveCustom").removeAttr("disabled");
      }
    }
  });
  $("#custom").on("shown.bs.modal", function () {
    $("#customMinutes").focus();
  });
  $("#saveCustom").click(function () {
    resetTimer();
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
        $("#time").append(
          new Option($("#customMinutes").val() + " minutes", minutes)
        );
        break;
    }
    $("#time").val(minutes);
    $("#custom").modal("toggle");
    prepareTimer(0);
  });
  $("#closeCustom").click(function () {
    $("#time").val("10");
    $("#custom").modal("toggle");
  });

  $("#undoTime").click(function () {
    var minutesLeft = playConfig.minutesLeft;
    if (minutesLeft != null) {
      resetTimer();
      prepareTimer(minutesLeft);
    }
  });
  $("#setTime").click(function () {
    prepareTimer(0);
  });
  $("#resetTime").click(function () {
    resetTimer();
  });
  document.addEventListener(
    "play",
    function enableNoSleep() {
      document.removeEventListener("play", enableNoSleep, false);
      noSleep.enable();
    },
    false
  );
  $("#play").click(function () {
    resumeTimer();
  });
  $("#pause").click(function () {
    pauseTimer();
  });
  $("#invertColors").click(function () {
    invertColors();
  });
  $("#bg_mask").click(function () {
    resetTimer();
  });
  $("#displayTimer").click(function () {
    if (countDownDate != null) {
      if (timer == null) {
        resumeTimer();
      } else {
        pauseTimer();
      }
    }
  });
  cookiesTimer();
  $(window).keydown(function (e) {
    switch (e.keyCode) {
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        if (!isShowAdvanced && !$("#ocrCode").is(":focus")) {
          if (!$("#custom").is(":visible")) {
            $("#custom").modal("toggle");
            $("#customMinutes").val(String.fromCharCode(e.keyCode));
            $("#customMinutes").focus();
            if ($("#customMinutes").val().length == 0) {
              $("#saveCustom").attr("disabled", true);
            } else {
              $("#saveCustom").removeAttr("disabled");
            }

            //console.log(e.keyCode);
          }
        }
        return;
      case 13:
        if ($("#custom").is(":visible")) {
          resetTimer();
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
              $("#time").append(
                new Option($("#customMinutes").val() + " minutes", minutes)
              );
              break;
          }
          $("#time").val(minutes);
          $("#custom").modal("toggle");
          prepareTimer(0);
        }
        return;
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
        if (!$("#custom").is(":visible")) {
          resetTimer();
        }
        return;
      case 32:
        e.preventDefault();
        if (!isShowAdvanced && !$("#custom").is(":visible")) {
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
  var colpick = $(".color").each(function () {
    $(this).minicolors({
      control: $(this).attr("data-control") || "hue",
      inline: $(this).attr("data-inline") === "true",
      letterCase: "uppercase",
      opacity: false,
      change: function (hex, opacity) {
        if (!hex) return;
        if (opacity) hex += ", " + opacity;
        try {
          //console.log(hex);
        } catch (e) {}
        $(this).select();
      },
      theme: "bootstrap",
    });
  });

  var $inlinehex = $("#inlinecolorhex h3 small");
  $("#inlinecolors").minicolors({
    inline: true,
    theme: "bootstrap",
    change: function (hex) {
      if (!hex) return;
      $inlinehex.html(hex);
    },
  });
});

var blinkTimer = null;
var isInvertedColors = 0;

function invertColors() {
  getTime();
  if (isInvertedColors == 0) {
    $("body").css("background-color", config.bgColorInverted);
    $("#displayTimer").css("color", config.fontColorInverted);
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
  playConfig.invertedColors = isInvertedColors;
  createCookie("playConfig", JSON.stringify(playConfig), 30);
}

function pauseTimer() {
  getTime();
  if (timer != null) {
    var now = Date.now() + dateDiffFb;
    //console.log(countDownDate);
    distance = countDownDate - now;
    clearInterval(timer);
    timer = null;
    showTimer();
    blinkTimer = setInterval(function () {
      $("#displayTimer").fadeOut(500, function () {
        $(this).fadeIn(500);
      });
    }, 500);
    playConfig.timerPaused = true;
    playConfig.timerPausedTime = distance;
    createCookie("playConfig", JSON.stringify(playConfig), 30);
    $("#play").show();
    $("#pause").hide();
    $(window).scrollTop(0);
  }
}
var isResumed = false;
var continuous = false;

function resumeTimer() {
  getTime();
  clearInterval(blinkTimer);
  if (!continuous) {
    countDownDate = Date.now() + dateDiffFb + distance;
  } else {
    countDownDate = Date.now() + dateDiffFb - distance;
  }
  isResumed = true;
  isPaused = false;
  playConfig.timerPaused = false;
  playConfig.time = countDownDate;
  createCookie("playConfig", JSON.stringify(playConfig), 30);
  setTimer(countDownDate);
  $("#play").hide();
  $("#pause").show();
  $(window).scrollTop(0);
}

function cookiesTimer() {
  return new Promise((resolve, reject) => {
    //console.log(playConfig.time);
    if (isShowAdvanced) {
      isShowAdvanced = false;
      $("#config").modal("toggle");
    }
    countDownDateCookie = playConfig.time;
    countDownDate = countDownDateCookie;
    isPaused = playConfig.timerPaused;
    //console.log("isPaused ", isPaused);
    if (isPaused) {
      var timerPausedTimer = playConfig.timerPausedTime;
      //console.log(timerPausedTimer);
      countDownDate = Date.now() + dateDiffFb + parseInt(timerPausedTimer);
      setTimer(countDownDate).then(pauseTimer());
      return true;
    } else if (countDownDateCookie != null && countDownDateCookie != "") {
      var now = Date.now() + dateDiffFb;
      if (countDownDateCookie > now || config.continuous) {
        countDownDate = countDownDateCookie;
        setTimer(countDownDate);
      }
      return true;
    }
    return false;
  });
}

function prepareTimer(minutesLeft) {
  resetTimer();
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
    countDownDate = Date.now() + dateDiffFb + (60000 * minutesLeft + 1000);
    //countDownDate = Date.now() + (3000);
    playConfig.minutesLeft = minutesLeft;
    playConfig.time = countDownDate;
    createCookie("playConfig", JSON.stringify(playConfig), 30);
    setTimer(countDownDate);
  }
}

function resetTimer() {
  getTime();
  clearInterval(timer);
  clearInterval(blinkTimer);
  timer = null;
  playConfig.time = 0;
  playConfig.timerPaused = false;
  playConfig.timerPausedTime = 0;
  playConfig.invertedColors = false;
  createCookie("playConfig", JSON.stringify(playConfig), 30);
  $("#invertColors").show();
  $("#controls").hide();
  $("#welcomeCard").show();
  document.title =
    "Cronopitch - The ultimate chronometer tool for lectures and events";
  $("#displayTimer").text("");
  $("#displayTimer").fadeIn(1);
  $("#displayTimer").html("");
  setColorDefault();
  $("#showImgTimer").hide();
  $("body").css("background-color", "#FFFFFF");
  countDownDate = null;
  hideFrontLayer();
}

function setColorDefault() {
  $("body").css("background-color", config.bgColorDefault);
  $("#displayTimer").css("color", config.fontColorDefault);
  $("#pause").css("color", config.fontColorDefault);
  $("#play").css("color", config.fontColorDefault);
  $("#resetTime").css("color", config.fontColorDefault);
  $("#undoTime").css("color", config.fontColorDefault);
  $("#invertColors").css("color", config.fontColorDefault);
}

function setTimer(countDownDate) {
  return new Promise((resolve, reject) => {
    getTime();
    continuous = false;
    $("#displayTimer").css("fontSize", "35vw");
    setColorDefault();
    var invertedColors = parseInt(playConfig.invertedColors);
    if (invertedColors == 1) {
      isInvertedColors = 0;
      invertColors();
    }

    this.countDownDate = countDownDate;
    if (!isResumed) {
      $("#displayTimer").text(minutesLeft + ":00");
      //document.title = 'Cronopitch - ' + minutes + ":" + seconds;
    } else {
      isResumed = false;
    }
    $("#controls").show();
    $("#play").hide();
    $("#pause").show();
    $("#welcomeCard").hide();
    if (config.imgTimer != null) {
      $("#displayTimer").css("fontSize", "29vw");
      $("#showImgTimer").show();
      $("#imgTimer").attr("src", config.imgTimer);
    }

    timer = setInterval(function () {
      showTimer();
      // if (isPaused) {
      //     pauseTimer();
      // }
    }, 100);
  });
}

function showTimer() {
  $(window).scrollTop(0);
  var now = Date.now() + dateDiffFb;
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
  var minutes =
    hours * 60 + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (!continuous) {
    $("#displayTimer").text(minutes + ":" + seconds);
    //document.title = minutes + ":" + seconds;
    document.title = "Cronopitch - " + minutes + ":" + seconds;
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
    $("#displayTimer").html(
      '<i class="fa fa-plus" aria-hidden="true" style="font-size: 8vw; vertical-align: middle;"></i>' +
        minutes +
        ":" +
        seconds
    );
    document.title = "Cronopitch - " + minutes + ":" + seconds;
  }
  if (distance <= 0) {
    if (config.continuous == false) {
      clearInterval(timer);
      $("#displayTimer").text("0:00");
      document.title =
        "Cronopitch - The ultimate chronometer tool for lectures and events";
      countDownDate = null;
      timer = null;
      if (config.showMsgEnd) {
        showFrontLayer();
      }
    }
  }
}

function createCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
  //console.log(isWriteFB, name + "=" + value + expires + "; path=/");
  if (isWriteFB) {
    //console.log(isWriteFB, name + "=" + value + expires + "; path=/");
    var refTimer = database.ref("cronopitch/" + idFirebase + "/" + name);
    try {
      value = JSON.parse(value);
    } catch (error) {}
    refTimer.set(value);
    refTimer = database.ref("cronopitch/" + idFirebase + "/idClient");
    refTimer.set(idClient);
  }
  //isWriteFB = true;
  // if (name == "config") {
  //console.log(isWriteFB, name + "=" + value + expires + "; path=/");
  // }
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function getTime() {
  database.ref("/.info/serverTimeOffset").on("value", function (offset) {
    var offsetVal = offset.val() || 0;
    var serverTime = Date.now() + offsetVal;
    dateDiffFb = serverTime - Date.now();
    //console.log(serverTime, dateDiffFb, Date.now(), (Date.now()));
  });
}

function eraseCookie(name) {
  // var refTimer = database.ref('cronopitch/' + idFirebase + '/' + name);
  // refTimer.set("");
  createCookie(name, "", -1);
}

function showFrontLayer() {
  //animateRotate(-20);
  getTime();
  $("#frontlayer").text(config.msgEnd);
  $("#bg_mask")
    .css({ visibility: "visible", opacity: 0.0 })
    .animate({ opacity: 1.0 }, 100);
  $("#frontlayer")
    .css({ visibility: "visible", opacity: 0.0 })
    .animate({ opacity: 1.0 }, 100);
}

function hideFrontLayer() {
  document.getElementById("bg_mask").style.visibility = "hidden";
  document.getElementById("frontlayer").style.visibility = "hidden";
}

function animateRotate(angle) {
  // caching the object for performance reasons
  var $elem = $("#bg_mask");

  // we use a pseudo object for the animation
  // (starts from `0` to `angle`), you can name it as you want
  $({ deg: 0 }).animate(
    { deg: angle },
    {
      duration: 1,
      step: function (now) {
        // in the step-callback (that is fired each step of the animation),
        // you can use the `now` paramter which contains the current
        // animation-position (`0` up to `angle`)
        $elem.css({
          transform: "rotate(" + now + "deg)",
        });
      },
    }
  );
}
