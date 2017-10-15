        $(document).ready(function () {
            var debug = true;
            var source = null;
            var url = 'jqxtree.php';
            var method = 'POST';
// Create jqxExpander
            $('#jqxExpander').jqxExpander({ showArrow: false, toggleMode: 'none', width: '300px', height: '400px'});
            $("#dialog").jqxWindow({
                resizable: false,
                width: 350,
                height: 120,
                position: { left: $("#jqxTree").offset().left + 150, top: $("#jqxTree").offset().top + 50 },
                autoOpen: false
            });
            $("#dialog").css('visibility', 'visible');
            $("#save").jqxButton({ height: 30, width: 80 });
            $("#cancel").jqxButton({ height: 30, width: 80 });
            $("#cancel").mousedown(function () {
                $("#dialog").jqxWindow('close');
            });
            $("#save").mousedown(function () {
                if( isFound($("#Title").val()) == true) {
                     var mess = $("#mess");
                     $("#popover").jqxPopover({ offset: { left: 0, top: 0 }, arrowOffsetValue: 0, position: "top", title: "Предупреждение:", showCloseButton: true, selector: $("#save") });
                     mess[0].innerHTML = 'Папка с таким именем уже есть.';
                     return false;
                }
                $("#dialog").jqxWindow('close');
                rename_folder($('#jqxTree').jqxTree('selectedItem').label, $("#Title").val());
                $('#jqxTree').jqxTree('updateItem', $('#jqxTree').jqxTree('selectedItem'), {icon: "./images/folder.png", label: $("#Title").val()});
            });

            if (debug) {
                var procData = 'page=tree&action=debug';
                $.ajax({
                    async: false,
                    type: method,
                    url: url,
                    data: procData,
                    success: function (data, status, xhr) {
                        try {
                        source = jQuery.parseJSON(data);
                        } catch (e) {
                            alert('Ошибка json: ' + data);
                            return;
                        }
                        if(source.error) {
                            alert(source.error);
                            return;
                        }
                        debug = source.debug;
                    }
                });
                if (debug) {
                    $('#Events').jqxPanel({  height: '400px', width: '500px' });
                    $('#Events').css('border', 'none');
                    $("#jqxbutton_clear").jqxButton({ width: 170, height: 30});
                    $('#jqxbutton_clear').click(function () {
                        $('#Events').jqxPanel('clearcontent');
                    });
                }
            }

//          Create jqxTree
            var procData = 'page=tree&action=reqwest';
            $.ajax({
                async: false,
                type: method,
                url: url,
                data: procData,
                complete: function(xhr, textStatus) {
                    if (debug) {
                        $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + url + '?' + procData + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                    }
                },
                success: function (data, status, xhr) {
                    try {
                    source = jQuery.parseJSON(data);
                    } catch (e) {
                        alert('Ошибка json: ' + data);
                        return;
                    }
                    i = 0;
                    $.each(source, function () {
                        if (source[i].error) {
                            alert(source[i].error);
                        }
                        i++;
                    });
                }
            });

            $('#jqxTree').jqxTree({ source: source, width: '100%', height: '100%'});
            $('#jqxTree').jqxTree('selectItem', null);

            $('#jqxTree').on('expand', function (event) {
                var label = $('#jqxTree').jqxTree('getItem', event.args.element).label;
                var $element = $(event.args.element);
                var loader = false;
                var loaderItem = null;
                var children = $element.find('ul:first').children();
                $.each(children, function () {
                    var item = $('#jqxTree').jqxTree('getItem', this);
                    if (item && item.label == 'Загрузка...') {
                        loaderItem = item;
                        loader = true;
//                        return false;
                    };
                });
                if (loader) {
                    var url = loaderItem.value.split("?")[0];
                    var procData = loaderItem.value.split("?")[1];
                     $.ajax({
                        async: false,
                        type: method,
                        url: url,
                        data: procData,
                        complete: function(xhr, textStatus) {
                            if (debug) {
                                $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + loaderItem.value + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                            }
                        },
                        success: function (data, status, xhr) {
                            var items = jQuery.parseJSON(data); // icon: "./images/folder.png", 
                            $('#jqxTree').jqxTree('addTo', items, $element[0]);
                            $('#jqxTree').jqxTree('removeItem', loaderItem.element);
                        }
                    });
                }
            });            // Create jqxTree

            var contextMenu = $("#jqxMenu").jqxMenu({ width: '150px',  height: '140px', autoOpenPopup: false, mode: 'popup' });
            var clickedItem = null;
            var attachContextMenu = function () {
                var timerId = null;
                // open the context menu when the user presses the mouse right button.
                $("#jqxTree").on('mousedown', function (event) {
                    var target = $(event.target).parents('li:first')[0];
                    var rightClick = isRightClick(event);
                    if (rightClick && target != null) {
                        $("#jqxTree").jqxTree('selectItem', target);
                        var scrollTop = $(window).scrollTop();
                        var scrollLeft = $(window).scrollLeft();
                        contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                        return false;
                    }
                });
                window.addEventListener('touchstart', function(event) { //  mousedown
                  if (timerId !== null) {
                    clearTimeout(timerId);
                    timerId = null;
                  }
                  timerId = setTimeout(function() {                                 
                    var target = $(event.target).parents('li:first')[0];
                    if (target != null) {
                        $("#jqxTree").jqxTree('selectItem', target);
                        var scrollTop = $(window).scrollTop();
                        var scrollLeft = $(window).scrollLeft();
                        contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                        timerId = null;
                        return false;
                    }
                  }, 1500);                                                         
                }, false);                                                          
                                                                                    
                window.addEventListener('touchmove',function(event) { //   mousemove
                  clearTimeout(timerId);                                            
                  timerId = null;
                }, false);                                                          
                                                                                    
                window.addEventListener('touchend',function(event) { //      mouseup
                  clearTimeout(timerId);                                            
                  timerId = null;
                }, true);                                                          
            }
            attachContextMenu();
            $("#jqxMenu").on('itemclick', function (event) {
                var selectedItem = $('#jqxTree').jqxTree('selectedItem');
//              alert(selectedItem.element.innerHTML);
                var prevLabel = getlabel('getPrevItem', selectedItem.element);
                var nextLabel = getlabel('getNextItem', selectedItem.element);
                var item = $.trim($(event.args).text());
                var nameNew = '';
                switch (item) {
                    case "Добавить в папку":
                        nameNew = getNewName();
                        if (selectedItem != null) {
                            $('#jqxTree').jqxTree('addTo', { icon: "./images/folder.png", label: nameNew }, selectedItem.element);
                        } else {
                            $('#jqxTree').jqxTree('addTo', { icon: "./images/folder.png", label: nameNew }, null, false);
                        }
                        // update the tree.
                        $('#jqxTree').jqxTree('render');
                        create( 'inside', prevLabel, selectedItem.label, nextLabel, nameNew);
                        attachContextMenu();
                        break;
                    case "Добавить до":
                        nameNew = getNewName();
                        if (selectedItem != null) {
                            $('#jqxTree').jqxTree('addBefore', { icon: "./images/folder.png", label: nameNew }, selectedItem.element, false);
                            // update the tree.
                            $('#jqxTree').jqxTree('render');
                        }          
                        create('before', prevLabel, selectedItem.label, nextLabel, nameNew);
                        attachContextMenu();
                        break;
                    case "Добавить после":
                        nameNew = getNewName();
                        if (selectedItem != null) {
                            $('#jqxTree').jqxTree('addAfter', { icon: "./images/folder.png", label: nameNew }, selectedItem.element, false);
                            // update the tree.
                            $('#jqxTree').jqxTree('render');
                            create('after', prevLabel, selectedItem.label, nextLabel, nameNew);
                            attachContextMenu();
                        }          
                        break;
                    case "Удалить":
                        if (selectedItem != null) {
                            $('#jqxTree').jqxTree('removeItem', selectedItem.element);
                            delete_folder(prevLabel, selectedItem.label, nextLabel);
                            attachContextMenu();
                        }
                        break;
                    case "Редактировать":
                        if (selectedItem != null) {
                            var args = event.args;
                            var key = args.key;
                            var row = args.row;
                            // update the widgets inside jqxWindow.
                            $("#dialog").jqxWindow('setTitle', "Редактирование папки");
                            $("#dialog").jqxWindow('open');
                            $("#dialog").attr('data-row', key);
                            $("#Title").attr('size', '30');
                            $("#Title").val(selectedItem.label);
                            $('#Title').focus(); 
                        }
                        break;
                }
            });

            // disable the default browser's context menu.
            $(document).on('contextmenu', function (e) {
                if ($(e.target).parents('.jqx-tree').length > 0) {
                    return false;
                }
                return true;
            });

            $("#jqxTree").jqxTree({dragEnd: function (item, dropItem, args, dropPosition, tree) {
                drag_folder( item.label, 
                             getlabel('getNextItem', item.element), 
                             getlabel('getPrevItem', dropItem.element), 
                             dropItem.label, 
                             getlabel('getNextItem', dropItem.element), 
                             dropPosition, 
                             item.label);
            }
            });

            function getlabel(strItrem, element) {
                var nextItem = $("#jqxTree").jqxTree(strItrem, element);
                if (nextItem) {
                   nextLabel = nextItem.label;
                } else {
                   nextLabel = '0';
                }
                return nextLabel;
            }        
            function isRightClick(event) {
                var rightclick;
                if (!event) var event = window.event;
                if (event.which) rightclick = (event.which == 3);
                else if (event.button) rightclick = (event.button == 2);
                return rightclick;
            }        
            function isFound(title) {
                var rV = false;
                var items = $('#jqxTree').jqxTree('getItems');
                for (var i = 0; i < items.length; i++) {
                    if ( $('#jqxTree').jqxTree('selectedItem').label == items[i].label) continue;
                    if (items[i].label == title) {
                       rV = true;
                       break;
                    }
                }
                return rV;
            }
/*
            function getNewName() { 
                var rV = 'Новая папка';
                var items = $('#jqxTree').jqxTree('getItems');
                var match = 0;
                var lnew = false;
                for (var i = 0; i < items.length; i++) {
                    if ( parseInt(items[i].label.lastIndexOf(rV)) > -1) {
                        lnew = true;
                        m = parseInt(/\d+/.exec(items[i].label));
                        if (m > match) {
                            match = m;
                        }
                    }
                }
                if (match > 0 || lnew) {
                    match++;
                    rV = rV + ' ' + match.toString();
                }
                return rV;
            }
*/
            function getNewName() { 
                var procData = 'page=tree&action=new';
                $.ajax({
                    async: false,
                    type: method,
                    url: url,
                    data: procData,
                    complete: function(xhr, textStatus) {
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + url + '?' + procData + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                        }
                    },
                    success: function (data, status, xhr) {
                        try {
                        source = jQuery.parseJSON(data);
                        } catch (e) {
                            alert('Ошибка json: ' + data);
                            return;
                        }
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'return: ' + source.retval + '</div>');
                        }
                    }
                });
                return source.retval;
            }
            function create(strin, prevLabel, selLabel, nextLabel, newLabel) { 
               var procData = 'page=tree&action=create&sellabelStart=&in=' + strin + '&prevlabel=' + prevLabel + '&sellabel=' + selLabel + '&nextlabel=' + nextLabel + '&newlabel=' + newLabel;
               var procDataEncoded = encodeURI(procData);
                $.ajax({
                    async: true,
                    type: method,
                    url: url,
                    data: procDataEncoded,
                    complete: function(xhr, textStatus) {
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + url + '?' + procData + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                        }
                    },
                    success: function (data, status, xhr) {
                        try {
                        source = jQuery.parseJSON(data);
                        } catch (e) {
                             alert('Ошибка json: ' + data);
                             return;
                        }
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'return: ' + source.retval + '</div>');
                        }
                    }
                });
            }

            function delete_folder( prevLabel, selLabel, nextLabel) { 
               var procData = 'page=tree&action=delete&prevlabel=' + prevLabel + '&sellabel=' + selLabel + '&nextlabel=' + nextLabel;
               var procDataEncoded = encodeURI(procData);
               console.log('prevLabel=' + prevLabel + '\nselLabel=' + selLabel + '\nnextlabel=' + nextLabel);
                $.ajax({
                    async: true,
                    type: method,
                    url: url,
                    data: procDataEncoded,
                    complete: function(xhr, textStatus) {
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + url + '?' + procData + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                        }
                    },
                    success: function (data, status, xhr) {
                        try {
                        source = jQuery.parseJSON(data);
                        } catch (e) {
                            alert('Ошибка json: ' + data);
                            return;
                        }
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'return: ' + source.retval + '</div>');
                        }
                    }
                });
            }

            function rename_folder( selLabel, newLabel) { 
               var procData = 'page=tree&action=rename&sellabel=' + selLabel + '&newlabel=' + newLabel;
               var procDataEncoded = encodeURI(procData);
                $.ajax({
                    async: true,
                    type: method,
                    url: url,
                    data: procDataEncoded,
                    complete: function(xhr, textStatus) {
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + url + '?' + procData + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                        }
                    },
                    success: function (data, status, xhr) {
                        try {
                        source = jQuery.parseJSON(data);
                        } catch (e) {
                            alert('Ошибка json: ' + data);
                            return;
                        }
                        if (debug) {
                            $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'return: ' + source.retval + '</div>');
                        }
                    }
                });
            }

            function drag_folder( selLabelStart, nextLabelStart, prevLabel, selLabel, nextLabel, instr, newLabel) {
               var procData = 'page=tree&action=drag&sellabelstart=' + selLabelStart + '&newlabel=' + newLabel + '&nextlabelstart=' + nextLabelStart + '&in=' + instr + '&prevlabel=' + prevLabel + '&sellabel=' + selLabel + '&nextlabel=' + nextLabel;
               var procDataEncoded = encodeURI(procData);
//               console.log('sellabelstart=' + selLabelStart + '\nnewlabel=' + newLabel + '\nnextlabelstart=' + nextLabelStart + '\nin=' + instr + '\nprevlabel=' + prevLabel + '\nsellabel=' + selLabel + '\nnextlabel=' + nextLabel);
               // Перенос саму в себя
               if (instr == 'before' && selLabelStart == selLabel) return;
               if (instr == 'inside' && selLabelStart == selLabel) return;
               if ( instr == 'after' && selLabelStart == selLabel) return;
               $.ajax({
                   async: true,
                   type: method,
                   url: url,
                   data: procDataEncoded,
                   complete: function(xhr, textStatus) {
                       if (debug) {
                           $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'url: ' + url + '?' + procData + ' ' + textStatus + ' ' + xhr.status + ' ' + xhr.statusText + '</div>');
                       }
                   },
                   success: function (data, status, xhr) {
                       try {
                       source = jQuery.parseJSON(data);
                       } catch (e) {
                           alert('Ошибка json: ' + data);
                           return;
                       }
                       if (debug) {
                           $('#Events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + 'return: ' + source.retval + '</div>');
                       }
                   }
               });
            }
     });
