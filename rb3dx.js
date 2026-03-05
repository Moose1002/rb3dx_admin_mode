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
            $("#ip-warning").css("display", "none")
        }
    });
});

function setPlatform(console) {
    consoleMode = console;
    $("#set-platform").remove();
    $("#content").css("display", "block");
    if (consoleMode == "xbox") {
        $("#jumpSongBtn").css("display", "inline-block");
        $("#set-xbox-ip").css("display", "block");
        $("#ip-warning").css("display", "block")
        $("#uploadCSV").text("or Upload CSV");
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

function writeToMic() {
    const mic1 = document.getElementById('mic1').value
    const mic2 = document.getElementById('mic2').value
    const mic3 = document.getElementById('mic3').value
    switch (consoleMode) {
        case "rpcs3":
            sendCommand(
                `{profile_mgr set_mic_vol 0 ${mic1}} {profile_mgr update_mic_levels 0} {profile_mgr set_mic_vol 1 ${mic2}} {profile_mgr update_mic_levels 1} {profile_mgr set_mic_vol 2 ${mic3}} {profile_mgr update_mic_levels 2}`
            )
            break;
        case "xbox":
            sendCommand(
                `{profile_mgr set_mic_vol 0 ${mic1}} {profile_mgr update_mic_levels 0}`
            )
            setTimeout(() => {
                sendCommand(
                    `{profile_mgr set_mic_vol 1 ${mic2}} {profile_mgr update_mic_levels 1}`
                )
            }, 250);
            setTimeout(() => {
                sendCommand(
                    `{profile_mgr set_mic_vol 2 ${mic3}} {profile_mgr update_mic_levels 2}`
                )
            }, 500);
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
