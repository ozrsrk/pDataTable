<?php
namespace pDataTables;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class pDataTable {
    private $tableData;
    private $tableColumn;
    private $tableDefColumn;
    private $pData;
                   
    public function __construct()
        {
        $this->pData=array(
            "dataItems" =>array(),
            "total_items" =>0,
            "total_pages" =>0,        
            );
        return $this;
        }

    public function getData()
        {
        $this->pData['dataItems']=$this->tableData;
        return $this->pData;       
        }
        
    public function setData($resultset)
        {      
        $request = new \Phalcon\Http\Request();
        $data = json_decode($request->getRawBody(), true);
               
        if(isset($data['PDataTables']['limit']))
            {
            $limit= $data['PDataTables']['limit'];       
            }
        else{
            $limit=10;
            }
            
        if(isset($data['PDataTables']['page']))
            {
            $page= $data['PDataTables']['page'];       
            }
        else{
            $page=1;
            }
        
         
            
        if(isset($data['searchString']))
            {
            $pDataTablesSearchStr= $data['searchString'];
            }
        else 
            {
            $pDataTablesSearchStr="";
            }

        if ($pDataTablesSearchStr!="")
            {
            $indexx=0;
            for ($i=0;$i<count($data['PDataTables']['columns']);$i++)
                {
                if((!isset($data['PDataTables']['columns'][$i]['searchable'])) || ($data['PDataTables']['columns'][$i]['searchable']!=0))
                    {
                    if($indexx==0)
                        {
                        $resultset = $resultset->andWhere($data['PDataTables']['columns'][$i]['data']." ILIKE '%".$pDataTablesSearchStr."%'");
                        }
                    else
                        {
                        $resultset = $resultset->orWhere($data['PDataTables']['columns'][$i]['data']." ILIKE '%".$pDataTablesSearchStr."%'");
                        }
                    $indexx++;
                    }
                }
            }

        //echo "AAAAAAA : ".$data['PDataTables']['order'];    
            
        if($data['PDataTables']['order'])    
            {
            $resultset = $resultset->orderBy($data['PDataTables']['order']);
            }
            
        $paginator = new PaginatorModel(
                [
                'data'  => $resultset->execute(), 
                'limit' => $limit,
                'page'  => $page,
                ]
                );
        
        $pages = $paginator->getPaginate();
              
        $this->pData['pageCount']=$pages->total_pages;
        $this->pData['totalRecordCount']=$pages->total_items;
        $this->pData['recordCount']=count($pages->items);
        $this->pData['activePage']=$page;
        
        $table_array=array();            
        foreach ($pages->items as $item)
            {
            $table_array[]=(array) $item;
            }
        $this->tableData=$table_array;
        return $this;
        }   
        
    public function addColumn($column_name, $callback)
        {        
        if(is_callable($callback))
            {
            for ($i=0;$i<count($this->tableData);$i++)
                {
                $ret= new \stdClass();
                foreach ($this->tableData[$i] as $key => $value) 
                    {
                    $ret->$key=$this->tableData[$i][$key];
                    }
                $this->tableData[$i][$column_name]=call_user_func($callback,$ret);
                }
            } 
        else 
            {
            $this->tableColumn[]=[
                     "column_name"  =>  $column_name,
                     "column_data"  =>  (string)$callback,
                     ];
            }
        return $this;        
        }        
      
    public function make()
        { 
        $this->tableDefColumn=[];
       
        if(count($this->tableData))
            {         
            foreach ($this->tableData[0] as $key=>$value)
                {             
                $this->tableDefColumn[]=$key;
                }
            
            for ($i=0;$i<count($this->tableData);$i++)       
                { 
                for ($x=0;$x<count($this->tableColumn);$x++)
                    {
                    $this->tableData[$i][$this->tableColumn[$x]['column_name']]=$this->replace($this->tableColumn[$x]['column_data'],$i);
                    }
                }
            }
        return $this;         
        }

    public function replace( $data_str, $i)
        {
        foreach ($this->tableDefColumn as $value) {           
            $avalue="[[".$value."]]";                 
            $data_str=str_replace($avalue,$this->tableData[$i][$value] ,$data_str);           
            }
        return $data_str;
        } 

    public function setArrayData_xxxxxxx($resultset)
        {
        $this->tableData=$resultset;       
        return $this;
        }          
        
    }