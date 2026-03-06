var xboxIP = "";
var consoleMode = "";

// -- Keydown listeners --
// Only show manual script menu when pressing ctrl + shift + u
$(document).keydown(function (e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u') {
        e.preventDefault(); // Prevent default action if needed
        $("#toggleManualScript").css("display", "block");
    }
});

$(document).ready(function() {
    $('#xbox-ip').keydown(function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {  // Check if Enter is pressed (without Shift)
            e.preventDefault(); // Prevent new line if needed
            xboxIP = (document.getElementById("xbox-ip").value);
            alert("Xbox IP Set");
            $("#ace_uploaded").css("display", "block");
            $("#general").css("display", "block");
            $("#ip-warning").css("display", "none")
            fetchSongList()
        }
    });
});

function navigate(page) {
    console.log(page);
    $("#general").css("display", "none")
    $("#audio").css("display", "none")
    $("#misc").css("display", "none")
    $(page).css("display", "block")
}

function setPlatform(console) {
    consoleMode = console;
    $("#set-platform").remove();
    $("#content").css("display", "block");
    if (consoleMode == "xbox") {
        $("#jumpSongBtn").css("display", "inline-block");
        $("#set-xbox-ip").css("display", "block");
        $("#ip-warning").css("display", "block")
        $("#uploadCSV").text("or");
    }
    if (consoleMode == "rpcs3") {
        $("#select-ace").css("display", "block");
        $("#uploadCSV").text("Upload CSV");
        $("#pullSongs").css("display", "none");
    }
}

function sendCommand(message) {
    switch (consoleMode) {
        case "rpcs3":
            ipcRenderer.send('write-to-file', message);
            break;
        case "xbox":
            fetch(`http://${xboxIP}:21070/execute?script={do ${message}}`);
        default:
            break;
    }
}

function writeToMic(id, volume) {
    //mic_num parses the last character of the slider's id - 1; volume is the value of the slider
    let mic_num = parseInt(id[3]) - 1;
    switch (consoleMode) {
        case "rpcs3":
            sendCommand(
                `{profile_mgr set_mic_vol ${mic_num} ${volume}} {profile_mgr update_mic_levels ${id_num}}`
            )
            break;
        case "xbox":
            sendCommand(
                `{profile_mgr set_mic_vol ${mic_num} ${volume}} {profile_mgr update_mic_levels ${id_num}}`
            )
            break;
        default:
            break;
    }
}

function logSong() {
    var shortname = (document.getElementById("song_list").value);
    sendCommand(
        `{meta_performer reset_songs} {meta_performer set_song {symbol ${shortname}}} {gamemode set_mode qp_coop} {ui abstract_wipe} {ui goto_screen {music_library get_next_screen}}`
    )
}

function pauseSong() {
    sendCommand(
       `{beatmatch set_paused {! {beatmatch get_paused}}}`
    )
}

function showManualScript() {
    $("#manualScript").css("display", $("#manualScript").css("display") == "block" ? "none" : "block"  ); // hide or show text box depending on current status
}

function runManualScript() {
    let inputValue = document.getElementById("manualScript").value;
    sendCommand(inputValue);
}

// -- Xbox exclusive actions --

function fetchSongList() {
    fetch(`http://${xboxIP}:21070/list_songs`).then((data) => data.text().then((t) => ParseSongList(t)));
}

function jumpSong() {
    var shortname = (document.getElementById("song_list").value);
    fetch(`http://${xboxIP}:21070/jump?shortname=${shortname}`);
}
