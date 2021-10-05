 (function () { "use strict";
 
        const sidebar = document.getElementsByClassName("sidebar")[0]
        if (sidebar) {
            sidebar.setAttribute("data-ix", "sidebar")
        }
        const rotateMenu = document.getElementsByClassName("work")[0]
        if (rotateMenu) {
            rotateMenu.setAttribute("data-ix", "show-sidebar")
        }
        const bigbutton = document.getElementsByClassName("bigbutton")[0]
          if (bigbutton) {
              bigbutton.setAttribute("data-ix", "circlebutton")
          }     
        
        var Main = function() { };
        Main.main = function() {
            var initTimer = new haxe_Timer(50);
            initTimer.run = function() {
                if(window.document.readyState == "interactive" || window.document.readyState == "complete") {
                    Main.init();
                    initTimer.stop();
                }
            };
        };
        Main.init = function() {
            Main.heroElement = window.document.getElementsByClassName("hero")[0];
            Main.projectsElement = window.document.getElementsByClassName("projects")[0];
            Main.sidebarElement = window.document.getElementsByClassName("sidebar")[0];
            if(window.document.getElementById("sequence" + 1) != null) {
                var seq = { images : [], id : "sequence" + 1};
                Main.animations.push(seq);
                var key = seq.id;
                var _this = Main.animationMap;
                if(__map_reserved[key] != null) {
                    _this.setReserved(key,seq);
                } else {
                    _this.h[key] = seq;
                }
            }
            if(window.document.getElementById("sequence" + 2) != null) {
                var seq1 = { images : [], id : "sequence" + 2};
                Main.animations.push(seq1);
                var key1 = seq1.id;
                var _this1 = Main.animationMap;
                if(__map_reserved[key1] != null) {
                    _this1.setReserved(key1,seq1);
                } else {
                    _this1.h[key1] = seq1;
                }
            }
            if(window.document.getElementById("sequence" + 3) != null) {
                var seq2 = { images : [], id : "sequence" + 3};
                Main.animations.push(seq2);
                var key2 = seq2.id;
                var _this2 = Main.animationMap;
                if(__map_reserved[key2] != null) {
                    _this2.setReserved(key2,seq2);
                } else {
                    _this2.h[key2] = seq2;
                }
            }
            if(window.document.getElementById("sequence" + 4) != null) {
                var seq3 = { images : [], id : "sequence" + 4};
                Main.animations.push(seq3);
                var key3 = seq3.id;
                var _this3 = Main.animationMap;
                if(__map_reserved[key3] != null) {
                    _this3.setReserved(key3,seq3);
                } else {
                    _this3.h[key3] = seq3;
                }
            }
            if(window.document.getElementById("sequence" + 5) != null) {
                var seq4 = { images : [], id : "sequence" + 5};
                Main.animations.push(seq4);
                var key4 = seq4.id;
                var _this4 = Main.animationMap;
                if(__map_reserved[key4] != null) {
                    _this4.setReserved(key4,seq4);
                } else {
                    _this4.h[key4] = seq4;
                }
            }
            if(window.document.getElementById("sequence" + 6) != null) {
                var seq5 = { images : [], id : "sequence" + 6};
                Main.animations.push(seq5);
                var key5 = seq5.id;
                var _this5 = Main.animationMap;
                if(__map_reserved[key5] != null) {
                    _this5.setReserved(key5,seq5);
                } else {
                    _this5.h[key5] = seq5;
                }
            }
            if(window.document.getElementById("sequence" + 7) != null) {
                var seq6 = { images : [], id : "sequence" + 7};
                Main.animations.push(seq6);
                var key6 = seq6.id;
                var _this6 = Main.animationMap;
                if(__map_reserved[key6] != null) {
                    _this6.setReserved(key6,seq6);
                } else {
                    _this6.h[key6] = seq6;
                }
            }
            if(window.document.getElementById("sequence" + 8) != null) {
                var seq7 = { images : [], id : "sequence" + 8};
                Main.animations.push(seq7);
                var key7 = seq7.id;
                var _this7 = Main.animationMap;
                if(__map_reserved[key7] != null) {
                    _this7.setReserved(key7,seq7);
                } else {
                    _this7.h[key7] = seq7;
                }
            }
            if(window.document.getElementById("sequence" + 9) != null) {
                var seq8 = { images : [], id : "sequence" + 9};
                Main.animations.push(seq8);
                var key8 = seq8.id;
                var _this8 = Main.animationMap;
                if(__map_reserved[key8] != null) {
                    _this8.setReserved(key8,seq8);
                } else {
                    _this8.h[key8] = seq8;
                }
            }
            var _g = 0;
            var _g1 = Main.animations;
            while(_g < _g1.length) {
                var seq9 = _g1[_g];
                ++_g;
                seq9.container = window.document.getElementById(seq9.id);
                var len = seq9.container.children.length;
                var _g2 = 0;
                while(_g2 < len) {
                    var child = seq9.container.children.item(_g2++);
                    var image;
                    if(child.tagName == "IMG") {
                        image = child;
                        seq9.images.push(image);
                    }
                }
            }
            var img_len = Main.projectsElement.children.length;
            var _g21 = 0;
            while(_g21 < img_len) {
                var child1 = Main.projectsElement.children.item(_g21++);
                if(child1.tagName == "IMG") {
                    var img = child1;
                    var key9 = img.id;
                    var _this9 = Main.navLinks.images;
                    if(__map_reserved[key9] != null) {
                        _this9.setReserved(key9,img);
                    } else {
                        _this9.h[key9] = img;
                    }
                }
            }
            var nav_len = Main.sidebarElement.children.length;
            var _g4 = 0;
            while(_g4 < nav_len) {
                var child2 = Main.sidebarElement.children.item(_g4++);
                if(child2.tagName == "A") {
                    var anchor = child2;
                    var anID = [anchor.id.split("-")];
                    if(anID[0].length == 2) {
                        var _this10 = Main.navLinks.anchors;
                        var key10 = anID[0][0];
                        if(__map_reserved[key10] != null) {
                            _this10.setReserved(key10,anchor);
                        } else {
                            _this10.h[key10] = anchor;
                        }
                        var this1 = Main.navLinks.colors;
                        var value = "#" + anID[0][1].toUpperCase();
                        var _this11 = this1;
                        var key11 = anID[0][0];
                        if(__map_reserved[key11] != null) {
                            _this11.setReserved(key11,value);
                        } else {
                            _this11.h[key11] = value;
                        }
                        anchor.addEventListener("mouseover",(function(anID1) {
                            return function() {
                                Main.previewProject(anID1[0][0]);
                            };
                        })(anID));
                    }
                }
            }
            if(Main.animations.length > 1) {
                var storage = js_Browser.getSessionStorage();
                if(storage != null) {
                    if(storage.getItem("latest_animation_index") != null) {
                        var latest = storage.getItem("latest_animation_index");
                        if(latest != null) {
                            var n = Std.parseInt(latest);
                            if(n < Main.animations.length - 1) {
                                ++n;
                            } else {
                                n = 0;
                            }
                            Main.currentSequence = Main.animations[n];
                            storage.setItem("latest_animation_index",n == null ? "null" : "" + n);
                        }
                    } else {
                        storage.setItem("latest_animation_index","0");
                        Main.currentSequence = Main.animations[Math.floor(Math.random() * Main.animations.length)];
                    }
                }
            } else if(Main.animations.length == 1) {
                Main.currentSequence = Main.animations[0];
            }
            new haxe_Timer(24).run = function() {
                if(Main.latestScrollY != window.scrollY) {
                    Main.latestScrollY = window.scrollY;
                    Main.updateScroll();
                }
                if(Main.sidebarElement.style.display == "none") {
                    if(Main.stopMotionMode == false) {
                        Main.stopMotionMode = true;
                        Main.updateScroll();
                    }
                } else {
                    Main.stopMotionMode = false;
                }
            };
            Main.updateScroll();
        };
        Main.updateScroll = function() {
            Main.relatedScroll = Main.latestScrollY / (window.document.body.clientHeight - window.innerHeight);
            if(Main.stopMotionMode == true) {
                if(Main.currentSequence != null) {
                    Main.setStopMotionFrame(Main.relatedScroll,Main.currentSequence);
                }
            }
        };
        Main.previewProject = function(id) {
            var _this = Main.navLinks.colors;
            if((__map_reserved[id] != null ? _this.existsReserved(id) : _this.h.hasOwnProperty(id)) == true) {
                var _this1 = Main.navLinks.colors;
                Main.sidebarElement.style.backgroundColor = __map_reserved[id] != null ? _this1.getReserved(id) : _this1.h[id];
            }
            var _this2 = Main.navLinks.images;
            if((__map_reserved[id] != null ? _this2.existsReserved(id) : _this2.h.hasOwnProperty(id)) == true) {
                var _this3 = Main.navLinks.images;
                Main.heroElement.style.backgroundImage = "url(" + (__map_reserved[id] != null ? _this3.getReserved(id) : _this3.h[id]).src + ")";
            }
        };
        Main.setStopMotionFrame = function(position,sequence) {
            if(sequence.images.length > 0) {
                var framePos = Math.floor((sequence.images.length - 1) * position);
                Main.heroElement.style.backgroundImage = "url(" + sequence.images[framePos].src + ")";
            }
        };
        var Std = function() { };
        Std.parseInt = function(x) {
            var v = parseInt(x, x && x[0]=="0" && (x[1]=="x" || x[1]=="X") ? 16 : 10);
            if(isNaN(v)) {
                return null;
            }
            return v;
        };
        var haxe_IMap = function() { };
        var haxe_Timer = function(time_ms) {
            var me = this;
            this.id = setInterval(function() {
                me.run();
            },time_ms);
        };
        haxe_Timer.prototype = {
            stop: function() {
                if(this.id == null) {
                    return;
                }
                clearInterval(this.id);
                this.id = null;
            }
            ,run: function() {
            }
        };
        var haxe_ds_StringMap = function() {
            this.h = { };
        };
        haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
        haxe_ds_StringMap.prototype = {
            setReserved: function(key,value) {
                if(this.rh == null) {
                    this.rh = { };
                }
                this.rh["$" + key] = value;
            }
            ,getReserved: function(key) {
                if(this.rh == null) {
                    return null;
                } else {
                    return this.rh["$" + key];
                }
            }
            ,existsReserved: function(key) {
                if(this.rh == null) {
                    return false;
                }
                return this.rh.hasOwnProperty("$" + key);
            }
        };
        var js_Browser = function() { };
        js_Browser.getSessionStorage = function() {
            try {
                var s = window.sessionStorage;
                s.getItem("");
                if(s.length == 0) {
                    var key = "_hx_" + Math.random();
                    s.setItem(key,key);
                    s.removeItem(key);
                }
                return s;
            } catch( e ) {
                return null;
            }
        };
        var __map_reserved = {};
        Main.latestScrollY = 0;
        Main.relatedScroll = 0;
        Main.stopMotionMode = true;
        Main.animations = [];
        Main.animationMap = new haxe_ds_StringMap();
        Main.navLinks = { images : new haxe_ds_StringMap(), anchors : new haxe_ds_StringMap(), colors : new haxe_ds_StringMap()};
        Main.main();
    })();
    
