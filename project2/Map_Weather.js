// Map API
		var map = new BMap.Map("ac_map");
		var point = new BMap.Point(116.331398,39.897445);

		map.centerAndZoom(point,13);
				
		map.enableDragging();
		map.enableScrollWheelZoom();
		map.enableDoubleClickZoom();
		map.enableKeyboard();
				
		map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE}));
		map.addControl(new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 0}));
		map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

		$("body").keydown(function(){
			if(event.keyCode == "13")
				$("#Locate").click();
		});

		function myLoc(result){
			var cityName = result.name;
			map.setCenter(cityName);
			alert("Now you are located in " + cityName);
		}
		var myCity = new BMap.LocalCity();
		myCity.get(myLoc);

		function theLocation(){
			var city = cityName();
			if(city != ""){
				map.centerAndZoom(city,11);
			}

			getData('now', 0, city);
		}
		function cityName(){
			return $("#cityName").val();
		}

		//HeWeather
		function getData(type, num, location){
			$.ajax({
				type: 'GET',
				url: 'https://free-api.heweather.net/s6/weather/'+type+'?',
				data: 'key=18a60ead4caa4d4f89059dc3e2895cf4	&location='+location+'&lang=en&username=HE1911250915131178',
				dataType: 'JSON',
				error: function(){
					alert('Network error!');
				},
				success: function(response){
					console.log(response);
					if(response.HeWeather6[0].status == "unknown location"){
						$("#image").hide();
						$("button").hide();
						$("#format").hide();
						$("#Info").hide();
						
						alert("The location is undefined in weather API!");
						return;
					}

					if(type == 'now')
						htmlCurrentData(type, response.HeWeather6[0].now);
					else if(type == 'forecast')
						htmlCurrentData(type, response.HeWeather6[0].daily_forecast[num]);
				}
			});
		}

		function htmlCurrentData(type, response){
			if(type == 'now'){
				var html = "<img src=\"image/attributes/weather.png\" width=\"15\" height=\"15\">  Weather: " + response.cond_txt + "</br>" +
				"<img src=\"image/attributes/temp.png\" width=\"15\" height=\"15\">  Temperature: " + response.tmp + "℃</br>" +
				"<img src=\"image/attributes/feeling.png\" width=\"15\" height=\"15\">  Feeling: " + response.fl + "℃</br>" +
				"<img src=\"image/attributes/humidity.png\" width=\"15\" height=\"15\">  Humidity: " + response.hum + "%</br>" +
				"<img src=\"image/attributes/press.png\" width=\"15\" height=\"15\">  Press: " + response.pres + "</br>" +
				"<img src=\"image/attributes/precipitation.png\" width=\"15\" height=\"15\">  Precipitation: " + response.pcpn + "</br>" +
				"<img src=\"image/attributes/visibility.png\" width=\"15\" height=\"15\">  Visibility: " + response.vis + "km</br>" +
				"<img src=\"image/attributes/dir.png\" width=\"15\" height=\"15\">  Wind Direction: " + response.wind_dir + "</br>" +
				"<img src=\"image/attributes/spd.png\" width=\"15\" height=\"15\">  Wind Speed: " + response.wind_spd + "km/h</br>";

				$("#image").empty();
				$("#image").fadeIn();
				$("#image").append(
					codeToImg(1, response.cond_code) + 
					"<div style=\"color: white; font-weight: bold;\">Now</div>"
					);
				$("#Info").fadeIn();
				$("button").fadeIn();
				$("#format").empty();
				$("#format").fadeIn();
				$("#format").append(html);
			}

			else if(type == 'forecast'){
				var html = "<img src=\"image/attributes/date.png\" width=\"15\" height=\"15\">  Date: " + response.date + "</br>" +
				"<img src=\"image/attributes/day.png\" width=\"15\" height=\"15\">  Day Weather: " + response.cond_txt_d + "</br>" +
				"<img src=\"image/attributes/night.png\" width=\"15\" height=\"15\">  Night Weather: " + response.cond_txt_n + "</br>" +
				"<img src=\"image/attributes/humidity.png\" width=\"15\" height=\"15\">  Humidity: " + response.hum + "%</br>" +
				"<img src=\"image/attributes/press.png\" width=\"15\" height=\"15\">  Press: " + response.pres + "</br>" +
				"<img src=\"image/attributes/precipitation.png\" width=\"15\" height=\"15\">  Precipitation: " + response.pcpn + "</br>" +
				"<img src=\"image/attributes/visibility.png\" width=\"15\" height=\"15\">  Visibility: " + response.vis + "km</br>" +
				"<img src=\"image/attributes/dir.png\" width=\"15\" height=\"15\">  Wind Direction: " + response.wind_dir + "</br>" +
				"<img src=\"image/attributes/spd.png\" width=\"15\" height=\"15\">  Wind Speed: " + response.wind_spd + "km/h</br>" +
				"<img src=\"image/attributes/uv.png\" width=\"15\" height=\"15\">  UV Index: " + response.uv_index + "</br>";

				$("#image").empty();
				$("#image").fadeIn();
				$("#image").append(
					codeToImg(1, response.cond_code_d) + 
					codeToImg(0, response.cond_code_n) +
					"<div style=\"color: white; font-weight: bold; position: absolute; left: 65px;\">Day</div>" +
					"<div style=\"color: white; font-weight: bold; position: absolute; right: 65px;\">Night</div>"
					);
				$("#Info").fadeIn();
				$("button").fadeIn();
				$("#format").empty();
				$("#format").fadeIn();
				$("#format").append(html);
			}

			else{
				$("#image").hide();
				$("#Info").hide();
				$("button").hide();
				$("#format").hide();
			}
		}

		// 1 for day, 0 for night;
		function codeToImg(num, code){
			if(num == 1)
				return "<img src=\"image/weathers/"+code+".png\" width=\"145\" height=\"145\">";
			else{
				if(code == "100" || code == "103" || code == "104" || code == "300" || code == "301" || code == "406" || code == "407")
					return "<img src=\"image/weathers/"+code+"n.png\" width=\"145\" height=\"145\">";
				else
					return "<img src=\"image/weathers/"+code+".png\" width=\"145\" height=\"145\">";
			}
		}