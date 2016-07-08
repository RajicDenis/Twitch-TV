$(document).ready(function() {

	var stream_name = [];
		stream_preview = [];
		stream_game = [];
		stream_logo = [];
		stream_display_name = [];
		stream_viewers = [];
		stream_date = [];
		stream_banner = [];
		stream_lang = [];
		broad_lang = [];
		gameList = [];
		game_names = [];
		streamDate = "";
		streamCount = "";
		game = "";
		langClicked = false;
		broadClicked = false;
		check = false;
		x = 9;

		getStreams();
		getGames();


		function unique(list) {   //iterates through array and removes duplicate strings
		    var result = [];
		    $.each(list, function(i, e) {
		        if ($.inArray(e, result) == -1) result.push(e);
		    });
		    return result;
		}

		function getDate() {   //converts json date to M/d/Y format
			var jsonDate = JSON.stringify(stream_date[$i]);					
			var parse = JSON.parse(jsonDate);
			
			var newDate = new Date(parse);
			var curr_date = newDate.getDate();
		    var curr_month = newDate.getMonth(); 
		    var curr_year = newDate.getFullYear();
		    var curr_min = newDate.getMinutes();
		    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
								 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

			var month = monthNames[curr_month];				 
		    streamDate = month + " " + curr_date + ", " + curr_year;
		}


		function appendStreams() {
			$('.videos').append('<a class="iframe" data-featherlight="iframe" data-featherlight-iframe-height="500px" ' +
								'data-featherlight-iframe-width="800px" href="https://player.twitch.tv/?channel='+stream_name[$i]+'"><div class="single_stream hvr-grow">' + 
						            '<div class="head" style="background: url('+stream_banner[$i]+')">' + 
							           '<div class="textbox">' +
											'<img class="user_logo" src="'+stream_logo[$i]+'">' +
											'<span class="username">'+stream_display_name[$i]+'</span>' +
										'</div>' +
						            '</div>' +
						            '<div class="image">' +
										'<img src="'+stream_preview[$i]+'" class="prev-img">' +
									'</div>' +
									'<div class="desc">' +
										'<div class="desc-box">' +
											'<span class="test" id="game_name">'+stream_game[$i]+'</span>' +
										'</div>' +
										'<div class="desc-box">' +
											'<span id="views"><img class="eye" src="images/eye.svg">'+stream_viewers[$i]+'</span>' +
											'<div class="dot"></div>' +
											'<span id="date">'+streamDate+'</span>' +
										'</div>' +											
									'</div>' +
					           '</div></a>');					           
		}


		function checkLanguage() {   //checks broadcast and stream language and appends streams accordingly

			if(langClicked == true && broadClicked == false) {

				if(stream_lang[$i] == 'en') {
					appendStreams();
				}

			} else if(broadClicked == true && langClicked == false){

				if(broad_lang[$i] == 'en') {
					appendStreams();
				}

			} else if(langClicked == true && broadClicked == true) {

				if(broad_lang[$i] == 'en' && stream_lang[$i] == 'en') {
					appendStreams();
				}

			} else {   //if no language is chosen, show default streams

				appendStreams();
			}

		}

		function getStreams() {   //pulls data from json and stores it into arrays under certain conditions
						   
		    $.getJSON('https://api.twitch.tv/kraken/streams/', function(data) {
    	
				for ($i=0; $i < data.streams.length; $i++) { 
					stream_name[$i] = data.streams[$i].channel.name;
					stream_preview[$i] = data.streams[$i].preview.medium;
					stream_game[$i] = data.streams[$i].game;
					stream_logo[$i] = data.streams[$i].channel.logo;
					stream_display_name[$i] = data.streams[$i].channel.display_name;
					stream_viewers[$i] = data.streams[$i].viewers;
					stream_date[$i] = data.streams[$i].channel.updated_at;
					stream_banner[$i] = data.streams[$i].channel.profile_banner;
					stream_lang[$i] = data.streams[$i].channel.language;
					broad_lang[$i] = data.streams[$i].channel.broadcaster_language;	

					getDate();

				}

	    		if(check == false) {   //checks if a game in the game list has been clicked

					$('.single_stream').remove();   //removes all streams so new ones can be loaded

					for($i=0; $i < data.streams.length; $i++) {
						checkLanguage();
					}

				} else {

					$('.single_stream').remove();	

					for($i=0; $i < data.streams.length; $i++) {
						if(stream_game[$i] == game) {   //pulls only the streams of the clicked game
							checkLanguage();
						}
					}
	    		}

	    		//Shows or hides "load more" button depending on stream count

	    		streamCount = $('div.single_stream').length;
				if(streamCount < 9 && streamCount != 0) { $('.load_more').css('display', 'none'); }
			
				if($('.load_more').css('display') == 'none' && $('.single_stream').length >= 9) {   //shows "load more" button if there are more than 9 streams available
					$('.load_more').css('display', 'flex');
					x = 9;
				}
	
				$('.single_stream:gt('+(x-1)+')').css('display', 'none');
				
				if(x == streamCount) {
					$('.load_more').css('display', 'none');   //hides "load more" button if all streams are loaded
				}				




			});

		}
		  
				
		function getGames() {   //pulls game names from json and appends them to the right header

			$.getJSON('https://api.twitch.tv/kraken/streams/', function(data) {

				game_names.length = 0;   //empties array so new data can be loaded
				gameList.length = 0;

				$('.right').empty();   //empties game list so new one can be loaded

				for ($i=0; $i < data.streams.length; $i++) { 

					game_names.push(data.streams[$i].game);   //stores game names in empty array

				};	

				gameList = unique(game_names);   //removes duplicate games from game list array

				for($k = 0; $k < gameList.length; $k++) {

					 $('.right').append('<div class="game"><span class="gameText">'+gameList[$k]+'</span></div>');

				}

			});

		}


		$('body').on('click', '.gameText', function() {   //pulls streams based on clicked game

			game = $(this).html();   //stores name of clicked game
			check = true;
			getStreams();
			getGames();

		});


		$('label[for="lang"]').click(function() {  //adds class on first checkbox if checked

			$(this).toggleClass('clicked');

			if($(this).hasClass('clicked')) {
				langClicked = true;
				getStreams();
				getGames();				
			} else {
				langClicked = false;
				getStreams();
				getGames();				
			}

		});


		$('label[for="broad"]').click(function() {   //adds class on second checkbox if checked

			$(this).toggleClass('clicked');

			if($(this).hasClass('clicked')) {
				broadClicked = true;
				getStreams();
			} else {
				broadClicked = false;
				getStreams();				
			}

		});

	    $('body').on('click', '.load_more', function () {   //loads additional streams on click

	    	streamCount = $('div.single_stream').length;
	        x = (x+9 <= streamCount) ? x+9 : streamCount;
	        getStreams();

    	});	

    	//menu and filter icons - responsive

		$('.close1-btn').hide();
		$('.close2-btn').hide();


        $(".filter-btn").on('click', function(){
        	if(window.innerWidth > 1280) {   //Adapt left header width to screen resolution
				$('.center').animate({left:'17%'},100);
        	} else if(window.innerWidth < 1440 && window.innerWidth > 414){
        		$('.center').animate({left:'230px'},100);
        	} else {   						 
        		$('.center').animate({left:'230px'},100);   
        		$('.right').css('display', 'none');   //Prevents header overlapping
        	}
			$('.filter-btn').hide();
			$('.close1-btn').show();				
		});

		$(".close1-btn").on('click', function(){
			$('.right').css('display', 'block');
			$('.center').animate({left:'0'},100);	
			$('.close1-btn').hide();
			$('.filter-btn').show();				
		});

		 

        $(".menu-btn").on('click', function(){
        	if(window.innerWidth > 1440) {   //Adapt right header width to screen resolution
				$('.center').animate({left:'-15%'},100);
        	} else if(window.innerWidth < 1440 && window.innerWidth > 414){
        		$('.center').animate({left:'-230px'},100);
        	} else {   						 
        		$('.center').animate({left:'-230px'},100);   
        		$('.left').css('display', 'none');   //Prevents header overlapping
        	}
			$('.menu-btn').hide();	
			$('.close2-btn').show();				
		});

		$(".close2-btn").on('click', function(){
			$('.left').css('display', 'block');
			$('.center').animate({left:'0'},100);	
			$('.close2-btn').hide();
			$('.menu-btn').show();				
		});

});


	