// Brand Sprint - Hero Section Color Animation 
$(document).ready(function(){
            var a =1;
            setInterval(function(){
               if(a>4)
                   {
                       a = 1;
                   }
                switch(a)
                    {
                        case 1:
                            $("#color-animation").css({"background-color":"#8159fb"});
                            a++;
                            break;
                        case 2:
                            $("#color-animation").css({"background-color":"#fd3c2d"});
                            a++;
                            break;
                        case 3:
                            $("#color-animation").css({"background-color":"#ffbfe1"});
                            a++;
                            break;
                        case 4:
                            $("#color-animation").css({"background-color":"#fdc800"});
                            a++;
                            break;
                    }
            },3000);
        });
        
        // Brand Sprint Color Animation - Ends Here //
var styles = `
.brand-sprint {
  background-color: #3821c3;
  -webkit-transition: background-color 200ms ease;
  transition: background-color 200ms ease;
}

.gradient {
  background-image: linear-gradient(to bottom, hsla(0, 0.00%, 0.00%, 0.00), hsla(249, 100.00%, 0.00%, 0.80))
}

.sidebar {
  -webkit-transition: background-color 200ms ease;
  transition: background-color 200ms ease;
  overflow: auto;
}

/* width */
::-webkit-scrollbar {
  width: 4px;
  height:4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #fff; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #999; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #000; 
}
`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)