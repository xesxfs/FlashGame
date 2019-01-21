module Tips {
	/**
	 *
	 * @author chenwei
	 *2016/07/12
	 */
	
	/*
	 * 错误提示
	 */ 
	export function error (str:string) {
        show(str,true);
	}
	
	/*
	 * 信息
	 */ 
    export function info(str: string) {        
        if(bPlaying == false){
            show(str);
        }
    }
    
    /*
     * 警告
     */    
    export function warn(str: string) {
        show(str);
    }
    
	function show(str:string,isError:Boolean=false){	

        setPlayStatus();

        var showtext = new egret.TextField();
        showtext.size = 28;
        showtext.strokeColor = 0x232323;
        
        var tipsBg: egret.Sprite = new egret.Sprite()
        tipsBg.graphics.beginFill(0x232323);
        let x = 0;
        let y = 0;
        let offset=30;
        tipsBg.graphics.drawRoundRect(x,y,str.length * showtext.size + offset,showtext.size + offset,40);
        tipsBg.graphics.endFill();     
        tipsBg.alpha=0.9;
        showtext.stroke = 2;
        showtext.bold = true;
        showtext.text = str;

        if(isError) {
            //红色
            showtext.textColor =0xfff57a;
        } else {
            //橙色
            showtext.textColor = 0xffffff;
        }         
        
        tipsBg.addChild(showtext);
        showtext.x = (tipsBg.width-showtext.width)/2;
        showtext.y = (tipsBg.height-showtext.height)/2;        
        tipsBg.x = (App.StageUtils.stageWidth - tipsBg.width) / 2;
        tipsBg.y = (App.StageUtils.stageHeight - tipsBg.height) / 2;
        App.LayerManager.tipLayer && App.LayerManager.tipLayer.addChild(tipsBg);
        
        EffectUtils.showFload(tipsBg,2000); 
      }


      //显示信息当中，防止重复不停显示
      var bPlaying:boolean = false;
      var timeID;
      function setPlayStatus(){
          timeID && clearTimeout(timeID);
          bPlaying = true;
          timeID = setTimeout(()=>{
              bPlaying = false;
          },1300);
      }
}
