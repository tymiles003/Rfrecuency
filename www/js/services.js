angular.module('starter.services', [])

.factory('$cordovaNfc', ['$q', function ($q) {
    var q = $q.defer();

    document.addEventListener("deviceready", function () {
        q.resolve({
            addNdefListener: function (callback) {
                var q = $q.defer();
                if (typeof nfc != "undefined") {
                    nfc.addNdefListener(callback, q.resolve, q.reject);
                } else {
                    q.reject("nfc plugin not defined");
                }
                return q.promise;
            },
            removeNdefListener: function (callback) {
                var q = $q.defer();
                if (typeof nfc != "undefined") {
                    nfc.removeNdefListener(callback, q.resolve, q.reject);
                } else {
                    q.reject("nfc plugin not defined");
                }
                return q.promise;
            },
            write: function (ndefMessage) {
                var q = $q.defer();
                if (typeof nfc != "undefined") {
                    nfc.write(ndefMessage, q.resolve, q.reject);
                } else {
                    q.reject("nfc plugin not defined");
                }
                return q.promise;
            },
            erase: function () {
                var q = $q.defer();
                if (typeof nfc != "undefined") {
                    nfc.erase(q.resolve, q.reject);
                } else {
                    q.reject("nfc plugin not defined");
                }
                return q.promise;
            },
            enabled: function () {
                var q = $q.defer();
                if (typeof nfc != "undefined") {
                    nfc.enabled(q.resolve, q.reject);
                } else {
                    q.reject("nfc plugin not defined");
                }
                return q.promise;
            },
            showSettings: function () {
                var q = $q.defer();
                if (typeof nfc != "undefined") {
                    nfc.showSettings(q.resolve, q.reject);
                } else {
                    q.reject("nfc plugin not defined");
                }
                return q.promise;
            }
        })
    }, false);

    return q.promise;

}])


.factory('$NfcUtil', function ($cordovaNfc) {
    var currentListenerCallback;
    return {
        removeNdefListener: function () {
            $cordovaNfc.then(function (nfcInstance) {
                nfcInstance.removeNdefListener(currentListenerCallback).then(function () {
                    console.log("Success remove NDEF listener");
                }, function (err) {
                    alert("Error  " + JSON.stringify(err));
                });
            });
        },
        removeAddNdefListener: function (newCurrentListenerCallback) {
            $cordovaNfc.then(function (nfcInstance) {
                nfcInstance.removeNdefListener(currentListenerCallback).then(function () {
                    currentListenerCallback = newCurrentListenerCallback;
                    nfcInstance.addNdefListener(newCurrentListenerCallback).then(function () {
                        //alert("Acerque el tag para leer...");
                    }, function (err) {
                        alert("Error adding NDEF listener " + JSON.stringify(err));
                    });
                }, function (err) {
                    alert("Error  " + JSON.stringify(err));
                });
            });
        }
    }
})

.factory('$Rfrecuency', function ($cordovaNfc, $NfcUtil, $http, $q) {

    return {
        readSingleTag: function () {

            var tagPayload = "1448078726822";
            var path = 'http://104.236.196.14/app_dev.php/api/product/info.json?tag=';

            var readCallback = function (nfcEvent) {
                var tag = nfcEvent.tag;
                var ndefMessage = tag.ndefMessage;
                var tagPayload = nfc.bytesToString(ndefMessage[0].payload).substring(3);
                alert(tagPayload);
            }

            $NfcUtil.removeAddNdefListener(readCallback);


            //            var promise = $http({
            //                method: 'get',
            //                url: (path + tagPayload)
            //            }).success(function (result) {
            //                customers = result;
            //                return customers;
            //            });
            //
            //            return promise;

        },
        write: function (product) {

            console.log("Producto: " + product.producto);
            console.log("Precio: " + product.costo);
            console.log("Tag: " + product.tag);
            console.log("Talla: " + product.talla);
            console.log("Marca: " + product.marca);
            console.log("Provedor: " + product.proveedor);
            console.log("Carga: " + product.carga);
            console.log("user: " + product.user);

            var writeCallback = function (nfcEvent) {
                $cordovaNfc.then(function (nfcInstance) {
                    var ndefMessage = [
                 ndef.textRecord(product.tag)
             ];

                    nfcInstance.write(ndefMessage).then(function () {
                        alert("Wrote data to NDEF tag.");

                        $http.post('http://104.236.196.14/app_dev.php/api/creates/products.json', {
                            producto: product.producto,
                            costo: product.costo,
                            tag: product.tag,
                            talla: product.talla,
                            marca: product.marca,
                            proveedor: product.proveedor,
                            carga: product.carga,
                            user: product.user
                        }).then(function (response) {
                            console.log("Guardo");
                            console.log(JSON.stringify(response));
                        }, function (response) {
                            console.log(JSON.stringify(response));
                            console.log("No Guardo");
                            //$ionicLoading.hide();
                        });

                        return true;

                    }, function (err) {
                        alert("Error write NDEF listener " + JSON.stringify(err));
                    });

                });
            }

            $NfcUtil.removeAddNdefListener(writeCallback);
        },
        erase: function () {

            var eraseCallback = function (nfcEvent) {
                $cordovaNfc.then(function (nfcInstance) {

                    nfcInstance.erase().then(function () {
                        alert("Erase data to NDEF tag.");
                    }, function (err) {
                        alert("Error erase NDEF listener " + JSON.stringify(err));
                    });

                });
            }

            $NfcUtil.removeAddNdefListener(eraseCallback);

        }
    }
})

