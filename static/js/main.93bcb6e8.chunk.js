(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(t,e,i){t.exports=i(19)},15:function(t,e,i){},17:function(t,e,i){},19:function(t,e,i){"use strict";i.r(e);var n=i(0),r=i.n(n),a=i(6),s=i.n(a),o=(i(15),i(3)),h=i(4),c=i(8),u=i(7),l=i(9),f=i(1),v=i(2),g=function(t,e,i){return(t<<10)+(e<<5)+i},A=function(){function t(){Object(f.a)(this,t)}return Object(v.a)(t,null,[{key:"map",value:function(t,e){var i=Object.of(null);return e?t.map(function(t,n){return i.index=n,e.call(i,t)}):t.slice()}},{key:"naturalOrder",value:function(t,e){return t<e?-1:t>e?1:0}},{key:"sum",value:function(t,e){var i=Object.of(null);return t.reduce(e?function(t,n,r){return i.index=r,t+e.call(i,n)}:function(t,e){return t+e},0)}},{key:"max",value:function(e,i){return Math.max.apply(null,i?t.map(e,i):e)}}]),t}(),m=function(){function t(e){Object(f.a)(this,t),this.comparator=e,this.contents=[],this.sorted=!1}return Object(v.a)(t,[{key:"sort",value:function(){this.contents.sort(this.comparator),this.sorted=!0}},{key:"push",value:function(t){this.contents.push(t),this.sorted=!1}},{key:"peek",value:function(t){return this.sorted||this.sort(),void 0===t&&(t=this.contents.length-1),this.contents[t]}},{key:"pop",value:function(){return this.sorted||this.sort(),this.contents.pop()}},{key:"size",value:function(){return this.contents.length}},{key:"map",value:function(t){return this.contents.map(t)}},{key:"debug",value:function(){return this.sorted||this.sort(),this.contents}}]),t}(),d=function(){function t(e,i,n,r,a,s,o){Object(f.a)(this,t),this.r1=e,this.r2=i,this.g1=n,this.g2=r,this.b1=a,this.b2=s,this.histo=o}return Object(v.a)(t,[{key:"volume",value:function(t){return this._volume&&!t||(this._volume=(this.r2-this.r1+1)*(this.g2-this.g1+1)*(this.b2-this.b1+1)),this._volume}},{key:"count",value:function(t){if(!this._count_set||t){var e,i,n,r,a=0;for(e=this.r1;e<=this.r2;e++)for(i=this.g1;i<=this.g2;i++)for(n=this.b1;n<=this.b2;n++)r=g(e,i,n),a+=this.histo[r]||0;this._count=a,this._count_set=!0}return this._count}},{key:"copy",value:function(){return new t(this.r1,this.r2,this.g1,this.g2,this.b1,this.b2,this.histo)}},{key:"avg",value:function(t){if(!this._avg||t){var e,i,n,r,a,s=0,o=0,h=0,c=0;for(i=this.r1;i<=this.r2;i++)for(n=this.g1;n<=this.g2;n++)for(r=this.b1;r<=this.b2;r++)a=g(i,n,r),s+=e=this.histo[a]||0,o+=e*(i+.5)*8,h+=e*(n+.5)*8,c+=e*(r+.5)*8;this._avg=s?[~~(o/s),~~(h/s),~~(c/s)]:[~(8*(this.r1+this.r2+1)/2),~~(8*(this.g1+this.g2+1)/2),~~(8*(this.b1+this.b2+1)/2)]}return this._avg}},{key:"contains",value:function(t){var e,i,n=t[0]>>3;return e=t[1]>>3,i=t[2]>>3,n>=this.r1&&n<=this.r2&&e>=this.g1&&e<=this.g2&&i>=this.b1&&i<=this.b2}}]),t}(),T=function(){function t(){Object(f.a)(this,t),this.vboxes=new m(function(t,e){return A.naturalOrder(t.count()*t.volume(),e.count()*e.volume())})}return Object(v.a)(t,[{key:"push",value:function(t){this.vboxes.push({vbox:t,color:t.avg()})}},{key:"palette",value:function(){return this.vboxes.map(function(t){return t.color})}},{key:"size",value:function(){return this.vboxes.size()}},{key:"map",value:function(t){for(var e=0;e<this.vboxes.size();e++)if(this.vboxes.peek(e).vbox.contains(t))return this.vboxes.peek(e).color;return this.nearest(t)}},{key:"nearest",value:function(t){for(var e,i,n,r=0;r<this.vboxes.size();r++)((i=Math.sqrt(Math.pow(t[0]-this.vboxes.peek(r).color[0],2)+Math.pow(t[1]-this.vboxes.peek(r).color[1],2)+Math.pow(t[2]-this.vboxes.peek(r).color[2],2)))<e||void 0===e)&&(e=i,n=this.vboxes.peek(r).color);return n}},{key:"forcebw",value:function(){this.vboxes.sort(function(t,e){var i=t.color1,n=e.color2;return A.naturalOrder(A.sum(i),A.sum(n))});var t=this.vboxes[0].color;t[0]<5&&t[1]<5&&t[2]<5&&(this.vboxes[0].color=[0,0,0]);var e=this.vboxes.length-1,i=this.vboxes[e].color;i[0]>251&&i[1]>251&&i[2]>251&&(this.vboxes[e].color=[255,255,255])}}]),t}(),p=function(t,e){if(e.count()){var i=e.r2-e.r1+1,n=e.g2-e.g1+1,r=e.b2-e.b1+1,a=A.max([i,n,r]);if(1===e.count())return[e.copy()];var s,o,h,c,u=0,l=[],f=[];if(a===i)for(s=e.r1;s<=e.r2;s++){for(c=0,o=e.g1;o<=e.g2;o++)for(h=e.b1;h<=e.b2;h++)c+=t[g(s,o,h)]||0;u+=c,l[s]=u}else if(a===n)for(s=e.g1;s<=e.g2;s++){for(c=0,o=e.r1;o<=e.r2;o++)for(h=e.b1;h<=e.b2;h++)c+=t[g(o,s,h)]||0;u+=c,l[s]=u}else for(s=e.b1;s<=e.b2;s++){for(c=0,o=e.r1;o<=e.r2;o++)for(h=e.g1;h<=e.g2;h++)c+=t[g(o,h,s)]||0;u+=c,l[s]=u}l.forEach(function(t,e){f[e]=u-t});var v=function(t){var i,n,r,a,o,h="".concat(t,"1"),c="".concat(t,"2"),v=0;for(s=e[h];s<=e[c];s++)if(l[s]>u/2){for(r=e.copy(),a=e.copy(),o=(i=s-e[h])<=(n=e[c]-s)?Math.min(e[c]-1,~~(s+n/2)):Math.max(e[h],~~(s-1-i/2));!l[o];)o++;for(v=f[o];!v&&l[o-1];)v=f[--o];return r[c]=o,a[h]=r[c]+1,[r,a]}};return v(a===i?"r":a===n?"g":"b")}},_=function(t,e){if(!t.length||e<2||e>256)return!1;var i=function(t){var e,i,n,r,a=new Array(32768);return t.forEach(function(t){i=t[0]>>3,n=t[1]>>3,r=t[2]>>3,e=g(i,n,r),a[e]=(a[e]||0)+1}),a}(t),n=0;i.forEach(function(){return n++});var r=new m(function(t,e){return A.naturalOrder(t.count(),e.count())});r.push(function(t,e){var i,n,r,a=1e6,s=0,o=1e6,h=0,c=1e6,u=0;return t.forEach(function(t){i=t[0]>>3,n=t[1]>>3,r=t[2]>>3,i<a?a=i:i>s&&(s=i),n<o?o=n:n>h&&(h=n),r<c?c=r:r>u&&(u=r)}),new d(a,s,o,h,c,u,e)}(t,i));var a=function(t,e){for(var n,r=1,a=0;a<1e3;)if((n=t.pop()).count()){var s=p(i,n),o=s[0],h=s[1];if(!o)return;if(t.push(o),h&&(t.push(h),r++),r>=e)return;if(a++>1e3)return}else t.push(n),a++};a(r,.75*e);for(var s=new m(function(t,e){return A.naturalOrder(t.count()*t.volume(),e.count()*e.volume())});r.size();)s.push(r.pop());a(s,e-s.size());for(var o=new T;s.size();)o.push(s.pop());return o},b=function(){function t(e,i){Object(f.a)(this,t),this.hsl=void 0,this.yiq=0,this.rgb=e,this.population=i}return Object(v.a)(t,[{key:"getHsl",value:function(){return this.hsl?this.hsl:this.hsl=M.rgbToHsl(this.rgb[0],this.rgb[1],this.rgb[2])}},{key:"getPopulation",value:function(){return this.population}},{key:"getRgb",value:function(){return this.rgb}},{key:"getHex",value:function(){return"#".concat(((1<<24)+(this.rgb[0]<<16)+(this.rgb[1]<<8)+this.rgb[2]).toString(16).slice(1,7))}},{key:"getTitleTextColor",value:function(){return this._ensureTextColors(),this.yiq<200?"#fff":"#000"}},{key:"getBodyTextColor",value:function(){return this._ensureTextColors(),this.yiq<150?"#fff":"#000"}},{key:"_ensureTextColors",value:function(){if(!this.yiq)return this.yiq=(299*this.rgb[0]+587*this.rgb[1]+114*this.rgb[2])/1e3}}]),t}(),y=function(){function t(e){Object(f.a)(this,t),this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),document.body.appendChild(this.canvas),this.width=this.canvas.width=e.width,this.height=this.canvas.height=e.height,this.context.drawImage(e,0,0,this.width,this.height)}return Object(v.a)(t,[{key:"clear",value:function(){return this.context.clearRect(0,0,this.width,this.height)}},{key:"update",value:function(t){return this.context.putImageData(t,0,0)}},{key:"getPixelCount",value:function(){return this.width*this.height}},{key:"getImageData",value:function(){return this.context.getImageData(0,0,this.width,this.height)}},{key:"removeCanvas",value:function(){return this.canvas.parentNode.removeChild(this.canvas)}}]),t}(),M=function(){function t(e,i,n){Object(f.a)(this,t),this.TARGET_DARK_LUMA=.26,this.MAX_DARK_LUMA=.45,this.MIN_LIGHT_LUMA=.55,this.TARGET_LIGHT_LUMA=.74,this.MIN_NORMAL_LUMA=.3,this.TARGET_NORMAL_LUMA=.5,this.MAX_NORMAL_LUMA=.7,this.TARGET_MUTED_SATURATION=.3,this.MAX_MUTED_SATURATION=.4,this.TARGET_VIBRANT_SATURATION=1,this.MIN_VIBRANT_SATURATION=.35,this.WEIGHT_SATURATION=3,this.WEIGHT_LUMA=6,this.WEIGHT_POPULATION=1,this.DynamicSwatch=void 0,this.MutedSwatch=void 0,this.DarkDynamicSwatch=void 0,this.DarkMutedSwatch=void 0,this.LightDynamicSwatch=void 0,this.LightMutedSwatch=void 0,this.HighestPopulation=0,"undefined"===typeof i&&(i=64),"undefined"===typeof n&&(n=5);var r=new y(e);try{for(var a=r.getImageData().data,s=r.getPixelCount(),o=[],h=0;h<s;){var c=4*h,u=a[c+0],l=a[c+1],v=a[c+2];a[c+3]>=125&&(u>250&&l>250&&v>250||o.push([u,l,v])),h+=n}var g=_(o,i);this._swatches=g.vboxes.map(function(t){return new b(t.color,t.vbox.count())}),this.maxPopulation=this.findMaxPopulation,this.generateVarationColors(),this.generateEmptySwatches()}finally{r.removeCanvas()}}return Object(v.a)(t,[{key:"generateVarationColors",value:function(){return this.DynamicSwatch=this.findColorVariation(this.TARGET_NORMAL_LUMA,this.MIN_NORMAL_LUMA,this.MAX_NORMAL_LUMA,this.TARGET_VIBRANT_SATURATION,this.MIN_VIBRANT_SATURATION,1),this.LightDynamicSwatch=this.findColorVariation(this.TARGET_LIGHT_LUMA,this.MIN_LIGHT_LUMA,1,this.TARGET_VIBRANT_SATURATION,this.MIN_VIBRANT_SATURATION,1),this.DarkDynamicSwatch=this.findColorVariation(this.TARGET_DARK_LUMA,0,this.MAX_DARK_LUMA,this.TARGET_VIBRANT_SATURATION,this.MIN_VIBRANT_SATURATION,1),this.MutedSwatch=this.findColorVariation(this.TARGET_NORMAL_LUMA,this.MIN_NORMAL_LUMA,this.MAX_NORMAL_LUMA,this.TARGET_MUTED_SATURATION,0,this.MAX_MUTED_SATURATION),this.LightMutedSwatch=this.findColorVariation(this.TARGET_LIGHT_LUMA,this.MIN_LIGHT_LUMA,1,this.TARGET_MUTED_SATURATION,0,this.MAX_MUTED_SATURATION),this.DarkMutedSwatch=this.findColorVariation(this.TARGET_DARK_LUMA,0,this.MAX_DARK_LUMA,this.TARGET_MUTED_SATURATION,0,this.MAX_MUTED_SATURATION)}},{key:"generateEmptySwatches",value:function(){var e;if(void 0===this.DynamicSwatch&&void 0!==this.DarkDynamicSwatch&&((e=this.DarkDynamicSwatch.getHsl())[2]=this.TARGET_NORMAL_LUMA,this.DynamicSwatch=new b(t.hslToRgb(e[0],e[1],e[2]),0)),void 0===this.DarkDynamicSwatch&&void 0!==this.DynamicSwatch)return(e=this.DynamicSwatch.getHsl())[2]=this.TARGET_DARK_LUMA,this.DarkDynamicSwatch=new b(t.hslToRgb(e[0],e[1],e[2]),0)}},{key:"findMaxPopulation",value:function(){for(var t=0,e=Array.from(this._swatches),i=0;i<e.length;i++){var n=e[i];t=Math.max(t,n.getPopulation())}return t}},{key:"findColorVariation",value:function(t,e,i,n,r,a){for(var s=void 0,o=0,h=Array.from(this._swatches),c=0;c<h.length;c++){var u=h[c],l=u.getHsl()[1],f=u.getHsl()[2];if(l>=r&&l<=a&&f>=e&&f<=i&&!this.isAlreadySelected(u)){var v=this.createComparisonValue(l,n,f,t,u.getPopulation(),this.HighestPopulation);(void 0===s||v>o)&&(s=u,o=v)}}return s}},{key:"createComparisonValue",value:function(t,e,i,n,r,a){return this.weightedMean(this.invertDiff(t,e),this.WEIGHT_SATURATION,this.invertDiff(i,n),this.WEIGHT_LUMA,r/a,this.WEIGHT_POPULATION)}},{key:"invertDiff",value:function(t,e){return 1-Math.abs(t-e)}},{key:"weightedMean",value:function(){for(var t=0,e=0,i=0;i<arguments.length;){var n=i<0||arguments.length<=i?void 0:arguments[i],r=i+1<0||arguments.length<=i+1?void 0:arguments[i+1];t+=n*r,e+=r,i+=2}return t/e}},{key:"swatches",value:function(){return Object.entries({vibrant:this.DynamicSwatch,muted:this.MutedSwatch,darkDynamic:this.DarkDynamicSwatch,darkMuted:this.DarkMutedSwatch,lightDynamic:this.LightDynamicSwatch,lightMuted:this.LightMuted}).filter(function(t){var e=Object(o.a)(t,2),i=(e[0],e[1]);return null!==i&&void 0!==i}).map(function(t){var e=Object(o.a)(t,2);return[e[0],e[1]]})}},{key:"isAlreadySelected",value:function(t){return this.DynamicSwatch===t||this.DarkDynamicSwatch===t||this.LightDynamicSwatch===t||this.MutedSwatch===t||this.DarkMutedSwatch===t||this.LightMutedSwatch===t}}],[{key:"rgbToHsl",value:function(t,e,i){t/=255,e/=255,i/=255;var n=Math.max(t,e,i),r=Math.min(t,e,i),a=void 0,s=void 0,o=(n+r)/2;if(n===r)a=s=0;else{var h=n-r;switch(s=o>.5?h/(2-n-r):h/(n+r),n){case t:a=(e-i)/h+(e<i?6:0);break;case e:a=(i-t)/h+2;break;case i:a=(t-e)/h+4}a/=6}return[a,s,o]}},{key:"hslToRgb",value:function(t,e,i){var n=void 0,r=void 0,a=void 0,s=function(t,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t};if(0===e)n=r=a=i;else{var o=i<.5?i*(1+e):i+e-i*e,h=2*i-o;n=s(h,o,t+1/3),r=s(h,o,t),a=s(h,o,t-1/3)}return[255*n,255*r,255*a]}}]),t}(),w=function(t){function e(){var t,i;Object(f.a)(this,e);for(var n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(i=Object(c.a)(this,(t=Object(u.a)(e)).call.apply(t,[this].concat(r)))).state={swatches:void 0},i.onerror=function(){},i.onload=function(){var t=new M(i._img).swatches();i.setState({swatches:t})},i}return Object(l.a)(e,t),Object(v.a)(e,[{key:"componentDidMount",value:function(){var t=this.props.image;this._originalSrc=t,this._img=new Image,this._img.onload=this.onload,this._img.onerror=this.onerror,this._img.crossOrigin=!0,this._img.src=t}},{key:"render",value:function(){var t=this.props,e=t.render,i=t.children,n=t.image,a=this.state.swatches;return r.a.createElement(r.a.Fragment,null,"function"===typeof i&&a?i?i({swatches:a,image:n}):i:e?e({swatches:a,image:n}):e)}}]),e}(r.a.Component);i(17),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(function(){return r.a.createElement(w,{image:"https://images.unsplash.com/photo-1540456348453-e29a1b8555b8?auto=format&fit=crop&w=800&q=80"},function(t){var e=t.swatches,i=t.image,n=Object(h.a)(e).map(function(t){var e=Object(o.a)(t,2);return e[0],e[1].getHex()});return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"App-color",style:{backgroundImage:"radial-gradient(farthest-corner at 40px 40px, ".concat(n[1]," 0%, ").concat(n[0]," 100%)")}},r.a.createElement("img",{src:i,className:"App-logo",alt:""}),r.a.createElement("h1",null,"Gradient"),r.a.createElement("p",null,"Extract prominent colors from an image.")),r.a.createElement("header",{className:"App-header"},Object(h.a)(e).map(function(t,e){var n=Object(o.a)(t,2),a=n[0],s=n[1];return r.a.createElement("div",{className:"App-color",key:e,style:{backgroundColor:s.getHex()}},r.a.createElement("img",{src:i,className:"App-logo",alt:""}),r.a.createElement("h1",{style:{color:s.getTitleTextColor()}},a),r.a.createElement("p",{style:{color:s.getBodyTextColor()}},"Lorem ipsum dolor sit amet, consectetur adipiscing elit."))})))})},null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[10,2,1]]]);
//# sourceMappingURL=main.93bcb6e8.chunk.js.map