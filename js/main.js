<script src="../vendor/jquery-2.1.4.min.js"></script>
function loadManifest() {
    if (sessionStorage && !sessionStorage.getItem("serverUrl"))
    {
        jQuery.getJSON('manifest.webapp').done(function (data) {
            sessionStorage.setItem("serverUrl", data.activities.openmrs.href);
        }).fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("reading manifest file request Failed: " + err);
        });
    }
}
function CheckAuthentication() {
	if (sessionStorage && !sessionStorage.getItem("serverUrl"))
    { 
        $.ajax({url: "http://localhost:8080/openmrs/ws/rest/v1/session",headers: '{"accept": "application/json"}', success: function(result){
        sessionStorage.setItem("authentication", result.detail.response.authenticated;     
    }          
    });
});
}