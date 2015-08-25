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