ig.module( 
	'plugins.box2d.entity'
)
.requires(
	'impact.entity',	
	'plugins.box2d.game'
)
.defines(function(){


ig.Box2DEntity = ig.Entity.extend({
	body: null,
	angle: 0,
	
	init: function( x, y , settings ) {
		this.parent( x, y, settings );
		
		// Only create a box2d body when we are not in Weltmeister
		if( !ig.global.wm ) { 
			this.createBody();
		}
	},
	
	createBody: function() {
		var bodyDef = new b2.BodyDef();
		bodyDef.position.Set(
			(this.pos.x + this.size.x / 2) * b2.SCALE,
			(this.pos.y + this.size.y / 2) * b2.SCALE
		);
		
		this.body = ig.world.CreateBody(bodyDef);
		
		var shapeDef = new b2.PolygonDef();
		shapeDef.SetAsBox(
			this.size.x / 2 * b2.SCALE,
			this.size.y / 2 * b2.SCALE
		);
		
		shapeDef.density = 1;
		//shapeDef.restitution = 0.0;
		//shapeDef.friction = 0.9;
		this.body.CreateShape(shapeDef);
		this.body.SetMassFromShapes();
	},
	
	update: function() {		
		var p = this.body.GetPosition();
		this.pos = {
			x: (p.x / b2.SCALE - this.size.x / 2),
			y: (p.y / b2.SCALE - this.size.y / 2 )
		};
		this.angle = this.body.GetAngle().round(2);
		
		if( this.currentAnim ) {
			this.currentAnim.update();
			this.currentAnim.angle = this.angle;
		}
	},
	
	kill: function() {
		ig.world.DestroyBody( this.body );
		this.parent();
	}
});
	
});