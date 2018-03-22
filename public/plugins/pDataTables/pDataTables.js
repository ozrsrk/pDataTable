jQuery.fn.pDataTables = function( options )
    { 
    var viewCount = [1,3,5,10,15,25,50,100];        
    var langs={

            TR:[
                {
                ARA     : "Ara",
                GOSTER  : "%s Kayıt Göster",
                TOTAL   : "%s Kayıttan %f tanesi gösteriliyor",
                }
                ],
                
           EN:[
                {
                ARA     : "Search",
                GOSTER  : "Show %s entries",
                TOTAL   : "Showing %f of %s entries",
                }
                ],                
            }; 
        
      
    var defaults = {
        url             :   "",
        table           :   "",
        columns         :   "",
        method          :   "POST",
        limit           :   10,
        page            :   1, 
        lang            :   "TR",
        order           :   ""
        }; 
        
            
        
    var settings = $.extend( {}, defaults, options ); 
    return this.each(function()
        {
        var $this = $(this);        
        $(this).off("keyup","#pDataTablesSearch");
        $(this).on('keyup','#pDataTablesSearch',function(e)
            {
            if( (e.keyCode == 13 || e.keyCode == 20 || e.keyCode == 27 ||e.keyCode == 144 || e.keyCode == 91 || e.keyCode == 92) || (e.keyCode >= 33 && e.keyCode <= 40) || (e.keyCode >= 16 && e.keyCode <= 18) )
                {
                return false;
                }
            else
                {
                getData();
                }
            });        
           
        $(this).off('change','select',);                  
        $(this).on('change','select', function (e) {                  
            settings.limit=e.target.value;
            settings.page=1;
            getData();
            e.preventDefault();                
            }), 
                   
        $(this).off("click", "thead th a");
        $(this).on("click", "thead th a", function(e) {
                         

            if($(e.target).data('order')=="")
                {
                $(e.target).data('order',"asc");
                }
            else if($(e.target).data('order')=="asc")
                {
                $(e.target).data('order',"desc");
                }
            else
                {
                $(e.target).data('order',"asc");
                }
            settings.order=settings.columns[$(e.target).data('index')].data+' '+$(e.target).data('order');               
            getData();
            });
            
        $(this).off("click","ul li span"); 
        $(this).on("click","ul li span", function(e) {
            settings.page=$(e.target).data('page');
            e.preventDefault();
            getData();  
            });
                            
        getData();  
        setpDataTablesHeader();
 
        function setpDataTablesHeader()
            {
            $("#"+table+" thead tr th ").each(function(i,v){
            if($("#"+table+" thead tr th ").eq(i).text()!='')
                {
                $("#"+table+" thead tr th a").eq(i).remove();
                $("#"+table+" thead tr th ").eq(i).append(' &nbsp; <a ><i class="fa fa-sort" aria-hidden="true" data-order="" data-index="'+i+'"></i></a>');
                }
            });
                
            rowCount = $("#"+table+" thead tr th").length;
            if($("#"+table+" thead tr").length>1)
                {
                $("#"+table+" thead tr:first").remove();        
                }   
                

            $("#"+table).find('thead tr').before(
                '<tr>'+
                    '<th colspan="'+rowCount+'">'+
                        '<div class="form-group col-xs-3">'+
                            '<select class="form-control col-xs-2" id="pDataTablesLimit">'+
                            '</select>'+
                        '</div>'+
                        '<div class="form-group col-md-3 col-md-offset-6 col-xs-6 col-xs-offset-3 ">'+
                            '<div class="input-group ">'+
                                '<input type="text" class="form-control" placeholder="'+langs[settings.lang][0].ARA+'" id="pDataTablesSearch" name="pDataTablesSearch">'+
                                '<div class="input-group-btn">'+
                                    '<button class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</th>'+
                '</tr>');
    
            for (var i = 0; i < viewCount.length; i++) 
                {               
                if(viewCount[i]==settings.limit)
                    {
                    selected=" selected ";
                    }
                 else
                    {
                    selected=" ";
                    }

                viewCountStr=langs[settings.lang][0].GOSTER.replace(/%s/g, viewCount[i]);
                $("#"+table +" thead tr th div #pDataTablesLimit").append('<option '+selected+ ' value="'+viewCount[i]+'">'+viewCountStr+'</option>');
                }
            }

        function getData()
            {
            table=settings.table;
            rowCount = $("#"+table+" thead tr th").length;
            $("#"+table).find('tbody').html('');        
            $.ajax({
                url         :   settings.url,
                method      :   settings.method,
                dataType    :   'json',
                data        :   JSON.stringify({ PDataTables: settings,searchString:$("#"+table+" #pDataTablesSearch").val()}),
                contentType :   "application/json; charset=utf-8",        
                beforeSend  :   function(){
                    $("#"+table).find('tbody').html('');
                    $("#"+table).find('tbody').append( '<tr><td align="center" colspan="'+rowCount+'"><span id="pDatatablesLoading" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></td></tr>');
                    },
                success     :   function(data){
                    settings.page=1;
                    $("#"+table+" tbody tr").remove();
                    
                    $("#"+table+" div #recordCountInfo").html('');
                    totalCountStr=langs[settings.lang][0].TOTAL.replace(/%f/g, data.recordCount,data.recordCount);
                    totalCountStr=totalCountStr.replace(/%s/g, data.totalRecordCount);
                
                    $("#"+table+" div #recordCountInfo").html("<br />"+totalCountStr);
                    $("#"+table+" tfoot tr th #pagination ul li").remove();
                    $.each(data.dataItems, function(i, item) {
                        $("#"+table).find('tbody').append( '<tr></tr>');
                            $.each(settings.columns, function(x,itm){
                                if(itm['hide']!==true)
                                    {                                        
                                    if(itm['dataStrArray'])
                                        {
                                        $("#"+table).find('tbody tr').last().append( '<td>'+ itm['dataStrArray'][item[itm['data']]]+'</td>');
                                        }
                                    else if(itm['dateEnToTr'])
                                        {
                                        var dateAr = item[itm['data']].split('-');
                                        var newDate = dateAr[2] + '.' + dateAr[1] + '.' + dateAr[0].slice(-4);
                                        $("#"+table).find('tbody tr').last().append( '<td>'+newDate +'</td>');
                                        }
                                    else if(itm['style'])
                                        {
                                        $("#"+table).find('tbody tr').last().append("<td style='"+itm['style']+"'>"+item[itm['data']]+"</td>");
                                        }                                    
                                    else if(itm['concatField'])
                                        {
                                        $("#"+table).find('tbody tr').last().append('<td>'+item[itm['data']]+" "+item[itm['concatField']]+'</td>');
                                        }                                    
                                    else
                                        {
                                        $("#"+table).find('tbody tr').last().append( '<td>'+item[itm['data']]+'</td>');
                                        }
                                    }
                                });
                            });
                if(data.activePage>1)
                    {
                    $("#"+table+" tfoot tr th #pagination ul").append('<li><span style="cursor:pointer;" data-page="1" class="glyphicon glyphicon-step-backward"></span></li>');
                    $("#"+table+" tfoot tr th #pagination ul").append('<li><span style="cursor:pointer;" data-page="'+(data.activePage-1)+'"class="glyphicon glyphicon-chevron-left"></span></li>');
                    }
                x=0;
                for (var i=data.activePage;i<=data.pageCount;i++)
                    {
                    x++;
                    if(x<10)
                        {
                        if(i==data.activePage){active='class="active"'}else{active=''}
                        $("#"+table+" tfoot tr th #pagination ul").append('<li '+active+'><span style="cursor:pointer;" data-page="'+(i)+'">'+i+'</span></li>');
                        }
                    }
                
                if(data.activePage<data.pageCount )
                    {
                    $("#"+table+" tfoot tr th #pagination ul").append('<li><span style="cursor:pointer;" data-page="'+(data.activePage+1)+'"class="glyphicon glyphicon-chevron-right"></span></li>');               
                    $("#"+table+" tfoot tr th #pagination ul").append('<li><span style="cursor:pointer;" data-page="'+(data.pageCount)+'" class="glyphicon glyphicon-step-forward"></span></li>');                
                    }
                },   
                complete    : function() {
                                $("#pdatatablesLoading").remove();
                            },
                failure: function(errMsg) {
                            alert(errMsg);
                            }
                });
        setpDataTablesTfoot();
        }

        function setpDataTablesTfoot()
            {
            rowCount = $("#"+table+" thead tr th").length;
            $("#"+table+' tfoot tr').remove();        
            
            $("#"+table).append('<tfoot><tr><th colspan="'+rowCount+'"></th></tr></tfoot>');
            $("#"+table+' tfoot tr:last').after(
                '<tr>'+
                    '<th colspan="'+rowCount+'">'+
                        '<div id="pagination" class="form-group col-xs-12 col-md-8 pull-left"><ul class="pagination col-md-12"></ul></div>'+
                        '<div class="form-group col-xs-12 col-md-4">'+
                            '<label id="recordCountInfo" class="pull-right"></label>' +
                        '</div>'+
                    '</th>'+
                '</tr>');
            }
        })
    }
