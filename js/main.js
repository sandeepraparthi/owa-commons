var tableData = new Array();
var manifestData;
var serverUrl;
var doneOrgUnitSel = false;
var session;

$(document).ready(function() {
    loadManifest();
});

function handleFileSelect(evt) {
    $('#messages').removeClass('hidden');
    $('#tableData').dataTable().fnClearTable();

    var files = evt.target.files; // FileList object
    var csvFile = files[0]; // FileList object
    if (csvFile.type.match('application/vnd.ms-excel') || csvFile.type.match('text/csv')) {
        $('#messages').html(csvFile.name + ' - ' + csvFile.size + ' bytes, last modified: ' + csvFile.lastModifiedDate);
        var reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onerror = function(e) {
            $('#messages').html('Error reading file');
        };
        reader.onload = function(e) {
            var readStr = e.target.result;
            readStr = readStr.split("\n").slice(1).join("\n");
            try {
                tableData = $.csv.toArrays(readStr);
                $('#tableData').dataTable().fnAddData(tableData);
                $('#btnImport').removeClass('hidden');
            } catch (err) {
                $('#messages').html('Error parsing: ' + err.message);
            }
        };
    } else {
        $('#messages').html('Incorrect file type');
    }
}

function loadManifest() {
    jQuery.getJSON('manifest.webapp').done(function(data) {
        manifestData = data;
        serverUrl = manifestData.activities.openmrs.href;
        $('#btnExit').attr('href', serverUrl);

//        var request = $.ajax({
//            url: serverUrl + '/ws/rest/v1/session',
//            headers: {
//                'Accept': 'application/json'
//            },
//            type: "GET",
//            cache: false,
//            crossDomain: true,
//            xhrFields: {
//                withCredentials: true
//            }
//        }).done(function(data, textStatus, jqXHR) {
//            if(data.authenticated)
//            console.log('Hello' + " authenticated "+data.authenticated);
////            if (jqXHR.getResponseHeader('Login-Page') == 'true') {
////                $.blockUI({message: $('#unauthenticatedMessage')});
////            }
//        }).fail(function(jqXHR, textStatus, errorThrown) {
//            //$.blockUI({message: $('#failureMessage')});
//        });
    });
}

function importUserAction() {
    oTable = $('#tableData').dataTable();
    tableNodes = oTable.fnGetNodes();
    $.each(tableNodes, function(index, value) {
        orgUnitStr = oTable.fnGetData(value, 6);
        totalOU = orgUnitStr.split('|').length;
        if (totalOU > 1) {
            $.each(orgUnitStr.split('|'), function(index, value) {
                postOrgUnitSelection('id=' + value, totalOU);
            });
        } else {
            postOrgUnitSelection('id=' + orgUnitStr, totalOU);
        }
    });
}

function postOrgUnitSelection(params, totalOU) {
    orgUnitSelectionUrl = serverUrl + '/dhis-web-commons/oust/addorgunit.action';
    clearOrgUnitSelectionUrl = serverUrl + '/dhis-web-commons/oust/clearSelectedOrganisationUnits.action';
    $.post(orgUnitSelectionUrl, params).done(function(data) {
        if (data.selectedUnits.length >= totalOU) {
            console.log('Done with OrgUnit Selections' + data);
            $.get(clearOrgUnitSelectionUrl, params);
        }
    });
}

function postUser() {
    $.ajax({
        type: "POST",
        url: serverUrl,
        data: data,
        success: success,
        dataType: dataType
    });
}

var createCORSRequest = function(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);    // Most browsers.
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();     // IE8 & IE9
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
};