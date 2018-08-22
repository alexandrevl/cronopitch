// Initialize Firebase
var config = {
    apiKey: "AIzaSyDKB9w_qIKETeT1Igv3pIAUTSZfq3axo4U",
    authDomain: "punisher-2eafa.firebaseapp.com",
    databaseURL: "https://punisher-2eafa.firebaseio.com",
    projectId: "punisher-2eafa",
    storageBucket: "punisher-2eafa.appspot.com",
    messagingSenderId: "693554201973"
};
firebase.initializeApp(config);

var database = firebase.database();
var ref = database.ref('cronopitch/1234/config');

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
var data = configDefault;
var test = ref.set(data);
console.log(test);

ref.on('value', (data) => {
    console.log(data.val());
});