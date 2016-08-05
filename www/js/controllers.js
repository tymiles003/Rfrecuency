angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $state, $http) {

    /*CALL LOGIN SERVICE*/
    $scope.login = function(user) {

        $http.post('http://104.236.196.14/app_dev.php/api/logins.json', {
            username: user.username,
            password: user.password
        }).
        then(function(response) {
            //console.log(response.data);
            window.localStorage['usidu'] = response.data.id;           
            alert('Bienvenido, ' + response.data.name);
            $state.go('app.inicio');
        }, function(response) {
            console.table(response);
            alert("Usuario ó contraseña invalidos");
           // $state.go('app.inicio');
        });

    };

})

.controller('menuCtrl', function($scope, $state, $rootScope) {

    /*DO LOGOUT*/
    $scope.logOut = function() {
        window.localStorage['usidu'] = "";
        alert("Hasta pronto");
        $state.go('login');
    }

    /*RESET ROOTSCOPE*/
    $scope.cleanView = function() {
        $rootScope.singleProduct = "";
    }

})

.controller('inicioCtrl', function($scope, $state, $ionicModal, $http, $ionicHistory, $rootScope, $ionicLoading, $cordovaNfc, $NfcUtil) {

    $scope.productInfo = "";
    var path = 'http://104.236.196.14/app_dev.php/api/product/info.json?tag=';

    $scope.$on("$ionicView.afterLeave", function() {
        $ionicHistory.clearCache();
    });

    var readCallback = function(nfcEvent) {

        $ionicLoading.show({
            template: 'Cargando'
        });

        var tag = nfcEvent.tag;
        var ndefMessage = tag.ndefMessage;
        var tagPayload = nfc.bytesToString(ndefMessage[0].payload).substring(3);

        //product data 
        $http.get(path + tagPayload)
            .then(function(result) {
                $scope.productInfo = result.data;
                $scope.openModal();
                $rootScope.singleProduct = $scope.productInfo;
                $ionicLoading.hide();
            }, function(err) {
                $ionicLoading.hide();
                //alert(JSON.stringify(err));
                alert(err.data.error.exception[0].message);
            });
    }

    $NfcUtil.removeAddNdefListener(readCallback);

    $scope.gotoMovements = function() {
        $rootScope.singleProduct = $scope.productInfo;
        $scope.closeModal();
        $state.go('app.movimientos');
    };
    $scope.gotoUbications = function() {
        $rootScope.singleProduct = $scope.productInfo;
        $scope.closeModal();
        $state.go('app.ubicaciones');
    };

    /*OPEN MODAL WHEN PRODUCT IS FOUNDED*/
    $ionicModal.fromTemplateUrl('detailsProduct.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

})


.controller('buscarCtrl', function($scope, $state, $http, $ionicModal, dataService1, dataService2, dataService3, dataService4, $rootScope, $ionicLoading) {

    $scope.dataService1 = dataService1;
    $scope.dataService2 = dataService2;
    $scope.dataService3 = dataService3;
    $scope.dataService4 = dataService4;

    $scope.show_code = false;
    $scope.show_provider = false;
    $scope.show_charge = false;
    $scope.show_ubication = false;
    $scope.found_products = "";
    $scope.single_product = "";
    $scope.no_found_products = false;
    $scope.product = {};

    /*HIDE-SHOW INPUT ACORDING TO PARAM*/
    $scope.showInput = function(item) {
        if (item == 'show_code') {
            $scope.show_code = !this.show_code;
            $scope.product.code = "";
        } else if (item == 'show_provider') {
            $scope.show_provider = !this.show_provider;
            $scope.product.provider = "";
        } else if (item == 'show_charge') {
            $scope.show_charge = !this.show_charge;
            $scope.product.charge = "";
        } else if (item == 'show_ubication') {
            $scope.show_ubication = !this.show_ubication;
            $scope.product.ubication = "";
        }
    }

    $ionicModal.fromTemplateUrl('detailsProduct.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    /*SHOW INFORMATION OF THE PRODUCT*/
    $scope.show_details = function(index) {
        //console.log(index);
        $scope.single_product = $scope.found_products[index];
        //console.log($scope.single_product);
        $rootScope.singleProduct = $scope.single_product;
        //console.log($rootScope.singleProduct);
        $scope.modal.show();
    };

    /*GET THE PRODUCTS WITH THE PARAMS OF THE SEARCH*/
    $scope.searchProduct = function(product) {
        $ionicLoading.show({
            template: 'Cargando'
        });

        //console.log(product);
        $http.post('http://104.236.196.14/app_dev.php/api/products/filters.json', {
            codigo: product.code,
            proveedor: product.provider,
            carga: product.charge,
            ubicacion: product.ubication
        }).
        then(function(response) {
            $scope.found_products = response.data;
            console.table(response.data);
            if ($scope.found_products == '') {
                $scope.no_found_products = true;
            } else {
                $scope.no_found_products = false;
            }
            console.log($scope.found_products);
            $ionicLoading.hide();

        }, function(response) {
            console.log("Bad Request");
            alert("ha ocurrido un error inesperado");
            $ionicLoading.hide();
        });
    }

    /*RESET FORM*/
    $scope.newSearch = function(product) {
        $scope.found_products = "";
        $scope.no_found_products = false;
        $scope.product = {};
        $scope.show_code = false;
        $scope.show_provider = false;
        $scope.show_charge = false;
        $scope.show_ubication = false;
        dataService1.isChecked = false;
        dataService2.isChecked = false;
        dataService3.isChecked = false;
        dataService4.isChecked = false;
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.gotoMovements = function(product) {
        $rootScope.singleProduct = $scope.single_product;
        $scope.closeModal();
        $state.go('app.movimientos');
    };

    $scope.gotoUbications = function(product) {
        $rootScope.singleProduct = $scope.single_product;
        $scope.closeModal();
        $state.go('app.ubicaciones');
    };
})

.controller('movimientosCtrl', function($scope, $state, $http, $ionicPopover, $ionicPopup, $rootScope, $ionicHistory, $cordovaNfc, $NfcUtil) {

    var path_movements = 'http://104.236.196.14/app_dev.php/api/all/tipomovimiento.json';
    var path_get_pro = 'http://104.236.196.14/app_dev.php/api/product/info.json?tag=';
    var path_set_mov = 'http://104.236.196.14/app_dev.php/api/crearmovimientos.json';


    $scope.$on("$ionicView.afterLeave", function() {
        $ionicHistory.clearCache();
    });

    $scope.move_products = [];
    $scope.movimiento = "";
    $scope.array_tags = [];
    var userlogged = window.localStorage['usidu'];
    //console.log($rootScope.singleProduct);

    /*GET ALL MOVEMENT TYPES*/
    $http.get(path_movements).
    then(function(response) {
        $scope.mov_types = response.data;
        //console.log($scope.mov_types);
    }, function(response) {
        //console.log("Bad Request");
    });

    /*SET THE CURRENT PRODUCT IN A GLOBAL VARIABLE*/
    if ($rootScope.singleProduct != "") {
        $scope.move_products.push($rootScope.singleProduct);
        $scope.array_tags.push($rootScope.singleProduct.tag);
        // console.log("2 " + $scope.array_tags);
    }


    /*READ AND ADD PRODUCT TO THE LIST*/
    $scope.getInfoTag = function() {

        $scope.openPopover1(event);

        var readCallback = function(nfcEvent) {

            var tag = nfcEvent.tag;
            var ndefMessage = tag.ndefMessage;
            var tagPayload = nfc.bytesToString(ndefMessage[0].payload).substring(3);
            //alert(tagPayload);
            //product data 
            $http.get(path_get_pro + tagPayload, {})
                .then(function(result) {

                    $scope.closePopover();
                    if ($scope.move_products.length == 0) {
                        $scope.move_products.push(result.data);
                        $scope.array_tags.push(result.data.tag);
                        //console.log($scope.move_products);
                        //console.log($scope.array_tags);
                    } else {
                        for (var i = $scope.move_products.length - 1; i >= 0; i--) {
                            if ($scope.move_products[i].tag != result.data.tag) {
                                $scope.move_products.push(result.data);
                                $scope.array_tags.push(result.data.tag);
                                //console.log($scope.move_products);
                                //console.log($scope.array_tags);
                            } else {
                                alert("El producto ya se encuentra en la lista");
                            }
                        }
                    }

                }, function(err) {
                    $scope.closePopover();
                    //alert(JSON.stringify(err));
                    alert(err.data.error.exception[0].message)
                });
        }

        $NfcUtil.removeAddNdefListener(readCallback);

    }

    /*DELETE PRODUCT FROM THE LIST*/
    $scope.del_product = function(index) {
        //console.log(index);
        console.log($scope.move_products[index].tag);
        for (var i = $scope.array_tags.length - 1; i >= 0; i--) {
            if ($scope.array_tags[i] === $scope.move_products[index].tag) {
                $scope.array_tags.splice(i, 1);
            }
        }
        $scope.move_products.splice(index, 1);
    }

    /*SEND ARRAY TO MAKE A MOVEMENT*/
    $scope.send_products_to_move = function() {

        console.log($scope.movimiento);

        if ($scope.move_products == "") {
            alert("No hay productos en la lista para generar un movimiento");
        } else if ($scope.movimiento.description == "" || $scope.movimiento.description == undefined) {
            alert("Ingrese la descripción del movimiento");
        } else if ($scope.movimiento.choice == "" || $scope.movimiento.choice == null) {
            alert("Seleccione un movimiento Entrada / Salida");
        } else {
            //alert("LLamar servicio de movimientos");

            $http.post(path_set_mov, {
                tipoMovimiento: $scope.movimiento.choice,
                motivo: $scope.movimiento.description,
                user: userlogged,
                tags: JSON.stringify($scope.array_tags)
            }).
            then(function(response) {
                alert("EL movimiento se realizo con exito");
                $scope.clearForm();
                //console.log(response.data);
            }, function(response) {
                alert(response.data.error.exception[0].message);
                $scope.clearForm();
                //console.log(response.data.error.exception[0].message);
            });
            
        }
    }

    /*CLEAN THE FORM ONCE IS SENT*/
    $scope.clearForm = function() {
        $scope.move_products = [];
        $scope.movimiento.description = "";
        $scope.movimiento.choice = "";
        $scope.show = false;
        $scope.showOut = false;
        $scope.array_tags = [];
    }

    // A confirm dialog
    $scope.showConfirm = function(movimiento) {

        $scope.movimiento = movimiento;
        console.log($scope.movimiento.choice);
        console.log($scope.movimiento.description);

        var confirmPopup = $ionicPopup.confirm({
            title: 'Estas seguro?',
            template: 'Se aplicará el movimiento a los productos seleccionados',
            buttons: [{
                text: 'Aceptar',
                type: 'button-dark',
                onTap: function() {
                    confirmPopup.close();
                    $scope.send_products_to_move();
                }
            }, {
                text: 'Cancelar'
            }]
        });
    };

    $scope.show = false;
    $scope.showOut = false;

    $scope.togleState = function() {
        $scope.show = !this.show;
        $scope.showOut = false;
    };

    $scope.togleStateOut = function() {
        $scope.showOut = !this.showOut;
        $scope.show = false;
    };

    //____________________________________

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover1 = popover;
    });

    $scope.closePopover = function() {
        $scope.popover1.hide();
    };

    $scope.openPopover1 = function($event) {
        $scope.popover1.show($event);
    };

})


.controller('ubicacionesCtrl', function($scope, $http, $ionicPopover, $ionicPopup, $rootScope, $ionicHistory, $ionicLoading, $cordovaNfc, $NfcUtil) {

    var path_ubications = 'http://104.236.196.14/app_dev.php/api/all/ubicaciones.json';
    var path_get_pro = 'http://104.236.196.14/app_dev.php/api/product/info.json?tag=';
    var path_set_ubi = 'http://104.236.196.14/api/ubicarproductos.json';

    $scope.$on("$ionicView.afterLeave", function() {
        $ionicHistory.clearCache();
    });

    $scope.ubicate_products = [];
    $scope.options = "";
    $scope.choice = "";
    $scope.array_tags = [];
    //console.log($rootScope.singleProduct);

    /*SET THE CURRENT PRODUCT IN A GLOBAL VARIABLE*/
    if ($rootScope.singleProduct != "") {
        $scope.ubicate_products.push($rootScope.singleProduct);
        $scope.array_tags.push($rootScope.singleProduct.tag);
        //console.log("1 " + $scope.array_tags);
    }

    /*GET THE UBICATIONS AND POPULATE THE SELECT OPTION*/
    $http.get(path_ubications).
    then(function(response) {
        $scope.options = response.data;
        //console.log($scope.options);
    }, function(response) {
        //console.log("Bad Request")
    });

    /*READ AND ADD PRODUCT TO THE LIST*/
    $scope.getInfoTag = function() {

        $scope.openPopover1(event);


        var readCallback = function(nfcEvent) {

            var tag = nfcEvent.tag;
            var ndefMessage = tag.ndefMessage;
            var tagPayload = nfc.bytesToString(ndefMessage[0].payload).substring(3);
            //alert(tagPayload);
            //product data 
            $http.get(path_get_pro + tagPayload, {})
                .then(function(response) {

                    $scope.closePopover();
                    if ($scope.ubicate_products.length == 0) {
                        $scope.ubicate_products.push(response.data);
                        $scope.array_tags.push(response.data.tag);
                        //console.log($scope.ubicate_products);
                        //console.log($scope.array_tags);
                    } else {
                        for (var i = $scope.ubicate_products.length - 1; i >= 0; i--) {
                            //console.log($scope.ubicate_products[i].tag);
                            //console.log(response.data.tag);
                            if ($scope.ubicate_products[i].tag != response.data.tag) {
                                $scope.ubicate_products.push(response.data);
                                $scope.array_tags.push(response.data.tag);
                                //console.log($scope.ubicate_products);
                                //console.log($scope.array_tags);
                            } else {
                                alert("El producto ya se encuentra en la lista");
                            }
                        }
                    }

                }, function(err) {
                    $scope.closePopover();
                    //alert(JSON.stringify(err));
                    alert(err.data.error.exception[0].message)
                });
        }

        $NfcUtil.removeAddNdefListener(readCallback);

    }

    /*DELETE PRODUCT FROM THE LIST*/
    $scope.del_product = function(index) {
        //console.log($scope.ubicate_products[index].tag);
        for (var i = $scope.array_tags.length - 1; i >= 0; i--) {
            if ($scope.array_tags[i] === $scope.ubicate_products[index].tag) {
                $scope.array_tags.splice(i, 1);
            }
        }
        $scope.ubicate_products.splice(index, 1);
    }


    /*SEND ARRAY TO THE SERVER WITH PRODUCTS TO LOCATE*/
    $scope.send_products_to_ubicate = function() {

        //console.log($scope.choice);
        if ($scope.ubicate_products == "") {
            alert("No hay productos en la lista para ser ubicados");
        } else if ($scope.choice == "" || $scope.choice == null) {
            alert("Seleccione Una Ubicación");
        } else {
            //console.log("LLamar servicio de ubicaciones");

            //alert($scope.choice);

            $http.post('http://104.236.196.14/api/ubicarproductos.json', {
                ubicacion: $scope.choice,
                tags: JSON.stringify($scope.array_tags)
            }).then(function(response) {
                alert(response.data);
                //console.log(response.data);
                $scope.clearForm();
            }, function(response) {
                alert(response.data.error.exception[0].message);
                $scope.clearForm();
            });
            
        }
    }

    /*CLEAN FORM ONCE IS SENT*/
    $scope.clearForm = function() {
        $scope.ubicate_products = [];
        $scope.choice = "";
        $scope.array_tags = [];
    }

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover1 = popover;
    });

    $scope.closePopover = function() {
        $scope.popover1.hide();
    };

    $scope.openPopover1 = function($event) {
        $scope.popover1.show($event);
    };

    // A confirm dialog
    $scope.showConfirm = function(choice) {
        console.log(choice);
        $scope.choice = choice;
        var confirmPopup = $ionicPopup.confirm({
            title: 'Estas seguro?',
            template: 'Los productos serán asignados en la ubicación seleccionada',
            buttons: [{
                text: 'Aceptar',
                type: 'button-dark',
                onTap: function() {
                    confirmPopup.close();
                    $scope.send_products_to_ubicate();
                }
            }, {
                text: 'Cancelar'
            }]
        });
    };

})


