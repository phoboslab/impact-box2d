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
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x + this.size.x / 2) * Box2D.SCALE,
			(this.pos.y + this.size.y / 2) * Box2D.SCALE
		); 
		bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		this.body = ig.world.CreateBody(bodyDef);

		var fixture = new Box2D.Dynamics.b2FixtureDef;
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		fixture.shape.SetAsBox(
			this.size.x / 2 * Box2D.SCALE,
			this.size.y / 2 * Box2D.SCALE
		);
		
		fixture.density = 1.0;
		// fixture.friction = 0.5;
		// fixture.restitution = 0.3;

		this.body.CreateFixture(fixture);
	},
	
	update: function() {		
		var p = this.body.GetPosition();
		this.pos = {
			x: (p.x / Box2D.SCALE - this.size.x / 2),
			y: (p.y / Box2D.SCALE - this.size.y / 2 )
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