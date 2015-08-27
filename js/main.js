function loadManifestAndgetAuth() {
    if (sessionStorage && !sessionStorage.getItem("serverUrl"))
    {
        jQuery.getJSON('manifest.webapp').done(function (data) {
            sessionStorage.setItem("serverUrl", data.activities.openmrs.href);
            var sessionUrl = sessionStorage.getItem("serverUrl") + "/ws/rest/v1/session";
            $.ajax({
                url: sessionUrl,
                headers: '{"accept": "application/json"}',
                type: "GET",
                cache: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    sessionStorage.setItem("authentication", data.authenticated);
                }
            });
        }).fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("reading manifest file request Failed: " + err);
        });
    }
}