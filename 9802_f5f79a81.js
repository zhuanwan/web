(self.webpackChunkweb=self.webpackChunkweb||[]).push([[9802],{2970:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>f});var u=n(7294),o=n(2777),r=n(5893);function f(){var e=(0,u.useRef)(null),t=(0,u.useRef)(null),n=function(e){e&&(e.off("mouse:down"),e.off("mouse:wheel"),e.off("mouse:move"),e.off("mouse:up"),e.clear(),e.setViewportTransform([1,0,0,1,0,0]),e.selection=!1,e.on("mouse:wheel",(function(t){var n=t.e.deltaY,u=e.getZoom();(u*=Math.pow(.999,n))>20&&(u=20),u<.01&&(u=.01),e.setZoom(u),t.e.preventDefault(),t.e.stopPropagation()})),function(e){var t=new o.fabric.IText("双击可编辑",{fill:"#f00",stroke:"blue",strokeWidth:2});e.add(t)}(e))};return(0,u.useEffect)((function(){var u=document.documentElement.clientWidth,r=document.documentElement.clientHeight;return e.current.width=u,e.current.height=r,t.current=new o.fabric.Canvas(e.current),n(t.current),function(){t.current=null}}),[]),(0,r.jsx)("canvas",{ref:e})}},4960:()=>{},6759:()=>{},6272:()=>{}}]);