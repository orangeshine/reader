(function()
				{
					var Util = (function()
						{
							var prefix = "html5_reader_";
							var StorageGetter = function(key)
							{
								return localStorage.getItem(prefix+key);
							}
							var StorageSetter = function(key,val)
							{
								return localStorage.setItem(prefix+key,val);
							}
							var getJSONP = function(url,callback)
							{
								return $.jsonp({
									url:url,
									cache:true,
									callback:'duokan_fiction_chapter',
									success:function(result)
									{
										var data = $.base64.decode(result);
										var json = decodeURIComponent(escape(data));
										callback(json);
									}
								});
							}
							return{
								getJSONP:getJSONP,
								StorageGetter:StorageGetter,
								StorageSetter:StorageSetter
							}
						})();
					var Dom = {
						top_nav:$('#top-nav'),
						bottom_nav:$('#bottom-nav'),
						mode_wrap:$('#mode-wrap'),
						nav_pannel:$('.nav-pannel-toggle'),
						font_wrap:$('#font-wrap'),
						icon_font:$('#icon-font'),
						bg_container:$('.bg-container'),
						bg_container_current:$('.bg-container-current')
					}
					var Win = $(window);
					var Doc = $(document);
					var ReaderModel;
					var readerUI;
					var Chapter_id;
					var fiction_container = $('#fiction_container');
					var cateli = $('#fiction_chapter_title ul li');
					var catelogs = $('#fiction_chapter_title');

					var initFontSize = parseInt(Util.StorageGetter('font_size'));
					if(!initFontSize)
					{
						initFontSize = 16;
					}
					fiction_container.css('font-size', initFontSize);

					var font_color = Util.StorageGetter('font_color');
					if(!font_color)
					{
						font_color = "#000";
					}
					fiction_container.css('color', font_color);

					var bg_color = Util.StorageGetter('bg_color');
					if(!bg_color)
					{
						bg_color = "#e9dfc7";
					}
					$('body').css('background',bg_color);

					var mode_hide = Util.StorageGetter('mode_hide');
					if(mode_hide == 1)
					{
						$('.icon-mode').addClass('icon-mode2');
						$('#title-mode').hide();
						$('#title-mode2').show();
					}

					var bg_className_num = Util.StorageGetter('bg_className');
					if(!bg_className_num)
					{
						bg_className_num = "bg-container1";
					}
					$("."+bg_className_num +' .bg-container-current').show();

					var now_chapter_id = parseInt(Util.StorageGetter('Chapter_id'));
					if(!now_chapter_id)
					{
						now_chapter_id = 1;
					}
					
					function main()
					{
						ReaderModel = ReaderModel();
						readerUI = ReaderBaseFrame(fiction_container);
						ReaderModel.init(function(data)
							{
								readerUI(data);
							});
						EventHandler();
					}
					function ReaderModel()
					{
						var ChapterTotal;
						var init = function(UIcallback)
						{
							getFictionInfo(function()
								{
									getCurChapterContent(now_chapter_id,
										function(data)
										{
											UIcallback && UIcallback(data);
										});
								});
						}
						var getFictionInfo = function(callback)
						{
							$.get('data/chapter.json',function(data)
							{
								Chapter_id = data.chapters[1].chapter_id;
								ChapterTotal = data.chapters.length;
								callback && callback();
							},'json');
						}
						var getCurChapterContent = function(now_chapter_id,callback)
						{
							$.get('data/data'+ now_chapter_id+'.json',function(data)
								{
									if(data.result == 0)
									{
										var url = data.jsonp;
										Util.getJSONP(url, function(data)
											{
												callback && callback(data);
											});
									}
								},'json');
						}
						return {
							init:init,
						}
					}
					function ReaderBaseFrame(fiction_container)
					{
						function parseChapterData(jsonData)
						{
							var jsonObj = JSON.parse(jsonData);
							var html = '<h4>' + jsonObj.t + '</h4>';
							for(var i=0;i<jsonObj.p.length;i++)
							{
								html += '<p>' + jsonObj.p[i] + '<p>';
							}
							return html;
						}
						return function(data)
						{
							fiction_container.html(parseChapterData(data));
						}
					}
					function EventHandler()
					{
						$('#action_mid').click(function()
						{
							if(Dom.bottom_nav.css('display')=='none')
							{
								catelogs.hide();
								Dom.bottom_nav.show();
								//$('.artical-action-mid').css({'height':'20%','top':'20%'});
							}
							else
							{
								Dom.bottom_nav.hide();
								Dom.nav_pannel.hide();
								Dom.icon_font.removeClass('font-clicked');
								//$('.artical-action-mid').css({'height':'40%','top':'30%'});
							}
						});

						Dom.font_wrap.click(function()
							{
								if(Dom.nav_pannel.css('display')=='none')
								{
									Dom.nav_pannel.show();
									Dom.icon_font.addClass('font-clicked');
								}
								else
								{
									Dom.nav_pannel.hide();
									Dom.icon_font.removeClass('font-clicked');
								}
							});
						$('#large-font').click(function()
							{
								if(initFontSize>20)
								{
									return;
								}
								initFontSize++;
								fiction_container.css('font-size',initFontSize);
								Util.StorageSetter('font_size',initFontSize);
							});
						$('#small-font').click(function()
							{
								if(initFontSize<12)
								{
									return;
								}
								initFontSize--;
								fiction_container.css('font-size',initFontSize);
								Util.StorageSetter('font_size',initFontSize);
							});
						
						Dom.bg_container.click(function()
							{
								var bg_classNameAll = this.className;
								var bg_className = bg_classNameAll.slice(13,26)
								bg_color = $("."+bg_className).css('background-color');
								$('body').css('background',bg_color);
								if(bg_className == 'bg-container6')
								{
									night();
								}
								else if(bg_className == 'bg-container5')
								{
									font_color = "#888";
									fiction_container.css('color', "#888");
									$('#title-mode2').hide();
									$('#title-mode').show();
								}
								else
								{
									font_color = "#000";
									fiction_container.css('color', "#000");
									$('#title-mode2').hide();
									$('#title-mode').show();
								}	
								
								Util.StorageSetter('mode_hide',mode_hide);
								Dom.bg_container_current.hide();
								$("."+bg_className +' .bg-container-current').show();
								Util.StorageSetter('bg_color',bg_color);
								Util.StorageSetter('font_color',font_color);
								Util.StorageSetter('bg_className',bg_className);	

							});
						Dom.mode_wrap.click(function()
							{
								if($('#title-mode').css('display') == "none")
								{
									daylight();
								}
								else
								{
									night();
								}
								
								$('body').css('background',bg_color);
								Util.StorageSetter('bg_color',bg_color);
								Util.StorageSetter('mode_hide',mode_hide);
								Util.StorageSetter('font_color',font_color);
								Util.StorageSetter('bg_className',bg_className_num);
							});
						Win.scroll(function()
							{
								Dom.bottom_nav.hide();
								Dom.nav_pannel.hide();
								catelogs.hide();
								Dom.icon_font.removeClass('font-clicked');
							});
						function daylight()
							{
								mode_hide = 0;
								bg_color = $('.bg-container2').css('background-color');
								font_color = "#000";
								fiction_container.css('color', "#000");
								$('.icon-mode').removeClass('icon-mode2');
								$('#title-mode2').hide();
								$('#title-mode').show();
								Dom.bg_container_current.hide();
								$('.bg-container1 .bg-container-current').show();
								bg_className_num = "bg-container1";
							}
						function night()
							{
								mode_hide = 1;
								bg_color = $('.bg-container6').css('background-color');
								font_color = "#888";
								fiction_container.css('color', "#888");
								$('.icon-mode').addClass('icon-mode2');
								$('#title-mode').hide();
								$('#title-mode2').show();
								Dom.bg_container_current.hide();
								$('.bg-container6 .bg-container-current').show();
								bg_className_num = "bg-container6";
							}
						$('#prev_button').click(function()
							{
								if(now_chapter_id != null)
								{
									if(now_chapter_id == 1)
									{
										return;
									}
									else
									{
										Util.StorageSetter('Chapter_id',now_chapter_id-1);
									}	
								}
								else
								{
									return;
								}
								isWeiXin();
							});
						$('#next_button').click(function()
							{
								if(now_chapter_id != null)
								{
									if(now_chapter_id == 4)
									{
										return;
									}
									else
									{
										Util.StorageSetter('Chapter_id',now_chapter_id+1);
									}	
								}
								else
								{
									Util.StorageSetter('Chapter_id',Chapter_id+1);
								}
								isWeiXin();
							})
						$('#cata-wrap').click(function()
							{
								catelogs.show();
								if(!now_chapter_id)
								{
									cateli[Chapter_id-1].style.backgroundColor = '#ff5722';
								}
								else
								{
									cateli[now_chapter_id-1].style.backgroundColor = '#ff5722';
								}

								Dom.bottom_nav.hide();
								Dom.nav_pannel.hide();
								Dom.icon_font.removeClass('font-clicked');
								//$('.artical-action-mid').css({'height':'40%','top':'30%'});

							});
						for(var i=0;i<cateli.length;i++)
						{
							cateli[i].index = i;
							cateli[i].onclick = function()
							{
								Util.StorageSetter('Chapter_id',this.index+1);
								isWeiXin();
							}
									
								
						}
						function isWeiXin(){
						var refresh = new Date();
					    var ua = window.navigator.userAgent.toLowerCase();
					    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
					        return window.location.href='?'+refresh.getTime();
					    }else{
					        window.location.reload();
					    }
					}
					}
					main();
				})();