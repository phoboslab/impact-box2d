ig.module( 
	'plugins.box2d.debug'
)
.requires(
	'plugins.box2d.lib'
)
.defines(function(){


ig.Box2DDebug = ig.Class.extend({
	drawer: null,
	world: null,
	alpha: 1,
	
	init: function( world, alpha, thickness ) {
		this.world = world;
		
		this.drawer = new b2.DebugDraw();
		this.drawer.m_sprite = {graphics:this};
		this.drawer.m_drawScale = 1 / b2.SCALE * ig.system.scale;
		this.drawer.m_fillAlpha = alpha || 0.3;
		this.drawer.m_lineThickness = thickness || 1.0;
		this.drawer.m_drawFlags = b2.DebugDraw.e_shapeBit | b2.DebugDraw.e_jointBit;
	},
	
	draw: function() {
		ig.system.context.save();
		ig.system.context.translate( -ig.game.screen.x * ig.system.scale, -ig.game.screen.y * ig.system.scale );
		
		// Set debug drawer, draw and unset again, to prevent box2d
		// from drawing on it's own during step()
		this.world.SetDebugDraw( this.drawer );
		this.world.DrawDebugData();
		this.world.SetDebugDraw( null );
		
		ig.system.context.restore();
	},

	
	clear: function(){},
	
	lineStyle: function( thickness, color, alpha ) {
		ig.system.context.strokeStyle = 'rgb('+color._r+','+color._g+','+color._b+')';
		ig.system.context.lineWidth = thickness;
	},
	
	moveTo: function( x, y ) {
		ig.system.context.beginPath();
		ig.system.context.moveTo( x, y );
	},
	
	lineTo: function( x, y ) {
		ig.system.context.lineTo( x, y );
		ig.system.context.stroke();
	},
	
	beginFill: function( color, alpha ) {
		this.alpha = alpha;
		ig.system.context.fillStyle = 'rgb('+color._r+','+color._g+','+color._b+')';
		ig.system.context.beginPath();
	},
	
	endFill: function() {
		ig.system.context.globalAlpha = this.alpha;
		ig.system.context.fill();
		ig.system.context.globalAlpha = 1;
	},
	
	drawCircle: function( x, y, r ) {
		ig.system.context.beginPath();
		ig.system.context.arc(x, y, r, 0, Math.PI*2, true);
		ig.system.context.stroke();
	}
});

});