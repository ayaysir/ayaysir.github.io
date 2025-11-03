      function resizeImg(osrc)
 
        {
 
            var bdiv =document.createElement('DIV');
 
            document.body.appendChild(bdiv);
 
            bdiv.setAttribute("id", "bdiv");
 
            bdiv.style.position = 'absolute';
 
            bdiv.style.top = 0;
 
            bdiv.style.left = 0;
 
            bdiv.style.zIndex = 0;
 
            bdiv.style.width = document.body.scrollWidth;
 
            bdiv.style.height = document.body.scrollHeight;
 
            bdiv.style.background = 'gray';
 
            //bdiv.style.filter = "alpha(opacity=75)";
 
            bdiv.style.opacity = '0.5';
 
            //bdiv.style.mozOpacity = '0.5';
 
            var odiv = document.createElement('DIV');
 
            document.body.appendChild(odiv);
 
            odiv.style.zIndex = 1;
 
            odiv.setAttribute("id", "odiv");
 
            odiv.innerHTML = "<a href='javascript:void(closeImg())'><img id='oimg' src='"+osrc+"' border='0' /></a>";
 
            var img = document.all['oimg'];
 
            var owidth = (document.body.clientWidth)/2 - (img.width)/2;
 
            var oheight = (document.body.clientHeight)/2 - (img.height)/2;
 
            odiv.style.position = 'absolute';
 
            odiv.style.top = oheight + document.body.scrollTop;
 
            odiv.style.left = owidth;
 
            scrollImg();
 
        }
 
        function resizeImg2(osrc)
 
        {
 
            var bdiv =document.createElement('DIV');
 
            document.body.appendChild(bdiv);
 
            bdiv.setAttribute("id", "bdiv");
 
            bdiv.style.position = 'absolute';
 
            bdiv.style.top = 0;
 
            bdiv.style.left = 0;
 
            bdiv.style.zIndex = 0;
 
            bdiv.style.width = document.body.scrollWidth;
 
            bdiv.style.height = document.body.scrollHeight;
 
            bdiv.style.background = 'gray';
 
            //bdiv.style.filter = "alpha(opacity=75)";
 
            bdiv.style.opacity = '0.5';
 
            //bdiv.style.mozOpacity = '0.5';
 
            var odiv = document.createElement('DIV');
 
            document.body.appendChild(odiv);
 
            odiv.style.zIndex = 1;
 
            odiv.setAttribute("id", "odiv");
 
            odiv.innerHTML = "<a href='javascript:void(closeImg())'><img id='oimg' src='"+osrc+"' border='0' width='700' height='400'/></a>";
 
            var img = document.all['oimg'];
 
            var owidth = (document.body.clientWidth)/2 - (img.width)/2;
 
            var oheight = (document.body.clientHeight)/2 - (img.height)/2;
 
            odiv.style.position = 'absolute';
 
            odiv.style.top = oheight + document.body.scrollTop;
 
            odiv.style.left = owidth;
 
            scrollImg();
 
        }
 
        function scrollImg()
 
        {
 
            var odiv = document.all['odiv'];
 
            var img = document.all['oimg'];
 
            var oheight = (document.body.clientHeight)/2 - (img.height)/2 + document.body.scrollTop;
 
            odiv.style.top = oheight;
 
            settime = setTimeout(scrollImg, 100);
 
        }
 
        function closeImg()
 
        {
 
            document.body.removeChild(odiv);
 
            document.body.removeChild(bdiv);
 
            clearTimeout(settime);
 
        }