.controller('productosCtrl', function($scope, $ionicModal, $ionicPopup, $ionicPopover, $timeout, $http,  $cordovaCamera, $ionicLoading, $ionicHistory, $cordovaNfc, $NfcUtil) {

    var path_get_notagged = 'http://104.236.196.14/app_dev.php/api/products/sin/tags.json';
    var path_populate_pro = 'http://104.236.196.14/app_dev.php/api/all/products.json';
    var path_create_pro = 'http://104.236.196.14/app_dev.php/api/creates/products.json';
    var path_set_single_tag = 'http://104.236.196.14/app_dev.php/api/asignartags.json';
    var photoUriUnique ="";
    var userlogged = window.localStorage['usidu'];

    $scope.products = "";
    $scope.products_no_tag = "";
    $scope.product = {};
    $scope.photoUri = "";

    $scope.$on("$ionicView.afterLeave", function() {
        $ionicHistory.clearCache();
    });

    /*GET PRODUCTS WITH NO TAG ASIGNED*/
    $scope.getNotaged = function() {

        $ionicLoading.show({
            template: 'Cargando'
        });

        $http.get(path_get_notagged).
        then(function(response) {
            $scope.products_no_tag = response.data;
            //alert(JSON.stringify(response.data));
            $ionicLoading.hide();
            //console.log($scope.products_no_tag);
        }, function(response) {
            console.log("Bad Request");
            $ionicLoading.hide();
        });

    }
    $scope.getNotaged();

    /*OPEN MODAL FOR CREATE NEW PRODUCT AND POPULATE THE OPTION SELECT */
    $scope.newProduct = function() {

        $scope.openModal();
        $http.get(path_populate_pro).
        then(function(response) {
            $scope.products = response.data;
            //console.log($scope.products);
        }, function(response) {
            console.log("Bad Request")
        });
    }

    /*CREATE A NEW SINGLE PRODUCT*/
    $scope.createProduct = function(product) {

        if (product.choice != null) {
            var product_selected = $scope.products[product.choice - 1].id;
        }
        //console.table($scope.products);

        var userlogged = window.localStorage['usidu'];

        if (product_selected == undefined) {
            alert("Debe seleccionar un producto de la lista");
            //$ionicLoading.hide();
            return;
        } else if (product.price == undefined) {
            alert("Debe ingresar un precio para el producto");
            //$ionicLoading.hide();
            return;
        } else if (product.charge == undefined) {
            alert("Debe ingresar el numero de carga");
            //$ionicLoading.hide();
            return;
        }

        $scope.openPopover(event);
        var tag = $scope.tagGenerator();

        var product = {
            producto: product_selected,
            costo: product.price,
            tag: tag,
            talla: product.size,
            marca: product.brand,
            proveedor: product.provider,
            carga: product.charge,
            user: userlogged
        }

        var writeCallback = function(nfcEvent) {
            $cordovaNfc.then(function(nfcInstance) {
                var ndefMessage = [
                    ndef.textRecord(product.tag)
                ];

                nfcInstance.write(ndefMessage).then(function() {
                    //alert("Se escribio el TAG");
                    $scope.closePopover();
                    $ionicLoading.show({
                        template: 'Cargando'
                    });
                    //console.log($scope.photoUri);
                    //console.table(product);

                    $http.post('http://104.236.196.14/app_dev.php/api/creates/products.json', {
                        producto: product.producto,
                        costo: product.costo,
                        tag: product.tag,
                        talla: product.talla,
                        marca: product.marca,
                        proveedor: product.proveedor,
                        carga: product.carga,
                        user: product.user
                    }).then(function(response) {
                        console.log(response);
                        console.log($scope.photoUri);
                        if ($scope.photoUri != "") {
                            $scope.sendPictureProduct(response.data.id);
                        }
                        $ionicLoading.hide();
                        $scope.showAlert();
                        $scope.cleanForm();
                        $NfcUtil.removeNdefListener();
                    }, function(err) {
                        console.log(JSON.stringify(err));
                        $ionicLoading.hide();
                    });


                }, function(err) {
                    alert("Error al escribir TAG " + JSON.stringify(err));
                    $scope.closePopover();
                });

            });
        }

        $NfcUtil.removeAddNdefListener(writeCallback);

    }

    /*CLEAN THE FORM*/
    $scope.cleanForm = function() {
        $scope.product = {};
        $scope.photoUri = "";
    }

    /*GENERATE UNIQUE CODE:'TAG'*/
    $scope.tagGenerator = function() {
        var d = new Date();
        var datecode = d.getTime();
        return datecode;
    }

    /*TAKE PHOTO AND STORE BASE64 CODE*/
    $scope.takePictureProduct = function() {

        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 600,
          targetHeight: 600,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.photoUri ="data:image/jpeg;base64," + imageData;

        var image = document.getElementById('single_img');
        image.src = "data:image/jpeg;base64," + imageData;
       
        }, function(err) {          
            console.log(error);
        });
    };

    /*SEND THE PHOTO WITH STORED BASE64 CODE ONCE THE PRODUCT HAS BEEN CREATED*/
    $scope.sendPictureProduct = function(id) {       

        console.log($scope.photoUri);
        console.log(id);

        $http.post('http://104.236.196.14/app_dev.php/api/asignarimagens.json', {
            id: id,
            imagen: $scope.photoUri
        }).
        then(function(response) {
           //alert("Se guardo la imagen");
            var image = document.getElementById('single_img');
            image.src = "img/default_image.png";
        }, function(response) {
            alert("Ha ocurrido algun error al guardar la imagen en el servidor");
        });
    }

    /*TAKE THE PICTURE AND SEND IT TO THE SERVER*/
    var cachenum = 1;
    $scope.cache = cachenum;
    $scope.takePicture = function(index) {

        $scope.photoUriSingle = "";
        var product_selected = $scope.products_no_tag[index].id;

      var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 600,
          targetHeight: 600,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
        photoUriUnique ="data:image/jpeg;base64," + imageData;           
            sendPhoto(product_selected,index);
        }, function(err) {
          // error
          console.log(error);
        });

        function sendPhoto(id,index) {
            $ionicLoading.show({
                template: 'Cargando Foto'
            });
            $http.post('http://104.236.196.14/app_dev.php/api/asignarimagens.json', {
                id: id,
                imagen: photoUriUnique
            }).
            then(function(response) {
                $ionicLoading.hide();
                $scope.showAlert();
                cachenum++;
                $scope.getNotaged();               
                $scope.cache = cachenum;
            }, function(response) {
                alert("Ha ocurrido algun error");
                $ionicLoading.hide();
            });
        }
    };

    /*SET A TAG IN A SINGLE PRODUCT*/
    $scope.setTagProduct = function(index) {

        var product_selected = $scope.products_no_tag[index].id;
        //console.log(product_selected);

        $scope.openPopover(event);
        var tag = $scope.tagGenerator();


        var writeCallback = function(nfcEvent) {
            $cordovaNfc.then(function(nfcInstance) {
                var ndefMessage = [
                    ndef.textRecord(tag)
                ];

                nfcInstance.write(ndefMessage).then(function() {
                    //alert("Se escribio el tag");
                    $scope.closePopover();

                    $ionicLoading.show({
                        template: 'Cargando'
                    });

                    $http.post(path_set_single_tag, {
                        id: product_selected,
                        tag: tag
                    }).then(function(response) {
                        $ionicLoading.hide();
                        $scope.showAlert();
                        $scope.getNotaged();
                    }, function(err) {
                        console.log(JSON.stringify(err));
                        $ionicLoading.hide();
                    });


                }, function(err) {
                    $scope.closePopover();
                    alert("No se escribio el tag" + JSON.stringify(err));
                });

            });
        }

        $NfcUtil.removeAddNdefListener(writeCallback);
    }

    $scope.cleanTag = function() {
        $scope.openPopover(event);

        var eraseCallback = function(nfcEvent) {
            $cordovaNfc.then(function(nfcInstance) {

                nfcInstance.erase().then(function() {
                    $scope.closePopover();
                    alert("Se ha borrado el tag");
                }, function(err) {
                    $scope.closePopover();
                    alert("Ha ocurrido un error borrando el tag" + JSON.stringify(err));
                });

            });
        }

        $NfcUtil.removeAddNdefListener(eraseCallback);

    }


    /*CURRENT DATE FOR LOAD IN MODAL*/
    var d = new Date();
    var day = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    $scope.today = year + "-" + month + "-" + day;

    /*OPEN MODAL FOR CREATE A NEW PRODUCT*/
    $ionicModal.fromTemplateUrl('createSingleProduct.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    //Popover---------------------------   
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
        $scope.popover1 = popover;
    });

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover1) {
        $scope.popover1 = popover1;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
        $scope.popover1.hide();
    };

    $scope.openPopover1 = function($event) {
        $scope.popover1.show($event);
    };
    /*SHOW SUCCESS ALERT AND DISMISS AFTER 1 SECOND*/
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Guardado',
            template: '<i class="ion-checkmark-circled iconsucces center-x"></i>',
            buttons: []
        });

        $timeout(function() {
            alertPopup.close();
        }, 1000);
    };

})

