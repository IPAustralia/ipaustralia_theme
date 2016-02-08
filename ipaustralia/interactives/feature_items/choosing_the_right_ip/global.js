/*globals jQuery, ND, window */
(function(ND, $){
	$(function($){
		var wizard = ND.wizard().init( {
			contents:'media/wizard/contents.html',
			data:'media/wizard/data.js',
			imgSupport: 'media/wizard/test.png'
		});					
	});
}(window.ND || {}, jQuery.noConflict()));