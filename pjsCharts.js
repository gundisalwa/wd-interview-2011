
    
 
function ProcessingBarChart(params, canvas){

    var myself = this;
    
    myself.pjs = new Processing(canvas);
    myself.params = params;
    myself.data = { table: [[]], inputs: [], labels: [] };
    myself.animation = { counter: 0, numFrames: 50 };

    myself.params.pFont =  myself.pjs.loadFont("Arial");
    myself.pjs.textFont( myself.params.pFont, 13);
    myself.pjs.textAlign( myself.pjs.CENTER , myself.pjs.CENTER );
    myself.margins = { top: 10, bottom: 30, left: 60, right: 10}


    myself.rgb2color = function(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return myself.pjs.color(rgb[1],rgb[2],rgb[3]);
    }
    
    myself.params.totalSize = { x: myself.params.chartSize.x                       , y: myself.params.chartSize.y      };
    myself.params.chartSize = { x: myself.params.totalSize.x - myself.margins.left - myself.margins.right , 
                                y: myself.params.totalSize.y - myself.margins.top - myself.margins.bottom };

    
    // Definition for the initial entry point  
    myself.pjs.setup = function() {  
        myself.update();
    
        myself.pjs.size(myself.params.totalSize.x, myself.params.totalSize.y);  
        myself.pjs.loop();
        
        myself.pjs.pushMatrix();
        myself.pjs.translate( 0 , myself.params.totalSize.y );
        myself.pjs.scale(1,-1); 
        
        // HACK: Will only work for a "rgb(red, green, blue)" kind of output from $("element").css("background-color"). Browser dependant.
        myself.pjs.fill(myself.rgb2color( myself.params.backgroundColor ));  
        
        myself.pjs.noStroke();  
        myself.pjs.rect( 0 , 0 , myself.params.totalSize.x , myself.params.totalSize.y ); 
        
        myself.pjs.translate( myself.margins.left , myself.margins.bottom );
        
        myself.drawInputAxis();
        myself.drawValueAxis();
        
        myself.pjs.noStroke();
        myself.animation.counter = 0;

        
    }  
    

    myself.update = function( ){
        
        myself.params.inputWidth = myself.params.chartSize.x / myself.data.inputs.length;
        myself.params.barWidth = 6/8 * 6/(7*myself.data.labels.length-1)*myself.params.inputWidth;
    
        //HACK: TODO: compute myself
        myself.params.valueMax = 0;
        for ( i = 0; i < myself.data.labels.length; i++ ){
            for ( j = 0; j < myself.data.inputs.length; j++ ){
                myself.params.valueMax = Math.max( myself.params.valueMax , myself.data.table[i][j] );
            };
        };
        myself.params.valueMax = 12 * Math.ceil ( myself.params.valueMax * 1.05 / 12 );
        myself.params.valueScale = ( myself.params.chartSize.y ) / myself.params.valueMax;
        
    };
    
    
    myself.drawValueAxis = function () {

        myself.pjs.stroke(0);
        myself.pjs.fill(0);
        
        myself.pjs.line( 0, 0, myself.params.chartSize.x, 0 );
        
        myself.pjs.pushMatrix();
        myself.pjs.scale(1,-1);
        myself.pjs.translate( -myself.margins.left / 2 , 0 );
        
        for (j = 0 ; j < 5 ; j++){
            myself.pjs.text( String( j/4 * myself.params.valueMax ) , 0, 0 );
            myself.pjs.line( myself.margins.left/2, 0, myself.margins.left/2 - 5, 0 );
            myself.pjs.translate ( 0 , -1/4 * myself.params.chartSize.y );
        };
        
        myself.pjs.popMatrix();
    
    };
    
        
    myself.drawInputAxis = function () {
        
        myself.pjs.stroke(0);
        myself.pjs.fill(0);
        
        myself.pjs.line( 0, 0, 0, myself.params.chartSize.y );
        
        myself.pjs.pushMatrix();
        myself.pjs.scale(1,-1);
        myself.pjs.translate (0, myself.margins.bottom /2 );
        
        for (j=0 ; j < myself.data.inputs.length ; j++){
            myself.pjs.line( 0, -myself.margins.bottom/2, 0, -myself.margins.bottom/2 + 5 );
            myself.pjs.translate ( myself.params.inputWidth /2, 0 );
            myself.pjs.text( String( myself.data.inputs[j]), 0, 0 );
            myself.pjs.translate ( myself.params.inputWidth /2, 0 );
        };
        myself.pjs.line( 0, -myself.margins.bottom/2, 0, -myself.margins.bottom/2 + 5 );
        
        myself.pjs.popMatrix();
    
    };
    
    
    myself.pjs.draw = function() {  
            
            myself.pjs.pushMatrix();
            
            for (j=0 ; j<myself.data.inputs.length ; j++){
            
                myself.pjs.pushMatrix();            
                myself.pjs.translate( 1/8 * myself.params.inputWidth, 0 );

            
                for (i=0 ; i<myself.data.labels.length ; i++){
                
                    yHeight = Math.min( myself.data.table[i][j] * myself.params.valueScale , 
                                        myself.animation.counter/myself.animation.numFrames * myself.params.chartSize.y );
            
                    myself.pjs.fill(myself.rgb2color(myself.params.colors[i]));  
                    myself.pjs.rect(0, 0, myself.params.barWidth, yHeight);
                    
                    myself.pjs.translate( 7/6 * myself.params.barWidth, 0 );
                };
                
                myself.pjs.popMatrix();
                myself.pjs.translate( myself.params.inputWidth, 0 );
            };
            
            myself.pjs.popMatrix();

        
            if (myself.animation.counter < myself.animation.numFrames){
                myself.animation.counter++;}
            else{
                myself.pjs.noLoop();}
        };

    
    
                
 }
 
 
 
 function ProcessingPieChart(params, canvas){

    var myself = this;
    
    myself.pjs = new Processing(canvas);
    myself.params = params;
    myself.data = { values: [], labels: [] };
    myself.animation = { counter: 0, numFrames: 50 };
        
    myself.rgb2color = function(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return myself.pjs.color(rgb[1],rgb[2],rgb[3]);
    }
    
    myself.params.radius = Math.min( myself.params.chartSize.x/2 , myself.params.chartSize.y/2 );
    myself.params.pFont =  myself.pjs.loadFont("Arial");
    myself.pjs.textFont( myself.params.pFont, 18);
    myself.pjs.textAlign( myself.pjs.CENTER , myself.pjs.CENTER );

 
    
    // Definition for the initial entry point  
    myself.pjs.setup = function() {  
        myself.update();
    
        myself.pjs.size(myself.params.chartSize.x, myself.params.chartSize.y);  
        myself.pjs.loop();
        myself.pjs.noStroke();
 
        myself.pjs.pushMatrix();
        myself.pjs.translate( 0 , myself.params.chartSize.y );
        myself.pjs.scale(1,-1);
        myself.pjs.translate( myself.params.chartSize.x/2 , myself.params.chartSize.y/2 );
        
        // HACK: Will only work for a "rgb(red, green, blue)" kind of output from $("element").css("background-color"). Browser dependant.
        myself.pjs.fill( myself.rgb2color( myself.params.backgroundColor ));  
        myself.pjs.rect(  -myself.params.chartSize.x/2 , -myself.params.chartSize.y/2, 
                           myself.params.chartSize.x , myself.params.chartSize.y);
                           
        myself.animation.counter = 0;
                   
    }  
    

    myself.update = function( ){
        
        myself.params.total = 0;
        for (j=0; j< myself.data.values.length; j++){
            myself.params.total += myself.data.values[j];
        };
        myself.params.scale = 2*Math.PI / myself.params.total;
    };
            
        
    myself.pjs.draw = function() {  
            
        myself.pjs.pushMatrix();
            
            var angle = 0;
            var total = 0;
            var aux = 0;
            var percentage = 0;
            for (i=0 ; i < myself.data.labels.length ; i++){
            
                    angle  = myself.data.values[i] * myself.params.scale;
                    angle *= myself.animation.counter / myself.animation.numFrames;

                    myself.pjs.fill(myself.rgb2color(myself.params.colors[i]));  
                    myself.pjs.arc(0, 0, 2*myself.params.radius, 2*myself.params.radius, total, total+angle);
                                        
                    if ( angle > Math.PI/6 ){
                    
                        aux = total + angle/2;
                        aux -= (aux > Math.PI)? 2*Math.PI : 0;
                                        
                        myself.pjs.pushMatrix();
                        
                        myself.pjs.rotate(aux);
                        myself.pjs.translate( myself.params.radius/2, 0)
                        if ( Math.abs(aux) > Math.PI/2 ){
                            myself.pjs.rotate(Math.PI)};
                        myself.pjs.scale(1,-1);

                        myself.pjs.fill(myself.rgb2color(myself.params.backgroundColor));  
                        percentage = Math.floor(100*angle/(2*Math.PI));
                        myself.pjs.text( String(percentage) +"%", 0, 0);
                        
                        myself.pjs.popMatrix(); 
                    }

                    total += angle;
            };
            
            myself.pjs.popMatrix();
        
            if (myself.animation.counter < myself.animation.numFrames){
                myself.animation.counter++;}
            else{
                myself.pjs.noLoop();}
        };

    
    
                
 }