.controller('inventarioCtrl', function($scope, $ionicModal, $ionicPopup, $ionicPopover, $http, $ionicLoading, $ionicHistory, $cordovaNfc, $NfcUtil) {

    $scope.activate_inventory = false;
    $scope.token = "";
    $scope.inventory = [];
    $scope.count_id = "";
    $scope.array_found_readed = [];
    $scope.array_found_products = [];
    $scope.array_unknown_products = [];
    var confirmPopup = "";

    $scope.$on("$ionicView.afterLeave", function() {
        $ionicHistory.clearCache();
    });


    /*CHECK IF THERE IS ANY AVAILABLE INVENTORY  */
    $scope.validateInventory = function(code) {
        //console.log(code);
        $ionicLoading.show({
            template: 'Cargando'
        });
        $http.get('http://104.236.196.14/app_dev.php/api/inventory/token.json?token=' + code).
        then(function(response) {
            $scope.inventory = response.data;
            console.log($scope.inventory);
            $ionicLoading.hide();
            if ($scope.inventory == "") {
                alert("El código ingresado no existe");
                $scope.activate_inventory = false;
            } else {
                $scope.activate_inventory = true;
                $scope.token = $scope.inventory[0].inventario_token;
            }

        }, function(response) {
            console.log(response);
            $ionicLoading.hide();
            alert("El código ingresado no existe");
        });

    };

    /*CHECK IF THERE IS SOMETHING NEW FOR CURRENT INVENTORY  */
    $scope.refreshInventory = function() {

        if ($scope.activate_inventory) {
            $http.get('http://104.236.196.14/app_dev.php/api/inventory/token.json?token=' + $scope.token).
            then(function(response) {
                $scope.inventory = response.data;
                //console.log($scope.inventory);
            }, function(response) {
                console.log(response);
                alert("El código ingresado no existe");
            });
        } else {
            alert("Ingrese el código del inventario");
        }

    }

    /*OPEN MODAL FOR START COUNTING  */
    $ionicModal.fromTemplateUrl('inventoryList.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.getStoragedProducts();
    });

    /*VERIFY IF TOKEN CORRSPOND TO THE CURRENT ONE*/
    $scope.verifyToken = function() {
        $scope.inventory_code = document.getElementById('inputoken').value;
        //console.log($scope.inventory_code);

        if ($scope.inventory_code != $scope.token) {
            alert("El código ingresado no corresponde");
            confirmPopup.close();
        } else {
            confirmPopup.close();
            $scope.sendTags();
            $scope.modal.hide();
        }
    }

    /*GET ALL THE STORAGED PRODUCTS  */
    $scope.getStoragedProducts = function() {

        $http.post('http://104.236.196.14/app_dev.php/api/products/filters.json').
        then(function(response) {
            $scope.array_found_products = response.data;
            console.table($scope.array_found_products);
        }, function(response) {
            console.log(response);
            // console.log("El tag no existe");
        });
    }

    /*READ TAG AND ADD IT TO THE ARRAY FOR SEND LATER*/
    var c = 0;

    $scope.readTags = function() {

        $scope.openPopover1(event);
        //console.log($scope.array_found_products);
        var readCallback = function(nfcEvent) {

            var tag = nfcEvent.tag;
            var ndefMessage = tag.ndefMessage;
            var tagPayload = nfc.bytesToString(ndefMessage[0].payload).substring(3);

            //alert(tagPayload);

            if (tagPayload == "" || tagPayload == undefined) {
                $scope.closePopover();
                alert("Tag Vacio");
            } else {
                $scope.closePopover();
                for (var i = $scope.array_found_products.length - 1; i >= 0; i--) {
                    if ($scope.array_found_products[i].tag === tagPayload) {
                        $scope.array_found_readed.push($scope.array_found_products[i]);
                        $scope.array_found_products.splice(i, 1);
                    }
                }
            }
        }
        $NfcUtil.removeAddNdefListener(readCallback);
    }

    /*SEND TAGS ARRAY TO THE SERVICE*/
    $scope.sendTags = function() {

            var array_tags = [];

            for (var i = $scope.array_found_readed.length - 1; i >= 0; i--) {
                array_tags.push($scope.array_found_readed[i].tag);
            }
            //array_tags = ["00001", "00006", "1447343383786", "1447343383782", "00005", "1447702820648", "1447637941192", "1447700834229", "1447702028401"];

            $ionicLoading.show({
                template: 'Cargando'
            });

            $http.post('http://104.236.196.14/app_dev.php/api/guardarconteos.json', {
                conteo: $scope.count_id,
                tags: JSON.stringify(array_tags)
            }).
            then(function(response) {
                $ionicLoading.hide();
                alert("Se han enviado los productos para el conteo #: " + $scope.count_number.numero_conteo);
                array_tags.length =0;
            }, function(response) {
                $ionicLoading.hide();
                alert("Ha ocurrido un error inesperado");
            });

        }
        /*MODALS, POPOVER, ALERT*/
    $scope.openModal = function(index) {
        $scope.count_number = $scope.inventory[index];
        $scope.count_id = $scope.inventory[index].id;
        console.log($scope.count_id);
        $scope.modal.show($scope.count_id);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover1 = popover;
    });

    $scope.openPopover1 = function($event) {
        $scope.popover1.show($event);
    };

    $scope.closePopover = function() {
        $scope.popover1.hide();
    };
    // A confirm dialog
    $scope.showConfirm = function() {
        confirmPopup = $ionicPopup.confirm({
            template: '<input type="password" id="inputoken" class="border-gray">',
            title: 'Deseas concluir este conteo?',
            subTitle: 'Ingresa el código del inventario:',
            buttons: [{
                text: 'Aceptar',
                type: 'button-dark',
                onTap: function() {
                    $scope.verifyToken();
                }
            }, {
                text: 'Cancelar'
            }]
        });
    };


});
