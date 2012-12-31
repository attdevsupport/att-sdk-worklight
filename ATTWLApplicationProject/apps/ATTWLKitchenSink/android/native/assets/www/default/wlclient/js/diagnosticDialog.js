
/* JavaScript content from wlclient/js/diagnosticDialog.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

__WLDiagnosticDialog = function() {
    this.showDialog = function(title, messageText, allowReload, allowDetails, response, customErrorMsg) {
        var buttons = [];
        if (allowReload) {
            buttons.push({
                text : WL.ClientMessages.reload,
                handler : function() {
                    WL.Client.reloadApp();
                }
            });
        }
        if (WL.App.close) {
            buttons.push({
                text : WL.ClientMessages.exit,
                handler : function() {
                    WL.App.close();
                }
            });
        }

        // Troubleshooting button
        if (allowDetails && WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_DIAGNOSTIC)) {
            buttons.push({
                text : WL.ClientMessages.details,
                handler : function() {
                    WL.Device.getNetworkInfo(function(networkInfoObject) {
                        showDiagnosticTable(response, networkInfoObject, customErrorMsg);
                    });
                }
            });
        }

        if (buttons.length == 0) {
            buttons.push({
                text : WL.ClientMessages.ok,
                handler : function() {
                }
            });
        }
        WL.SimpleDialog.show(title, messageText, buttons);
    };

    // Diagnostics functions
    function showDiagnosticTable(response, networkInfo, customErrorMsg) {
        // Back again with networkInfo object
        var diagnosticData = getDiagnosticData(response, networkInfo, customErrorMsg);
        clearScreenBeforeDiagnostics();
        WLJSX.$$('html')[0].style.overflow = 'auto';
        WLJSX.$$('body')[0].style.overflow = 'visible';
        WLJSX.$$('body')[0].style.backgroundColor = 'white';

        var diagnosticDiv = WLJSX.newElement('<div/>', {
            'id' : 'diagnostic',
            'class' : 'max'
        });

        var contentContainer = WLJSX.$("content");
        if (contentContainer && contentContainer.tagName.toLowerCase() != "body") {
            contentContainer.style.display = "none";
        }
        WLJSX.$$('body')[0].appendChild(diagnosticDiv);

        var diagnosticTable = WLJSX.newElement('<table/>', {
            'id' : 'diagnosticTable'
        });

        WLJSX.append(diagnosticDiv, diagnosticTable);
        WLJSX.addClass(diagnosticTable, 'max');
        WLJSX.addClass(diagnosticTable, 'diagnosticTable');
        var titleRow = WLJSX.newElement('<tr/>');
        var titleColumn = WLJSX.newElement('<td/>', {
            'class' : 'center strong',
            'colspan' : '2'
        });

        WLJSX.html(titleColumn, WL.ClientMessages.diagApp);
        WLJSX.append(diagnosticTable, titleRow);
        WLJSX.append(titleRow, titleColumn);
        WLJSX.append(diagnosticTable, titleRow);

        for (dataRecord in diagnosticData) {
            var row = WLJSX.newElement('<tr/>');
            var labelColumn = WLJSX.newElement('<td>' + dataRecord + '</td>');
            var dataColumn = WLJSX.newElement('<td>' + diagnosticData[dataRecord] + '</td>');
            WLJSX.append(row, labelColumn);
            WLJSX.append(row, dataColumn);
            WLJSX.append(diagnosticTable, row);
        }
        titleColumn.appendChild(getDiagnosticsButtonDiv(diagnosticData));
        diagnosticDiv.appendChild(getDiagnosticsButtonDiv(diagnosticData));
        if (WL.StaticAppProps.ENVIRONMENT == WL.Env.ANDROID) {
            WL.OptionsMenu.init();
        }
    }

    function getDiagnosticData(response, networkInfo, customErrorMsg) {
        var diagnosticData = {};
        diagnosticData[WL.ClientMessages.diagTime] = new Date();
        diagnosticData[WL.ClientMessages.diagApplicationName] = WL.StaticAppProps.APP_DISPLAY_NAME;
        diagnosticData[WL.ClientMessages.diagApplicationVersion] = WL.StaticAppProps.APP_VERSION;
        diagnosticData[WL.ClientMessages.diagServiceURL] = WL.StaticAppProps.WORKLIGHT_ROOT_URL;
        diagnosticData[WL.ClientMessages.diagDevicePlatform] = (typeof (device) != "undefined") ? device.platform : "";
        diagnosticData[WL.ClientMessages.diagDeviceVersion] = (typeof (device) != "undefined") ? device.version : "";
        diagnosticData[WL.ClientMessages.diagScreenResolution] = (WL.App.getScreenWidth ? WL.App.getScreenWidth() : screen.width) + 'x'
                + (WL.App.getScreenHeight ? WL.App.getScreenHeight() : screen.height);
        if (typeof networkInfo != "undefined") {
            diagnosticData[WL.ClientMessages.diagAirplaneMode] = networkInfo.isAirplaneMode == null ? WL.ClientMessages.notAvailable
                    : networkInfo.isAirplaneMode;
            diagnosticData[WL.ClientMessages.diagUsingNetwork] = networkInfo.networkConnectionType;
            diagnosticData[WL.ClientMessages.diagWifiName] = networkInfo.wifiName == null ? WL.ClientMessages.notAvailable
                    : networkInfo.wifiName;
            diagnosticData[WL.ClientMessages.diagMobileNetworkType] = networkInfo.telephonyNetworkType == null ? WL.ClientMessages.notAvailable
                    : networkInfo.telephonyNetworkType;
            diagnosticData[WL.ClientMessages.diagCarrierName] = networkInfo.carrierName == null ? WL.ClientMessages.notAvailable
                    : networkInfo.carrierName;
            diagnosticData[WL.ClientMessages.diagIPAddress] = networkInfo.ipAddress;
        }
        diagnosticData[WL.ClientMessages.diagErrorCode] = response.errorCode;
        diagnosticData[WL.ClientMessages.diagErrorMessage] = (typeof (customErrorMsg) === 'undefined' || customErrorMsg == null) ? response.errorMsg
                : customErrorMsg;
        diagnosticData[WL.ClientMessages.diagHttpStatus] = response.status != -1 ? response.status : "";
        return diagnosticData;
    }

    function getDiagnosticsButtonDiv(diagnosticData) {
        var copyButton = WLJSX.newElement('<input/>', {
            'class' : 'diagnosticButtons',
            'type' : 'button',
            'value' : WL.ClientMessages.copyToClipboard,
            'title' : WL.ClientMessages.copyToClipboard
        });
        var exitButton = WLJSX.newElement('<input/>', {
            'class' : 'diagnosticButtons',
            'type' : 'button',
            'value' : WL.ClientMessages.exit,
            'title' : WL.ClientMessages.exit
        });
        var buttonsDiv = WLJSX.newElement('<div/>', {
            'class' : 'center'
        });
        var diagnosticToCopy = formatDiagnosticData(diagnosticData);

        WLJSX.bind(copyButton, 'click', function() {
            WL.App.copyToClipboard(diagnosticToCopy);
        });

        WLJSX.bind(exitButton, 'click', function() {
            WL.App.close();
        });

        buttonsDiv.appendChild(copyButton);
        buttonsDiv.appendChild(exitButton);

        // Add worklight setting button to android
        if (WL.Env.ANDROID == WL.StaticAppProps.ENVIRONMENT) {
            var isSettingsEnable = cordova.exec(null, null, "Utils", "readPref", [ "enableSettings" ]);
            if (isSettingsEnable == "true") {
                var settingsButton = WLJSX.newElement('<input/>', {
                    'class' : 'diagnosticButtons',
                    'type' : 'button',
                    'value' : WL.ClientMessages.settings,
                    'title' : WL.ClientMessages.settings
                });
                WLJSX.bind(settingsButton, 'click', function() {
                    WL.App.__showWLPreferences();
                });
                buttonsDiv.appendChild(settingsButton);
            }
        }
        return buttonsDiv;
    }

    function formatDiagnosticData(diagnosticData) {
        var diagnosticDataText = "" + WL.ClientMessages.diagApp + "\n\n";
        for (property in diagnosticData) {
            var diagnosticDataValue = (typeof diagnosticData[property] == "undefined" || diagnosticData[property] == "undefined") ? ""
                    : diagnosticData[property];
            diagnosticDataText += property + " : " + diagnosticDataValue + "\n\n";
        }
        return diagnosticDataText;
    }

    function clearScreenBeforeDiagnostics() {
        var contentContainer = WLJSX.$("content");
        WLJSX.empty(contentContainer);
        // hideBusy();
        // Android native elements
        if (WL.OptionsMenu) {
            WL.OptionsMenu.setVisible(false);
        }
        if (WL.TabBar) {
            WL.TabBar.setVisible(false);
        }
    }
};

__WL.prototype.DiagnosticDialog = new __WLDiagnosticDialog;
WL.DiagnosticDialog = new __WLDiagnosticDialog;
