var xboxIP = "";

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

function fetchSongList() {
    fetch(`http://${xboxIP}:21070/list_songs`).then((data) => data.text().then((t) => ParseSongList(t)));
}

function jumpSong() {
    var shortname = (document.getElementById("song_list").value);
    fetch(`http://${xboxIP}:21070/jump?shortname=${shortname}`);
}
