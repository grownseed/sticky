Raphael.fn.circlePath = function(x, y, r)
{
	return 'M' + x + ',' + (y - r) + 'A' + r + ',' + r + ',0,1,1,' + (x - 0.1) + ',' + (y - r) + ' z';
};

window.addEvent('domready', function()
{
	var surface = Raphael('container', window.getWidth(), window.getHeight()),
		centre = {x: window.getWidth() / 2, y: window.getHeight() / 2},
		base_radius = 250;
	
	var getPointCoords = function(angle, radius)
	{
		var coords = {};
		
		coords.x = centre.x + Math.round(radius * Math.cos(angle));
		coords.y = centre.y + Math.round(radius * Math.sin(angle));
		
		return coords;
	};
	
	var circle_path = surface.circlePath(centre.x, centre.y, base_radius);
	
	var circle = surface.path(circle_path)
		.attr({'stroke-width': 0, 'stroke-opacity': 0, 'fill': '#ac0000'});
	
	var circle_length = circle.getTotalLength();
	
	var cut_at = 60,
		threshold = 
		{
			inner: base_radius * 0.2,
			outer: base_radius * 2.5
		},
		grabbed = false;
	
	var circle_main = circle.getSubpath(cut_at, circle_length - cut_at),
		controllers =
		{
			previous: circle.getPointAtLength(circle_length - 20),
			next: circle.getPointAtLength(20),
			end: circle.getPointAtLength(cut_at)
		};
	
	$('container').addEvent('mousemove', function(e)
	{
		var distance = Math.sqrt(Math.pow(e.client.x - centre.x, 2) + Math.pow(e.client.y - centre.y, 2));
		
		if (distance > base_radius * 0.9 && distance < base_radius * 1.1)
			grabbed = true;
		
		if (distance > threshold.inner && distance < threshold.outer && grabbed)
		{		
			var angle = Raphael.angle(e.client.x, e.client.y, centre.x, centre.y) + 90;
			
			circle.transform('r' + angle + ',' + centre.x + ',' + centre.y);
			
			var control_y = centre.y - (base_radius - (base_radius - distance) * 0.6);
			
			var handle = ' C' + controllers.previous.x + ',' + controllers.previous.y + ' ' + centre.x + ',' + control_y + ' ' + centre.x + ',' + (centre.y - distance) + ' C' + centre.x + ',' + control_y + ' ' + controllers.next.x + ',' + controllers.next.y + ' ' + controllers.end.x + ',' + controllers.end.y;
			
			circle.attr({'path': circle_main + handle});
		}
		
		if ((distance < threshold.inner || distance > threshold.outer) && grabbed)
		{
			grabbed = false;
			circle.animate({'path': circle_path}, 400, 'elastic');
		}
	});
});
