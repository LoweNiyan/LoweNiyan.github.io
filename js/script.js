var scrollTop
var docheight
var windowheight
var progress

var locRepl = function() {
    var targetProtocol = "https:";
    if (window.location.protocol != targetProtocol)
        window.location.href = targetProtocol +
        window.location.href.substring(window.location.protocol.length);
}

url = window.location.hostname;
if (url != '127.0.0.1' && url != '192.168.1.102') {
    locRepl();
}

function getClientHeight()
{
  var clientHeight=0;
  if(document.body.clientHeight&&document.documentElement.clientHeight)
  {
  var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  else
  {
  var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  return clientHeight;
}

$(document).ready(function () {
    console.log("██╗  ██╗███████╗██╗     ██╗      ██████╗\n██║  ██║██╔════╝██║     ██║     ██╔═══██╗\n███████║█████╗  ██║     ██║     ██║   ██║\n██╔══██║██╔══╝  ██║     ██║     ██║   ██║\n██║  ██║███████╗███████╗███████╗╚██████╔╝\n╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ \n");
    $("body").scroll(function() {
        scrollTop = $("body").scrollTop();
        docheight = $(document).height();
        windowheight = $("header").height();
        progress = ((scrollTop / (docheight - windowheight)) * 100).toFixed(0) + "%";
        if (scrollTop > windowheight - 1) {
            $(".bottombar").css("margin-bottom","-8px");
        }
        else {
            $(".bottombar").css("margin-bottom","-40px");
        }
        $(".progress").text(progress);
    }); 
});
