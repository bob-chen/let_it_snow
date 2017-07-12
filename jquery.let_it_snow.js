/* ===========================================================
 * jquery-let_it_snow.js v1
 * ===========================================================
 * Let it Snow (Support multiple image)
 *
 * NOTE: This plugin is based on the work by Jason Brown (Loktar00)
 * https://github.com/loktar00/JQuery-Snowfall
 * http://www.thepetedesign.com
 *
 * As the end of the year approaches, let's add 
 * some festive to your website!
 *
 * https://github.com/bob-chen/let_it_snow 
 * Forked from https://github.com/peachananr/let_it_snow
 *
 * ========================================================== */

!function($){
  
  var defaults = {
    speed: 0,
    interaction: true,
    size: 2,
    count: 200,
    opacity: 0,
    color: "#ffffff",
    windPower: 0,
    images: false
    };

  function isImgOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
      return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
      return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
  }

  $.fn.let_it_snow = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        flakes = [],
        canvas = el.get(0),
        ctx = canvas.getContext("2d"),
        flakeCount = settings.count,
        mX = -100,
        mY = -100;
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        el.on("letItSnow.set", function (event, prop, value) {
            settings[prop] = value;
        });
        
    (function() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
        window.requestAnimationFrame = requestAnimationFrame;
    })();
    
    function snow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < flakeCount; i++) {
            var flake = flakes[i],
                x = mX,
                y = mY,
                minDist = 100,
                x2 = flake.x,
                y2 = flake.y;

            var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
                dx = x2 - x,
                dy = y2 - y;

            if (dist < minDist) {
                var force = minDist / (dist * dist),
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force / 2;

                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;

            } else {
                flake.velX *= .98;
                if (flake.velY <= flake.speed) {
                    flake.velY = flake.speed
                }
                
                switch (settings.windPower) { 
                  case false:
                    flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
                  break;
                  
                  case 0:
                    flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
                  break;
                  
                  default: 
                    flake.velX += 0.01 + (settings.windPower/100);
                }
            }

            var s = settings.color;
            var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
            var matches = patt.exec(s);
            var rgb = parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16);

            
            flake.y += flake.velY;
            flake.x += flake.velX;

            if (flake.y >= canvas.height || flake.y <= 0) {
                reset(flake);
            }


            if (flake.x >= canvas.width || flake.x <= 0) {
                reset(flake);
            }
            if (settings.images == false) {
              ctx.fillStyle = "rgba(" + rgb + "," + flake.opacity + ")"
              ctx.beginPath();
              ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
              ctx.fill();
            } else {
              var imgElement = settings.imageItems[ i%settings.imageNum ];

              // Fix: fix INDEX_SIZE_ERR which caused by drawImage with unloaded img element
              if (isImgOk(imgElement)) {
                ctx.drawImage(settings.imageItems[ i%settings.imageNum ], flake.x, flake.y, flake.size * 2, flake.size * 2 );
              }
            }
            
        }
        requestAnimationFrame(snow);
    };
    
    
    function reset(flake) {
        
        if (settings.windPower == false || settings.windPower == 0) {
          flake.x = Math.floor(Math.random() * canvas.width);
          flake.y = 0;
        } else {
          if (settings.windPower > 0) {
            var xarray = Array(Math.floor(Math.random() * canvas.width), 0);
            var yarray = Array(0, Math.floor(Math.random() * canvas.height))
            var allarray = Array(xarray, yarray)
            
            var selected_array = allarray[Math.floor(Math.random()*allarray.length)];
            
             flake.x = selected_array[0];
             flake.y = selected_array[1];
          } else {
            var xarray = Array(Math.floor(Math.random() * canvas.width),0);
            var yarray = Array(canvas.width, Math.floor(Math.random() * canvas.height))
            var allarray = Array(xarray, yarray)
            
            var selected_array = allarray[Math.floor(Math.random()*allarray.length)];
            
             flake.x = selected_array[0];
             flake.y = selected_array[1];
          }
        }
        
        flake.size = (Math.random() * 3) + settings.size;
        flake.speed = (Math.random() * 1) + settings.speed;
        flake.velY = flake.speed;
        flake.velX = 0;
        flake.opacity = (Math.random() * 0.5) + settings.opacity;
    }
     function init() {
      for (var i = 0; i < flakeCount; i++) {
          var x = Math.floor(Math.random() * canvas.width),
              y = Math.floor(Math.random() * canvas.height),
              size = (Math.random() * 3)  + settings.size,
              speed = (Math.random() * 1) + settings.speed,
              opacity = (Math.random() * 0.5) + settings.opacity;
      
          flakes.push({
              speed: speed,
              velY: speed,
              velX: 0,
              x: x,
              y: y,
              size: size,
              stepSize: (Math.random()) / 30,
              step: 0,
              angle: 180,
              opacity: opacity
          });
      }

      settings.imageItems = [];
      var imageList = $("img.lis_flake");
      for(i=0; i < imageList.length; i++) {
        settings.imageItems.push(imageList.get(i));
      }
      settings.imageNum = imageList.length;

      snow();
    }
    
    if (settings.images != false) {
      for (var j = 0; j < settings.images.length; j++) {
        $("<img src='"+settings.images[j]+"' style='display: none' class='lis_flake'>").prependTo(settings.wrapper)
      }
      
    }

    init();

    $(window).resize(function() {
      if(this.resizeTO) clearTimeout(this.resizeTO);
      this.resizeTO = setTimeout(function() {
        el2 = el.clone();
        el2.insertAfter(el);
        el.remove();
        
        el2.let_it_snow(settings);
      }, 200);
    });
    
    if (settings.interaction == true) {
      canvas.addEventListener("mousemove", function(e) {
          mX = e.clientX,
          mY = e.clientY
      });
    }
  }
}(window.jQuery);
