ig.module( 
	'plugins.box2d.debug'
)
.requires(
	'impact.game',
	'plugins.box2d.lib'
)
.defines(function(){


ig.Box2DDebug = ig.Class.extend({
	drawer: null,
	canvas: null,
	world: null,

	alpha: 0.5,
	thickness: 1.0,

	init: function(world, alpha, thickness) {
		this.world = world;
		this.canvas = ig.system.canvas;
		this.drawer = new Box2D.Dynamics.b2DebugDraw();
		this.drawer.SetSprite(this);
		this.drawer.SetDrawScale(1 / Box2D.SCALE * ig.system.scale);
		this.drawer.SetFillAlpha(alpha || this.alpha);
		this.drawer.SetLineThickness(thickness || this.thickness);
		this.drawer.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
		world.SetDebugDraw(this.drawer);
	},

	draw: function() {
		ig.system.context.save();
		ig.system.context.translate(-ig.game.screen.x * ig.system.scale, -ig.game.screen.y * ig.system.scale);
		this.world.DrawDebugData();
		ig.system.context.restore();
	},

	clearRect: function() {},

	beginPath: function() {
		ig.system.context.lineWidth = this.strokeWidth;
		ig.system.context.fillStyle = this.fillStyle;
		ig.system.context.strokeStyle = this.strokeSyle;
		ig.system.context.beginPath();
	},

	arc: function(x, y, radius, startAngle, endAngle, counterClockwise) {
		ig.system.context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	},

	closePath: function() {
		ig.system.context.closePath();
	},

	fill: function() {
		ig.system.context.fillStyle = this.fillStyle;
		ig.system.context.fill();
	},

	stroke: function() {
		ig.system.context.stroke();
	},

	moveTo: function(x, y) {
		ig.system.context.moveTo(x, y);
	},

	lineTo: function(x, y) {
		ig.system.context.lineTo(x, y);
		ig.system.context.stroke();
	}

});

ig.Game.inject({
	loadLevel: function(data) {
		this.parent(data);
		this.debugDrawer = new ig.Box2DDebug(ig.world);
	},
	draw: function() {
		this.parent();
		this.debugDrawer.draw();
	}
});

});