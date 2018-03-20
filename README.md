# pDataTable
Phalcon Ajaxa datatable


Phalcon Php için Ajax DataTable


======================================================================================

View (Volt)
<pre>  
  <table id="cariListesi" class="table table-hover  col-sm12" role="grid">
      <thead>        
          <tr>                                    
              <th width="5"></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
              <th>D</th>
          </tr>
      </thead>
      <tbody>                                    
      </tbody>
  </table>
  
  
  
<script src="{{url("plugins/pDataTables/pDataTables.js")}}"></script>

tableCariListesipDataTables={
    url         :   '{{url("Carikart/getCariListPage")}}',
    table       :   'cariListesi',
    page        :   1, 
    limit       :   10,
    ozelkod1    :   '',
    ozelkod2    :   '',
    ozelkod3    :   '',
    kategori1   :   0,
    kategori2   :   0,
    kategori3   :   0,
    columns     :   [   
                        {data   :   "action1",searchable  : false},
                        {data   :   "ad_soyad"},
                        {data   :   "cep_telefon"},
                        {data   :   "is_telefon"},
                        {data   :   "eposta"},
                        {data   :   "id", searchable  : false,hide  :   true,},
                    ],
    }
$("#cariListesi").pDataTables(tableCariListesipDataTables);
</script>

=====================================================================
Controller
=====================================================================

$resultset  = Carikart::Query()
        ->columns("Carikart.cari_id,Carikart.ad_soyad,Carikart.cep_telefon,Carikart.is_telefon,eposta")
        ->where("Carikart.deleted_at=1");      

$dt= new DT();
$pdata =$dt->setData($resultset)
     ->addColumn("action1", function($resultset){
        return '<input type="radio" name="id" value="'.$resultset->cari_id.'" class="cariIdInput" onClick="JSF__selectedCariKartId('.$resultset->cari_id.')">';  
        })   
    ->make()->getData();

return  json_encode($pdata, JSON_PRETTY_PRINT); 
</code>
