;(function($){
  'use strict';

  $.fn.imgPosition = function(options){

    var thisElement = $(this.selector);
    var defaults = {
      width:  thisElement.width(),
      height: thisElement.height(),
    };
    var setting = $.extend(defaults, options);

    var addEvent = function(elm,listener,fn){
      try {
        elm.addEventListener(listener,fn,false);
      } catch(e) {
        elm.attachEvent("on"+listener,fn);
      }
    };

    addEvent(window,"load",function(){
      thisElement.css({
          'position': 'relative',
          'width' :    defaults.width,
          'height' :   defaults.height
      });
      thisElement.find("img").each(function(){
        var newImg = new Image();
        newImg.src = $(this).attr("src");

        var reference = resize(newImg);
        
        $(this)
          .attr({
            "width": reference.width,
            "height": reference.height,
          })
          .css({
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "margin-top": reference.marginTop,
            "margin-left": reference.marginLeft
        });

      });
    });

    var getNewSise = function(imgWidth, imgHeight, baseWidth, baseHeight) {
      if( imgWidth <= defaults.width && imgHeight <= defaults.height ){
        return {
          success: true,
          width: imgWidth,
          height: imgHeight
        }
      } else {
        imgWidth -= 10;
        imgHeight = imgWidth / baseWidth * baseHeight;
        return getNewSise(imgWidth, imgHeight, baseWidth, baseHeight);
      }
    };

    var resize = function(newImg) {
      var imgWidth = newImg.naturalWidth;
      var imgHeight = newImg.naturalHeight;
      var baseWidth = imgWidth;
      var baseHeight = imgHeight;
      var result;

      if( defaults.width < baseWidth || defaults.height < baseHeight ){
        // フレームの枠より画像の方が大きい場合
        while(true){
          result = getNewSise(imgWidth, imgHeight, baseWidth, baseHeight);
          if( result.success ){
            break;
          }
        }
        return {
          width: result.width,
          height: result.height,
          marginTop: -(result.height / 2),
          marginLeft: -(result.width / 2),
        }
      } else {
        return {
          width: imgWidth,
          height: imgHeight,
          marginTop: -(imgHeight / 2),
          marginLeft: -(imgWidth / 2),
        };
      }
    };

    return(this);
  };

})(jQuery);